import React, { useState, useEffect, useRef } from "react";
import { User, Booking, Project, Message } from "../types";
import { BRANDING } from "../config/branding";
import { Quotation, quotationService } from "../database/quotationService";
import { LeadEntry, leadService } from "../database/leadService";
import { userService } from "../database/userService";
import { projectService } from "../database/projectService";
import { bookingService } from "../database/bookingService";
import { 
  ShieldCheck, Calendar, ClipboardCheck, MessageSquare, Send, CheckCircle, 
  Trash2, Plus, Sliders, RefreshCw, Layers, MapPin, DollarSign, Hammer, Loader2,
  Users, TrendingUp, Sparkle, Phone, HelpCircle, Briefcase, FileText, ChevronRight, Check
} from "lucide-react";

interface AdminPanelProps {
  currentUser: User;
}

interface ClientOption {
  id: string;
  name: string;
  email: string;
}

export default function AdminPanel({ currentUser }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<string>("analytics");
  
  // Server-state caches
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [leads, setLeads] = useState<LeadEntry[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  // Project spawning states
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [newProjTitle, setNewProjTitle] = useState<string>("Bespoke Villa Residency");
  const [newProjLoc, setNewProjLoc] = useState<string>("DLF Phase 5, Gurgaon");
  const [newProjStyle, setNewProjStyle] = useState<string>("Traditional Bespoke Mansion");
  const [newProjBudget, setNewProjBudget] = useState<string>("4500000");

  // Project tracking update states
  const [editingProjectId, setEditingProjectId] = useState<string>("");
  const [updatedStatus, setUpdatedStatus] = useState<string>("");
  const [updatedPercent, setUpdatedPercent] = useState<number>(0);

  // Messaging thread state
  const [activeThreadUserId, setActiveThreadUserId] = useState<string>("");
  const [replyText, setReplyText] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const chatsEndRef = useRef<HTMLDivElement | null>(null);

  const token = localStorage.getItem("moonlooks_token") || "";

  // CMS editable lists (mock state for premium white labelling)
  const [testimonials, setTestimonials] = useState([
    { id: 1, author: "Rahul Verma", city: "Noida", text: "The Alabaster contemporary themes brought absolute peace to our living area. Exceptionally executed!" },
    { id: 2, author: "Sanjay Gupta", city: "Gurgaon", text: "Turnkey delivery on DLF highrises was flawless. Curators understood material selection perfectly." }
  ]);
  const [newTestimonialAuthor, setNewTestimonialAuthor] = useState("");
  const [newTestimonialCity, setNewTestimonialCity] = useState("");
  const [newTestimonialText, setNewTestimonialText] = useState("");

  const loadAllAdminMasterData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // 1. Fetch consultations/bookings
      const bkgs = await bookingService.getAllBookings(token);
      setBookings(bkgs);

      // 2. Fetch projects
      const projs = await projectService.getAllProjects(token);
      setProjects(projs);
      if (projs.length > 0) {
        setEditingProjectId(projs[0].id);
        setUpdatedStatus(projs[0].status);
        setUpdatedPercent(projs[0].progressPercent);
      }

      // 3. Fetch auto-complete clients list
      const clientsList = await userService.getAllClients(token);
      setClients(clientsList.filter(u => u.role === "client"));
      if (clientsList.length > 0) {
        setSelectedClientId(clientsList[0].id);
      }
      setRegisteredUsers(clientsList);

      // 4. Fetch incoming chat logs
      const mResponse = await fetch("/api/messages", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (mResponse.ok) {
        const chats = await mResponse.json();
        setMessages(chats);
        // Identify active thread target user
        const otherMsg = chats.find((m: Message) => m.senderId !== "usr_admin");
        if (otherMsg) {
          setActiveThreadUserId(otherMsg.senderId);
        } else {
          setActiveThreadUserId("usr_client");
        }
      }

      // 5. Fetch quotations logs
      const qResponse = await fetch("/api/admin/quotations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (qResponse.ok) {
        const qtns = await qResponse.json();
        setQuotations(qtns);
      }

      // 6. Fetch marketing leads
      const lResponse = await fetch("/api/admin/leads", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (lResponse.ok) {
        const leadEntries = await lResponse.json();
        setLeads(leadEntries);
      }

    } catch (err) {
      console.error("Admin data recall failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminMasterData();

    // Polling thread messages
    const threadPoller = setInterval(() => {
      if (token && activeTab === "messages") {
        fetch("/api/messages", { headers: { Authorization: `Bearer ${token}` } })
          .then(res => res.json())
          .then(data => { if (Array.isArray(data)) setMessages(data); })
          .catch(console.log);
      }
    }, 4500);

    return () => clearInterval(threadPoller);
  }, []);

  useEffect(() => {
    chatsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeThreadUserId]);

  // Booking updates
  const handleUpdateBookingStatus = async (bookingId: string, status: "Confirmed" | "Cancelled") => {
    try {
      await bookingService.updateBookingStatus(token, bookingId, status);
      const bkgs = await bookingService.getAllBookings(token);
      setBookings(bkgs);
    } catch (err: any) {
      alert(err.message || "Failed to update booking ledger.");
    }
  };

  // Lead updates
  const handleUpdateLeadStatus = async (leadId: string, status: "Hot Prospect" | "Contacted" | "New Entry") => {
    try {
      await leadService.updateLeadStatus(token, leadId, status);
      const updatedLeads = await leadService.getLeadsDirectory(token);
      setLeads(updatedLeads);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Spawn new project
  const handleCreateActiveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return alert("Select target client.");
    setActionLoading(true);

    try {
      await projectService.createProject(token, {
        userId: selectedClientId,
        title: newProjTitle,
        location: newProjLoc,
        specifications: {
          style: newProjStyle,
          palette: ["#6B2737", "#FFFAE1", "#332C2D", "#BA8E9A"],
          materials: ["Exotic Botticino", "Veneer Panels", "Satin Gold"]
        },
        invoice: {
          currency: "INR",
          budgetTotal: parseFloat(newProjBudget) || 1200000,
          amountPaid: 0,
          pendingAmount: parseFloat(newProjBudget) || 1200000,
          milestones: [
            { id: "ms_new1", desc: "Phase I: Concept Draft Approval", amount: (parseFloat(newProjBudget) || 1200000) * 0.3, status: "Pending" },
            { id: "ms_new2", desc: "Phase II: Teak & Stone Purchases", amount: (parseFloat(newProjBudget) || 1200000) * 0.4, status: "Pending" },
            { id: "ms_new3", desc: "Phase III: Turnkey Handover Execution", amount: (parseFloat(newProjBudget) || 1200000) * 0.3, status: "Pending" }
          ]
        }
      });
      alert("Success! Bespoke contract instantiated.");
      setNewProjTitle("Bespoke Residence Suite");
      loadAllAdminMasterData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Update active project milestones
  const handleUpdateProjectTimeline = async () => {
    if (!editingProjectId) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/projects/${editingProjectId}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: updatedStatus,
          progressPercent: updatedPercent
        })
      });
      if (res.ok) {
        alert("Masterplan project progress adjusted.");
        loadAllAdminMasterData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Dispatch administrator reply message
  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThreadUserId) return;
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          text: replyText,
          recipientId: activeThreadUserId
        })
      });
      if (response.ok) {
        setReplyText("");
        const newMsg = await response.json();
        setMessages(prev => [...prev, newMsg]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add testimonial dynamically (SaaS CMS mockup)
  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonialAuthor || !newTestimonialText) return;
    setTestimonials(prev => [
      ...prev,
      {
        id: prev.length + 1,
        author: newTestimonialAuthor,
        city: newTestimonialCity || "India",
        text: newTestimonialText
      }
    ]);
    setNewTestimonialAuthor("");
    setNewTestimonialCity("");
    setNewTestimonialText("");
  };

  const activeChatUsers = Array.from(
    new Set(
      messages
        .filter((m) => m.senderId !== "usr_admin" || m.recipientId !== "usr_admin")
        .map((m) => (m.senderId === "usr_admin" ? m.recipientId : m.senderId))
    )
  ).filter(Boolean);

  const currentThreadMessages = messages.filter(
    (m) =>
      (m.senderId === activeThreadUserId && m.recipientId === "usr_admin") ||
      (m.senderId === "usr_admin" && m.recipientId === activeThreadUserId)
  );

  if (loading) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-6 text-center">
        <Loader2 className="h-10 w-10 text-[#6B2737] animate-spin mx-auto mb-4" />
        <p className="font-sans text-xs tracking-widest text-[#6B2737] uppercase font-bold">RECONCILING PRINCIPAL CONSOLE DATA...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in font-sans">
      
      {/* Title */}
      <div className="mb-10 text-left border-b border-gray-150 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-[#6B2737] tracking-[0.3em] uppercase block mb-1">
            CREATIVE DIRECTOR • ENTERPRISE MANAGEMENT SYSTEM
          </span>
          <h2 className="font-sans text-3xl font-extralight text-gray-900 leading-tight">
            Curator <span className="font-semibold text-[#6B2737]">Admin Panel</span>
          </h2>
        </div>
        <div className="flex items-center space-x-2 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20 w-fit">
          <ShieldCheck className="h-4 w-4 text-amber-700 animate-pulse shrink-0" />
          <span className="font-sans text-[11px] font-semibold text-amber-800 uppercase tracking-widest">Sovereign Clearance</span>
        </div>
      </div>

      {/* Admin Tabbed Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 bg-gray-50 p-2.5 rounded-2xl border border-gray-150 text-xs">
        {[
          { id: "analytics", label: "Analytics Overview", icon: TrendingUp },
          { id: "bookings", label: "Consults Bookings", icon: Calendar },
          { id: "leads", label: "Leads Stream", icon: Briefcase },
          { id: "projects", label: "Projects & Milestones", icon: Layers },
          { id: "quotations", label: "Quotations Registry", icon: FileText },
          { id: "users", label: "Users Registry", icon: Users },
          { id: "messages", label: "Messages Room", icon: MessageSquare },
          { id: "cms", label: "CMS Controls", icon: Sliders }
        ].map((tab) => {
          const IconComp = tab.icon;
          const isSel = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                isSel 
                  ? "bg-[#6B2737] text-[#FFFAE1] shadow" 
                  : "bg-white text-gray-600 border border-gray-150 hover:bg-gray-100"
              }`}
            >
              <IconComp className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Container */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 min-h-[500px]">
        
        {/* TAB 1: ANALYTICS OVERVIEW */}
        {activeTab === "analytics" && (
          <div className="space-y-8 text-left">
            <div>
              <h3 className="font-sans text-xl font-bold text-gray-800 uppercase">ATELIER CORE METRICS & LEADERBOARD</h3>
              <p className="text-xs text-gray-400 mt-1">Unified analytics computed from active Supabase and Express lowdb persistent state logs.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="border border-gray-150 p-5 rounded-2xl bg-gray-50">
                <span className="block font-mono text-[9px] text-[#6B2737] uppercase font-bold tracking-wider mb-2">ACTIVE CONSULTATIONS</span>
                <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
                <span className="text-[10px] text-gray-400 font-light block mt-1">Requested slot bookings</span>
              </div>
              <div className="border border-gray-150 p-5 rounded-2xl bg-gray-50">
                <span className="block font-mono text-[9px] text-[#6B2737] uppercase font-bold tracking-wider mb-2">bespoke PROJECTS SPAWNED</span>
                <p className="text-2xl font-bold text-gray-800">{projects.length}</p>
                <span className="text-[10px] text-gray-400 font-light block mt-1">Ongoing architectural sites</span>
              </div>
              <div className="border border-gray-150 p-5 rounded-2xl bg-gray-50">
                <span className="block font-mono text-[9px] text-[#6B2737] uppercase font-bold tracking-wider mb-2">SPARKLING INCOMING LEADS</span>
                <p className="text-2xl font-bold text-gray-800">{leads.length}</p>
                <span className="text-[10px] text-gray-400 font-light block mt-1">Hot CRM prospects tracked</span>
              </div>
              <div className="border border-gray-150 p-5 rounded-2xl bg-gray-50">
                <span className="block font-mono text-[9px] text-[#6B2737] uppercase font-bold tracking-wider mb-2">QUOTATION PROPOSALS</span>
                <p className="text-2xl font-bold text-gray-800">{quotations.length}</p>
                <span className="text-[10px] text-gray-400 font-light block mt-1">Saved design estimations</span>
              </div>
            </div>

            <div className="bg-[#6B2737]/5 border border-[#6B2737]/10 rounded-2xl p-6">
              <h4 className="font-sans text-xs font-bold text-[#6B2737] uppercase tracking-wider mb-2 flex items-center space-x-2">
                <Sparkle className="h-4 w-4 text-[#6B2737] fill-[#6B2737]" />
                <span>COMMERCIAL PLATFORM CONCORD STATUS</span>
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed font-light">
                Securely listening and managing active databases. To deploy white labeling color configurations and logos, review <strong>branding.ts</strong>. Simulated backend components gracefully serve previews when local Atlas environment tags are unpopulated.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: CONSULTATIONS BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="font-sans text-xl font-bold text-gray-800 uppercase">site consultations log</h3>
              <p className="text-xs text-gray-400 mt-1">Verify requested calendar coordinates and manage confirmed client site visits.</p>
            </div>

            {bookings.length === 0 ? (
              <p className="font-sans text-xs text-gray-400 italic">No bookings found in database storage.</p>
            ) : (
              <div className="overflow-x-auto border border-gray-150 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-150 font-mono text-[9px] text-gray-400 uppercase tracking-widest font-black">
                      <th className="py-3.5 px-4">Homeowner Name</th>
                      <th className="py-3.5 px-4">Design Style Spec</th>
                      <th className="py-3.5 px-4">Budget / Size</th>
                      <th className="py-3.5 px-4">Schedules</th>
                      <th className="py-3.5 px-4 text-right">Confirm / Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700 font-sans">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50/50">
                        <td className="py-4 px-4 font-semibold">
                          <p>{b.name}</p>
                          <p className="text-[10px] text-gray-400 font-light">{b.phone} • {b.email}</p>
                        </td>
                        <td className="py-4 px-4">{b.style}</td>
                        <td className="py-4 px-4 font-mono text-[10px]">{b.size} • {b.budget}</td>
                        <td className="py-4 px-4 font-mono text-[10px] text-[#6B2737] font-semibold">{b.date} @ {b.time}</td>
                        <td className="py-4 px-4 text-right">
                          <select
                            value={b.status}
                            onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as any)}
                            className="bg-white border border-gray-200 rounded px-2 py-1 text-[10px] font-bold focus:outline-none"
                          >
                            <option value="Review Pending">Review Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LEADS STREAM */}
        {activeTab === "leads" && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="font-sans text-xl font-bold text-gray-800 uppercase">SPACE PLANNING LEADS STREAM</h3>
              <p className="text-xs text-gray-400 mt-1">Prospecting data captured dynamically from home page contact triggers (CRM interface).</p>
            </div>

            {leads.length === 0 ? (
              <p className="font-sans text-xs text-gray-400 italic">No marketing leads logged.</p>
            ) : (
              <div className="overflow-x-auto border border-gray-150 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-150 font-mono text-[9px] text-gray-400 uppercase tracking-widest font-black">
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">City</th>
                      <th className="py-3.5 px-4">Requirements</th>
                      <th className="py-3.5 px-4">Brief Query</th>
                      <th className="py-3.5 px-4 text-right">Lead Status Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-gray-50/50">
                        <td className="py-4 px-4">
                          <p className="font-bold text-gray-800">{l.name}</p>
                          <p className="text-[10px] text-gray-400">{l.email} • {l.phone}</p>
                        </td>
                        <td className="py-4 px-4 font-semibold text-gray-600">{l.city}</td>
                        <td className="py-4 px-4 font-sans text-gray-600">{l.projectType}</td>
                        <td className="py-4 px-4 text-gray-500 font-light truncate max-w-xs">{l.messageText}</td>
                        <td className="py-4 px-4 text-right">
                          <select
                            value={l.status}
                            onChange={(e) => handleUpdateLeadStatus(l.id, e.target.value as any)}
                            className="bg-white border border-gray-200 rounded px-2 py-1 text-[10px] font-bold focus:outline-none cursor-pointer"
                          >
                            <option value="New Entry">New Entry</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Hot Prospect">Hot Prospect</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROJECTS MANAGEMENT */}
        {activeTab === "projects" && (
          <div className="space-y-8 text-left">
            <div>
              <h3 className="font-sans text-xl font-bold text-gray-800 uppercase">PROJECT CONCORD WORKSPACE</h3>
              <p className="text-xs text-gray-400 mt-1">Manage physical progress logs, dispatch milestone bills, and spawn residential projects.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Spawning bespoke project */}
              <form onSubmit={handleCreateActiveProject} className="border border-gray-150 p-6 rounded-2xl bg-gray-50/50 space-y-4">
                <h4 className="font-sans text-sm font-bold text-[#6B2737] uppercase tracking-wide">SPAWN BESPOKE BLUEPRINT CONTRACT</h4>
                
                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">Target Homeowner Profile</label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="">-- Choose target user --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">Residency Title name</label>
                  <input
                    type="text"
                    required
                    value={newProjTitle}
                    onChange={(e) => setNewProjTitle(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">Coordinates Location</label>
                    <input
                      type="text"
                      required
                      value={newProjLoc}
                      onChange={(e) => setNewProjLoc(e.target.value)}
                      className="w-full bg-white border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">Total Target Budget (INR)</label>
                    <input
                      type="number"
                      value={newProjBudget}
                      onChange={(e) => setNewProjBudget(e.target.value)}
                      className="w-full bg-white border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full bg-[#6B2737] text-white text-xs font-bold py-3.5 rounded-full uppercase tracking-widest hover:bg-[#6B2737]/90 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {actionLoading ? "INSTANTIATING ATELIER MATRIX..." : "SPAWN ACTIVE WORKSPACE"}
                </button>
              </form>

              {/* Edit existing project stages */}
              <div className="border border-gray-150 p-6 rounded-2xl bg-gray-50/50 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="font-sans text-sm font-bold text-[#6B2737] uppercase tracking-wide">ADJUST ONGOING PROJECTS TIMELINE</h4>
                  
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">Select active workspace project</label>
                    <select
                      value={editingProjectId}
                      onChange={(e) => {
                        setEditingProjectId(e.target.value);
                        const match = projects.find(p => p.id === e.target.value);
                        if (match) {
                          setUpdatedStatus(match.status);
                          setUpdatedPercent(match.progressPercent);
                        }
                      }}
                      className="w-full bg-white border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    >
                      <option value="">-- Choose project --</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.title} ({p.status})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">Target state status</label>
                      <input
                        type="text"
                        value={updatedStatus}
                        onChange={(e) => setUpdatedStatus(e.target.value)}
                        placeholder="e.g. Sourcing Materials"
                        className="w-full bg-white border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">Progress physical percentage</label>
                      <input
                        type="number"
                        value={updatedPercent}
                        onChange={(e) => setUpdatedPercent(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="w-full bg-white border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleUpdateProjectTimeline}
                  disabled={actionLoading || !editingProjectId}
                  className="w-full mt-4 bg-gray-900 text-[#FFFAE1] text-xs font-bold py-3.5 rounded-full uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 transition-all cursor-pointer"
                >
                  SAVE MASTERPLAN CHANGES
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: QUOTATIONS REGISTRY */}
        {activeTab === "quotations" && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="font-sans text-xl font-bold text-gray-800 uppercase">QUOTATIONS DIRECTORY ARCHIVE</h3>
              <p className="text-xs text-gray-400 mt-1">Review, authorize, and download custom estimations requested by prospective homeowners.</p>
            </div>

            {quotations.length === 0 ? (
              <p className="font-sans text-xs text-gray-400 italic">No saved estimations in quotations cache.</p>
            ) : (
              <div className="border border-gray-150 rounded-2xl overflow-hidden divide-y divide-gray-100 text-xs font-sans">
                {quotations.map((q) => (
                  <div key={q.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-800 text-sm">{q.clientName}</span>
                        <span className="text-[9px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 border border-amber-100 rounded uppercase font-bold">{q.materialsGradeText}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">{q.projectType} • size: {q.sizeSqFt} sqft • Date: {q.date}</p>
                    </div>
                    <div className="flex items-center space-x-4 shrink-0 justify-between">
                      <span className="font-bold text-gray-900 text-sm">₹{q.estimatedTotal.toLocaleString("en-IN")}</span>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-150 uppercase">{q.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: USERS REGISTRY */}
        {activeTab === "users" && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="font-sans text-xl font-bold text-gray-800 uppercase">REGISTERED CLIENT DOCUMENT REGISTRY</h3>
              <p className="text-xs text-gray-400 mt-1">Review active users metadata mapped dynamically relative to resources in MongoDB Atlas.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {registeredUsers.map((u) => (
                <div key={u.id} className="border border-gray-150 rounded-2xl p-5 hover:shadow-sm bg-gray-50/40 flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-250 bg-gray-250 shrink-0">
                    <img src={u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400"} alt={u.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-sans font-bold text-gray-800 text-sm">{u.name}</h4>
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${u.role === "admin" ? "bg-amber-150 text-amber-800 border" : "bg-[#6B2737]/5 text-[#6B2737] border border-[#6B2737]/10"}`}>{u.role}</span>
                    </div>
                    <p className="font-mono text-[10px] text-gray-500">{u.email}</p>
                    {u.phone && <p className="text-[11px] text-gray-400 mt-1 font-light">📞 Contact Details: {u.phone} • {u.city}</p>}
                    {u.bio && <p className="text-[11px] text-gray-500 font-light mt-1 italic">&quot;{u.bio}&quot;</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: ADMINISTRATIVE CHAT MESSAGES */}
        {activeTab === "messages" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            
            {/* Thread Selectors */}
            <div className="lg:col-span-4 border-r border-gray-100 pr-4 space-y-2">
              <h4 className="font-sans text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">Active Customer Threads</h4>
              {activeChatUsers.length === 0 ? (
                <p className="font-sans text-xs text-gray-400 italic">No threads available.</p>
              ) : (
                activeChatUsers.map((userIdStr) => {
                  const targetUser = registeredUsers.find(u => u.id === userIdStr);
                  const isSel = activeThreadUserId === userIdStr;
                  return (
                    <button
                      key={String(userIdStr)}
                      onClick={() => setActiveThreadUserId(String(userIdStr))}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-xs cursor-pointer block ${
                        isSel 
                          ? "bg-[#6B2737]/5 border-[#6B2737] text-gray-800 font-semibold" 
                          : "bg-white border-gray-150 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <p className="font-bold">{targetUser?.name || "Anonymous client"}</p>
                      <p className="font-mono text-[9px] text-gray-400 truncate mt-0.5">{targetUser?.email || "No Email logs"}</p>
                    </button>
                  );
                })
              )}
            </div>

            {/* Chat Pane */}
            <div className="lg:col-span-8 flex flex-col h-[480px] justify-between">
              
              <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                <span className="font-sans font-bold text-sm text-gray-700 uppercase">Selected Thread Timeline</span>
                <span className="font-mono text-[9px] text-[#6B2737] uppercase font-bold">Logged into Firebase Auth</span>
              </div>

              {/* Scroll Pane */}
              <div className="flex-1 overflow-y-auto space-y-4 my-4 pr-1 scrollbar-thin">
                {currentThreadMessages.length === 0 ? (
                  <p className="text-center py-12 text-gray-400 text-xs italic">Select a customer thread to review comments.</p>
                ) : (
                  currentThreadMessages.map((m) => {
                    const isMe = m.senderId === "usr_admin";
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

              {/* Controls */}
              <form onSubmit={handleSendAdminReply} className="border-t border-gray-100 pt-3 flex space-x-2 items-center">
                <input
                  type="text"
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type an official creative advice note..."
                  className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || !activeThreadUserId}
                  className="rounded-xl border border-[#6B2737] bg-[#6B2737] p-2.5 text-white hover:bg-[#6B2737]/90 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

            </div>

          </div>
        )}

        {/* TAB 8: CMS CONTENT CONTROLS */}
        {activeTab === "cms" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            
            {/* Testimonials Stream */}
            <div className="space-y-4">
              <h4 className="font-sans text-sm font-bold text-[#6B2737] uppercase tracking-wide">Dynamic Testimonials CMS</h4>
              
              <div className="border border-gray-150 p-4 rounded-xl bg-gray-50/50 space-y-4 font-sans text-xs">
                {testimonials.map((t) => (
                  <div key={t.id} className="p-3 bg-white border border-gray-100 rounded-lg">
                    <p className="italic text-gray-600 font-light">&quot;{t.text}&quot;</p>
                    <p className="font-bold text-gray-800 mt-2 font-mono text-[10px] uppercase text-right">— {t.author} • {t.city}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddTestimonial} className="border border-gray-150 p-4 rounded-xl bg-white space-y-3">
                <span className="text-[10px] font-mono uppercase font-bold block text-gray-400">Add fresh review card</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Author"
                    value={newTestimonialAuthor}
                    onChange={(e) => setNewTestimonialAuthor(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={newTestimonialCity}
                    onChange={(e) => setNewTestimonialCity(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <textarea
                  required
                  placeholder="Testimonial content"
                  value={newTestimonialText}
                  onChange={(e) => setNewTestimonialText(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-xs focus:outline-none height-16"
                />
                <button type="submit" className="w-full bg-[#6B2737] text-white text-[10px] font-bold tracking-widest py-2 rounded uppercase cursor-pointer">Add Testimonial Column</button>
              </form>
            </div>

            {/* Static Settings Details */}
            <div className="space-y-4">
              <h4 className="font-sans text-sm font-bold text-[#6B2737] uppercase tracking-wide font-black">Centralized Rebranding config</h4>
              
              <div className="border border-gray-150 p-4 rounded-xl bg-gray-50 space-y-3 text-xs font-mono">
                <div>
                  <span className="block text-[9px] text-gray-400 uppercase">Brand corporate name:</span>
                  <span className="font-sans font-bold text-gray-800 text-sm block">{BRANDING.name}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-gray-400 uppercase">Support Mail coordinate:</span>
                  <span className="font-sans text-gray-700 block">{BRANDING.email}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-gray-400 uppercase">Corporate Headquarter location:</span>
                  <span className="font-sans text-gray-700 block text-[11px] leading-relaxed font-light">{BRANDING.address}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-gray-400 uppercase">Accent Color Tone hex value:</span>
                  <span className="text-[#6B2737] font-sans font-bold text-sm block">{BRANDING.accentColor}</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
