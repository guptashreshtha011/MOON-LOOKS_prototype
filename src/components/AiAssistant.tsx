import React, { useState } from "react";
import { 
  Sparkles, Palette, HardHat, Lightbulb, Landmark, Loader2, 
  Copy, Check, Info, LayoutGrid, Ruler, FileText, CheckCircle2, Phone 
} from "lucide-react";
import { MoodboardResponse, PaletteColor, MaterialDetail } from "../types";

interface AiAssistantProps {
  initialStyleStyle?: string;
  onSelectTab?: (tab: string) => void;
}

// Realistic standard Indian Property Categories
const PROPERTY_TYPES = [
  "3BHK Residential Apartment",
  "4BHK Premium Apartment",
  "Luxury Villa / Duplex",
  "Modular Kitchen & Dining Fit-out",
  "Living Room & Foyer Renovation",
  "Master Bedroom Lounge Suite"
];

// Modern Indian Luxury Interior Styles
const INDIAN_STYLES = [
  "Modern Indian Luxury (Teak & Brass)",
  "Contemporary Indian Modernist",
  "Elegant Japandi-Scandinavian",
  "Warm Minimalist & Natural Textures",
  "Classic Royal Maroon Woodwork",
];

// Target Cities
const CITIES = [
  "Noida (Greater Noida)",
  "Gurgaon (DLF & Golf Course Road)",
  "New Delhi (South Delhi & Vasant Kunj)",
  "Bangalore (Whitefield & HSR Layout)",
  "Pune (Koregaon Park)",
];

// Interactive Floor Plan Pre-seeds for visual design review
interface IndianFloorPlan {
  id: string;
  title: string;
  area: string;
  rooms: string;
  dimensions: string;
  description: string;
  efficiencyRating: string;
  highlights: string[];
}

const INDIAN_FLOOR_PLANS: IndianFloorPlan[] = [
  {
    id: "fp_1",
    title: "Signature 3BHK Noida Classic",
    area: "1,850 sq.ft Super Area",
    rooms: "3 BHK + 3 Washrooms + Foyer + Utility Balcony",
    dimensions: "50' x 37'",
    description: "Our signature high-efficiency layout maximizing daylight infiltration into the master suite, with dual cross-ventilating balconies and an elegant linear open kitchen dining section.",
    efficiencyRating: "92% Carpet Ratio",
    highlights: ["Linear Living-Dining Flow", "Independent Foyer Entrance", "Dedicated Utility Utility Patio"],
  },
  {
    id: "fp_2",
    title: "Gurgaon Villa Grande Layout",
    area: "4,200 sq.ft Double-Height Duplex",
    rooms: "4 BHK + Family Lounge + Puja Room + Home Theater",
    dimensions: "65' x 65'",
    description: "Designed for premium duplex estates, highlighted by an majestic double-height living room vault, semi-open partitions, walk-in closets in every chamber, and customized servant quarters.",
    efficiencyRating: "89% Built-up Area Spacial Flow",
    highlights: ["Double-Height Vaulted Accent Ceiling", "Central Prayer Court integration", "His & Her Walk-in Dressing Suites"],
  },
  {
    id: "fp_3",
    title: "Bangalore Compact Minimalist Suite",
    area: "1,500 sq.ft Smart Luxury Space",
    rooms: "2.5 BHK + Study Corner + 2 Bathrooms",
    dimensions: "40' x 38'",
    description: "Engineered specifically for busy IT professionals. Combines open plan living with sound-absorbing glass room dividers to facilitate effortless remote work cycles.",
    efficiencyRating: "95% Space Optimization Ratio",
    highlights: ["Dual-Purpose Dynamic Work Pod", "Compact L-Shaped Modular Kitchen", "Concealed Smart Storage Ducts"],
  }
];

export default function AiAssistant({ initialStyleStyle, onSelectTab }: AiAssistantProps) {
  const [propertyType, setPropertyType] = useState<string>(PROPERTY_TYPES[0]);
  const [style, setStyle] = useState<string>(initialStyleStyle || INDIAN_STYLES[0]);
  const [city, setCity] = useState<string>(CITIES[0]);
  const [colorInspiration, setColorInspiration] = useState<string>("Teak Wood Finishes with Warm Amber and Brass accents");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [moodboard, setMoodboard] = useState<MoodboardResponse | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activePlanTab, setActivePlanTab] = useState<string>("fp_1");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMoodboard(null);

    try {
      const response = await fetch("/api/ai/moodboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          room: propertyType, 
          style, 
          colorInspiration: `Localized in ${city}. Color accents: ${colorInspiration}`, 
          description: description || `Standard premium Indian interior spacing plan requested for ${propertyType} in ${city}.` 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMoodboard(data);
      } else {
        alert(data.error || "Failed to compile floor plans layout.");
      }
    } catch (err) {
      console.error(err);
      alert("A server error occurred during design schema calculations.");
    } finally {
      setLoading(false);
    }
  };

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const selectedPlan = INDIAN_FLOOR_PLANS.find((p) => p.id === activePlanTab) || INDIAN_FLOOR_PLANS[0];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-16">
      
      {/* Editorial Title */}
      <div className="text-center">
        <span className="font-mono text-xs tracking-[0.4em] text-[#6B2737] uppercase bg-[#6B2737]/5 px-4 py-1.5 rounded-full inline-block mb-3">
          Studio Draft Tools
        </span>
        <h2 className="font-sans text-4xl font-extralight tracking-tight text-gray-900 md:text-5xl">
          FLOOR PLANS & <span className="font-semibold text-[#6B2737]">AI SCHEMES</span>
        </h2>
        <div className="mx-auto mt-4 h-[1px] w-24 bg-[#6B2737]/20" />
        <p className="mx-auto mt-4 max-w-2xl font-sans text-sm font-light text-gray-500 leading-relaxed">
          Review our professional 2D and 3D architectural floor plan blueprints. Utilize our AI configuration engine powered by Gemini to customize structural grids, luxury material layers, and warm lighting setups instantly.
        </p>
      </div>

      {/* SECTION 1: DETAILED 2D FLOOR PLANS BLUEPRINT INSPECTOR */}
      <div className="bg-[#F5F3EF] border border-gray-150 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-5">
          <div className="text-left">
            <span className="font-mono text-[10px] text-[#6B2737] tracking-widest uppercase font-bold block mb-1">
              ARCHITECTURAL COMPILING
            </span>
            <h3 className="font-sans text-2xl font-light text-gray-900">
              EXPLORE OUR <span className="font-semibold text-[#6B2737]">SIGNATURE INDIAN BLUEPRINTS</span>
            </h3>
          </div>
          <div className="flex gap-2">
            {INDIAN_FLOOR_PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setActivePlanTab(plan.id)}
                className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer ${
                  activePlanTab === plan.id
                    ? "bg-[#6B2737] text-[#FFFAE1]"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                }`}
              >
                {plan.id === "fp_1" ? "3BHK Noida" : plan.id === "fp_2" ? "4BHK Gurgaon" : "2.5BHK Bangalore"}
              </button>
            ))}
          </div>
        </div>

        {/* Layout breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          
          {/* Floor plan schematic sketch */}
          <div className="lg:col-span-6 bg-white border border-gray-150 p-6 rounded-2xl flex flex-col items-center justify-center relative min-h-[300px] overflow-hidden select-none">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
            
            {/* Elegant stylized blueprint box */}
            <div className="w-full max-w-sm relative z-10 p-5 rounded-xl border border-dashed border-[#6B2737]/35 bg-white shadow-md text-gray-800 space-y-4">
              
              <div className="flex justify-between items-center bg-[#6B2737]/5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-[#6B2737] border border-[#6B2737]/10">
                <span>{selectedPlan.dimensions} Blueprint Grid</span>
                <span>{selectedPlan.efficiencyRating}</span>
              </div>

              {/* Simulated blueprint box */}
              <div className="border border-gray-100 p-4 rounded-lg bg-gray-50/50 flex flex-col justify-between space-y-4 font-mono text-[10px] text-gray-500 font-semibold relative">
                
                {/* Visual architectural box labels */}
                <div className="flex justify-between gap-4">
                  <div className="border border-dashed border-gray-300 p-3 flex-1 text-center bg-white rounded">
                    <span className="block text-gray-900 font-bold">MASTER SUITE</span>
                    <span>14' x 16'</span>
                  </div>
                  <div className="border border-dashed border-gray-300 p-3 flex-1 text-center bg-white rounded">
                    <span className="block text-gray-900 font-bold">BEDROOM II</span>
                    <span>12' x 13'</span>
                  </div>
                </div>

                <div className="border-2 border-dashed border-[#6B2737]/30 p-4 text-center bg-white rounded relative overflow-hidden">
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-red-400/50" />
                  <span className="block text-[#6B2737] font-extrabold uppercase">LIVING & DINING SALON</span>
                  <span className="font-mono">24' x 16' Open-concept Layout</span>
                </div>

                <div className="flex justify-between gap-4">
                  <div className="border border-dashed border-gray-300 p-2.5 flex-1 text-center bg-white rounded text-[9px]">
                    <span className="block text-gray-900 font-bold">PUJA ROOM</span>
                    <span>6' x 8'</span>
                  </div>
                  <div className="border border-dashed border-[#6B2737]/30 p-2.5 flex-1 text-center bg-[#6B2737]/5 rounded text-[9px]">
                    <span className="block text-[#6B2737] font-bold">MODULAR KITCHEN</span>
                    <span>10' x 12'</span>
                  </div>
                  <div className="border border-dashed border-gray-300 p-2.5 flex-1 text-center bg-white rounded text-[9px]">
                    <span className="block text-gray-900 font-bold">FOYER</span>
                    <span>8' x 6'</span>
                  </div>
                </div>

              </div>

              <div className="bg-[#6B2737]/5 px-3 py-2 rounded-lg text-center space-y-0.5">
                <span className="font-mono text-[9px] text-[#6B2737] font-bold block uppercase">FLOORING PLAN REGISTER</span>
                <span className="font-sans text-[11px] text-gray-600">Italian Marble (Lobby) + Engineered Oak (Bedrooms)</span>
              </div>

            </div>

            <span className="absolute bottom-3 right-3 font-mono text-[9px] text-[#6B2737]/50 uppercase tracking-widest bg-gray-50 border border-gray-150 px-2.5 py-1 rounded">
              Standard Indian Layout Grid Plan Drafted
            </span>
          </div>

          {/* Details Spec column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="font-mono text-xs text-[#6B2737] tracking-widest uppercase bg-[#6B2737]/10 px-3 py-1 rounded-full font-bold">
              PLANNING SPECIFICATIONS
            </span>
            <h4 className="font-sans text-3xl font-light text-gray-900 leading-tight">
              {selectedPlan.title}
            </h4>
            <p className="font-mono text-xs text-gray-400">
              Rooms Count: <span className="font-bold text-gray-800">{selectedPlan.rooms}</span>
            </p>
            <p className="text-gray-600 text-sm font-light leading-relaxed">
              {selectedPlan.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-gray-200/60 py-5">
              <div>
                <span className="font-mono text-[10px] text-gray-400 block uppercase font-bold mb-1">Floor Dimensions</span>
                <span className="font-sans text-sm font-bold text-gray-800">{selectedPlan.dimensions} sq.ft span</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-gray-400 block uppercase font-bold mb-1">Customizations Support</span>
                <span className="font-sans text-sm font-bold text-green-700">100% Modifiable Grid</span>
              </div>
            </div>

            {/* highlights checkmarks list */}
            <div className="space-y-3.5">
              <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest block font-bold">
                LAYOUT ARCHITECTURAL ADVANTAGES
              </span>
              <div className="space-y-2.5">
                {selectedPlan.highlights.map((h, i) => (
                  <div key={i} className="flex items-center space-x-2 text-xs font-medium text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              {onSelectTab && (
                <button
                  onClick={() => onSelectTab("booking")}
                  className="flex-1 bg-[#6B2737] border border-[#6B2737] text-[#FFFAE1] px-5 py-3 rounded-full text-xs font-semibold hover:bg-[#6B2737]/90 active:scale-95 transition-all text-center cursor-pointer shadow-md shadow-[#6B2737]/10"
                >
                  ACQUIRE DRAFT BLUEPRINTS
                </button>
              )}
              <a
                href="https://wa.me/919876543210?text=Namaste%20Moon%20Looks!%20I%20am%20interested%20in%20the%20signature%203BHK%20layout%20specifications."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 border border-gray-300 bg-white text-gray-700 px-5 py-3 rounded-full text-xs font-semibold hover:border-[#6B2737] hover:text-[#6B2737] transition-all cursor-pointer"
              >
                <Phone className="h-3.5 w-3.5 text-green-600" />
                <span>INQUIRE VIA WHATSAPP</span>
              </a>
            </div>

          </div>

        </div>

      </div>


      {/* SECTION 2: AI SPACING CONCEPT PLANNER & SPATIAL DEVIATIONS */}
      <div className="text-left space-y-8">
        <div>
          <span className="font-mono text-xs tracking-[0.3em] text-[#6B2737] uppercase bg-[#6B2737]/5 px-4 py-1.5 rounded-full inline-block mb-3">
            Interactive AI Studio
          </span>
          <h3 className="font-sans text-2xl font-light text-gray-900 md:text-3xl">
            SPACING & <span className="font-semibold text-[#6B2737]">MATERIAL CONFIGURATOR</span>
          </h3>
          <p className="font-sans text-gray-500 text-xs mt-2 uppercase tracking-wider font-light">
            Generate customized spacing structures, premium material recommendations and color codes for your residential unit instantly
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 text-left">
          
          {/* Inputs Panel left */}
          <div className="lg:col-span-5 bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm h-fit space-y-6">
            <h4 className="font-sans text-lg font-bold text-gray-800 flex items-center space-x-2">
              <Landmark className="h-5 w-5 text-[#6B2737]" />
              <span>SPATIAL BRIEF DECORATOR</span>
            </h4>

            <form onSubmit={handleGenerate} className="space-y-5">
              
              {/* Property Type selection */}
              <div>
                <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1.5 font-bold">
                  PROJECT SCOPE TARGET
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#6B2737] font-medium"
                >
                  {PROPERTY_TYPES.map((p, i) => (
                    <option key={i} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Elegant Accent Style */}
              <div>
                <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1.5 font-bold">
                  INTERIOR STYLE DIRECTION
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#6B2737] font-medium"
                >
                  {INDIAN_STYLES.map((st, i) => (
                    <option key={i} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Target City */}
              <div>
                <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1.5 font-bold">
                  TARGET LOCATION GEOGRAPHY
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#6B2737] font-medium"
                >
                  {CITIES.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Colors and Material Accents input */}
              <div>
                <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1.5 font-bold">
                  MATERIAL & TONE INSPIRATIONS
                </label>
                <input
                  type="text"
                  required
                  value={colorInspiration}
                  onChange={(e) => setColorInspiration(e.target.value)}
                  placeholder="e.g. Teak Wood veneers with quartz marble and gold cove light trims"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#6B2737] font-medium"
                />
              </div>

              {/* Custom brief */}
              <div>
                <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1.5 font-bold">
                  ADDITIONAL SPACE PLAN REQUIREMENTS (OPTIONAL)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Include puja space, open modular utility cabinet in kitchen, direct sunlight vents in living hall, budget-friendly wardrobes."
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#6B2737] font-sans"
                />
              </div>

              {/* Triggers */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2.5 rounded-full border border-[#6B2737] bg-[#6B2737] px-6 py-4 text-xs font-semibold tracking-wider text-[#FFFAE1] hover:bg-[#6B2737]/95 transition-all shadow-md shadow-[#6B2737]/10 disabled:opacity-55 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-[#FFFAE1]" />
                    <span>COMPILING CUSTOM SPACING PLANS...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-300 fill-amber-300 animate-pulse shrink-0" />
                    <span>GENERATE CONCEPT SPECIFICATIONS</span>
                  </>
                )}
              </button>

            </form>
          </div>

          {/* AI Outputs Showcase block */}
          <div className="lg:col-span-7">
            {loading ? (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center space-y-4 rounded-3xl border border-dashed border-[#6B2737]/15 bg-[#6B2737]/5 p-8 text-center bg-white/70">
                <Loader2 className="h-12 w-12 animate-spin text-[#6B2737]" />
                <h4 className="font-sans text-lg font-medium text-gray-800">Casting realistic design specifications...</h4>
                <p className="max-w-xs font-sans text-xs text-gray-500 font-light leading-relaxed">
                  Gemini AI is analyzing layout density, recommended Indian materials, cabinetry fittings, and luxury lighting layers.
                </p>
              </div>
            ) : moodboard ? (
              <div className="space-y-8 animate-fade-in">
                
                {/* Concept Spacing Philosophy */}
                <div className="bg-[#6B2737] rounded-3xl p-8 border border-[#6B2737]/25 shadow-xl text-white relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                  <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#FFFAE1] bg-white/10 px-3 py-1 rounded-full inline-block mb-3 font-semibold">
                    SPACING PHILOSOPHY
                  </span>
                  <p className="font-sans text-base sm:text-lg font-light tracking-wide leading-relaxed text-[#FFFAE1]/90">
                    "{moodboard.philosophy}"
                  </p>
                  {moodboard.isDemo && (
                    <div className="mt-4 flex items-center space-x-1.5 font-mono text-[9px] text-[#FFFAE1]/80 bg-white/5 p-2 rounded-lg">
                      <Info className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                      <span>Optimized with modern Indian residential interior presets. Ready for consultation drafts.</span>
                    </div>
                  )}
                </div>

                {/* Color Swatches Grid */}
                <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm text-left">
                  <h4 className="font-sans text-xs tracking-widest text-[#6B2737] uppercase font-bold mb-5 flex items-center space-x-2">
                    <Palette className="h-4 w-4 text-[#6B2737]" />
                    <span>COMPLEMENTARY INDIAN COLOR CODES</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {moodboard.palette.map((color: PaletteColor, idx: number) => (
                      <div 
                        key={idx} 
                        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-150 bg-gray-50 flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
                        onClick={() => copyHex(color.hex)}
                      >
                        <div 
                          className="h-24 w-full transition-transform duration-300 group-hover:scale-105"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-xs font-semibold text-gray-800 line-clamp-1">
                              {color.name}
                            </span>
                            <button className="text-gray-400 group-hover:text-[#6B2737] transition-colors">
                              {copiedHex === color.hex ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                          <span className="font-mono text-[10px] text-gray-500 font-bold block mb-1">
                            {color.hex}
                          </span>
                          <p className="font-sans text-[10px] text-gray-400 line-clamp-2 leading-tight">
                            {color.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Materials & Grades Specification Details */}
                <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm text-left">
                  <h4 className="font-sans text-xs tracking-widest text-[#6B2737] uppercase font-bold mb-5 flex items-center space-x-2">
                    <HardHat className="h-4 w-4 text-[#6B2737]" />
                    <span>DETAILED MATERIAL & FABRIC GRADES</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {moodboard.materials.map((mat: MaterialDetail, idx: number) => (
                      <div key={idx} className="flex flex-col justify-between bg-gray-50 rounded-2xl p-4 border border-gray-150 hover:border-[#6B2737]/35 transition-all">
                        <div>
                          <span className="font-mono text-[9px] tracking-wider text-amber-800 bg-[#6B2737]/5 px-2 py-0.5 rounded-full inline-block mb-1.5 uppercase font-semibold">
                            {mat.type}
                          </span>
                          <h5 className="font-sans text-[13px] font-semibold text-gray-800">
                            {mat.name}
                          </h5>
                        </div>
                        <p className="font-sans text-[11px] text-gray-500 mt-2 font-light leading-relaxed">
                          {mat.application}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Room Spacing Action Steps */}
                <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm text-left">
                  <h4 className="font-sans text-xs tracking-widest text-[#6B2737] uppercase font-bold mb-4 flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4 text-[#6B2737]" />
                    <span>ON-SITE EXECUTION PROTOCOLS</span>
                  </h4>
                  <ul className="space-y-3 font-sans text-xs text-gray-600 font-light leading-relaxed pl-1">
                    {moodboard.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="font-mono text-[#6B2737] font-semibold mr-1.5">{idx + 1}.</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ) : (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center space-y-4 rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-center text-left">
                <Palette className="h-12 w-12 text-gray-300 stroke-1" />
                <h4 className="font-sans text-lg font-medium text-gray-400">Concept Planner Empty</h4>
                <p className="max-w-xs font-sans text-xs text-gray-400 leading-normal font-light">
                  Input your property type, target location, and material preferences on the left config panel to generate structural spacing details instantly.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
