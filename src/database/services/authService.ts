import { User } from "../models";

export async function loginUser(email: string, password: string): Promise<{ token: string; user: User }> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Authentication failed");
  }
  return data;
}

export async function signupUser(payload: {
  name: string;
  email: string;
  phone: string;
  password?: string;
  city: string;
  projectType: string;
}): Promise<{ token: string; user: User }> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }
  return data;
}

export async function verifySession(token: string): Promise<{ user: User }> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Session verification failed");
  }
  return data;
}

export async function requestPasswordReset(email: string): Promise<{ success: boolean; message: string; otp?: string }> {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Password reset request failed");
  }
  return { success: true, message: data.message, otp: data.otp };
}

export async function resetPasswordWithToken(newPassword: string): Promise<void> {
  const response = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: "reset_token_verified", newPassword }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Password reset failed");
  }
}

export async function sendEmailVerificationOTP(email: string): Promise<{ success: boolean; otp: string }> {
  const response = await fetch("/api/auth/send-verification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to send email verification OTP");
  }
  return data;
}

export async function verifyEmailOTP(email: string, otp: string): Promise<{ success: boolean }> {
  const response = await fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to verify email OTP");
  }
  return data;
}
