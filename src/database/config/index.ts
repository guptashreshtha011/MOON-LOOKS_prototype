// Central configuration for modern cloud DB and auth providers

const metaEnv = (import.meta as any).env || {};

export const FIREBASE_CONFIG = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "PLACEHOLDER_FIREBASE_API_KEY",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "PLACEHOLDER.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "PLACEHOLDER-project-id",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "PLACEHOLDER.appspot.com",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "PLACEHOLDER_SENDER_ID",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "PLACEHOLDER_APP_ID",
  measurementId: metaEnv.VITE_FIREBASE_MEASUREMENT_ID || "PLACEHOLDER_MEASUREMENT_ID"
};

export const SUPABASE_CONFIG = {
  url: metaEnv.VITE_SUPABASE_URL || "https://PLACEHOLDER.supabase.co",
  anonKey: metaEnv.VITE_SUPABASE_ANON_KEY || "PLACEHOLDER_ANON_KEY"
};

export const MONGODB_CONFIG = {
  uri: metaEnv.VITE_MONGODB_URI || "mongodb://localhost:27017/moonlooks"
};

export const API_BASE_URL = "/api";
export const HAS_CLOUDFLARE_PROTECTION = false;
