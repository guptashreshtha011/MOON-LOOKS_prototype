// Lead capture, contact entries, and market inquiry management service

export interface LeadEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  projectType: string;
  messageText: string;
  status: "Hot Prospect" | "Contacted" | "New Entry";
  createdAt: string;
}

export const leadService = {
  // Capture fresh lead from home landing page (Guest accessible)
  async captureLead(payload: Partial<LeadEntry>): Promise<{ success: boolean; lead: LeadEntry }> {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to log lead capture query.");
    return { success: true, lead: data };
  },

  // Admin view: fetch prospective clients lead database
  async getLeadsDirectory(token: string): Promise<LeadEntry[]> {
    const res = await fetch("/api/admin/leads", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Unauthorized admin query.");
    return Array.isArray(data) ? data : [];
  },

  // Admin view: status progression
  async updateLeadStatus(token: string, leadId: string, status: "Hot Prospect" | "Contacted" | "New Entry"): Promise<LeadEntry> {
    const res = await fetch(`/api/admin/leads/${leadId}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to progress lead status.");
    return data;
  }
};
