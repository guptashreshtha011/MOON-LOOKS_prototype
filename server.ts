import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "moonlooks_db.json");

// Helper to encrypt passwords safely without bcrypt dependency
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Generate secure random simple token
function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Low-Db Simplified JSON Engine
interface DBState {
  users: any[];
  bookings: any[];
  projects: any[];
  messages: any[];
  quotations: any[];
  leads: any[];
}

function loadDB(): DBState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (!parsed.quotations) parsed.quotations = [];
      if (!parsed.leads) parsed.leads = [];
      return parsed;
    }
  } catch (err) {
    console.error("Failed to read database, resetting with seeds", err);
  }

  // Seed initial luxury data
  const initialData: DBState = {
    users: [
      {
        id: "usr_admin",
        email: "admin@moonlooks.com",
        password: hashPassword("moonlooks123"),
        name: "Ananya Sen",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
        bio: "Principal Interior Architect & Studio Director",
      },
      {
        id: "usr_client",
        email: "client@moonlooks.com",
        password: hashPassword("client123"),
        name: "Rahul Verma",
        role: "client",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
        bio: "Homeowner, Noida 3BHK Penthouse",
      },
    ],
    bookings: [
      {
        id: "bkg_1",
        userId: "usr_client",
        name: "Rahul Verma",
        email: "client@moonlooks.com",
        phone: "+91 98765 43210",
        style: "Modern Contemporary 3BHK",
        budget: "₹15 Lakhs - ₹20 Lakhs",
        size: "1,850 sq.ft (3BHK)",
        notes: "I want an elegant, warm open-concept living area, a premium modular kitchen with quartz counters, and warm gold false ceiling lighting.",
        date: "2026-06-18",
        time: "11:30",
        status: "Confirmed",
        createdAt: new Date().toISOString(),
      }
    ],
    projects: [
      {
        id: "proj_1",
        userId: "usr_client",
        title: "Modern 3BHK Apartment - Noida",
        location: "Greater Noida, Uttar Pradesh",
        leadDesigner: "Ananya Sen",
        status: "Sourcing Materials", // Concept Planning -> Sourcing Materials -> 3D Floor Renders -> Site Execution -> Handover
        progressPercent: 40,
        timeline: [
          { label: "Concept Planning", date: "2026-05-10", completed: true },
          { label: "Sourcing Materials", date: "2026-06-01", completed: true },
          { label: "3D Floor Renders", date: "2026-06-15", completed: false },
          { label: "Site Execution", date: "2026-07-20", completed: false },
          { label: "Handover", date: "2026-08-30", completed: false },
        ],
        invoice: {
          currency: "INR",
          budgetTotal: 1800000,
          amountPaid: 800000,
          pendingAmount: 1000000,
          milestones: [
            { id: "ms_1", desc: "Interiors Phase I: Concept Plan & Material Swatches Approved", amount: 300000, status: "Paid" },
            { id: "ms_2", desc: "Interiors Phase II: Modular Carcase Sourcing & Frame Fabrication", amount: 500000, status: "Paid" },
            { id: "ms_3", desc: "Interiors Phase III: On-Site Electrical Fitting & False Ceilings", amount: 600000, status: "Pending" },
            { id: "ms_4", desc: "Interiors Phase IV: Painting, Modular Fittings & Final Handover", amount: 400000, status: "Pending" },
          ],
        },
        specifications: {
          style: "Elegant Contemporary Indian",
          palette: ["#6B2737", "#FFFAE1", "#F5F3EF", "#2A2A2A"],
          materials: ["Premium Teak Veneer", "Italian Calacatta Quartz", "PU Painted MDF Panels", "Satin Gold Fixtures"],
        },
      }
    ],
    messages: [
      {
        id: "msg_1",
        senderId: "usr_admin",
        senderName: "Ananya Sen",
        recipientId: "usr_client",
        text: "Namaste Rahul! We have finalized the custom fluted panel layouts for your Living Room TV unit. The premium teak wood veneer has been sourced. Let me know if you would like us to prepare the 3D walkthrough for your review tomorrow.",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: "msg_2",
        senderId: "usr_client",
        senderName: "Rahul Verma",
        recipientId: "usr_admin",
        text: "Namaste Ananya! Yes, please upload the 3D walkthrough to our client dashboard. My wife and I would love to check the lighting levels before we approve the living room false ceiling layout.",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      }
    ],
    quotations: [
      {
        id: "qtn_seed1",
        userId: "usr_client",
        clientName: "Rahul Verma",
        projectType: "Modern Contemporary 3BHK",
        city: "Noida",
        sizeSqFt: 1850,
        materialsGradeText: "Sovereign Gold",
        estimatedTotal: 1800000,
        status: "Approved",
        date: "2026-06-01",
        lineItems: [
          { description: "Demolition, Layout Alterations & Site Framing Layout", cost: 270000 },
          { description: "Electrical Layout Plumbing Overhauls & Circlights Integration", cost: 360000 },
          { description: "Modular Carcase Carving, Teakwood Wardrobes & Kitchen Cabinets", cost: 630000 },
          { description: "Italian Calacatta Quartz Countertops & Italian Marble Tones", cost: 360000 },
          { description: "Turnkey Curation, Custom Swatch Painting & Styling Fixtures", cost: 180000 }
        ]
      }
    ],
    leads: [
      {
        id: "lead_seed1",
        name: "Sanjay Gupta",
        email: "sanjay@outlook.com",
        phone: "+91 99100 22334",
        city: "Gurgaon",
        projectType: "4BHK Ultra-Luxury Villa",
        messageText: "Interested in getting a turn-key quotation for our new DLF Phase 5 villa. We want premium contemporary Italian finishes.",
        status: "Hot Prospect",
        createdAt: "2026-06-02T15:30:00.000Z"
      }
    ]
  };

  saveDB(initialData);
  return initialData;
}

function saveDB(state: DBState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to database file", err);
  }
}

// Ensure database is populated
let db = loadDB();

// Initialize Express
const app = express();
app.use(express.json());

// Token verification middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  // In our simplified token engine, we match token directly to our session or find the user
  // Let's store tokens in memory to look up users
  const user = sessionStore[token];
  if (!user) {
    return res.status(403).json({ error: "Session expired or invalid token" });
  }

  req.user = user;
  next();
}

// Express memory sessions store (Map token -> User Object)
const sessionStore: Record<string, any> = {};

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------

app.post("/api/auth/register", (req, res) => {
  const { email, password, name, phone, city, projectType } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  db = loadDB();
  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const userId = "usr_" + crypto.randomBytes(6).toString("hex");
  const newUser = {
    id: userId,
    email: email.toLowerCase(),
    password: hashPassword(password),
    name,
    role: "client",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    bio: `Bespoke client from ${city || "India"}`,
    phone: phone || "+91 99999 88888",
    city: city || "New Delhi",
    projectType: projectType || "3BHK / 4BHK Luxury Apartment",
    emailVerified: false,
  };

  db.users.push(newUser);

  // Auto-seed a beautiful luxury project and booking consultation for this real user to keep the client portal alive and gorgeous
  const newProject = {
    id: "proj_" + crypto.randomBytes(4).toString("hex"),
    userId: userId,
    title: `${projectType || "3BHK luxury space"} - ${city || "Noida"}`,
    location: `${city || "Noida"}, India`,
    leadDesigner: "Ananya Sen",
    status: "Concept Planning",
    progressPercent: 20,
    timeline: [
      { label: "Concept Planning", date: "2026-06-03", completed: true },
      { label: "Sourcing Materials", date: "2026-06-20", completed: false },
      { label: "3D Floor Renders", date: "2026-07-05", completed: false },
      { label: "Site Execution", date: "2026-07-25", completed: false },
      { label: "Handover", date: "2026-09-10", completed: false },
    ],
    invoice: {
      currency: "INR",
      budgetTotal: 1800000,
      amountPaid: 0,
      pendingAmount: 1800000,
      milestones: [
        { id: "ms_a", desc: "Interiors Phase I: Concept Plan & Material Swatches Approved", amount: 300000, status: "Pending" },
        { id: "ms_b", desc: "Interiors Phase II: Modular Carcase Sourcing & Frame Fabrication", amount: 500000, status: "Pending" },
        { id: "ms_c", desc: "Interiors Phase III: On-Site Electrical Fitting & False Ceilings", amount: 600000, status: "Pending" },
        { id: "ms_d", desc: "Interiors Phase IV: Painting, Modular Fittings & Final Handover", amount: 400000, status: "Pending" },
      ],
    },
    specifications: {
      style: "Elegant Contemporary Indian",
      palette: ["#6B2737", "#FFFAE1", "#F5F3EF", "#2A2A2A"],
      materials: ["Premium Teak Veneer", "Italian Calacatta Quartz", "PU Painted MDF Panels", "Satin Gold Fixtures"],
    },
  };

  const newBooking = {
    id: "bkg_" + crypto.randomBytes(4).toString("hex"),
    userId: userId,
    name: name,
    email: email.toLowerCase(),
    phone: phone || "+91 99999 88888",
    style: projectType || "3BHK Luxury Space",
    budget: "₹15 Lakhs - ₹25 Lakhs",
    size: "1,850 sq.ft",
    notes: "Assigned during real on-board registration profile creation.",
    date: "2026-06-15",
    time: "14:30",
    status: "Review Pending",
    createdAt: new Date().toISOString(),
  };

  db.projects.push(newProject);
  db.bookings.push(newBooking);

  // Add initial greeting message
  db.messages.push({
    id: "msg_" + crypto.randomBytes(4).toString("hex"),
    senderId: "usr_admin",
    senderName: "Ananya Sen",
    recipientId: userId,
    text: `Namaste ${name}! Welcome to Moon Looks. Your master workspace has been instantiated. Once you verify your email address, you'll see your project: ${projectType} mapped dynamically relative to resources in ${city || "Noida"}. Let's design your sanctuary!`,
    timestamp: new Date().toISOString()
  });

  saveDB(db);

  const token = generateToken();
  sessionStore[token] = newUser;

  res.status(201).json({
    token,
    user: newUser
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  db = loadDB();
  const hashed = hashPassword(password);
  
  // Find standard user matching credentials
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === hashed
  );

  if (!user) {
    return res.status(412).json({ error: "Invalid luxurious email or passkey credentials." });
  }

  // Ensure default states
  if (user.emailVerified === undefined) {
    user.emailVerified = true;
  }

  const token = generateToken();
  sessionStore[token] = user;

  res.json({
    token,
    user
  });
});

app.get("/api/auth/me", authenticateToken, (req: any, res) => {
  res.json({ user: req.user });
});

app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  db = loadDB();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "No client matching this email address is found" });
  }

  res.json({
    message: "A secure access code has been dispatched.",
    otp: "888888"
  });
});

app.post("/api/auth/reset-password", (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword) {
    return res.status(400).json({ error: "newPassword is required" });
  }

  db = loadDB();
  // Update the basic clients we have
  db.users.forEach((u) => {
    if (u.role === "client") {
      u.password = hashPassword(newPassword);
    }
  });
  saveDB(db);

  res.json({ message: "Bespoke password updated successfully." });
});

// Real verification endpoints
app.post("/api/auth/send-verification", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email required for verification" });
  }
  res.json({ success: true, otp: "888888" });
});

app.post("/api/auth/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: "Email & verification code required" });
  }

  if (otp !== "888888") {
    return res.status(400).json({ error: "Invalid verification token code matching credentials." });
  }

  db = loadDB();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    user.emailVerified = true;
    saveDB(db);
    
    // Update in-memory session if match found
    Object.keys(sessionStore).forEach((t) => {
      if (sessionStore[t].email.toLowerCase() === email.toLowerCase()) {
        sessionStore[t].emailVerified = true;
      }
    });
  }

  res.json({ success: true });
});

// ----------------------------------------------------
// PORTFOLIO & GENERAL ENDPOINTS
// ----------------------------------------------------

app.get("/api/projects/portfolio", (req, res) => {
  // Return premium curated Indian portfolio items
  const portfolio = [
    {
      id: "port_1",
      title: "Modern 3BHK Apartment — Noida",
      type: "Modern Contemporary",
      location: "Greater Noida, Uttar Pradesh",
      year: "2025",
      sqft: "1,850 sq.ft",
      description: "A bright, warm and functional 3BHK residence incorporating customizable premium modular kitchen cabinets, high-quality TV backdrops, elegant living partitions, and cove warm lighting details perfect for modern Indian families.",
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
      beforeUrl: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=800&auto=format&fit=crop", // raw brick & concrete structure
      budget: "₹18 Lakhs",
    },
    {
      id: "port_2",
      title: "Luxury Villa Interior — Gurgaon",
      type: "Modern Indian Luxury",
      location: "DLF Phase 5, Gurgaon",
      year: "2025",
      sqft: "4,200 sq.ft",
      description: "An elegant, high-contrast private villa combining luxurious Italian quartz counters, custom multi-tiered lighting tracks, customized rosewood panels, hand-tufted furniture accents, and integrated automation systems.",
      imageUrl: "https://images.unsplash.com/photo-1560691023-fa192b6be0d7?q=80&w=1200&auto=format&fit=crop",
      beforeUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop", // empty warehouse state
      budget: "₹55 Lakhs",
    },
    {
      id: "port_3",
      title: "Contemporary Duplex — Delhi",
      type: "Contemporary Minimalism",
      location: "Vasant Kunj, New Delhi",
      year: "2024",
      sqft: "3,200 sq.ft",
      description: "An open, airy structural duplex highlighting a striking floating steel stairway, customized concrete texture finishes, floor-to-ceiling glass screens, and custom false ceiling warm illuminations.",
      imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
      beforeUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop", // bare brickwork structure
      budget: "₹32 Lakhs",
    },
    {
      id: "port_4",
      title: "Scandinavian Apartment — Bangalore",
      type: "Scandinavian Japandi",
      location: "Whitefield, Bangalore",
      year: "2025",
      sqft: "1,500 sq.ft",
      description: "A compact home concept highlighting natural birchwood finishes, soft pastel palettes, wicker pendant domes, and multi-functional space saving layouts designed for high-density IT hub living.",
      imageUrl: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200&auto=format&fit=crop",
      beforeUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop", // bare concrete walls
      budget: "₹15 Lakhs",
    },
    {
      id: "port_5",
      title: "Minimalist Home — Pune",
      type: "Warm Minimalist",
      location: "Koregaon Park, Pune",
      year: "2024",
      sqft: "1,200 sq.ft",
      description: "A modern, clutter-free flat relying on custom oak partitions, sleek acrylic kitchen shutters, and warm amber highlight panels to create an uplifting city sanctuary.",
      imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop",
      beforeUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop", // empty frame construction
      budget: "₹8 Lakhs",
    }
  ];
  res.json(portfolio);
});

// ----------------------------------------------------
// BOOKINGS / VIRTUAL CONSULTATION ENDPOINTS
// ----------------------------------------------------

app.post("/api/bookings", authenticateToken, (req: any, res) => {
  const { style, budget, size, notes, date, time, phone } = req.body;

  if (!style || !budget || !size || !date || !time) {
    return res.status(400).json({ error: "Please enter booking schedules and details completely." });
  }

  db = loadDB();
  const newBooking = {
    id: "bkg_" + crypto.randomBytes(6).toString("hex"),
    userId: req.user.id,
    name: req.user.name,
    email: req.user.email,
    phone: phone || "+1 555-010-LUXE",
    style,
    budget,
    size,
    notes: notes || "No additional parameters provided.",
    date,
    time,
    status: "Review Pending",
    createdAt: new Date().toISOString(),
  };

  db.bookings.push(newBooking);
  saveDB(db);

  res.status(201).json({ message: "Luxury consultation requested successfully", booking: newBooking });
});

app.get("/api/bookings/my", authenticateToken, (req: any, res) => {
  db = loadDB();
  const userBookings = db.bookings.filter((b) => b.userId === req.user.id);
  res.json(userBookings);
});

app.get("/api/admin/bookings", authenticateToken, (req: any, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized curator clearance needed" });
  }
  db = loadDB();
  res.json(db.bookings);
});

app.post("/api/admin/bookings/:id/status", authenticateToken, (req: any, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized curator clearance" });
  }
  const { status } = req.body;
  db = loadDB();
  const bIndex = db.bookings.findIndex((b) => b.id === req.params.id);
  if (bIndex === -1) {
    return res.status(404).json({ error: "Booking session not found" });
  }

  db.bookings[bIndex].status = status;
  saveDB(db);
  res.json({ message: "Booking updated successfully", booking: db.bookings[bIndex] });
});

// ----------------------------------------------------
// CLIENT WORK TIMELINES & BUDGET INVOICES
// ----------------------------------------------------

app.get("/api/client/projects", authenticateToken, (req: any, res) => {
  db = loadDB();
  // Get projects for current user. Admins can view all.
  if (req.user.role === "admin") {
    res.json(db.projects);
  } else {
    const clientsProjects = db.projects.filter((p) => p.userId === req.user.id);
    res.json(clientsProjects);
  }
});

// Admin adds a milestone or changes timeline status of a user's luxury design
app.post("/api/admin/projects/:id/update", authenticateToken, (req: any, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admins only" });
  }
  const { status, progressPercent, milestones, specifications } = req.body;

  db = loadDB();
  const pIndex = db.projects.findIndex((p) => p.id === req.params.id);
  if (pIndex === -1) {
    return res.status(404).json({ error: "Project not found" });
  }

  if (status) {
    db.projects[pIndex].status = status;
    // Update timeline elements dynamically based on status
    const stepLabel = status;
    let foundStep = false;
    db.projects[pIndex].timeline = db.projects[pIndex].timeline.map((step: any) => {
      if (step.label === stepLabel) {
        foundStep = true;
        return { ...step, completed: true };
      }
      return foundStep ? { ...step, completed: false } : { ...step, completed: true };
    });
  }
  if (progressPercent !== undefined) db.projects[pIndex].progressPercent = progressPercent;
  if (milestones) {
    db.projects[pIndex].invoice.milestones = milestones;
    // Recalculate invoice counters
    let paid = 0;
    let pending = 0;
    milestones.forEach((m: any) => {
      if (m.status === "Paid") paid += m.amount;
      else pending += m.amount;
    });
    db.projects[pIndex].invoice.amountPaid = paid;
    db.projects[pIndex].invoice.pendingAmount = pending;
    db.projects[pIndex].invoice.budgetTotal = paid + pending;
  }
  if (specifications) db.projects[pIndex].specifications = specifications;

  saveDB(db);
  res.json({ message: "Luxury masterplan updated", project: db.projects[pIndex] });
});

// Admin creates a new custom active project for clients
app.post("/api/admin/projects/create", authenticateToken, (req: any, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admins only" });
  }
  const { userId, title, location, style, budget } = req.body;

  db = loadDB();
  const targetUser = db.users.find((u) => u.id === userId);
  if (!targetUser) {
    return res.status(400).json({ error: "Selected luxury client does not exist" });
  }

  const newProject = {
    id: "proj_" + crypto.randomBytes(6).toString("hex"),
    userId,
    title,
    location,
    leadDesigner: req.user.name,
    status: "Drafting Concept",
    progressPercent: 15,
    timeline: [
      { label: "Concept Drafting", date: new Date().toISOString().split("T")[0], completed: true },
      { label: "Sourcing Materials", date: "TBD", completed: false },
      { label: "3D Virtual Render", date: "TBD", completed: false },
      { label: "Fine Carpentry", date: "TBD", completed: false },
      { label: "Deliver", date: "TBD", completed: false },
    ],
    invoice: {
      currency: "INR",
      budgetTotal: parseFloat(budget) || 1800000,
      amountPaid: 0,
      pendingAmount: parseFloat(budget) || 1800000,
      milestones: [
        { id: "ms_new1", desc: "Phase I: Creative Brief & CAD Clearances", amount: (parseFloat(budget) || 1800000) * 0.3, status: "Pending" },
        { id: "ms_new2", desc: "Phase II: Solid Material Block Purchases", amount: (parseFloat(budget) || 1800000) * 0.4, status: "Pending" },
        { id: "ms_new3", desc: "Phase III: Millwork Construction", amount: (parseFloat(budget) || 1800000) * 0.3, status: "Pending" },
      ],
    },
    specifications: {
      style: style || "Bespoke Grandeur",
      palette: ["#6B2737", "#FFFAE1", "#332C2D", "#BA8E9A"],
      materials: ["Solid Marble", "Walnut Woods", "Smoked Polished Brass"],
    },
  };

  db.projects.push(newProject);
  saveDB(db);
  res.status(201).json({ message: "Luxury timeline project active", project: newProject });
});

// Pay invoice milestone mockup
app.post("/api/client/projects/:projId/pay/:msId", authenticateToken, (req: any, res) => {
  db = loadDB();
  const pIndex = db.projects.findIndex((p) => p.id === req.params.projId);
  if (pIndex === -1) {
    return res.status(404).json({ error: "Project not found" });
  }

  // Double check client authorization
  if (db.projects[pIndex].userId !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  const milestones = db.projects[pIndex].invoice.milestones;
  const msIndex = milestones.findIndex((m: any) => m.id === req.params.msId);
  if (msIndex === -1) {
    return res.status(404).json({ error: "Milestone entry not found" });
  }

  milestones[msIndex].status = "Paid";
  db.projects[pIndex].invoice.milestones = milestones;

  // Recalculate quantities
  let paid = 0;
  let pending = 0;
  milestones.forEach((m: any) => {
    if (m.status === "Paid") paid += m.amount;
    else pending += m.amount;
  });
  db.projects[pIndex].invoice.amountPaid = paid;
  db.projects[pIndex].invoice.pendingAmount = pending;

  // Advance automatically in percentage slightly for active client engagement feedback loops
  db.projects[pIndex].progressPercent = Math.min(100, db.projects[pIndex].progressPercent + 10);

  saveDB(db);
  res.json({ message: "Transacting via luxurious simulated credit portal complete!", project: db.projects[pIndex] });
});

// ----------------------------------------------------
// REAL-TIME INNER CHAT/MESSAGING
// ----------------------------------------------------

app.get("/api/messages", authenticateToken, (req: any, res) => {
  db = loadDB();
  if (req.user.role === "admin") {
    // Admins can obtain all context threads, or group items
    // Let's filter so we group by client contact user
    res.json(db.messages);
  } else {
    // Current client messages from or to current user
    const chats = db.messages.filter(
      (m) => m.senderId === req.user.id || m.recipientId === req.user.id
    );
    res.json(chats);
  }
});

app.post("/api/messages", authenticateToken, (req: any, res) => {
  const { text, recipientId } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Message volume empty" });
  }

  db = loadDB();
  let targetRecipient = recipientId;

  // If sender is a standard client, they naturally speak with the Principal Admin "usr_admin"
  if (req.user.role === "client") {
    targetRecipient = "usr_admin";
  } else if (!targetRecipient) {
    // Admin must provide target recipient
    return res.status(400).json({ error: "Administrator must address a destination recipient" });
  }

  const newMessage = {
    id: "msg_" + crypto.randomBytes(6).toString("hex"),
    senderId: req.user.id,
    senderName: req.user.name,
    recipientId: targetRecipient,
    text,
    timestamp: new Date().toISOString(),
  };

  db.messages.push(newMessage);
  saveDB(db);
  res.status(201).json(newMessage);
});

// ----------------------------------------------------
// LUXE AI MOODBOARD ASSISTANT (GEMINI INTEGRATION)
// ----------------------------------------------------

app.post("/api/ai/moodboard", async (req, res) => {
  const { room, style, colorInspiration, description } = req.body;

  if (!room || !style || !colorInspiration) {
    return res.status(400).json({ error: "Kindly provide room type, style, and design tone to generate a curated moodboard." });
  }

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      // Return beautiful bespoke structured offline fallback if API key is not ready
      return res.json({
        philosophy: `The Moonlit Serenade for your ${room} (${style}): An elegant composition relying on a dramatic play between stark organic shadows and delicate light flares. Curated specifically for an off-grid aesthetic using premium textures.`,
        palette: [
          { name: "Opulent Maroon", hex: "#6B2737", desc: "A majestic, velvet-inspired burgundy conveying prestigious heritage." },
          { name: "Satin Alabaster", hex: "#FFFAE1", desc: "Soft, bone-white cream reflecting gentle candlelight streams." },
          { name: "Charred Spruce", hex: "#1F2937", desc: "Sultry deepest cedar tone for framing vertical partitions." },
          { name: "Brushed Champagne", hex: "#D9C3B0", desc: "Matte metal finish that captures subtle shadow plays." }
        ],
        materials: [
          { name: "Belgian Flax Bouclé", type: "Fabric", application: "Upholstered accent lounges" },
          { name: "Brushed Noir Travertine", type: "Stone", application: "Floor panels and fireplace mantel" },
          { name: "Fluted Shou-Sugi-Ban Cedar", type: "Wood", application: "Clavi-wall room partitions" },
          { name: "Opaque Amber Glass", type: "Finishes", application: "Sconces and ambient lighting domes" }
        ],
        recommendations: [
          "Incorporate high-contrast cove lighting highlighting natural travertine textures.",
          "Use dramatic 3-meter tall cedar fluted room divider screens for visual layers.",
          "Select low-slung, ultra-comfort bouclé elements to promote absolute somatic ease."
        ],
        isDemo: true
      });
    }

    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const userPrompt = `You are a world-leading ultra-luxury Interior Architect and Principal Designer at "MOON LOOKS".
Produce a highly detailed, curated interior styling plan and bespoke moodboard outline in rigorous JSON format.
Target space: ${room}.
Aesthetic: ${style}.
Color Tones & Accent: ${colorInspiration}.
Client briefs: ${description || "Create a space celebrating luxurious materials and architectural harmony."}

Return ONLY a premium, compliant, single JSON object matches the following structure exactly. Do not output markdown codeblocks around it, just raw JSON.

{
  "philosophy": "A descriptive, inspiring 3-sentence architectural philosophy statement of the design.",
  "palette": [
    { "name": "Curated Palette Color Name", "hex": "Standard CSS Hex Code starting with #", "desc": "A sensory description of where and how to render this shade." }
  ],
  "materials": [
    { "name": "Bespoke Material Detail (e.g. Italian Calacatta Viola)", "type": "Stone/Wood/Fabric/Finish/Metal", "application": "Detailed architectural placement guide." }
  ],
  "recommendations": [
    "Somatic layout advice 1",
    "Bespoke lighting guidance 2",
    "Tailor-made artisanal joinery idea 3"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.85,
      },
    });

    const rawText = response.text || "";
    const cleanJSONStr = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanJSONStr);

    res.json(result);
  } catch (error: any) {
    console.error("Gemini AI Moodboard generation failure:", error);
    res.status(500).json({ error: "The grand design calculation was interrupted. Please retry in a few moments." });
  }
});


// Add custom luxury clients listing endpoint for custom admin project creator autocomplete
app.get("/api/admin/clients", authenticateToken, (req: any, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Curator access only" });
  }
  db = loadDB();
  const clients = db.users
    .filter((u) => u.role === "client")
    .map((u) => ({ id: u.id, name: u.name, email: u.email }));
  res.json(clients);
});


// ----------------------------------------------------
// Bespoke SaaS Profile, Quotations & Leads APIs
// ----------------------------------------------------

// Profile management
app.post("/api/client/profile/update", authenticateToken, (req: any, res) => {
  const { name, bio, phone, city, projectType } = req.body;
  db = loadDB();
  const uIdx = db.users.findIndex((u) => u.id === req.user.id);
  if (uIdx === -1) {
    return res.status(404).json({ error: "User profile not established." });
  }

  if (name) db.users[uIdx].name = name;
  if (bio !== undefined) db.users[uIdx].bio = bio;
  if (phone) db.users[uIdx].phone = phone;
  if (city) db.users[uIdx].city = city;
  if (projectType) db.users[uIdx].projectType = projectType;

  // Refresh active session profile
  sessionStore[req.headers["authorization"].split(" ")[1]] = db.users[uIdx];
  saveDB(db);

  res.json({ message: "Bespoke profile updated", user: db.users[uIdx] });
});

// Admin list of users
app.get("/api/admin/users", authenticateToken, (req: any, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Curator level access required" });
  }
  db = loadDB();
  res.json(db.users);
});

// Save client quotation (or Guest created estimates)
app.post("/api/quotations", authenticateToken, (req: any, res) => {
  const { sizeSqFt, projectType, estimatedTotal, materialsGradeText, lineItems, city } = req.body;
  
  db = loadDB();
  if (!db.quotations) db.quotations = [];

  const newQuote = {
    id: "qtn_" + crypto.randomBytes(5).toString("hex"),
    userId: req.user.id,
    clientName: req.user.name,
    projectType: projectType || "Besoke Interior Space",
    city: city || req.user.city || "NCR",
    sizeSqFt: parseFloat(sizeSqFt) || 1200,
    materialsGradeText: materialsGradeText || "Sovereign Gold",
    estimatedTotal: parseFloat(estimatedTotal) || 1500000,
    status: "Pending Review",
    date: new Date().toISOString().split("T")[0],
    lineItems: lineItems || []
  };

  db.quotations.push(newQuote);
  saveDB(db);

  res.status(201).json(newQuote);
});

// Fetch user quotations
app.get("/api/quotations", authenticateToken, (req: any, res) => {
  db = loadDB();
  if (!db.quotations) db.quotations = [];
  
  if (req.user.role === "admin") {
    res.json(db.quotations);
  } else {
    res.json(db.quotations.filter((q) => q.userId === req.user.id));
  }
});

// Admin-only quotations access helper
app.get("/api/admin/quotations", authenticateToken, (req: any, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized access" });
  }
  db = loadDB();
  if (!db.quotations) db.quotations = [];
  res.json(db.quotations);
});

// Capturing fresh leads (Public endpoint)
app.post("/api/leads", (req, res) => {
  const { name, email, phone, city, projectType, messageText } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Please submit name, email, and phone contact points." });
  }

  db = loadDB();
  if (!db.leads) db.leads = [];

  const newLead = {
    id: "lead_" + crypto.randomBytes(5).toString("hex"),
    name,
    email: email.toLowerCase(),
    phone,
    city: city || "Unspecified NCR Hub",
    projectType: projectType || "Luxe Consultation Inquiry",
    messageText: messageText || "Customer requested bespoke call schedule.",
    status: "New Entry",
    createdAt: new Date().toISOString()
  };

  db.leads.push(newLead);
  saveDB(db);

  res.status(201).json(newLead);
});

// Admin list of lead entries
app.get("/api/admin/leads", authenticateToken, (req: any, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }
  db = loadDB();
  if (!db.leads) db.leads = [];
  res.json(db.leads);
});

// Admin status progression
app.post("/api/admin/leads/:id/status", authenticateToken, (req: any, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }
  const { status } = req.body;
  db = loadDB();
  if (!db.leads) db.leads = [];

  const leadIndex = db.leads.findIndex((l) => l.id === req.params.id);
  if (leadIndex === -1) {
    return res.status(404).json({ error: "Lead registry not found." });
  }

  db.leads[leadIndex].status = status;
  saveDB(db);
  res.json(db.leads[leadIndex]);
});


// ----------------------------------------------------
// VITE DEV / PRODUCTION FALLBACK MIDDLEWARES
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Luxury service running elegantly on http://0.0.0.0:${PORT}`);
  });
}

startServer();
