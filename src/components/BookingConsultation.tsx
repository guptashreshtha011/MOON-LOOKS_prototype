import React, { useState, useEffect } from "react";
import { User, Booking } from "../types";
import { Calendar, Clock, Landmark, Home, PenTool, CheckCircle, Info, Loader2, Sparkles, MapPin, Phone, User as UserIcon } from "lucide-react";

interface BookingConsultationProps {
  currentUser: User | null;
  selectedStyle?: string;
  selectedBudget?: string;
  selectedSize?: string;
  selectedNotes?: string;
  onOpenAuth: () => void;
  onSelectTab: (tab: string) => void;
}

const STYLE_PRESETS = [
  "Contemporary Luxury Theme",
  "Warm Minimalist Teak",
  "Modern Indian Heritage",
  "Japandi Zen Duplex Style",
  "Neo-Classical Brass Glamour",
  "Compact Functional Modular Mode",
];

const BUDGET_PRESETS = [
  "₹5 Lakhs - ₹10 Lakhs (Kitchen/SFT-level)",
  "₹10 Lakhs - ₹20 Lakhs (Standard 2BHK flat)",
  "₹20 Lakhs - ₹40 Lakhs (Premium 3BHK flat)",
  "₹40 Lakhs - ₹75 Lakhs (Elite 4BHK Duplex)",
  "₹75 Lakhs+ (Ultra Luxury Villa)",
];

const SIZE_PRESETS = [
  "2BHK Apartment (1000 - 1400 SQFT)",
  "3BHK Apartment (1400 - 2000 SQFT)",
  "4BHK Duplex Flat (2000 - 3500 SQFT)",
  "Luxury Urban Villa (3500+ SQFT)",
  "Modular Kitchen Area Only Scope",
];

export default function BookingConsultation({
  currentUser,
  selectedStyle,
  selectedBudget,
  selectedSize,
  selectedNotes,
  onOpenAuth,
  onSelectTab,
}: BookingConsultationProps) {
  const [style, setStyle] = useState<string>(selectedStyle || STYLE_PRESETS[0]);
  const [budget, setBudget] = useState<string>(selectedBudget || BUDGET_PRESETS[2]);
  const [size, setSize] = useState<string>(selectedSize || SIZE_PRESETS[1]);
  const [phone, setPhone] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("10:00");
  const [notes, setNotes] = useState<string>(selectedNotes || "");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [myInquiries, setMyInquiries] = useState<Booking[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Sync preference if chosen from other views
  useEffect(() => {
    if (selectedStyle) {
      setStyle(selectedStyle);
    }
  }, [selectedStyle]);

  useEffect(() => {
    if (selectedBudget) {
      // Find matching preset or set dynamically
      const foundPreset = BUDGET_PRESETS.find(b => b.includes(selectedBudget));
      setBudget(foundPreset || selectedBudget);
    }
  }, [selectedBudget]);

  useEffect(() => {
    if (selectedSize) {
      const foundSize = SIZE_PRESETS.find(s => s.includes(selectedSize));
      setSize(foundSize || selectedSize);
    }
  }, [selectedSize]);

  useEffect(() => {
    if (selectedNotes) {
      setNotes(selectedNotes);
    }
  }, [selectedNotes]);

  // Fetch current user existing bookings
  const loadMyBookings = () => {
    if (!currentUser) return;
    const token = localStorage.getItem("moonlooks_token");
    if (!token) return;

    fetch("/api/bookings/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMyInquiries(data);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadMyBookings();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmitting(true);

    const token = localStorage.getItem("moonlooks_token");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ style, budget, size, phone, date, time, notes }),
      });

      const data = await response.json();
      if (response.ok) {
        setBookingSuccess(true);
        loadMyBookings();
        // Clear fields
        setNotes("");
        setDate("");
      } else {
        alert(data.error || "Failed to schedule consultation.");
      }
    } catch (err) {
      console.error(err);
      alert("A server connection issue occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      
      {/* Header */}
      <div className="mb-14 text-center">
        <span className="font-mono text-xs tracking-[0.4em] text-[#6B2737] uppercase bg-[#6B2737]/5 px-4 py-1.5 rounded-full inline-block mb-3 font-semibold">
          Studio Consultations
        </span>
        <h2 className="font-sans text-4xl font-extralight tracking-tight text-gray-900 md:text-5xl">
          SCHEDULE <span className="font-semibold text-[#6B2737]">CONSULTATION</span>
        </h2>
        <div className="mx-auto mt-4 h-[1px] w-24 bg-[#6B2737]/20" />
        <p className="mx-auto mt-4 max-w-2xl font-sans text-sm font-light text-gray-500 leading-relaxed font-sans">
          Coordinate customized spatial layout briefing with our design team. Share design thoughts online and secure a supervised layout discussion slot.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 text-left">
        
        {/* Booking Form Layout */}
        <div className="lg:col-span-7 bg-white border border-gray-150 rounded-3xl p-8 shadow-sm">
          {!currentUser ? (
            
            /* Offline Shield */
            <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
              <div className="h-16 w-16 bg-[#6B2737]/5 rounded-full flex items-center justify-center border border-[#6B2737]/10">
                <Home className="h-7 w-7 text-[#6B2737]" />
              </div>
              <div>
                <h4 className="font-sans text-[20px] font-semibold text-gray-800">CLIENT PORTAL ACCESS REQUIRED</h4>
                <p className="max-w-md font-sans text-xs text-gray-500 leading-relaxed mt-2 font-light">
                  Please log in or sign up for a Client Portal account to request supervised site visits, custom budget estimates, and track structural milestones.
                </p>
              </div>
              <button
                onClick={onOpenAuth}
                className="rounded-full border border-[#6B2737] bg-[#6B2737] text-[#FFFAE1] px-8 py-3.5 text-xs font-semibold tracking-wider hover:bg-[#6B2737]/90 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                ACCESS CLIENT PORTAL
              </button>
            </div>
          ) : bookingSuccess ? (
            
            /* Booking Success Visualizer */
            <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center animate-fade-in">
              <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center border border-green-200">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h4 className="font-sans text-xl font-bold text-gray-800">CONSULTATION SLOT REGISTERED</h4>
                <p className="max-w-md font-sans text-sm text-gray-500 mt-2 font-light leading-relaxed">
                  Excellent, <span className="font-semibold text-gray-900">{currentUser.name}</span>. Your consultation booking has been recorded on our dashboard. Our design coordinator will call you to finalize sketches.
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-150 rounded-2xl p-5 w-full max-w-sm text-left font-sans text-xs space-y-2.5 text-gray-600">
                <div className="flex justify-between font-mono text-[9px] uppercase text-gray-400 font-bold">
                  <span>Selected Concept:</span>
                  <span className="text-gray-800 font-bold">{style}</span>
                </div>
                <div className="flex justify-between font-mono text-[9px] uppercase text-gray-400 font-bold">
                  <span>SFT Floor Dimension:</span>
                  <span className="text-gray-800 font-bold">{size}</span>
                </div>
                <div className="flex justify-between font-mono text-[9px] uppercase text-gray-400 font-bold">
                  <span>Reserved Schedule:</span>
                  <span className="font-semibold text-[#6B2737]">{date || "TBD"} @ {time}</span>
                </div>
              </div>
              <div className="flex space-x-3 w-full justify-center">
                <button
                  onClick={() => setBookingSuccess(false)}
                  className="rounded-full border border-gray-200 px-6 py-2.5 text-xs font-semibold hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Schedule Another
                </button>
                <button
                  onClick={() => onSelectTab("dashboard")}
                  className="rounded-full border border-[#6B2737] bg-[#6B2737] text-white px-6 py-2.5 text-xs font-semibold hover:bg-[#6B2737]/90 transition-all cursor-pointer"
                >
                  Open Client Portal
                </button>
              </div>
            </div>
          ) : (
            
            /* Registration Scheduler Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="font-sans text-lg font-bold text-gray-800 flex items-center space-x-2 border-b border-gray-100 pb-4">
                <Sparkles className="h-5 w-5 text-[#6B2737]" />
                <span>BOOK AN INTERIOR CONSULTATION</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                
                {/* Client Profile */}
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">Registered Owner</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.name}
                    className="w-full bg-gray-100 border border-gray-200 text-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                </div>

                {/* Secure Contact */}
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">Indian Contact Number</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9811234567"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#6B2737]"
                  />
                </div>

                {/* Selected style preference */}
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">Aesthetic Concept Category</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#6B2737]"
                  >
                    {STYLE_PRESETS.map((p, i) => (
                      <option key={i} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Project Size constraints */}
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">Property Layout Size</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#6B2737]"
                  >
                    {SIZE_PRESETS.map((p, i) => (
                      <option key={i} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Investment budget targets */}
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">Investment Allocation Range</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#6B2737]"
                  >
                    {BUDGET_PRESETS.map((b, i) => (
                      <option key={i} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Timetable Date Picker */}
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">Preferred Consult Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#6B2737] focus:bg-white"
                  />
                </div>

                {/* Hour selection */}
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">Hourly Slot Selection (IST)</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#6B2737]"
                  >
                    <option value="10:00">10:00 AM (Layout briefing)</option>
                    <option value="12:00">12:00 PM (Material review)</option>
                    <option value="14:00">02:00 PM (Cost estimation mapping)</option>
                    <option value="16:00">04:00 PM (Timeline execution layout)</option>
                  </select>
                </div>
              </div>

              {/* Consultation instructions notes */}
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">Space description and functional requirements</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us about your property, specific modular hardware queries (e.g. Hettich), daylight positions, false ceiling preferences..."
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#6B2737]"
                />
              </div>

              {/* Submit triggers */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center space-x-2.5 rounded-full border border-[#6B2737] bg-[#6B2737] px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#FFFAE1] hover:bg-[#6B2737]/90 transition-all disabled:opacity-55 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-[#FFFAE1]" />
                    <span>Transmitting consult request...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4" />
                    <span>SECURE FREE CONSULTATION SLOT</span>
                  </>
                )}
              </button>

            </form>
          )}
        </div>

        {/* Inquiries Sidebar Panel */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="bg-gradient-to-br from-[#6B2737] to-[#4e1b27] rounded-3xl p-8 border border-amber-900/10 shadow-lg text-white">
            <h4 className="font-sans text-xl font-bold text-[#FFFAE1] tracking-wide mb-1">Ananya Sen</h4>
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-amber-300 mb-4 font-bold">Principal Interior Architect</p>
            <p className="font-sans text-xs font-light text-gray-200 leading-relaxed mb-6">
              "We avoid assembly line standard packages or cheap hollow board partitions. To us, every modern Indian apartment deserves solid weather-resistant plywood bases, custom-routed circulation flow, and materials verified down to the millimeter."
            </p>
            <div className="border-t border-white/10 pt-4 font-mono text-[10px] space-y-2.5 text-gray-300">
              <div className="flex justify-between items-center">
                <span>Direct Contact:</span>
                <span className="text-[#FFFAE1] font-bold">+91 98112 34567</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Design Studio:</span>
                <span className="text-[#FFFAE1] font-bold">Sector 150, Greater Noida, UP</span>
              </div>
            </div>
          </div>

          {/* Current client's existing bookings list */}
          {currentUser && (
            <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
              <h4 className="font-sans text-xs font-bold tracking-widest text-gray-800 uppercase mb-4">
                MY SUBMITTED REQUESTS ({myInquiries.length})
              </h4>
              
              {myInquiries.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-gray-100 rounded-2xl bg-gray-50">
                  <Info className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                  <p className="font-sans text-xs text-gray-400">No active consult requests logged yet.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {myInquiries.map((b) => (
                    <div 
                      key={b.id} 
                      className="border border-gray-150 rounded-2xl p-4 bg-gray-50 hover:border-[#6B2737]/30 transition-all font-sans text-xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] font-bold text-gray-700 leading-none">{b.style}</span>
                        <span className={`px-2 py-0.5 rounded-full font-mono text-[8px] font-bold tracking-wider uppercase ${
                          b.status === "Confirmed" 
                            ? "bg-green-50 text-green-700 border border-green-100" 
                            : b.status === "Declined"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="text-gray-500 font-light font-sans text-[11px] leading-relaxed line-clamp-2 mb-2">
                        "{b.notes}"
                      </p>
                      <div className="flex items-center justify-between font-mono text-[9px] text-gray-400 border-t border-gray-100/50 pt-2 shrink-0">
                        <span>{b.size}</span>
                        <span className="text-[#6B2737] font-bold">{b.date} @ {b.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
