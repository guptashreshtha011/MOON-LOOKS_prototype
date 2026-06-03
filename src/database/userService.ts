// MongoDB Atlas and API integration layer for User management
import { User } from "./models";

export const userService = {
  // Retrieve current user details
  async getProfile(token: string): Promise<User> {
    const res = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch user profiles.");
    return data.user;
  },

  // Update profile details (stored in MongoDB Atlas)
  async updateProfile(token: string, payload: Partial<User>): Promise<User> {
    const res = await fetch("/api/client/profile/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to commit profile updates.");
    return data.user;
  },

  // Retrieve complete directory of registered clients & roles (Admin only)
  async getAllClients(token: string): Promise<User[]> {
    const res = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Unauthorized admin query.");
    return data;
  }
};
