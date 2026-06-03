// Consultation & Design Session Booking Service
import { Booking } from "./models";

export const bookingService = {
  // Client makes a booking consultation query
  async createBooking(token: string | null, payload: Partial<Booking>): Promise<Booking> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to log luxury consult slot.");
    return data;
  },

  // Retrieve matching bookings
  async getClientBookings(token: string): Promise<Booking[]> {
    const res = await fetch("/api/bookings", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load bookings database.");
    return Array.isArray(data) ? data : [];
  },

  // Admin view
  async getAllBookings(token: string): Promise<Booking[]> {
    const res = await fetch("/api/admin/bookings", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Unauthorized admin query.");
    return Array.isArray(data) ? data : [];
  },

  // Admin state updates
  async updateBookingStatus(token: string, bookingId: string, status: "Confirmed" | "Cancelled"): Promise<Booking> {
    const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update booking.");
    return data;
  }
};
