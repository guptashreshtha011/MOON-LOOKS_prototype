export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "client";
  avatar?: string;
  bio?: string;
  phone?: string;
  city?: string;
  projectType?: string;
  emailVerified?: boolean;
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
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: string;
}

export interface ProjectTimelineStep {
  label: string;
  date: string;
  completed: boolean;
}

export interface ProjectInvoiceMilestone {
  id: string;
  desc: string;
  amount: number;
  status: "Pending" | "Paid" | "Processing";
}

export interface ProjectInvoice {
  currency: string;
  budgetTotal: number;
  amountPaid: number;
  pendingAmount: number;
  milestones: ProjectInvoiceMilestone[];
}

export interface ProjectSpecifications {
  style: string;
  palette: string[];
  materials: string[];
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  location: string;
  leadDesigner: string;
  status: string;
  progressPercent: number;
  timeline: ProjectTimelineStep[];
  invoice: ProjectInvoice;
  specifications: ProjectSpecifications;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  text: string;
  timestamp: string;
}
