import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  DollarSign, Calculator, Ruler, LayoutGrid, Sparkles, Check, 
  HelpCircle, CalendarPlus, Settings, Hammer, Info 
} from "lucide-react";

interface CostEstimationProps {
  onExportEstimate?: (data: {
    style: string;
    budget: string;
    size: string;
    notes: string;
  }) => void;
}

interface Tier {
  id: string;
  name: string;
  description: string;
  pricePerSqft: number;
  pricePerRoom: number;
  materials: string[];
}

const TIERS: Tier[] = [
  {
    id: "classic",
    name: "Classic Minimalist",
    description: "Premium linear travertine blocks, hand-selected oak partitions, and seamless architectural recessed warm LED outlines.",
    pricePerSqft: 1500,
    pricePerRoom: 100000,
    materials: ["Travertine Limestone", "White Rift Oak", "Satin Brushed Steel"],
  },
  {
    id: "japandi",
    name: "Japandi Zen Oasis",
    description: "Charred cedar framework (Shou Sugi Ban), volcanic slate basins, double-layered acoustic cedar flutings, and organic grasscloth wall overlays.",
    pricePerSqft: 2550,
    pricePerRoom: 180000,
    materials: ["Charred Cedar Wood", "Basalt Volcanic Slate", "Hand-woven Tatami Grasscloth"],
  },
  {
    id: "neoclassical",
    name: "Neoclassical Marble & Brass",
    description: "Pure Calacatta marble slab cladding, plaster fluted column moldings, fluted crystal dining sconces, and custom hand-polished warm brass trim.",
    pricePerSqft: 4000,
    pricePerRoom: 300000,
    materials: ["Calacatta Viola Marble", "Verde Alpi Serpentine", "Polished Virgin Brass"],
  },
  {
    id: "velvet",
    name: "Bespoke Maroon Velvet Grandeur",
    description: "French burgundy fluted lacquers, deep hand-tufted silk velvet wall modules, gold-leaf domed ceiling accents, and rare Italian mahogany woodwork.",
    pricePerSqft: 6000,
    pricePerRoom: 450000,
    materials: ["Silk Velvet Bouclé", "Italian Mahogany Wood", "24K Burnished Gold Leaf"],
  }
];

interface Upgrade {
  id: string;
  name: string;
  cost: number;
  description: string;
}

const UPGRADES: Upgrade[] = [
  {
    id: "wellness",
    name: "Thermal Wellness Cascade",
    cost: 1200000,
    description: "Custom wellness spa suite consisting of private cedar sauna rooms, cold-plunges, and monolithic thermal water basins.",
  },
  {
    id: "uplighting",
    name: "Curatorial Smart Cove Tracks",
    cost: 250000,
    description: "Intelligent architectural automated cove track system with multi-spectrum temperature zoning to reflect transient natural daylight shifts.",
  },
  {
    id: "double_ceilings",
    name: "Double-Height Ceiling Vaults",
    cost: 500000,
    description: "Master carpentry and plaster engineering to support 6-meter dramatic ceiling spans with nested sound-absorption buffers.",
  },
  {
    id: "vr_blueprints",
    name: "3D CAD & Immersive Virtual Walkthroughs",
    cost: 100000,
    description: "Photorealistic spatial mapping, custom VR simulation suites, and dedicated project-management visualization feeds.",
  }
];

export default function CostEstimation({ onExportEstimate }: CostEstimationProps) {
  const [sqft, setSqft] = useState<number>(1850);
  const [rooms, setRooms] = useState<number>(3);
  const [selectedTier, setSelectedTier] = useState<string>("japandi");
  const [activeUpgrades, setActiveUpgrades] = useState<string[]>(["vr_blueprints"]);

  // Calculate costs on change
  const [estimate, setEstimate] = useState({
    subtotal: 0,
    materials: 0,
    labor: 0,
    curatorFee: 0,
    upgradesCost: 0,
    total: 0,
    timelineWeeks: 0,
  });

  const [notification, setNotification] = useState<string>("");

  useEffect(() => {
    const tierObj = TIERS.find((t) => t.id === selectedTier) || TIERS[1];
    
    // Core construction calculation
    const baseBuildingCost = sqft * tierObj.pricePerSqft;
    const roomsCost = rooms * tierObj.pricePerRoom;
    const coreSubtotal = baseBuildingCost + roomsCost;

    // Upgrades calculation
    const upgradesSum = activeUpgrades.reduce((sum, id) => {
      const item = UPGRADES.find((u) => u.id === id);
      return sum + (item ? item.cost : 0);
    }, 0);

    // Dynamic cost partitioning
    const totalRaw = coreSubtotal + upgradesSum;
    const materialWeight = 0.52; // 52% materials
    const laborWeight = 0.33;    // 33% master artisan labor
    const curatorWeight = 0.15;  // 15% curatorial supervision and CAD drafts

    const materialsBudget = Math.round(totalRaw * materialWeight);
    const laborBudget = Math.round(totalRaw * laborWeight);
    const curatorBudget = Math.round(totalRaw * curatorWeight);
    const grandTotal = materialsBudget + laborBudget + curatorBudget;

    // Timeline calculation: scale relative to Sqft and Quality tiers
    let tierIndexFactor = 1;
    if (selectedTier === "classic") tierIndexFactor = 0.9;
    if (selectedTier === "neoclassical") tierIndexFactor = 1.35;
    if (selectedTier === "velvet") tierIndexFactor = 1.6;

    const baseWeeks = 10;
    const sizeAddedWeeks = Math.floor(sqft / 450);
    const computedWeeks = Math.round((baseWeeks + sizeAddedWeeks) * tierIndexFactor);

    setEstimate({
      subtotal: coreSubtotal,
      materials: materialsBudget,
      labor: laborBudget,
      curatorFee: curatorBudget,
      upgradesCost: upgradesSum,
      total: grandTotal,
      timelineWeeks: computedWeeks,
    });
  }, [sqft, rooms, selectedTier, activeUpgrades]);

  const handleToggleUpgrade = (id: string) => {
    setActiveUpgrades((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    if (!onExportEstimate) return;
    
    const selectedTierObj = TIERS.find((t) => t.id === selectedTier);
    const styleString = selectedTierObj ? selectedTierObj.name : "Custom Theme";
    
    onExportEstimate({
      style: styleString,
      budget: `₹${(estimate.total / 100000).toFixed(1)} Lakhs`,
      size: `${sqft.toLocaleString("en-IN")} SQFT / ${rooms} Suites`,
      notes: `Generated from Atelier Cost Estimator:\n- Style Theme: ${styleString}\n- Size: ${sqft} SQFT / ${rooms} Rooms\n- Upgrades: ${activeUpgrades.join(", ")}\n- Project Timeline estimate: ~${estimate.timelineWeeks} Weeks.`,
    });

    setNotification("Estimates exported! Redirecting to consultation scheduler...");
    setTimeout(() => setNotification(""), 4000);
  };

  const activeTierObj = TIERS.find((t) => t.id === selectedTier) || TIERS[1];

  return (
    <div id="cost-estimator" className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-10 shadow-sm space-y-10 font-sans">
      
      {/* Element Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <span className="font-mono text-xs text-[#6B2737] tracking-[0.3em] uppercase block mb-1">
            ATELIER CLIENT UTILITY
          </span>
          <h3 className="font-sans text-2xl font-light text-gray-900 leading-tight">
            BESPOKE <span className="font-semibold text-[#6B2737]">INVESTMENT ESTIMATOR</span>
          </h3>
        </div>
        <div className="flex items-center space-x-2 bg-[#6B2737]/5 px-4 py-2 rounded-full border border-[#6B2737]/10 font-sans text-[11px] font-semibold text-[#6B2737]">
          <Calculator className="h-4 w-4" />
          <span>Interactive Architectural Quotes</span>
        </div>
      </div>

      {notification && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-xs font-semibold animate-pulse">
          {notification}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Sliders Block */}
          <div className="space-y-6">
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center space-x-2">
              <Ruler className="h-4 w-4 text-[#6B2737]" />
              <span>SPATIAL SCALE DIMENSIONS</span>
            </h4>

            {/* Sqft Slider */}
            <div>
              <div className="flex justify-between font-mono text-xs text-gray-600 mb-2">
                <span>ESTATE FLOOR SCALE (SQ.FT.)</span>
                <span className="font-bold text-[#6B2737] text-sm">{sqft.toLocaleString()} SQFT</span>
              </div>
              <input
                type="range"
                min="1000"
                max="20000"
                step="250"
                value={sqft}
                onChange={(e) => setSqft(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-ew-resize accent-[#6B2737]"
              />
              <div className="flex justify-between font-mono text-[9px] text-gray-400 mt-1">
                <span>1,000 SQFT (PENTHOUSE APARTMENT)</span>
                <span>20,000 SQFT (MEGA CLIENT VILLA)</span>
              </div>
            </div>

            {/* Room Suite Counter */}
            <div>
              <div className="flex justify-between font-mono text-xs text-gray-600 mb-2">
                <span>SUITES & ROOM COUNT</span>
                <span className="font-bold text-[#6B2737] text-sm">{rooms} SUITES</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setRooms((prev) => Math.max(1, prev - 1))}
                  className="h-10 w-10 text-lg border border-gray-200 rounded-xl hover:border-[#6B2737] active:scale-95 transition-all text-gray-600 cursor-pointer flex items-center justify-center font-bold"
                >
                  -
                </button>
                <div className="flex-1 text-center bg-gray-50 border border-gray-150 py-2.5 rounded-xl font-sans text-xs text-gray-800 font-bold">
                  {rooms} Custom Formatted Chambers
                </div>
                <button
                  type="button"
                  onClick={() => setRooms((prev) => Math.min(12, prev + 1))}
                  className="h-10 w-10 text-lg border border-gray-200 rounded-xl hover:border-[#6B2737] active:scale-95 transition-all text-gray-600 cursor-pointer flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Aesthetic Tiers */}
          <div className="space-y-4">
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center space-x-2">
              <LayoutGrid className="h-4 w-4 text-[#6B2737]" />
              <span>AESTHETIC FINISHING THEMES</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TIERS.map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`border p-4 rounded-2xl cursor-pointer transition-all ${
                    selectedTier === tier.id
                      ? "border-[#6B2737] bg-[#6B2737]/5 shadow-sm"
                      : "border-gray-150 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h5 className="font-sans text-xs font-bold text-gray-800">{tier.name}</h5>
                    {selectedTier === tier.id && (
                      <span className="h-4 w-4 bg-[#6B2737] text-[#FFFAE1] rounded-full flex items-center justify-center text-[8px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-[11px] text-gray-500 font-light mt-1.5 leading-relaxed line-clamp-2">
                    {tier.description}
                  </p>
                  
                  {/* Visual materials pills */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {tier.materials.slice(0, 2).map((m, idx) => (
                      <span key={idx} className="font-mono text-[8px] bg-white border border-gray-100 rounded-full px-2 py-0.5 text-gray-400 uppercase">
                        {m}
                      </span>
                    ))}
                    <span className="font-mono text-[8px] text-[#6B2737] px-1 inline-flex items-center">
                      +1 more
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-100/50 pt-3 mt-3 text-[10px] font-mono text-gray-400">
                    <span>Base Sqft Cost:</span>
                    <span className="text-[#6B2737] font-bold">₹{tier.pricePerSqft}/SQFT</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Luxury Upgrades Checkboxes */}
          <div className="space-y-4">
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center space-x-2">
              <Settings className="h-4 w-4 text-[#6B2737]" />
              <span>BESPOKE DESIGN EXTRAVAGANZAS</span>
            </h4>

            <div className="divide-y divide-gray-150 border border-gray-150 rounded-2xl overflow-hidden font-sans text-xs bg-white">
              {UPGRADES.map((up) => {
                const isActive = activeUpgrades.includes(up.id);
                return (
                  <div
                    key={up.id}
                    onClick={() => handleToggleUpgrade(up.id)}
                    className={`p-4 flex items-start space-x-4 cursor-pointer transition-all ${
                      isActive ? "bg-gray-50/50" : "hover:bg-gray-50/20"
                    }`}
                  >
                    <div className="mt-0.5">
                      <div className={`h-4 w-4 rounded border flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-[#6B2737] border-[#6B2737] text-white"
                          : "border-gray-300"
                      }`}>
                        {isActive && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center font-semibold text-gray-800">
                        <span>{up.name}</span>
                        <span className="font-mono text-[11px] text-[#6B2737]">₹{up.cost.toLocaleString("en-IN")}</span>
                      </div>
                      <p className="font-sans text-[11px] text-gray-500 font-light mt-0.5 leading-snug">
                        {up.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Estimated Totals & Dynamic Breakdown */}
        <div className="lg:col-span-4 lg:col-start-9 bg-gray-50 border border-gray-150 rounded-3xl p-6 flex flex-col justify-between space-y-6">
          
          <div className="space-y-6">
            
            {/* Lead Status */}
            <div>
              <span className="font-mono text-[9px] tracking-widest text-[#6B2737] uppercase bg-[#6B2737]/10 px-2.5 py-0.5 rounded-full inline-block font-semibold">
                ESTIMATED PROPOSAL SUMMARY
              </span>
              <div className="mt-4">
                <span className="font-mono text-[10px] text-gray-400 block uppercase font-semibold">TOTAL BLUEPRINT VALUATION</span>
                <span className="font-sans text-3xl sm:text-4xl font-semibold text-[#6B2737] tracking-tight block">
                  ₹{estimate.total.toLocaleString("en-IN")}
                </span>
                <span className="font-mono text-[9px] text-[#6B2737]/60 uppercase tracking-widest block mt-0.5">
                  EST. BUDGET: {sqft} SQFT @ {activeTierObj.name}
                </span>
              </div>
            </div>

            {/* Estimated timeline weeks card */}
            <div className="bg-white border border-gray-150 p-4 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="font-sans">
                <span className="font-mono text-[9px] text-gray-400 block uppercase">EST. ATELIER DURATION</span>
                <span className="text-lg font-bold text-gray-900">~{estimate.timelineWeeks} Weeks</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#6B2737]/5 flex items-center justify-center">
                <Hammer className="h-5 w-5 text-[#6B2737]" />
              </div>
            </div>

            {/* Visual Budget Partitions bar diagram */}
            <div className="space-y-4">
              <h5 className="font-sans text-[11px] font-bold tracking-wider text-gray-400 uppercase">PARTITION DETAILS</h5>

              <div className="space-y-3.5 text-xs font-sans">
                
                {/* 1. Exotic Materials */}
                <div>
                  <div className="flex justify-between font-mono text-[10px] text-gray-500 mb-1 font-semibold">
                    <span>EXOTIC TIER MATERIALS (52%)</span>
                    <span>₹{estimate.materials.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#6B2737] rounded-full" style={{ width: "52%" }} />
                  </div>
                </div>

                {/* 2. Artisans and construction labor */}
                <div>
                  <div className="flex justify-between font-mono text-[10px] text-gray-500 mb-1 font-semibold">
                    <span>MASTER ARTISANS & LABOR (33%)</span>
                    <span>₹{estimate.labor.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "33%" }} />
                  </div>
                </div>

                {/* 3. Director Fee */}
                <div>
                  <div className="flex justify-between font-mono text-[10px] text-gray-500 mb-1 font-semibold">
                    <span>CURATOR INSPECTION & ARCHITECTURE (15%)</span>
                    <span>₹{estimate.curatorFee.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-800 rounded-full" style={{ width: "15%" }} />
                  </div>
                </div>

              </div>
            </div>

            {/* Materials Breakdown list */}
            <div className="bg-white border border-gray-150 p-4 rounded-2xl text-xs space-y-2">
              <span className="font-mono text-[9px] text-gray-400 block uppercase font-bold">MATERIALS REGISTERED IN TIER</span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-gray-700">
                {activeTierObj.materials.map((mat, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{mat}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Action Trigger Buttons */}
          <div className="space-y-3.5 pt-4 border-t border-gray-150/80">
            {onExportEstimate ? (
              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center space-x-2 rounded-full border border-[#6B2737] bg-[#6B2737] text-white px-5 py-3 text-xs font-semibold tracking-wider hover:bg-[#6B2737]/90 active:scale-95 transition-all text-center cursor-pointer shadow-sm shadow-[#6B2737]/10"
              >
                <CalendarPlus className="h-4 w-4 shrink-0" />
                <span>EXPORT SPECS TO BOOK INQUIRY</span>
              </button>
            ) : (
              <p className="text-[10px] font-mono text-gray-400 italic text-center">
                Sign in to export calculation values directly to the consultation desk.
              </p>
            )}
            <div className="flex items-center space-x-2 font-sans text-[10px] text-gray-500 leading-snug">
              <Info className="h-3.5 w-3.5 text-[#6B2737]/60 shrink-0" />
              <span>
                Simulated estimative assessment. Excludes heavy landscaping coordinates or rare site-level reinforcement clearances.
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
