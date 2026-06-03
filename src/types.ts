export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "client";
  avatar: string;
  bio?: string;
  emailVerified?: boolean;
  phone?: string;
  city?: string;
  projectType?: string;
}

export interface Booking {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  style: string;
  budget: string;
  size: string;
  notes: string;
  date: string;
  time: string;
  status: "Review Pending" | "Confirmed" | "Completed" | "Declined";
  createdAt: string;
}

export interface Milestone {
  id: string;
  desc: string;
  amount: number;
  status: "Pending" | "Paid";
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  location: string;
  leadDesigner: string;
  status: string;
  progressPercent: number;
  timeline: {
    label: string;
    date: string;
    completed: boolean;
  }[];
  invoice: {
    currency: string;
    budgetTotal: number;
    amountPaid: number;
    pendingAmount: number;
    milestones: Milestone[];
  };
  specifications: {
    style: string;
    palette: string[];
    materials: string[];
  };
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  text: string;
  timestamp: string;
}

export interface PaletteColor {
  name: string;
  hex: string;
  desc: string;
}

export interface MaterialDetail {
  name: string;
  type: string;
  application: string;
}

export interface MoodboardResponse {
  philosophy: string;
  palette: PaletteColor[];
  materials: MaterialDetail[];
  recommendations: string[];
  isDemo?: boolean;
}
