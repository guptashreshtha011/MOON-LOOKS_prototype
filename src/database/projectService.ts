// Supabase & MongoDB dynamic service layer for managing luxury residential projects
import { Project } from "./models";

export const projectService = {
  // Retrieve projects allocated to the logged-in client
  async getClientProjects(token: string): Promise<Project[]> {
    const res = await fetch("/api/client/projects", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load projects.");
    return Array.isArray(data) ? data : [];
  },

  // Authorize milestone progress invoice payment (CNR ledger)
  async postMilestonePayment(token: string, projectId: string, milestoneId: string): Promise<Project> {
    const res = await fetch(`/api/client/projects/${projectId}/pay/${milestoneId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Payment routing interrupted.");
    return data;
  },

  // Admin: Retrieve total list of active projects across workspaces
  async getAllProjects(token: string): Promise<Project[]> {
    const res = await fetch("/api/admin/projects", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Unauthorized admin query.");
    return Array.isArray(data) ? data : [];
  },

  // Admin: Spawn new bespoke project for verified homeowner profile
  async createProject(token: string, payload: Partial<Project>): Promise<Project> {
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to catalog project.");
    return data;
  }
};
