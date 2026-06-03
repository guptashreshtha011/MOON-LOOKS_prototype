import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, Compass } from "lucide-react";
import { useAuth } from "../../database/hooks";

interface LoginPageProps {
  onNavigateToSignup: () => void;
  onNavigateToForgotPassword: () => void;
  onLoginSuccess: () => void;
}

export default function LoginPage({
  onNavigateToSignup,
  onNavigateToForgotPassword,
  onLoginSuccess
}: LoginPageProps) {
  const { login, error, clearError, isFirebaseActive } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!email) {
      setValidationError("Please input your registered email address.");
      return;
    }
    if (!password || password.length < 6) {
      setValidationError("Please input your secure passkey (minimum 6 characters).");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err: any) {
      // Error handled by AuthProvider custom state
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-gray-150 rounded-3xl p-8 shadow-xl relative overflow-hidden transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/20 via-[#6B2737] to-amber-500/20" />
      
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#6B2737]/5 border border-[#6B2737]/10 text-[#6B2737] mb-4">
          <Compass className="h-6 w-6 stroke-1 animate-spin" style={{ animationDuration: "12s" }} />
        </div>
        <h2 className="font-sans text-xl font-bold tracking-tight text-gray-900 uppercase">CLIENT SANCTUARY ACCESS</h2>
        <p className="font-sans text-xs text-gray-500 mt-1 font-light leading-relaxed">
          Unlock your active blueprints, spatial milestones, and consult threads.
        </p>
      </div>

      {isFirebaseActive ? (
        <div className="mb-4 bg-emerald-50/70 border border-emerald-200/50 text-emerald-800 px-4 py-2.5 rounded-2xl text-[11px] font-sans leading-relaxed flex items-center justify-center space-x-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-550 animate-pulse" />
          <span>Secured via production-grade Firebase Auth</span>
        </div>
      ) : (
        <div className="mb-4 bg-amber-50/70 border border-amber-200/50 text-amber-800 px-4 py-2.5 rounded-2xl text-[11px] font-sans leading-relaxed">
          <span>Running in local secure enclave mode. Configure Firebase in settings to switch to active live server cloud auth.</span>
        </div>
      )}

      {(validationError || error) && (
        <div className="mb-5 bg-red-50/70 border border-red-200/50 text-red-750 px-4 py-3 rounded-2xl text-xs font-sans leading-relaxed">
          {validationError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1 font-semibold">
            EMAIL ADDRESS
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationError(null);
              }}
              placeholder="e.g. rahul@domain.com"
              className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:bg-white focus:border-[#6B2737] text-xs font-sans placeholder-gray-400 outline-none transition-all"
            />
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 stroke-1" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 font-semibold">
              PASSWORD
            </label>
            <button
              type="button"
              onClick={onNavigateToForgotPassword}
              className="text-[10px] font-semibold text-[#6B2737] hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setValidationError(null);
              }}
              placeholder="••••••••"
              className="w-full bg-gray-50 pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:bg-white focus:border-[#6B2737] text-xs font-sans placeholder-gray-400 outline-none transition-all"
            />
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 stroke-1" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4 stroke-1" /> : <Eye className="h-4 w-4 stroke-1" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center space-x-2 text-[11px] text-gray-500 cursor-pointer select-none font-sans">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-gray-300 text-[#6B2737] focus:ring-[#6B2737]"
            />
            <span>Remember computer session</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 rounded-full bg-[#6B2737] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-[#6B2737]/90 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all text-center flex items-center justify-center space-x-2 shadow-md shadow-[#6B2737]/15 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Verifying Dossier...</span>
            </>
          ) : (
            <span>LOGIN TO SANCTUARY</span>
          )}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-gray-100 pt-6">
        <p className="text-xs text-gray-500 font-sans">
          First purchase with Moon Looks?{" "}
          <button
            onClick={onNavigateToSignup}
            className="font-bold text-[#6B2737] hover:underline hover:text-amber-700 focus:outline-none cursor-pointer"
          >
            Create client project profile
          </button>
        </p>
      </div>
    </div>
  );
}
