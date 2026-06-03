import React, { createContext, useState, useEffect, useContext } from "react";
import { User } from "../models";
import { 
  loginUser, 
  signupUser, 
  verifySession, 
  requestPasswordReset, 
  resetPasswordWithToken, 
  sendEmailVerificationOTP, 
  verifyEmailOTP 
} from "../services/authService";
import { AUTH_KEYS, getStoredToken, setStoredToken, clearStoredAuth } from "../auth";
import { getFirebaseInstance } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut,
  onAuthStateChanged
} from "firebase/auth";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  verificationPendingEmail: string | null;
  login: (email: string, password: string) => Promise<User>;
  signup: (payload: { name: string; email: string; phone: string; password?: string; city: string; projectType: string }) => Promise<User>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (password: string) => Promise<void>;
  sendOTP: (email: string) => Promise<{ success: boolean; otp: string }>;
  verifyOTP: (otp: string) => Promise<boolean>;
  setPendingVerificationEmail: (email: string | null) => void;
  clearError: () => void;
  isFirebaseActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationPendingEmail, setVerificationPendingEmail] = useState<string | null>(
    localStorage.getItem(AUTH_KEYS.VERIFICATION_REQUIRED)
  );

  const firebaseInfo = getFirebaseInstance();
  const isFirebaseActive = firebaseInfo.configured;
  const firebaseAuth = firebaseInfo.auth;

  // Sync state between client-side Firebase Auth and back-end express sessions
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (isFirebaseActive && firebaseAuth) {
      console.log("[AuthProvider] Booting production-grade Firebase Auth listener.");
      unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
        if (fbUser) {
          const storedToken = getStoredToken();
          if (storedToken) {
            try {
              const res = await verifySession(storedToken);
              setCurrentUser(res.user);
            } catch (err) {
              console.warn("Express session verify failed check:", err);
              // Fallback to auto-log them back in or clear auth
              clearStoredAuth();
              setCurrentUser(null);
            } finally {
              setLoading(false);
            }
          } else {
            // Logged into Firebase but missing Express token? Sync profile gracefully
            setLoading(false);
          }
        } else {
          // Clear any local cache on logout
          const storedToken = getStoredToken();
          if (storedToken) {
            clearStoredAuth();
            setCurrentUser(null);
          }
          setLoading(false);
        }
      });
    } else {
      // Offline/Local development model: standard token recovery
      const token = getStoredToken();
      if (token) {
        setLoading(true);
        verifySession(token)
          .then((res) => {
            setCurrentUser(res.user);
          })
          .catch((err) => {
            console.error("Local session restoration failed:", err);
            clearStoredAuth();
            setCurrentUser(null);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isFirebaseActive, firebaseAuth]);

  const login = async (email: string, password: string): Promise<User> => {
    setError(null);
    setLoading(true);
    try {
      if (isFirebaseActive && firebaseAuth) {
        console.log("[Firebase Auth] Transacting matching passkey via cloud gateway...");
        await signInWithEmailAndPassword(firebaseAuth, email, password);
      } else {
        console.warn("[Firebase Unconfigured] Authenticaton falling back to central MongoDB server verify.");
      }

      // Sync backend token representation
      const data = await loginUser(email, password);
      setStoredToken(data.token);
      setCurrentUser(data.user);
      
      if (!data.user.emailVerified) {
        setVerificationPendingEmail(data.user.email);
        localStorage.setItem(AUTH_KEYS.VERIFICATION_REQUIRED, data.user.email);
      } else {
        setVerificationPendingEmail(null);
        localStorage.removeItem(AUTH_KEYS.VERIFICATION_REQUIRED);
      }
      
      return data.user;
    } catch (err: any) {
      console.error("[Login Failure]", err);
      const message = err.code || err.message || "Invalid luxury credentials.";
      let prettyError = message;
      if (message.includes("auth/invalid-credential") || message.includes("auth/user-not-found")) {
        prettyError = "Invalid email or matching secret passkey.";
      } else if (message.includes("auth/too-many-requests")) {
        prettyError = "Too many failed attempts. Security limits applied. Please try again later.";
      }
      setError(prettyError);
      throw new Error(prettyError);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload: { 
    name: string; 
    email: string; 
    phone: string; 
    password?: string; 
    city: string; 
    projectType: string 
  }): Promise<User> => {
    setError(null);
    setLoading(true);
    try {
      if (!payload.password || payload.password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }

      if (isFirebaseActive && firebaseAuth) {
        console.log("[Firebase Auth] Registering user in secure Google Identity Store...");
        await createUserWithEmailAndPassword(firebaseAuth, payload.email, payload.password);
      } else {
        console.warn("[Firebase Unconfigured] Standard user creation processed locally.");
      }

      // Sync master credentials to backend moonlooks_db.json
      const data = await signupUser(payload);
      setStoredToken(data.token);
      setCurrentUser(data.user);
      
      setVerificationPendingEmail(data.user.email);
      localStorage.setItem(AUTH_KEYS.VERIFICATION_REQUIRED, data.user.email);
      
      return data.user;
    } catch (err: any) {
      console.error("[Signup Failure]", err);
      const message = err.code || err.message || "Registration failed.";
      let prettyError = message;
      if (message.includes("auth/email-already-in-use")) {
        prettyError = "Email address is already linked with another design dossier.";
      } else if (message.includes("auth/weak-password")) {
        prettyError = "Passkey strength is insufficient. Try letters with digits.";
      }
      setError(prettyError);
      throw new Error(prettyError);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log("[AuthProvider] Clearing customer session.");
    try {
      if (isFirebaseActive && firebaseAuth) {
        await signOut(firebaseAuth);
      }
    } catch (err) {
      console.error("Firebase signout error:", err);
    }
    clearStoredAuth();
    setCurrentUser(null);
    setVerificationPendingEmail(null);
    setError(null);
  };

  const forgotPassword = async (email: string) => {
    setError(null);
    setLoading(true);
    try {
      if (isFirebaseActive && firebaseAuth) {
        console.log("[Firebase Auth] Dispatching official password reset link...");
        await sendPasswordResetEmail(firebaseAuth, email);
      }
      const res = await requestPasswordReset(email);
      return res;
    } catch (err: any) {
      console.error("[Reset Dispatched Error]", err);
      const message = err.code || err.message || "Email address could not be verified.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (password: string) => {
    setError(null);
    setLoading(true);
    try {
      await resetPasswordWithToken(password);
    } catch (err: any) {
      setError(err.message || "Password modification failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async (email: string) => {
    setError(null);
    try {
      return await sendEmailVerificationOTP(email);
    } catch (err: any) {
      setError(err.message || "OTP transport failed.");
      throw err;
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    const emailToVerify = verificationPendingEmail || currentUser?.email;
    if (!emailToVerify) {
      setError("Email address required for verification query.");
      setLoading(false);
      return false;
    }

    try {
      const res = await verifyEmailOTP(emailToVerify, otp);
      if (res.success) {
        setVerificationPendingEmail(null);
        localStorage.removeItem(AUTH_KEYS.VERIFICATION_REQUIRED);
        
        if (currentUser) {
          setCurrentUser({ ...currentUser, emailVerified: true });
        }
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || "Invalid passcode.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const setPendingVerificationEmail = (email: string | null) => {
    if (email) {
      setVerificationPendingEmail(email);
      localStorage.setItem(AUTH_KEYS.VERIFICATION_REQUIRED, email);
    } else {
      setVerificationPendingEmail(null);
      localStorage.removeItem(AUTH_KEYS.VERIFICATION_REQUIRED);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        verificationPendingEmail,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
        sendOTP,
        verifyOTP,
        setPendingVerificationEmail,
        clearError,
        isFirebaseActive
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be executed within AuthProvider");
  }
  return context;
}
