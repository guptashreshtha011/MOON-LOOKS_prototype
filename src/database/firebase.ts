// Proper Firebase Authentication Integration for Production
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { FIREBASE_CONFIG } from "./config";

// Robust Environment Verification and Validation
export const isFirebaseConfigured = (): boolean => {
  return (
    !!FIREBASE_CONFIG.apiKey &&
    FIREBASE_CONFIG.apiKey !== "PLACEHOLDER_FIREBASE_API_KEY" &&
    FIREBASE_CONFIG.apiKey.trim() !== "" &&
    !!FIREBASE_CONFIG.projectId &&
    FIREBASE_CONFIG.projectId !== "PLACEHOLDER_PROJECT_ID" &&
    FIREBASE_CONFIG.projectId.trim() !== ""
  );
};

let appInstance: any = null;
let authInstance: any = null;

try {
  if (isFirebaseConfigured()) {
    console.log("[Firebase] Valid environment keys detected. Initializing official cloud backend...");
    appInstance = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApp();
    authInstance = getAuth(appInstance);
  } else {
    console.warn(
      "[Firebase Override] Placeholder credentials detected. " +
      "Please configure your real VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID inside your system environment variables."
    );
  }
} catch (err) {
  console.error("[Firebase Engine Error] Critical init failure:", err);
}

export const getFirebaseInstance = () => {
  return {
    configured: isFirebaseConfigured(),
    app: appInstance,
    auth: authInstance,
    error: isFirebaseConfigured() 
      ? null 
      : "Firebase credentials are unconfigured or set to placeholders. Please configure VITE_FIREBASE_API_KEY in your SaaS environment variables settings panel."
  };
};

export const auth = authInstance;
export const app = appInstance;
