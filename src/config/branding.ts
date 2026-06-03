// Centralized rebranding configuration for premium SaaS white-labelling

export interface CompanyBrand {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  currencySymbol: string;
  accentColor: string; // Tailwind accent theme classes
  backgroundColor: string;
  fonts: {
    display: string;
    body: string;
    mono: string;
  };
  supportedCities: string[];
}

export const BRANDING: CompanyBrand = {
  name: "Moon Looks",
  tagline: "Ultra-Luxury Bespoke Indian Residences & Architecture",
  email: "curators@moonlooks.com",
  phone: "+91 99999 88888",
  whatsappNumber: "919999988888",
  address: "DLF Phase 5, Golf Course Road, Gurgaon, NCR, India",
  currencySymbol: "₹",
  accentColor: "#6B2737", // Sovereign Deep Burgundy
  backgroundColor: "#FFFAE1", // Warm Ivory Chamois
  fonts: {
    display: "font-sans font-extralight tracking-tight",
    body: "font-sans text-gray-700",
    mono: "font-mono tracking-wider"
  },
  supportedCities: [
    "Gurgaon",
    "Bangalore",
    "Mumbai",
    "Pune",
    "Hyderabad",
    "Delhi"
  ]
};

export interface PricingPackage {
  id: string;
  name: string;
  description: string;
  amountText: string;
  estimatedArea: string;
  badge?: string;
  features: string[];
}

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: "pkg_elite",
    name: "Luxury Atelier Signature",
    description: "Perfect for premium 3BHK high-rises, featuring bespoke teak veneer finishes and Calacatta quartz countertops.",
    amountText: "₹15 Lakhs - ₹25 Lakhs",
    estimatedArea: "1,500 - 2,200 sq.ft",
    badge: "Most Popular",
    features: [
      "Custom 3D VR Walkthroughs",
      "Lead Curator Site Supervision",
      "Teakwood & Calacatta Quartz Selections",
      "Premium PU-MDF Modular Fittings"
    ]
  },
  {
    id: "pkg_sovereign",
    name: "Imperial Residence Collection",
    description: "Fully bespoke design tailored for duplex villas, luxury farmhouses, and ultra-premium estates.",
    amountText: "₹35 Lakhs - ₹60 Lakhs+",
    estimatedArea: "3,000+ sq.ft",
    badge: "Elite Class",
    features: [
      "Full turnkey project management",
      "Exclusive designer-guided global material sourcing trip",
      "Bespoke Italian marble & solid teakwood fixtures",
      "Home automation & smart circadian lighting plan",
      "Prepaid 365-day luxury maintenance concierge"
    ]
  },
  {
    id: "pkg_consultation",
    name: "Prestige Design Consultation",
    description: "1-on-1 boutique vision consultation and space plotting with our master curator.",
    amountText: "₹3 Lakhs",
    estimatedArea: "Concept Planning Only",
    features: [
      "Detailed 2D furniture layouts",
      "Color theory and chromotherapy moodboards",
      "Sourcing directory of international luxury vendors"
    ]
  }
];
