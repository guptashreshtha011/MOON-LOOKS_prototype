import React, { useState, useEffect, useRef } from "react";
import { User, Project, Message } from "../types";
import { BRANDING, PRICING_PACKAGES } from "../config/branding";
import { quotationService, Quotation } from "../database/quotationService";
import { userService } from "../database/userService";
import { projectService } from "../database/projectService";
import { bookingService } from "../database/bookingService";
import { 
  Building2, Calendar, ClipboardList, CreditCard, Send, CheckCircle, 
  Clock, DollarSign, MessageSquare, Loader2, Sparkles, User as UserIcon,
  Layers, MapPin, Sparkle, Download, Compass, Plus, Save, ChevronRight, HelpCircle
} from "lucide-react";

interface ClientDashboardProps {
  currentUser: User;
}

export default function ClientDashboard({ currentUser }: ClientDashboardProps) {
  // Navigation tabs
  const [activeTab, setActiveTabLocal] = useState<string>("overview");
  
  // Storage states
  const [profile, setProfile] = useState<User>(currentUser);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [typedMessage, setTypedMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  
  // Custom interactive cost estimator state
  const [estSize, setEstSize] = useState<number>(1850);
  const [estStyle, setEstStyle] = useState<string>("Modern Contemporary 3BHK");
  const [estGrade, setEstGrade] = useState<string>("Sovereign Gold");
  const [estCity, setEstCity] = useState<string>(currentUser.city || "Gurgaon");
  const [activeEstimate, setActiveEstimate] = useState<Quotation | null>(null);
  const [savingEstimateMsg, setSavingEstimateMsg] = useState<string | null>(null);

  // Profile forms
  const [editName, setEditName] = useState<string>(currentUser.name);
  const [editBio, setEditBio] = useState<string>(currentUser.bio || "");
  const [editPhone, setEditPhone] = useState<string>(currentUser.phone || "");
  const [editCity, setEditCity] = useState<string>(currentUser.city || "");
  const [editProjectType, setEditProjectType] = useState<string>(currentUser.projectType || "");
  const [profileUpdateMsg, setProfileUpdateMsg] = useState<string | null>(null);

  const [sendingMsg, setSendingMsg] = useState<boolean>(false);
  const [payingMsId, setPayingMsId] = useState<string | null>(null);
  const chatsEndRef = useRef<HTMLDivElement | null>(null);

  const token = localStorage.getItem("moonlooks_token") || "";

  // Dynamic Saved Designs (inspiration mock list)
  const savedDesigns = [
    { id: "img_sd1", title: "Teakwood Slatted Living Backdrop", area: "Living Room", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400" },
    { id: "img_sd2", title: "Muted Lavender False Ceiling Panel", area: "Master Suite", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=400" },
    { id: "img_sd3", title: "Satin Brass Fluted Kitchen Island", area: "Italian Kitchen", img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=400" },
    { id: "img_sd4", title: "Calacatta Gold Bookmatched Bath Panel", area: "Powder Room", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400" }
  ];

  const loadPortalData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Fetch assigned projects
      const projs = await projectService.getClientProjects(token);
      setProjects(projs);

      // Fetch client chat logs
      const response = await fetch("/api/messages", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const chats = await response.json();
        setMessages(chats);
      }

      // Fetch client quotations
      const responseQuotes = await fetch("/api/quotations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (responseQuotes.ok) {
        const qtns = await responseQuotes.json();
        setQuotations(qtns);
      }

      // Sync user profile
      const userProfile = await userService.getProfile(token);
      setProfile(userProfile);
    } catch (err) {
      console.error("Portal loading failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
    
    // Refresh messages loop
    const chatPollTimer = setInterval(() => {
      if (token) {
        fetch("/api/messages", { headers: { Authorization: `Bearer ${token}` } })
          .then(res => res.json())
          .then(data => { if (Array.isArray(data)) setMessages(data); })
          .catch(console.log);
      }
    }, 4500);

    return () => clearInterval(chatPollTimer);
  }, []);

  // Scroll to bottom of threads
  useEffect(() => {
    chatsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTab]);

  // Recalculate guest estimation
  useEffect(() => {
    const freshEstimate = quotationService.calculateQuote(estSize, estStyle, estGrade);
    setActiveEstimate(freshEstimate);
  }, [estSize, estStyle, estGrade]);

  // Handle direct message transmit
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || sendingMsg) return;
    setSendingMsg(true);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: typedMessage })
      });
      if (response.ok) {
        setTypedMessage("");
        const newMsg = await response.json();
        setMessages(prev => [...prev, newMsg]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMsg(false);
    }
  };

  // Dispatch payment
  const handlePayMilestone = async (projId: string, msId: string) => {
    setPayingMsId(msId);
    try {
      const updatedProj = await projectService.postMilestonePayment(token, projId, msId);
      setProjects(prev => prev.map(p => p.id === projId ? updatedProj : p));
    } catch (err: any) {
      alert(err.message || "Simulated gateway processing errored.");
    } finally {
      setPayingMsId(null);
    }
  };

  // Submit profile alterations to DB
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileUpdateMsg("Verifying cryptographic payload with Atlas...");
    try {
      const updatedUser = await userService.updateProfile(token, {
        name: editName,
        bio: editBio,
        phone: editPhone,
        city: editCity,
        projectType: editProjectType
      });
      setProfile(updatedUser);
      setProfileUpdateMsg("Success! Bespoke parameters saved securely in cloud database.");
      setTimeout(() => setProfileUpdateMsg(null), 4000);
    } catch (err: any) {
      setProfileUpdateMsg(`Error: ${err.message}`);
    }
  };

  // Save generated quote estimate to DB quotations history
  const handleSaveEstimate = async () => {
    if (!activeEstimate) return;
    setSavingEstimateMsg("Recording bespoke blueprint quotation in Supabase cache...");
    try {
      const saved = await quotationService.saveClientQuotation(token, {
        ...activeEstimate,
        city: estCity,
        projectType: estStyle
      });
      setQuotations(prev => [saved, ...prev]);
      setSavingEstimateMsg("Estimate committed safely! Find this in ('Quotations') sheet.");
      setTimeout(() => setSavingEstimateMsg(null), 4000);
    } catch (err: any) {
      setSavingEstimateMsg(`Save interrupted: ${err.message}`);
    }
  };

  // Total sums of active financial budgets
  const activeProject = projects[0];
  const totalBudget = activeProject?.invoice?.budgetTotal || 0;
  const totalPaid = activeProject?.invoice?.amountPaid || 0;
  const pendingPaid = activeProject?.invoice?.pendingAmount || 0;

  if (loading) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-6 text-center">
        <Loader2 className="h-10 w-10 text-[#6B2737] animate-spin mx-auto mb-4" />
        <p className="font-sans text-xs tracking-widest text-[#6B2737] uppercase font-bold">RECONCILING BESPOKE BLUEPRINTS...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in">
      
      {/* Title block */}
      <div className="mb-10 text-left border-b border-gray-150 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="font-mono text-[9px] text-[#6B2737] tracking-[0.4em] uppercase block mb-1 font-bold">
            CURATED HOMEOWNER COUPE • PORTAL ACTIVE
          </span>
          <h2 className="font-sans text-3xl font-extralight text-gray-900 leading-tight">
            Nouveau Atelier, <span className="font-semibold text-[#6B2737]">{profile.name}</span>
          </h2>
          <p className="font-sans text-xs text-gray-500 font-light mt-1">
            Registered: {profile.city || "NCR Hub"} • Style Select: {profile.projectType || "Penthouse Spec"}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 bg-[#6B2737]/5 px-4 py-2 rounded-full border border-[#6B2737]/10 w-fit">
          <Sparkle className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse" />
          <span className="font-sans text-[10px] font-bold text-[#6B2737] uppercase tracking-widest">
            {profile.role?.toUpperCase() || "CLIENT"} LEDGER NO: {profile.id?.slice(-5).toUpperCase() || "NEW"}
          </span>
        </div>
      </div>

      {/* Grid structure combining tabs side navigation + active sheet content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Tab Switch Navigation */}
        <aside className="lg:col-span-3 space-y-2">
          {[
            { id: "overview", label: "Overview", icon: Compass },
            { id: "projects", label: "My Projects", icon: Building2 },
            { id: "quotation", label: "Cost Estimator", icon: ClipboardList },
            { id: "payments", label: "Payments Ledger", icon: CreditCard },
            { id: "timeline", label: "Timeline Status", icon: Clock },
            { id: "messages", label: "Messages Room", icon: MessageSquare },
            { id: "designs", label: "Saved Designs", icon: Layers },
            { id: "profile", label: "Profile Metadata", icon: UserIcon }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabLocal(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  isSel 
                    ? "bg-[#6B2737] border-[#6B2737] text-[#FFFAE1] shadow-md shadow-[#6B2737]/10" 
                    : "bg-white border-gray-150 text-gray-600 hover:bg-gray-50 hover:text-[#6B2737]"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <IconComp className={`h-4 w-4 ${isSel ? "text-white" : "text-[#6B2737]"}`} />
                  <span>{tab.label}</span>
                </div>
                {isSel && <ChevronRight className="h-3 w-3 text-[#FFFAE1]" />}
              </button>
            );
          })}

          <div className="pt-6 border-t border-gray-150 text-center">
            <span className="font-mono text-[9px] text-gray-400 uppercase font-black tracking-widest block mb-1">ATELIER DIRECT LINE</span>
            <a href={`https://wa.me/${BRANDING.whatsappNumber}`} target="_blank" rel="noreferrer" className="text-[11px] font-sans font-bold text-green-700 hover:underline">
              ⚡ WhatsApp SOS Chat
            </a>
          </div>
        </aside>

        {/* Right Active Sheet Panels */}
        <main className="lg:col-span-9 bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 min-h-[500px]">
          
          {/* SECTION 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 text-left">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-sans text-xl font-bold text-gray-800 uppercase tracking-wide">ATELIER PORTAL BOARD OVERVIEW</h3>
                <p className="font-sans text-xs text-gray-400 mt-1">Summary stats of your custom residential contract milestones and payments status.</p>
              </div>

              {/* Statistics Panel Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-[#6B2737]/5 to-[#6B2737]/0 border border-[#6B2737]/10 p-5 rounded-2xl">
                  <span className="block font-mono text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-2">CRITERIA ESTIMATED SUM</span>
                  <p className="text-xl font-bold text-gray-800">₹{totalBudget ? totalBudget.toLocaleString("en-IN") : "No Active Contract"}</p>
                  <span className="text-[10px] text-gray-400 font-light block mt-1">Turn-key quote details assigned</span>
                </div>
                <div className="bg-gradient-to-br from-green-500/5 to-green-500/0 border border-green-500/10 p-5 rounded-2xl">
                  <span className="block font-mono text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-2">AMOUNT CLEARED IN LEDGER</span>
                  <p className="text-xl font-bold text-green-800">₹{totalPaid.toLocaleString("en-IN")}</p>
                  <span className="text-[10px] text-gray-400 font-light block mt-1">Fully cross-verified with bank logs</span>
                </div>
                <div className="bg-gradient-to-br from-amber-500/5 to-amber-500/0 border border-amber-500/10 p-5 rounded-2xl">
                  <span className="block font-mono text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-2">INVOICES PENDING PROCESSING</span>
                  <p className="text-xl font-bold text-amber-800">₹{pendingPaid.toLocaleString("en-IN")}</p>
                  <span className="text-[10px] text-gray-400 font-light block mt-1">Awaiting milestone dispatch</span>
                </div>
              </div>

              {/* Active Workspace summary */}
              {activeProject ? (
                <div className="border border-gray-150 rounded-2xl p-6 bg-gray-50/50 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <span className="font-mono text-[9px] text-[#6B2737] bg-[#6B2737]/5 border border-[#6B2737]/10 px-2 py-0.5 rounded-full font-bold uppercase uppercase">ACTIVE PROJECT</span>
                      <h4 className="font-sans text-lg font-semibold text-gray-800 mt-2">{activeProject.title}</h4>
                      <p className="text-xs text-gray-500 font-light">{activeProject.location} • Lead Designer: {activeProject.leadDesigner}</p>
                    </div>
                    <div className="text-right sm:text-right">
                      <span className="text-[10px] font-mono text-gray-400 uppercase block font-bold">STAGE STATE</span>
                      <span className="text-xs font-bold text-[#6B2737] bg-white border border-gray-150 px-3 py-1 rounded-full uppercase inline-block mt-1">{activeProject.status}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between font-mono text-[10px] text-gray-500 mb-1">
                      <span>PHYSICAL COMPLETION PERCENT:</span>
                      <span>{activeProject.progressPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#6B2737] transition-all" style={{ width: `${activeProject.progressPercent}%` }} />
                    </div>
                  </div>

                  <button onClick={() => setActiveTabLocal("projects")} className="text-[#6B2737] font-semibold text-xs hover:underline flex items-center space-x-1 mt-2 cursor-pointer">
                    <span>Inspect active plans and swatches</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="border border-dashed border-gray-200 text-center py-12 rounded-2xl bg-gray-50">
                  <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="font-sans text-xs font-bold text-gray-600">NO ARCHITECTURAL PROJECTS ALLOCATED</p>
                  <p className="text-[11px] text-gray-400 font-light mt-1 max-w-sm mx-auto">Please consult our designers or update profile metadata to start your luxury construction tracker.</p>
                </div>
              )}

              {/* Instant notification alert center */}
              <div className="bg-[#6B2737]/5 border border-[#6B2737]/10 rounded-2xl p-5 flex items-start space-x-3">
                <Sparkles className="h-5 w-5 text-[#6B2737] shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <span className="font-sans text-xs font-bold text-[#6B2737] uppercase tracking-wider block mb-1">PRINCIPAL ARCHITECT REMARK</span>
                  <p className="text-xs text-gray-700 leading-relaxed font-light">
                    &quot;Namaste {profile.name}! Bespoke materials like Italian Botticino marble frames have arrived at the assembly hub. We are scheduling CAD ceiling layouts render logs next week.&quot;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: MY PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-8 text-left">
              <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-sans text-xl font-bold text-gray-800 uppercase tracking-wide">ACTIVE ARCHITECTURAL CONTRACTS</h3>
                  <p className="font-sans text-xs text-gray-400 mt-1">List of your ongoing luxury residential constructions and assigned design briefs.</p>
                </div>
              </div>

              {projects.length === 0 ? (
                <div className="border border-dashed border-gray-200 text-center py-12 rounded-2xl bg-gray-50">
                  <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-2 icon-stroke-1" />
                  <p className="font-sans text-xs font-bold text-gray-600">No project briefs allocated here.</p>
                </div>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="border border-gray-150 rounded-2xl p-6 hover:shadow-md transition-shadow duration-350 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="font-mono text-[9px] tracking-widest text-[#6B2737] bg-[#6B2737]/5 px-2.5 py-0.5 rounded-full font-bold uppercase uppercase">CONTRACT ASSIGNED</span>
                        <h4 className="font-sans text-xl font-bold text-gray-800 mt-2">{project.title}</h4>
                        <p className="text-xs text-gray-500 font-light mt-0.5">{project.location} • Lead Designer: {project.leadDesigner}</p>
                      </div>
                      <div className="text-right sm:text-right shrink-0">
                        <span className="text-[10px] font-mono text-gray-400 uppercase font-bold block">CONSTRUCTION STATE</span>
                        <span className="text-xs font-bold text-[#6B2737] bg-white border border-gray-150 px-3 py-1 rounded-full uppercase mt-1 inline-block">{project.status}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <div>
                        <h5 className="font-sans text-[11px] font-bold text-[#6B2737] tracking-wider uppercase mb-3 text-left">MATERIAL SWATCH PALETTE</h5>
                        <div className="flex space-x-2">
                          {project.specifications?.palette?.map((color, idx) => (
                            <div key={idx} className="group relative">
                              <div className="h-10 w-10 rounded-full border border-gray-200" style={{ backgroundColor: color }} />
                              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform font-mono text-[8px] bg-gray-900 text-white px-1 py-0.5 rounded font-black z-10">{color}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-sans text-[11px] font-bold text-[#6B2737] tracking-wider uppercase mb-3 text-left">SPECIFIED EXOTIC MATERIALS</h5>
                        <div className="flex flex-wrap gap-1.5 justify-start">
                          {project.specifications?.materials?.map((mat, idx) => (
                            <span key={idx} className="font-sans text-[10px] text-[#6B2737] bg-[#6B2737]/5 border border-[#6B2737]/10 px-2 py-1 rounded-full font-medium">{mat}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between font-mono text-[10px] text-gray-500 mb-1 font-bold">
                        <span>STAGE ESTIMATE PROGRESS ROADMAP:</span>
                        <span>{project.progressPercent}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#6B2737]" style={{ width: `${project.progressPercent}%` }} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* SECTION 3: COST ESTIMATOR & QUOTATIONS */}
          {activeTab === "quotation" && (
            <div className="space-y-8 text-left">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-sans text-xl font-bold text-gray-800 uppercase tracking-wide">LUXURY COST ESTIMATOR & BLUEPRINT PORTING</h3>
                <p className="font-sans text-xs text-gray-400 mt-1">Establish instant realistic budgets matching your selected square footage design styles and material grades.</p>
              </div>

              {/* Estimate Generator Input Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-150">
                <div className="space-y-4">
                  <h4 className="font-sans text-sm font-bold text-gray-700 uppercase">1. ESTIMATION FORMULAE PARAMETERS</h4>
                  
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">Target Carpet Area (sqft)</label>
                    <input
                      type="number"
                      value={estSize}
                      onChange={(e) => setEstSize(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#6B2737]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">Site Configuration Style</label>
                    <select
                      value={estStyle}
                      onChange={(e) => setEstStyle(e.target.value)}
                      className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#6B2737] cursor-pointer"
                    >
                      <option value="Modern Contemporary 3BHK">Modern Contemporary 3BHK (Noida / Delhi)</option>
                      <option value="Traditional Bespoke Mansion">Bespoke Heritage Villa (DLF Gurgaon)</option>
                      <option value="Scandinavian Japandi Penthouse">Scandinavian Japandi (Bangalore Outer Ring)</option>
                      <option value="Warm Minimalist Duplex">Warm Minimalist Duplex (Pune Koregaon)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">Architectural Material Tier</label>
                    <select
                      value={estGrade}
                      onChange={(e) => setEstGrade(e.target.value)}
                      className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#6B2737] cursor-pointer"
                    >
                      <option value="Elite Heritage">Elite Heritage Finish • ₹2200/sqft (Premium Italian Woods & Teak)</option>
                      <option value="Sovereign Gold">Sovereign Gold Finish • ₹1600/sqft (Modular carcases & Quartz)</option>
                      <option value="Standard Comfort">Standard Comfort • ₹900/sqft (Modular clean veneer and laminates)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">City Hub Location</label>
                    <select
                      value={estCity}
                      onChange={(e) => setEstCity(e.target.value)}
                      className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    >
                      <option value="Gurgaon">Gurgaon (DLF Golf Course Road)</option>
                      <option value="Bangalore">Bangalore (Whitefield Hub)</option>
                      <option value="Mumbai">Mumbai (Bandra Sea Link Spec)</option>
                      <option value="Noida">Noida (Sector 150 Highrises)</option>
                      <option value="Pune">Pune (Koregaon Park)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 flex flex-col justify-between">
                  <h4 className="font-sans text-sm font-bold text-gray-700 uppercase">2. LIVE BESPOKE INR QUOTATION SUMMARY</h4>

                  {activeEstimate && (
                    <div className="border border-gray-150 p-4 rounded-xl bg-white space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="font-sans text-xs text-gray-500">Proposed Total Sum:</span>
                        <span className="font-sans text-lg font-bold text-[#6B2737]">₹{activeEstimate.estimatedTotal.toLocaleString("en-IN")}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-gray-400 uppercase font-bold tracking-wider block mb-1">Estimated Line Breakdowns:</span>
                        {activeEstimate.lineItems.map((item, id) => (
                          <div key={id} className="flex justify-between text-[11px] font-light leading-relaxed">
                            <span className="truncate max-w-[70%] text-gray-600">• {item.description}</span>
                            <span className="font-mono text-gray-500">₹{item.cost.toLocaleString("en-IN")}</span>
                          </div>
                        ))}
                      </div>

                      {savingEstimateMsg && (
                        <div className="p-2 border border-amber-200 bg-amber-50 rounded-lg text-amber-800 text-[10px] font-bold text-center">
                          {savingEstimateMsg}
                        </div>
                      )}

                      <button onClick={handleSaveEstimate} className="w-full mt-2 rounded-xl bg-[#6B2737] text-white text-[11px] font-bold py-2.5 uppercase tracking-wider hover:bg-[#6B2737]/90 transition-all flex items-center justify-center space-x-1.5 cursor-pointer">
                        <Save className="h-3.5 w-3.5" />
                        <span>Save Quote to Registered Profile</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* History checklist */}
              <div className="space-y-4">
                <h4 className="font-sans text-xs font-bold text-gray-400 tracking-wider uppercase">Your Saved Architectural Quotations (Supabase Cache)</h4>
                {quotations.length === 0 ? (
                  <p className="font-sans text-xs text-gray-400 italic font-light">No saved quotation models saved yet to the cloud registry.</p>
                ) : (
                  <div className="border border-gray-150 rounded-2xl overflow-hidden divide-y divide-gray-100 font-sans text-xs">
                    {quotations.map((q) => (
                      <div key={q.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-800">{q.projectType}</span>
                            <span className="text-[9px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 border border-amber-100 rounded uppercase">{q.materialsGradeText}</span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5">{q.sizeSqFt} sqft • City: {q.city} • Date: {q.date}</p>
                        </div>
                        <div className="flex items-center space-x-3 shrink-0">
                          <span className="font-bold text-gray-900">₹{q.estimatedTotal.toLocaleString("en-IN")}</span>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-bold bg-green-50 text-green-700 border border-green-150">{q.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 4: PAYMENTS LEDGER */}
          {activeTab === "payments" && (
            <div className="space-y-8 text-left">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-sans text-xl font-bold text-gray-800 uppercase tracking-wide">FINANCIAL CONCORD & BANK ROLLS</h3>
                <p className="font-sans text-xs text-gray-400 mt-1">Cross-check milestone bills, pay invoices instantly via safe portal logs, and download historical bookkeeping ledgers.</p>
              </div>

              {activeProject ? (
                <div className="space-y-6">
                  {/* Ledger Details table */}
                  <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-gray-50 p-4 sm:px-6 grid grid-cols-3 gap-4 border-b border-gray-150 text-center font-mono text-xs text-gray-500 font-semibold">
                      <div className="border-r border-gray-150 pr-2">
                        <span className="block text-[8px] text-gray-400 uppercase tracking-widest font-black">Contract budget sum</span>
                        <span className="text-gray-800 text-sm font-bold block">₹{activeProject.invoice.budgetTotal.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="border-r border-gray-150 px-2 text-green-700">
                        <span className="block text-[8px] text-gray-400 uppercase tracking-widest font-black">Ledger Paid Cleared</span>
                        <span className="text-sm font-bold block">₹{activeProject.invoice.amountPaid.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="px-2 text-amber-700">
                        <span className="block text-[8px] text-gray-400 uppercase tracking-widest font-black">Awaiting clearing</span>
                        <span className="text-sm font-bold block">₹{activeProject.invoice.pendingAmount.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="divide-y divide-gray-100 font-sans text-xs">
                      {activeProject.invoice.milestones.map((ms) => (
                        <div key={ms.id} className="p-4 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <p className="font-semibold text-gray-800">{ms.desc}</p>
                            <p className="font-mono text-[10px] text-gray-500 mt-0.5 uppercase">VERIFIED LEDGER: ₹{ms.amount.toLocaleString("en-IN")} INR</p>
                          </div>

                          <div className="shrink-0 flex items-center space-x-2">
                            {ms.status === "Paid" ? (
                              <span className="flex items-center space-x-1 font-mono text-[9px] font-bold text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
                                <CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" />
                                <span>BANK CLEARED</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => handlePayMilestone(activeProject.id, ms.id)}
                                disabled={payingMsId === ms.id}
                                className="flex items-center space-x-1 bg-[#6B2737] text-white font-bold text-[10px] tracking-wider uppercase px-4 py-1.5 rounded-full border hover:bg-[#6B2737]/95 disabled:opacity-50 cursor-pointer"
                              >
                                {payingMsId === ms.id ? "TRANSACTING..." : "DISPATCH BILL"}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-gray-200 text-center py-12 rounded-2xl bg-gray-50">
                  <CreditCard className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="font-sans text-xs font-bold text-gray-600">No project invoices generated yet</p>
                </div>
              )}
            </div>
          )}

          {/* SECTION 5: TIMELINE */}
          {activeTab === "timeline" && (
            <div className="space-y-8 text-left">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-sans text-xl font-bold text-gray-800 uppercase tracking-wide">CONSTRUCTION MILESTONES & WORK TRACKER</h3>
                <p className="font-sans text-xs text-gray-400 mt-1">Live tracking of architectural blueprints and site assembly tasks.</p>
              </div>

              {activeProject ? (
                <div className="space-y-8">
                  <div className="relative flex flex-col space-y-6 pl-6 border-l-2 border-gray-150">
                    {activeProject.timeline.map((step, idx) => (
                      <div key={idx} className="relative text-left">
                        {/* Bullet indicators */}
                        <div className={`absolute -left-[31px] top-0 h-4 w-4 rounded-full border-4 ${
                          step.completed 
                            ? "bg-[#6B2737] border-white shadow-sm ring-1 ring-[#6B2737]" 
                            : "bg-white border-gray-200"
                        }`} />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className={`font-sans text-sm font-semibold uppercase ${step.completed ? "text-gray-900" : "text-gray-400"}`}>{step.label}</h4>
                            {step.completed && <span className="font-mono text-[8px] bg-[#6B2737]/5 px-1.5 py-0.5 border border-[#6B2737]/10 text-[#6B2737] rounded font-bold uppercase">CLEARED</span>}
                          </div>
                          <p className="font-mono text-[10px] text-gray-400 mt-0.5 uppercase">ESTIMATED COMPLETION FRAME: {step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-light leading-relaxed">
                      💡 Note: Project completion speeds dynamically depend on custom teak imports or custom structural frame layout clearances. Speak with architectural curators in chat pane if modifications are requested.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-gray-200 text-center py-12 rounded-2xl bg-gray-50">
                  <Clock className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="font-sans text-xs font-bold text-gray-600">Timeline roadmap unavailable.</p>
                </div>
              )}
            </div>
          )}

          {/* SECTION 6: MESSAGES ROOM */}
          {activeTab === "messages" && (
            <div className="space-y-6 flex flex-col h-[520px] justify-between text-left">
              
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-sans text-lg font-bold text-gray-800 uppercase tracking-wide">PRINCIPAL CURATOR DISPATCH LINE</h3>
                <p className="font-mono text-[8px] tracking-wider text-amber-700 uppercase mt-1">SECURED AND BACKED UP BY FIREBASE AUTH ENTITIES</p>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin my-4 py-2">
                {messages.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                    <MessageSquare className="h-10 w-10 text-gray-200 stroke-1 mb-2" />
                    <p className="font-sans text-xs text-gray-400">Your secure chat log is empty.</p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.senderId === currentUser.id;
                    return (
                      <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                        <span className="font-mono text-[8px] text-gray-400 uppercase mb-1">{m.senderName}</span>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 font-sans text-xs leading-relaxed break-words shadow-sm ${
                          isMe 
                            ? "bg-[#6B2737] text-[#FFFAE1] rounded-tr-none" 
                            : "bg-gray-100 text-gray-800 rounded-tl-none"
                        }`}>
                          {m.text}
                        </div>
                        <span className="font-mono text-[8px] text-gray-400 mt-1">
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={chatsEndRef} />
              </div>

              {/* Chat Input triggers */}
              <form onSubmit={handleSendMessage} className="border-t border-gray-100 pt-4 flex space-x-2 items-center">
                <input
                  type="text"
                  required
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  placeholder="Send prompt secure dispatcher log..."
                  className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#6B2737]"
                />
                <button
                  type="submit"
                  disabled={sendingMsg || !typedMessage.trim()}
                  className="rounded-xl border border-[#6B2737] bg-[#6B2737] p-2.5 text-white hover:bg-[#6B2737]/90 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

          {/* SECTION 7: SAVED DESIGNS */}
          {activeTab === "designs" && (
            <div className="space-y-8 text-left">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-sans text-xl font-bold text-gray-800 uppercase tracking-wide">SAVED RESEARCH & ATELIER INSPIRATIONS</h3>
                <p className="font-sans text-xs text-gray-400 mt-1">Curate references and solid teak swatches bookmark models to build your home outline.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {savedDesigns.map((sd) => (
                  <div key={sd.id} className="border border-gray-150 rounded-2xl overflow-hidden shadow-xs group bg-gray-50">
                    <div className="h-48 overflow-hidden relative">
                      <img src={sd.img} alt={sd.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350" />
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-[9px] font-mono font-bold text-[#FFFAE1] px-2 py-0.5 rounded uppercase">
                        {sd.area}
                      </div>
                    </div>
                    <div className="p-4 bg-white border-t border-gray-100">
                      <p className="font-sans text-xs font-bold text-gray-800 uppercase tracking-wide">{sd.title}</p>
                      <span className="text-[10px] text-gray-400 font-light block mt-1">Assigned from Master Moodboard Library</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 8: PROFILE METADATA */}
          {activeTab === "profile" && (
            <div className="space-y-8 text-left">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-sans text-xl font-bold text-gray-800 uppercase tracking-wide">PROFILE METADATA & ATLAS CLOUD CREDENTIALS</h3>
                <p className="font-sans text-xs text-gray-400 mt-1">Review your contact data securely synchronized into our MongoDB Atlas database.</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">Owner Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">User Bio / Home Context</label>
                  <input
                    type="text"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">Verified phone contact</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">City Hub</label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">Chosen Project Spec Brief Type</label>
                  <input
                    type="text"
                    value={editProjectType}
                    onChange={(e) => setEditProjectType(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                  />
                </div>

                {profileUpdateMsg && (
                  <div className="p-3 bg-[#6B2737]/5 border border-[#6B2737]/10 text-[#6B2737] rounded-xl text-xs font-semibold">
                    {profileUpdateMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="rounded-full bg-[#6B2737] text-white font-sans text-xs font-bold uppercase tracking-widest px-8 py-3 hover:bg-[#6B2737]/90 active:scale-95 transition-all text-center cursor-pointer"
                >
                  Save Atlas Document Profile
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
