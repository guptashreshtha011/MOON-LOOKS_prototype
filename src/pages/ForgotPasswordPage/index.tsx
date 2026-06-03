import React, { useState } from "react";
import { Mail, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../../database/hooks";

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

export default function ForgotPasswordPage({ onBackToLogin }: ForgotPasswordPageProps) {
  const { forgotPassword, error, clearError, isFirebaseActive } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!email || !email.includes("@")) {
      setValidationError("Please input a valid registered email address.");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      // Handled by AuthProvider context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-gray-150 rounded-3xl p-8 shadow-xl relative overflow-hidden transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/20 via-[#6B2737] to-amber-500/20" />
      
      {!success ? (
        <div>
          <button
            onClick={onBackToLogin}
            className="flex items-center space-x-1.5 text-xs text-gray-500 hover:text-gray-900 mb-6 font-semibold transition-all group cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Return to Log In</span>
          </button>

          <div className="text-center mb-8">
            <h2 className="font-sans text-xl font-bold tracking-tight text-gray-900 uppercase">RE-VERIFY IDENTITY</h2>
            <p className="font-sans text-xs text-gray-500 mt-1 font-light leading-relaxed">
              {isFirebaseActive 
                ? "Enter your email address and we will dispatch an official Firebase password reset link immediately."
                : "Enter your custom email to initiate a security verification request."
              }
            </p>
          </div>

          {(validationError || error) && (
            <div className="mb-5 bg-red-50/70 border border-red-200/50 text-red-750 px-4 py-3 rounded-2xl text-xs font-sans leading-relaxed">
              {validationError || error}
            </div>
          )}

          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1 font-semibold">
                YOUR REGISTERED EMAIL
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setValidationError(null);
                  }}
                  placeholder="name@company.com"
                  className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:bg-white focus:border-[#6B2737] text-xs font-sans placeholder-gray-400 outline-none transition-all"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 stroke-1" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 rounded-full bg-[#6B2737] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-[#6B2737]/90 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all text-center flex items-center justify-center space-x-2 shadow-md shadow-[#6B2737]/15 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Requesting Reset...</span>
                </>
              ) : (
                <span>SEND RESET EMAIL</span>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-green-50 text-green-500 border border-green-200 mb-6 scale-110">
            <CheckCircle2 className="h-8 w-8 stroke-1" />
          </div>
          <h2 className="font-sans text-xl font-bold tracking-tight text-gray-900 uppercase">RESET TRANSMITTED</h2>
          <p className="font-sans text-xs text-gray-500 mt-2 font-light leading-relaxed">
            {isFirebaseActive 
              ? `A secure Firebase passkey reset link has been dispatched to ${email}. Please check your inbox and follow instructions.`
              : `A design request has been logged. In development enclave mode, check your server database state updates.`
            }
          </p>
          <button
            onClick={onBackToLogin}
            className="w-full mt-8 rounded-full bg-[#6B2737] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-[#6B2737]/90 active:scale-95 transition-all text-center cursor-pointer shadow-md shadow-[#6B2737]/15"
          >
            LOGIN TO MY WORKSPACE
          </button>
        </div>
      )}
    </div>
  );
}
