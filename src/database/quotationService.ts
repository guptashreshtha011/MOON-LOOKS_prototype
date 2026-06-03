// Premium quotation generator and pricing matrix management

export interface Quotation {
  id: string;
  userId: string;
  clientName: string;
  projectType: string;
  city: string;
  sizeSqFt: number;
  materialsGradeText: "Elite Heritage" | "Sovereign Gold" | "Standard Comfort";
  estimatedTotal: number;
  status: "Pending Review" | "Approved" | "Refined";
  date: string;
  lineItems: { description: string; cost: number }[];
}

export const quotationService = {
  // Generate bespoke live quotation estimate based on physical parameters
  calculateQuote(sizeSqFt: number, style: string, materialsGrade: string): Quotation {
    let ratePerSqFt = 900; // Base rate
    if (materialsGrade === "Elite Heritage") ratePerSqFt = 2200;
    else if (materialsGrade === "Sovereign Gold") ratePerSqFt = 1600;

    if (style.includes("Villas") || style.includes("Farmhouse")) {
      ratePerSqFt += 300;
    }

    const calculatedBase = sizeSqFt * ratePerSqFt;
    const items = [
      { description: "Demolition, Layout Alterations & Site Framing Layout", cost: Math.round(calculatedBase * 0.15) },
      { description: "Electrical Layout Plumbing Overhauls & Circlights Integration", cost: Math.round(calculatedBase * 0.20) },
      { description: "Modular Carcase Carving, Teakwood Wardrobes & Kitchen Cabinets", cost: Math.round(calculatedBase * 0.35) },
      { description: "Italian Calacatta Quartz Countertops & Italian Marble Tones", cost: Math.round(calculatedBase * 0.20) },
      { description: "Turnkey Curation, Custom Swatch Painting & Styling Fixtures", cost: Math.round(calculatedBase * 0.10) }
    ];

    const total = items.reduce((acc, curr) => acc + curr.cost, 0);

    return {
      id: "qtn_" + Math.random().toString(36).substring(4, 9),
      userId: "",
      clientName: "Bespoke Estimator Guest",
      projectType: style,
      city: "NCR India",
      sizeSqFt,
      materialsGradeText: materialsGrade as any,
      estimatedTotal: total,
      status: "Pending Review",
      date: new Date().toISOString().split("T")[0],
      lineItems: items
    };
  },

  // Save quotation to persistent file database (SaaS CRM)
  async saveClientQuotation(token: string, payload: Partial<Quotation>): Promise<Quotation> {
    const res = await fetch("/api/quotations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to commit luxury blueprint estimation.");
    return data;
  },

  // Retrieve client estimations
  async getClientQuotations(token: string): Promise<Quotation[]> {
    const res = await fetch("/api/quotations", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to retrieve compiled quotes.");
    return Array.isArray(data) ? data : [];
  },

  // Get admin directory list
  async getAllQuotations(token: string): Promise<Quotation[]> {
    const res = await fetch("/api/admin/quotations", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Unauthorized quotations request.");
    return Array.isArray(data) ? data : [];
  }
};
