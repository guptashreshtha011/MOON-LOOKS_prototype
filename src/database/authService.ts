// Authentication database gateway bridge
// Bridges client UI actions dynamically to our secure Express API endpoints (built on Firebase/MongoDB)

import { 
  loginUser, 
  signupUser, 
  verifySession, 
  requestPasswordReset, 
  resetPasswordWithToken, 
  sendEmailVerificationOTP, 
  verifyEmailOTP 
} from "./services/authService";

export const authService = {
  login: loginUser,
  signup: signupUser,
  verify: verifySession,
  requestReset: requestPasswordReset,
  resetPassword: resetPasswordWithToken,
  sendOTP: sendEmailVerificationOTP,
  verifyOTP: verifyEmailOTP
};
