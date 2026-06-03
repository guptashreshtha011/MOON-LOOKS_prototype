import { Project, Booking } from "../models";

export async function fetchUserProjects(token: string): Promise<Project[]> {
  const response = await fetch("/api/client/projects", {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("Failed to load active blueprints and projects");
  }
  const data = await response.json();
  return data.projects || [];
}

export async function fetchUserBookings(token: string): Promise<Booking[]> {
  const response = await fetch("/api/client/bookings", {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("Failed to load client booking consultations");
  }
  const data = await response.json();
  return data.bookings || [];
}
