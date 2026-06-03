import React, { useState } from "react";
import { useAuth } from "../../database/hooks";
import ClientDashboard from "../../layout/ClientDashboard";
import AdminPanel from "../../layout/AdminPanel";
import { Mail, Clock, KeyRound, ShieldAlert, LogOut, CheckCircle2, Loader2, Sparkles, Compass } from "lucide-react";

interface DashboardPageProps {
  onLogout: () => void;
}

export default function DashboardPage({ onLogout }: DashboardPageProps) {
  const { currentUser, logout, verifyOTP, sendOTP, verificationPendingEmail, error } = useAuth();
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    
    if (otp.length !== 6) {
      setOtpError("The verification OTP must be exactly 6 digits.");
      return;
    }

    setVerifying(true);
    try {
      const success = await verifyOTP(otp);
      if (!success) {
        setOtpError("Incorrect activation code. Please try code: 888888");
      }
    } catch (err: any) {
      setOtpError(err.message || "Failed to complete email verification.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    setResendStatus(null);
    try {
      const targetEmail = verificationPendingEmail || currentUser?.email;
      if (targetEmail) {
        await sendOTP(targetEmail);
        setResendStatus("A fresh 6-digit access key code has been sent!");
        setTimeout(() => setResendStatus(null), 4050);
      }
    } catch {
      setOtpError("Failed to dispatch code.");
    } finally {
      setResending(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#6B2737]" />
      </div>
    );
  }

  // Email verification flow gate
  const needsVerification = !currentUser.emailVerified || !!verificationPendingEmail;
  if (needsVerification && currentUser.role !== "admin") {
    return (
      <div className="mx-auto max-w-md py-12 px-4">
        <div className="bg-white border border-gray-150 rounded-3xl p-8 shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#6B2737]" />
          
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 mb-4 animate-bounce">
            <Mail className="h-6 w-6 stroke-1" />
          </div>

          <h3 className="font-sans text-lg font-bold text-gray-900 uppercase">VERIFY YOUR SECURE ACCOUNT</h3>
          <p className="font-sans text-xs text-gray-500 font-light mt-3 leading-relaxed">
            Welcome, <strong>{currentUser.name}</strong>! To protect project details and billing ledger lists, we have sent a 6-digit verification code to:
          </p>
          <div className="my-2 p-2.5 bg-gray-50 rounded-xl border border-gray-150 font-mono text-[11px] text-gray-700 select-all">
            {verificationPendingEmail || currentUser.email}
          </div>
          <p className="font-sans text-[10.5px] text-rose-700/80 font-semibold mb-6">
            For demonstration and test review, input verification OTP: <strong>888888</strong>
          </p>

          {(otpError || error) && (
            <div className="mb-4 bg-red-50 border border-red-150 text-red-700 rounded-xl p-3 text-left text-xs">
              {otpError || error}
            </div>
          )}

          {resendStatus && (
            <div className="mb-4 bg-green-50 border border-green-150 text-green-700 rounded-xl p-3 text-xs">
              {resendStatus}
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 text-center font-mono text-lg tracking-widest outline-none focus:bg-white focus:border-[#6B2737]"
            />

            <button
              type="submit"
              disabled={verifying}
              className="w-full rounded-full bg-[#6B2737] text-white px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-[#6B2737]/95 transition-all text-center flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-[#6B2737]/10"
            >
              {verifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Validating OTP Code...</span>
                </>
              ) : (
                <span>ACTIVATE MY PORTAL</span>
              )}
            </button>
          </form>

          <div className="mt-6 flex justify-between items-center text-xs border-t border-gray-100 pt-4">
            <button
              onClick={handleResendOtp}
              disabled={resending}
              className="text-[#6B2737] font-semibold hover:underline cursor-pointer disabled:opacity-50"
            >
              {resending ? "Resending..." : "Resend code"}
            </button>
            <button
              onClick={() => {
                logout();
                onLogout();
              }}
              className="text-gray-400 hover:text-gray-600 flex items-center space-x-1 font-mono text-[9px] uppercase tracking-wide cursor-pointer"
            >
              <LogOut className="h-3 w-3" />
              <span>Cancel / Exit</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fully authorized: render either the Admin views or the Client views
  if (currentUser.role === "admin") {
    // Ensure casting if App.tsx uses different typing representations
    return <AdminPanel currentUser={currentUser as any} />;
  }

  return <ClientDashboard currentUser={currentUser as any} />;
}
