import React, { useState, useEffect } from "react";
import { 
  ArrowUpRight, Maximize2, Split, Info, Loader2, Sparkles, 
  Search, SlidersHorizontal, ArrowUpDown, MapPin, Grid, Layers 
} from "lucide-react";
import CostEstimation from "./CostEstimation";

interface PortfolioItem {
  id: string;
  title: string;
  type: string;
  location: string;
  year: string;
  sqft: string;
  description: string;
  imageUrl: string;
  beforeUrl: string;
  budget: string;
}

interface PortfolioProps {
  onSelectTab: (tab: string) => void;
  setSelectedStyle: (style: string) => void;
  onExportEstimate?: (data: {
    style: string;
    budget: string;
    size: string;
    notes: string;
  }) => void;
}

export default function Portfolio({ onSelectTab, setSelectedStyle, onExportEstimate }: PortfolioProps) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  // Before/After slider control
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isSliding, setIsSliding] = useState<boolean>(false);

  // Search & Filter state variables
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedLocFilter, setSelectedLocFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("default");

  useEffect(() => {
    // Delay slightly to demonstrate beautiful skeletons or fetch immediately
    fetch("/api/projects/portfolio")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        if (data.length > 0) {
          setActiveItem(data[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load portfolio items", err);
        setLoading(false);
      });
  }, []);

  const handleSliderMove = (clientX: number, containerRect: DOMRect) => {
    const x = clientX - containerRect.left;
    const percentage = Math.max(0, Math.min(100, (x / containerRect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSliding) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleSliderMove(e.clientX, rect);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleSliderMove(e.touches[0].clientX, rect);
  };

  // Parsing helper functions for robust quantitative sorting
  const parseSqft = (val: string): number => {
    // extract digits from e.g. "12,400 sq.ft" or "5,400 sq.ft"
    return parseInt(val.replace(/[^0-9]/g, "")) || 0;
  };

  const parseBudget = (val: string): number => {
    // extract digits from e.g. "$4,200,000" or "$1,850,000"
    return parseInt(val.replace(/[^0-9]/g, "")) || 0;
  };

  // Perform search / filter operations dynamically
  const filteredAndSortedItems = items
    .filter((item) => {
      // 1. Text Search matching
      const s = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !s ||
        item.title.toLowerCase().includes(s) ||
        item.description.toLowerCase().includes(s) ||
        item.location.toLowerCase().includes(s) ||
        item.type.toLowerCase().includes(s);

      // 2. Type/Style filtering
      const matchesType = 
        selectedType === "All" || 
        item.type.toLowerCase().includes(selectedType.toLowerCase());

      // 3. Location filtering
      const matchesLoc = 
        selectedLocFilter === "All" ||
        item.location.toLowerCase().includes(selectedLocFilter.toLowerCase());

      return matchesSearch && matchesType && matchesLoc;
    })
    .sort((a, b) => {
      // 4. Custom sorting trigger
      if (sortBy === "sqft-asc") return parseSqft(a.sqft) - parseSqft(b.sqft);
      if (sortBy === "sqft-desc") return parseSqft(b.sqft) - parseSqft(a.sqft);
      if (sortBy === "budget-asc") return parseBudget(a.budget) - parseBudget(b.budget);
      if (sortBy === "budget-desc") return parseBudget(b.budget) - parseBudget(a.budget);
      return 0; // default order
    });

  // Unique categories for filters
  const locationOptions = ["All", "Noida", "Gurgaon", "Delhi", "Bangalore", "Pune"];
  const typeOptions = ["All", "Contemporary", "Luxury", "Minimalist", "Japandi"];

  // SKELETON SCREENS DESIGN (Improve perceived performance UX during loading cycles)
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10 space-y-16">
        {/* Pulsing Header Banner */}
        <div className="text-center space-y-4 animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded-full mx-auto" />
          <div className="h-10 w-80 bg-gray-200 rounded-lg mx-auto" />
          <div className="h-4 w-120 bg-gray-200 rounded mx-auto" />
        </div>

        {/* Pulsing Feature Slider block */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 bg-gray-50/50 p-2 rounded-3xl border border-gray-150 animate-pulse">
          <div className="lg:col-span-7 col-span-1">
            {/* Aspect Video frame */}
            <div className="aspect-video w-full rounded-2xl bg-gray-200" />
            <div className="h-4 w-1/3 bg-gray-200 rounded mt-4" />
          </div>
          <div className="lg:col-span-5 col-span-1 flex flex-col justify-between py-6 space-y-6">
            <div className="space-y-4">
              <div className="h-4 w-1/4 bg-gray-200 rounded" />
              <div className="h-8 w-2/3 bg-gray-200 rounded" />
              <div className="h-20 w-full bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded-lg" />
            </div>
            <div className="flex gap-4">
              <div className="h-12 flex-1 bg-gray-200 rounded-full" />
              <div className="h-12 w-40 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>

        {/* Pulsing other portfolios grid */}
        <div className="space-y-6 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="border border-gray-100 rounded-2xl p-4 bg-white space-y-4">
                <div className="aspect-video w-full bg-gray-200 rounded-xl" />
                <div className="h-5 w-2/3 bg-gray-200 rounded" />
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
                <div className="h-6 w-1/3 bg-gray-200 rounded-full pt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center">
        <span className="font-mono text-xs tracking-[0.4em] text-[#6B2737] uppercase bg-[#6B2737]/5 px-4 py-1.5 rounded-full inline-block mb-3 animate-fade-in">
          EXQUISITE PORTFOLIOS
        </span>
        <h2 className="font-sans text-4xl font-extralight tracking-tight text-gray-900 md:text-5xl">
          OUR DESIGN <span className="font-semibold text-[#6B2737]">PORTFOLIO</span>
        </h2>
        <div className="mx-auto mt-4 h-[1px] w-24 bg-[#6B2737]/20" />
        <p className="mx-auto mt-4 max-w-2xl font-sans text-sm font-light text-gray-500 leading-relaxed">
          Explore our premium residential transformations and modern architectural space executions custom crafted for modern Indian families seeking timeless beauty and absolute layout comfort.
        </p>
      </div>

      {/* FILTERING, SEARCHING & SORTING INTERFACE PANEL */}
      <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-sm space-y-6">
        
        {/* Search Input bar */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by design style, location, room category, premium teak veneer..."
              className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#6B2737] focus:bg-white text-gray-800 transition-all font-sans"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Sorting trigger dropdown */}
            <div className="flex items-center space-x-1.5 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50">
              <ArrowUpDown className="h-3.5 w-3.5 text-[#6B2737]/60" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-xs font-sans text-gray-700 outline-none cursor-pointer focus:ring-0 font-medium"
              >
                <option value="default font-bold">Standard Chronology</option>
                <option value="sqft-asc">Floor Scale: Small → Large</option>
                <option value="sqft-desc">Floor Scale: Large → Small</option>
                <option value="budget-asc">Investment: Low → High</option>
                <option value="budget-desc">Investment: High → Low</option>
              </select>
            </div>
          </div>

        </div>

        {/* Toggle Pills block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-5">
          
          {/* Styles category */}
          <div className="space-y-2">
            <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest block font-bold">
              ESTATE STYLE FILTER
            </span>
            <div className="flex flex-wrap gap-1.5">
              {typeOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedType(opt)}
                  className={`px-3 py-1 text-[10px] uppercase tracking-wider font-mono font-bold rounded-full border transition-all cursor-pointer ${
                    selectedType === opt
                      ? "bg-[#6B2737] border-[#6B2737] text-[#FFFAE1] shadow-sm"
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Locations Category */}
          <div className="space-y-2">
            <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest block font-bold">
              REGIONAL GEOGRAPHY
            </span>
            <div className="flex flex-wrap gap-1.5">
              {locationOptions.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocFilter(loc)}
                  className={`px-3 py-1 text-[10px] uppercase tracking-wider font-mono font-bold rounded-full border transition-all cursor-pointer ${
                    selectedLocFilter === loc
                      ? "bg-[#6B2737] border-[#6B2737] text-[#FFFAE1] shadow-sm"
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {loc === "All" ? "All Locations" : loc}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Main Feature: Interactive Before/After Visualizer */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 p-16 text-center shadow-inner">
          <SlidersHorizontal className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h4 className="font-sans text-lg font-medium text-gray-700">No Matching Monuments Catalogued</h4>
          <p className="max-w-md font-sans text-xs text-gray-500 leading-relaxed mx-auto mt-2 font-light">
            We couldn't detect any active projects matching "{searchQuery}" with the chosen style or locations filters. Try resetting specifications parameters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedType("All");
              setSelectedLocFilter("All");
              setSortBy("default");
            }}
            className="mt-6 rounded-full border border-[#6B2737] text-[#6B2737] px-6 py-2.5 text-xs font-semibold hover:bg-[#6B2737] hover:text-white transition-all cursor-pointer"
          >
            RESET CURATOR FILTERS
          </button>
        </div>
      ) : (
        <>
          {/* Ensure active item updates automatically if selection falls out of filtered scope */}
          {activeItem && !filteredAndSortedItems.find((item) => item.id === activeItem.id) && (
            <div className="hidden" style={{ display: 'none' }}>
              {(() => {
                setTimeout(() => {
                  if (filteredAndSortedItems.length > 0) {
                    setActiveItem(filteredAndSortedItems[0]);
                  }
                }, 0);
                return null;
              })()}
            </div>
          )}

          {activeItem && (
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 bg-[#FFFAE1]/10 p-2 rounded-3xl border border-gray-100 shadow-sm animate-fade-in">
              
              {/* Interactive slider column */}
              <div className="lg:col-span-7">
                <div className="text-sm font-medium text-gray-700 mb-4 flex items-center justify-between px-2">
                  <span className="flex items-center space-x-1.5 font-mono text-[10px] tracking-widest text-[#6B2737] font-bold">
                    <Split className="h-3 w-3" />
                    <span>INTERACTIVE TRANSFORMATION SLIDER</span>
                  </span>
                  <span className="hidden sm:inline-block font-sans text-[10px] text-gray-500 bg-white shadow-xs border border-gray-100 rounded-full px-3 py-1">
                    Drag the middle divider left & right
                  </span>
                </div>

                {/* Slider container */}
                <div 
                  className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-900 shadow-xl border border-gray-100 select-none cursor-ew-resize"
                  onMouseDown={() => setIsSliding(true)}
                  onMouseUp={() => setIsSliding(false)}
                  onMouseLeave={() => setIsSliding(false)}
                  onMouseMove={handleMouseMove}
                  onTouchStart={() => setIsSliding(true)}
                  onTouchEnd={() => setIsSliding(false)}
                  onTouchMove={handleTouchMove}
                >
                  {/* After element (Fully finished luxury state) */}
                  <img 
                    src={activeItem.imageUrl} 
                    alt="After state" 
                    className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                  />
                  <div className="absolute right-4 bottom-4 z-10 rounded-md bg-black/60 px-2.5 py-1 font-mono text-[9px] tracking-wider text-[#FFFAE1] uppercase font-black">
                    Bespoke Final State
                  </div>

                  {/* Before element (Construction/Unfinished state) */}
                  <div 
                    className="absolute inset-0 h-full w-full pointer-events-none"
                    style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                  >
                    <img 
                      src={activeItem.beforeUrl} 
                      alt="Before state" 
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute left-4 bottom-4 z-10 rounded-md bg-black/60 px-2.5 py-1 font-mono text-[9px] tracking-wider text-[#FFFAE1] uppercase font-black">
                      Before Transformation
                    </div>
                  </div>

                  {/* Slider bar handler */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-[#FFFAE1] z-20 pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full border-2 border-white bg-[#6B2737] shadow-xl flex items-center justify-center">
                      <Split className="h-4 w-4 text-[#FFFAE1]" />
                    </div>
                    <div className="absolute top-1/4 -translate-x-1/2 h-4 w-[2px] bg-white rounded" />
                    <div className="absolute bottom-1/4 -translate-x-1/2 h-4 w-[2px] bg-white rounded" />
                  </div>
                </div>
                
                {/* Direct Slider Shortcuts */}
                <div className="flex justify-between mt-3 px-2">
                  <button 
                    onClick={() => setSliderPosition(2)}
                    className="font-mono text-[10px] text-gray-500 hover:text-[#6B2737] hover:underline cursor-pointer"
                  >
                    Show 100% Final Look
                  </button>
                  <button 
                    onClick={() => setSliderPosition(50)}
                    className="font-mono text-[10px] text-gray-500 hover:text-[#6B2737] hover:underline cursor-pointer"
                  >
                    Center Divider
                  </button>
                  <button 
                    onClick={() => setSliderPosition(98)}
                    className="font-mono text-[10px] text-gray-500 hover:text-[#6B2737] hover:underline cursor-pointer"
                  >
                    Show 100% Initial Site
                  </button>
                </div>
              </div>

              {/* Luxury Specifications Column */}
              <div className="lg:col-span-5 flex flex-col justify-between py-2 px-4 lg:px-0">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-mono text-amber-800 uppercase tracking-widest mb-2 font-bold">
                    <span>{activeItem.type}</span>
                    <span>•</span>
                    <span>{activeItem.year}</span>
                  </div>
                  <h3 className="font-sans text-3xl font-extralight text-gray-900 leading-tight">
                    {activeItem.title}
                  </h3>
                  <p className="font-sans text-[#6B2737] font-medium text-sm mt-1 flex items-center space-x-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{activeItem.location}</span>
                  </p>
                  
                  <p className="mt-5 text-sm font-light text-gray-600 leading-relaxed">
                    {activeItem.description}
                  </p>

                  {/* Specs Grid */}
                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4 font-mono text-xs text-gray-500 font-semibold">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Floor Geometry</span>
                      <span className="text-gray-800 font-bold">{activeItem.sqft}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Aesthetic Investment</span>
                      <span className="text-gray-800 font-bold">{activeItem.budget}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Trigger */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setSelectedStyle(activeItem.title);
                      onSelectTab("booking");
                    }}
                    className="flex-1 rounded-full border border-[#6B2737] bg-[#6B2737] text-white px-5 py-3 text-xs font-semibold tracking-wider hover:bg-[#6B2737]/90 transition-all text-center cursor-pointer shadow-sm shadow-[#6B2737]/10"
                  >
                    INQUIRE ON THEME
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStyle(activeItem.title);
                      onSelectTab("ai-assistant");
                    }}
                    className="flex items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white text-gray-700 px-5 py-3 text-xs font-semibold tracking-wider hover:border-[#6B2737] hover:text-[#6B2737] transition-all cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse shrink-0" />
                    <span>PLAN IN FLOOR PLANS ASSISTANT</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Grid of other portfolios */}
          <div className="border-t border-gray-100 pt-12">
            <h4 className="font-sans text-xs tracking-[0.3em] text-gray-400 uppercase font-black mb-6 text-center">
              EXPLORE Curated PORTFOLIOS ({filteredAndSortedItems.length} matches)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredAndSortedItems.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => {
                    setActiveItem(item);
                    setSliderPosition(50); // reset slider to center
                    // Smooth scroll to top of slider section
                    window.scrollTo({ top: 400, behavior: "smooth" });
                  }}
                  className={`group cursor-pointer overflow-hidden rounded-2xl bg-white border transition-all duration-300 ${
                    activeItem?.id === item.id 
                      ? "border-[#6B2737] shadow-lg scale-[1.02]" 
                      : "border-gray-150 shadow-sm hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                    <div className="absolute right-3 top-3 rounded-full bg-white/90 backdrop-blur-sm p-1.5 shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="h-3.5 w-3.5 text-[#6B2737]" />
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="font-mono text-[9px] tracking-widest text-[#6B2737] uppercase block mb-1">
                      {item.type}
                    </span>
                    <h5 className="font-sans text-lg font-medium text-gray-900 group-hover:text-[#6B2737] transition-colors">
                      {item.title}
                    </h5>
                    <p className="font-sans text-xs text-gray-500 line-clamp-2 mt-2 font-light leading-relaxed">
                      {item.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
                      <span className="font-sans text-xs text-gray-400 flex items-center space-x-1 shrink-0">
                        <MapPin className="h-3 w-3 inline text-red-500/50" />
                        <span>{item.location}</span>
                      </span>
                      <span className="font-mono text-xs text-[#6B2737] font-bold">
                        {item.budget} ({parseSqft(item.sqft).toLocaleString()} SQFT)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* NEW INTERACTIVE COST ESTIMATION CALCULATOR */}
      <div className="border-t border-gray-100 pt-16">
        <CostEstimation onExportEstimate={onExportEstimate} />
      </div>

    </div>
  );
}
