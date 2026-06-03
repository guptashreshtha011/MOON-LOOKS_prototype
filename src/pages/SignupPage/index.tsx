import React, { useState } from "react";
import { Mail, Lock, User as UserIcon, Phone, MapPin, Landmark, Loader2, Compass } from "lucide-react";
import { useAuth } from "../../database/hooks";

interface SignupPageProps {
  onNavigateToLogin: () => void;
  onSignupSuccess: () => void;
}

const INDIAN_CITIES = [
  "Noida & Greater Noida",
  "Gurgaon",
  "New Delhi",
  "Bangalore",
  "Pune",
  "Mumbai",
  "Hyderabad",
  "Chennai",
  "Kolkata"
];

const INTENDED_PROJECT_TYPES = [
  "3BHK / 4BHK Luxury Apartment",
  "Custom Luxury Residential Villa",
  "Penthouse Suite Remodeling",
  "Specialized Modular Kitchen",
  "Office Sanctuary & Commercial space",
  "Duplex / Triplex Modern Estate"
];

export default function SignupPage({
  onNavigateToLogin,
  onSignupSuccess
}: SignupPageProps) {
  const { signup, error, clearError, isFirebaseActive } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState(INDIAN_CITIES[0]);
  const [projectType, setProjectType] = useState(INTENDED_PROJECT_TYPES[0]);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!name || name.length < 2) {
      setValidationError("Please input your full legal name.");
      return;
    }
    if (!email || !email.includes("@")) {
      setValidationError("Please enter a valid active email address.");
      return;
    }
    if (!phone || phone.length < 9) {
      setValidationError("Please provide a valid Indian contact number (+91).");
      return;
    }
    if (!password || password.length < 6) {
      setValidationError("Passkey is too weak. Ensure at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("Confirm password does not match original passkey.");
      return;
    }

    setLoading(true);
    try {
      await signup({
        name,
        email,
        phone,
        password,
        city,
        projectType
      });
      onSignupSuccess();
    } catch (err: any) {
      // Handled by AuthProvider context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white border border-gray-150 rounded-3xl p-8 shadow-xl relative overflow-hidden transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/20 via-[#6B2737] to-amber-500/20" />
      
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#6B2737]/5 border border-[#6B2737]/10 text-[#6B2737] mb-3">
          <Compass className="h-6 w-6 stroke-1 animate-pulse" />
        </div>
        <h2 className="font-sans text-xl font-bold tracking-tight text-gray-900 uppercase">CREATE CLIENT BLUEPRINT DOSSIER</h2>
        <p className="font-sans text-xs text-gray-500 mt-1 font-light leading-relaxed">
          Open your construction workspace & real-time contractor audit portal.
        </p>
      </div>

      {isFirebaseActive ? (
        <div className="mb-4 bg-emerald-50/70 border border-emerald-200/50 text-emerald-800 px-4 py-2 rounded-2xl text-[11px] font-sans flex items-center justify-center space-x-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-550 animate-pulse" />
          <span>Secured via production-grade Firebase Auth</span>
        </div>
      ) : (
        <div className="mb-4 bg-amber-50/70 border border-amber-200/50 text-amber-800 px-4 py-2 rounded-2xl text-[11px] font-sans">
          <span>Running in local secure enclave mode. Configure Firebase in settings to switch to active live server cloud auth.</span>
        </div>
      )}

      {(validationError || error) && (
        <div className="mb-5 bg-red-50/70 border border-red-200/50 text-red-750 px-4 py-3 rounded-2xl text-xs font-sans leading-relaxed">
          {validationError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1 font-semibold">
              FULL NAME
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setValidationError(null);
                }}
                placeholder="e.g. Rahul Verma"
                className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:bg-white focus:border-[#6B2737] text-xs font-sans placeholder-gray-400 outline-none transition-all"
              />
              <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 stroke-1" />
            </div>
          </div>

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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1 font-semibold">
              PHONE NUMBER
            </label>
            <div className="relative">
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setValidationError(null);
                }}
                placeholder="e.g. +91 98765 43210"
                className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:bg-white focus:border-[#6B2737] text-xs font-sans placeholder-gray-400 outline-none transition-all"
              />
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 stroke-1" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1 font-semibold">
              LOCATION (CITY)
            </label>
            <div className="relative">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:bg-white focus:border-[#6B2737] text-xs font-sans outline-none transition-all appearance-none"
              >
                {INDIAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 stroke-1" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1 font-semibold">
            ESTATE PROJECT TYPE
          </label>
          <div className="relative">
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:bg-white focus:border-[#6B2737] text-xs font-sans outline-none transition-all appearance-none"
            >
              {INTENDED_PROJECT_TYPES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <Landmark className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 stroke-1" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1 font-semibold">
              CREATE PASSKEY
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValidationError(null);
                }}
                placeholder="Min 6 characters"
                className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:bg-white focus:border-[#6B2737] text-xs font-sans placeholder-gray-400 outline-none transition-all"
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 stroke-1" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1 font-semibold">
              CONFIRM PASSKEY
            </label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setValidationError(null);
                }}
                placeholder="Re-type password"
                className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:bg-white focus:border-[#6B2737] text-xs font-sans placeholder-gray-400 outline-none transition-all"
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 stroke-1" />
            </div>
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
              <span>Instantiating Profile...</span>
            </>
          ) : (
            <span>CREATE ACCOUNT & START</span>
          )}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-gray-100 pt-6">
        <p className="text-xs text-gray-500 font-sans">
          Already have an existing client project profile?{" "}
          <button
            onClick={onNavigateToLogin}
            className="font-bold text-[#6B2737] hover:underline hover:text-amber-700 focus:outline-none cursor-pointer"
          >
            Access existing sanctuary
          </button>
        </p>
      </div>
    </div>
  );
}
