import React, { useState, useEffect } from "react";
import { User } from "./types";
import Navigation from "./components/Navigation";
import Portfolio from "./components/Portfolio";
import Testimonials from "./components/Testimonials";
import AiAssistant from "./components/AiAssistant";
import BookingConsultation from "./components/BookingConsultation";
import WhatsAppFab from "./components/WhatsAppFab";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import { useAuth } from "./database/hooks";

import { 
  X, Mail, Lock, User as UserIcon, LogIn, ChevronRight, 
  MapPin, Phone, MessageSquare, ShieldAlert, Sparkles, Star,
  Sofa, Bed, ChefHat, Lamp, Ruler, Grid, Smile, PhoneCall,
  Flame, HelpCircle, Utensils, Send, CheckCircle2, ShieldCheck, Heart, Landmark
} from "lucide-react";

export default function App() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("portfolio");
  const [authSubPage, setAuthSubPage] = useState<"login" | "signup" | "forgot-password" | "dashboard">("login");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedNotes, setSelectedNotes] = useState<string>("");

  // Quick Contact input states
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Sync sub page on user change
  useEffect(() => {
    if (currentUser) {
      setAuthSubPage("dashboard");
    } else {
      setAuthSubPage("login");
    }
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    setActiveTab("portfolio");
    setAuthSubPage("login");
  };

  // Handle Quick Contact Action Form Dispatch
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) return;
    setContactLoading(true);
    setContactSuccess(false);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: `${contactName.toLowerCase().replace(/\s+/g, "")}@example.com`,
          phone: contactPhone,
          city: "NCR General Hub",
          projectType: "SaaS Call Consultation Inquiry",
          messageText: contactMessage || "Requested immediate call scheduled back for custom interior planning.",
        }),
      });

      if (response.ok) {
        setContactSuccess(true);
        setContactName("");
        setContactPhone("");
        setContactMessage("");
        setTimeout(() => setContactSuccess(false), 5000);
      }
    } catch (err) {
      console.error("Leads dispatch failure", err);
    } finally {
      setContactLoading(false);
    }
  };

  // List of high-end specialized services requested
  const servicesList = [
    {
      id: "residential-interiors",
      title: "Residential Interiors",
      icon: Sofa,
      desc: "Complete luxury living, dining, and multi-bedroom flat executions custom curated to your lifestyle status.",
      highlight: "Premium false ceilings, customized veneer paneling & tailored layout integration as standard."
    },
    {
      id: "modular-kitchens",
      title: "Modular Kitchens",
      icon: ChefHat,
      desc: "High-performance modular layouts utilizing durable BWR ply, anti-scratch acrylic finishes, and soft-close Hettich hardware.",
      highlight: "Includes quartz countertops, standard chimneys, and smart spice-pullout custom assemblies."
    },
    {
      id: "bedroom-design",
      title: "Bedroom Design",
      icon: Bed,
      desc: "Personalized layouts combining plush hydraulic beds, seamless floor-to-ceiling wardrobes, and optimized dressing partitions.",
      highlight: "Custom velvet backdrops, warm integrated headboard lights, and silent profile shutter sliding tracks."
    },
    {
      id: "living-room-design",
      title: "Living Room Design",
      icon: Grid,
      desc: "The visual star of your flat. High-contrast accent walls, Italian marble TV framing, and luxurious bespoke lounging layouts.",
      highlight: "Equipped with hidden cove lighting, layered sheer drapes, and premium custom brass accents."
    },
    {
      id: "kids-room-interiors",
      title: "Kids Room Interiors",
      icon: Smile,
      desc: "Vibrant, highly functional multi-activity bedrooms featuring smart storage study desks, magnetic pinboards, and safe rounded-edge furniture.",
      highlight: "Engineered with heavy-duty safety hinges and hidden modular toy chest chest storage units."
    },
    {
      id: "dining-spaces",
      title: "Dining Spaces",
      icon: Utensils,
      desc: "Warm elegant setups mapping premium marble or teak dining consoles paired with custom upholstered chairs and designer credenzas.",
      highlight: "Aesthetic chandelier wiring alignments, luxury glassware cabinetry, and integrated wet bar provisions."
    },
    {
      id: "false-ceiling-lighting",
      title: "False Ceiling & Lighting",
      icon: Lamp,
      desc: "Symmetrical Gypsum ceiling architecture utilizing branded Saint-Gobain boards, anti-glare COB spotlights, and ambient Phillips LED strips.",
      highlight: "Structured ceiling load distributions and heat dissipation routing for absolute fire safety."
    },
    {
      id: "space-planning",
      title: "Space Planning",
      icon: Ruler,
      desc: "Scientific room circulation mapping ensuring spacious walking paths, ergonomic height alignments, and seamless passage transition flows.",
      highlight: "Ensures no visual congestion and guarantees optimal natural daylight entry."
    },
    {
      id: "2d-3d-floor-planning",
      title: "2D & 3D Floor Planning",
      icon: Landmark,
      desc: "Deep visual concept mapping using exact property measurements, furnishing alignments, and complete color palette preview renders.",
      highlight: "Interactive material mapping before procurement to guarantee layout accuracy."
    },
    {
      id: "architecture-consultation",
      title: "Architecture Consultation",
      icon: PhoneCall,
      desc: "Comprehensive civil analysis, load-bearing assessments, entry-direction layout planning (Vastu compliant), and window vent locations.",
      highlight: "Supervised directly by council-registered luxury architects."
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-gray-800 flex flex-col justify-between selection:bg-[#6B2737]/15">
      
      {/* Editorial Navigation */}
      <Navigation
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => {
          setAuthSubPage("login");
          setActiveTab("dashboard");
        }}
        onLogout={handleLogout}
      />

      {/* Main Sanctuary Viewer */}
      <main className="flex-grow">
        {activeTab === "portfolio" && (
          <div className="space-y-12">
            
            {/* Soft Warm Elegantly Crafted Indian Hero Banner */}
            <section className="relative min-h-[520px] w-full flex items-center bg-[#FAF9F5] overflow-hidden pt-12 pb-16 border-b border-gray-150">
              <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6B2737 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              
              <div className="relative mx-auto max-w-7xl px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Side Content Column */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className="inline-flex items-center space-x-2 font-mono text-[9px] tracking-[0.25em] font-bold uppercase text-[#6B2737] bg-[#6B2737]/5 border border-[#6B2737]/20 px-4 py-2 rounded-full shadow-xs animate-fade-in">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                    <span>PREMIUM INDIAN INTERIOR STUDIO</span>
                  </div>
                  
                  <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-gray-900 leading-[1.1]">
                    Designing Elegant Spaces <br />
                    <span className="font-semibold text-[#6B2737] tracking-tight">For Modern Living</span>
                  </h1>
                  
                  <p className="font-sans text-sm sm:text-base font-light text-gray-600 leading-relaxed max-w-2xl">
                    Luxury interiors, personalized architecture, and thoughtfully crafted homes custom tailored for modern Indian lifestyles. From modular Hettich kitchens to premium false ceilings and bespoke living rooms, we execute details with absolute precision.
                  </p>

                  {/* High-conversion primary CTAs */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      onClick={() => {
                        const target = document.getElementById("projects-section");
                        if (target) {
                          target.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }}
                      className="rounded-full bg-[#6B2737] border border-[#6B2737] text-[#FFFAE1] px-8 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-[#6B2737]/90 active:scale-95 transition-all text-center cursor-pointer shadow-md shadow-[#6B2737]/15"
                    >
                      View Live Projects
                    </button>
                    <button
                      onClick={() => setActiveTab("booking")}
                      className="rounded-full border border-gray-300 bg-white text-gray-700 px-8 py-3.5 text-xs font-bold uppercase tracking-wider hover:border-[#6B2737] hover:text-[#6B2737] active:scale-95 transition-all text-center cursor-pointer"
                    >
                      Book Free Consultation
                    </button>
                  </div>

                  {/* Trust Indicators block for realistic business reputation */}
                  <div className="pt-6 border-t border-gray-200/60 max-w-xl flex flex-wrap items-center gap-6">
                    <div className="flex items-center space-x-1">
                      <div className="flex text-amber-500 text-xs">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      </div>
                      <span className="font-sans text-xs font-semibold text-gray-700">4.9/5 Rating</span>
                    </div>
                    <div className="text-gray-400 text-xs">•</div>
                    <div className="font-sans text-xs font-light text-gray-600">
                      <strong>150+</strong> Luxury Flats Handed Over
                    </div>
                    <div className="text-gray-400 text-xs">•</div>
                    <div className="font-sans text-xs font-light text-gray-600">
                      <strong>10 Years</strong> Structural Warranty
                    </div>
                  </div>
                </div>

                {/* Right Side Visual showcase panel */}
                <div className="lg:col-span-5 relative">
                  <div className="absolute inset-0 bg-[#6B2737]/5 rounded-[2.5rem] transform translate-y-4 translate-x-4 -z-10 border border-[#6B2737]/10" />
                  <div className="relative overflow-hidden rounded-[2rem] border border-gray-150 shadow-xl bg-white aspect-[4/3] sm:aspect-square">
                    <img 
                      src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop" 
                      alt="Premium premium living room layout by Moon Looks" 
                      className="h-full w-full object-cover"
                    />
                    
                    {/* Tiny Floating Badges for realism */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-lg flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="font-sans text-xs font-bold text-gray-800">Greater Noida Sector 150 site</span>
                      </div>
                      <span className="font-mono text-[10px] tracking-wider text-[#6B2737] font-bold">RECENT SITE VISIT</span>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Main portfolio and filterable Slider section */}
            <div id="projects-section" className="scroll-mt-24">
              <Portfolio 
                onSelectTab={setActiveTab} 
                setSelectedStyle={setSelectedStyle} 
                onExportEstimate={(data) => {
                  setSelectedStyle(data.style);
                  setSelectedBudget(data.budget);
                  setSelectedSize(data.size);
                  setSelectedNotes(data.notes);
                  setActiveTab("booking");
                }}
              />
            </div>

            {/* SERVICES SECTION - HIGHLY DETAILED, RELEVANT, CONVERSION-DRIVEN */}
            <section id="services-section" className="scroll-mt-24 mx-auto max-w-7xl px-6 py-12">
              <div className="text-center mb-12">
                <span className="font-mono text-xs tracking-[0.3em] text-[#6B2737] uppercase bg-[#6B2737]/5 px-4 py-1.5 rounded-full inline-block mb-3 font-semibold">
                  Comprehensive Offerings
                </span>
                <h2 className="font-sans text-3xl sm:text-4xl font-extralight tracking-tight text-gray-900 leading-tight">
                  OUR SPECIALIZED <span className="font-semibold text-[#6B2737]">SERVICES</span>
                </h2>
                <div className="mx-auto mt-4 h-[1px] w-24 bg-[#6B2737]/20" />
                <p className="mx-auto mt-4 max-w-2xl font-sans text-sm font-light text-gray-500 leading-relaxed">
                  End-to-end design, modular manufacturing, and supervised ground execution services managed by certified interior architects.
                </p>
              </div>

              {/* Grid of the 10 core requested services */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {servicesList.map((srv, index) => {
                  const SrvIcon = srv.icon;
                  return (
                    <div 
                      key={srv.id}
                      className="group relative bg-white border border-gray-150 rounded-3xl p-6 shadow-xs hover:border-amber-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Service Item Header with Icon */}
                        <div className="flex items-center space-x-3.5 mb-4">
                          <div className="h-10 w-10 rounded-2xl bg-[#6B2737]/5 flex items-center justify-center text-[#6B2737] group-hover:bg-[#6B2737] group-hover:text-white transition-colors duration-300">
                            <SrvIcon className="h-5 w-5 stroke-[1.75]" />
                          </div>
                          <h3 className="font-sans text-base font-semibold text-gray-800 tracking-tight">
                            {srv.title}
                          </h3>
                        </div>

                        <p className="font-sans text-xs text-gray-500 font-light leading-relaxed mb-4">
                          {srv.desc}
                        </p>
                      </div>

                      {/* Highlight bullet badge */}
                      <div className="border-t border-gray-100 pt-3.5">
                        <div className="flex items-start space-x-1.5 bg-[#6B2737]/5 rounded-xl p-2.5 text-[10.5px] text-[#6B2737] leading-relaxed font-sans font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#6B2737]" />
                          <span>{srv.highlight}</span>
                        </div>

                        {/* CTA Inquire */}
                        <button
                          onClick={() => {
                            setSelectedStyle(`${srv.title} Concept`);
                            setSelectedNotes(`Hello, I want to inquire about custom options for ${srv.title}.`);
                            setActiveTab("booking");
                          }}
                          className="mt-4 w-full flex items-center justify-center space-x-1 py-2 text-[11px] font-bold tracking-wider uppercase rounded-xl text-[#6B2737] border border-[#6B2737]/20 hover:bg-[#6B2737] hover:text-white hover:border-[#6B2737] transition-all cursor-pointer"
                        >
                          <span>Inquire pricing</span>
                          <ChevronRight className="h-3 w-3 shrink-0" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </section>

            {/* ABOUT OUR STUDIO SECTION - TRUST-CENTERED & DETAILED DESIGN PROCESS */}
            <section id="about-section" className="scroll-mt-24 mx-auto max-w-7xl px-6 py-12 border-t border-gray-150">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left image board column */}
                <div className="lg:col-span-5 relative">
                  <div className="absolute inset-0 bg-amber-500/5 rounded-3xl transform translate-y-3 translate-x-3 -z-10" />
                  <div className="relative overflow-hidden rounded-2xl border border-gray-150 shadow-md">
                    <img 
                      src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=800&auto=format&fit=crop" 
                      alt="Moon Looks luxury interior execution in Pune" 
                      className="aspect-[4/5] object-cover w-full"
                    />
                    
                    {/* Visual Stamp */}
                    <div className="absolute top-4 right-4 bg-[#6B2737] text-[#FFFAE1] px-4 py-2 rounded-xl text-[10px] font-mono tracking-widest font-bold uppercase shadow-md">
                      ESTD. 2016
                    </div>
                  </div>
                </div>

                {/* Right content column */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <span className="font-mono text-xs tracking-[0.3em] text-[#6B2737] uppercase bg-[#6B2737]/5 px-4 py-1.5 rounded-full inline-block font-semibold">
                    OUR HERITAGE
                  </span>
                  
                  <h2 className="font-sans text-3xl sm:text-4xl font-extralight tracking-tight text-gray-900 leading-tight">
                    ABOUT <span className="font-semibold text-[#6B2737]">MOON LOOKS</span>
                  </h2>
                  
                  <p className="font-sans text-sm text-gray-600 leading-relaxed font-light">
                    Moon Looks is a premier high-end residential interior design and spatial architecture firm registered under Indian architectural codes. With active design centers in Greater Noida (Sector 150), Gurgaon, and Pune, we bridge the gap between creative interior visualization and flawless ground execution.
                  </p>

                  <p className="font-sans text-sm text-gray-600 leading-relaxed font-light">
                    We select only premium, certified raw elements: custom Calacatta marble slab inlays, weather-resistant plywood cores, and premium matte PU lacquer hardware finishes. Our clients get real-time tracking of site progress via our custom client portal, ensuring zero project delays or budget creep.
                  </p>

                  {/* 4-Step Structural Execution Timeline */}
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="font-sans text-sm font-bold text-gray-800 tracking-tight uppercase mb-4">
                      Our Failsafe 4-Step Design Process
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <div className="h-6 w-6 rounded-full bg-[#6B2737] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">1</div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800">Virtual Briefing</p>
                          <p className="text-[11px] text-gray-500 font-light">Discuss scope, layouts, and initial INR budget parameters with the architect.</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="h-6 w-6 rounded-full bg-[#6B2737] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">2</div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800">Concept Blueprinting</p>
                          <p className="text-[11px] text-gray-500 font-light">Use our AI planning tools and 3D visualizers to lock down the exact structural flow.</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="h-6 w-6 rounded-full bg-[#6B2737] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">3</div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800">Element Selection</p>
                          <p className="text-[11px] text-gray-500 font-light">Choose from our curated veneer list, Hettich hinges or premium quartz composites.</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="h-6 w-6 rounded-full bg-[#6B2737] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">4</div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800">Supervised Execution</p>
                          <p className="text-[11px] text-gray-500 font-light">Studio architects manage local handovers and certify strict material tolerances.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            <div id="testimonials" className="scroll-mt-24">
              <Testimonials />
            </div>

            {/* CONTACT US SECTION WITH GEOLOCATION MAP & FORM */}
            <section id="contact-section" className="scroll-mt-24 mx-auto max-w-7xl px-6 py-12 border-t border-gray-150">
              <div className="text-center mb-12">
                <span className="font-mono text-xs tracking-[0.3em] text-[#6B2737] uppercase bg-[#6B2737]/5 px-4 py-1.5 rounded-full inline-block mb-3 font-semibold">
                  Get in Touch
                </span>
                <h2 className="font-sans text-3xl sm:text-4xl font-extralight tracking-tight text-gray-900 leading-tight">
                  VISIT OUR <span className="font-semibold text-[#6B2737]">STUDIO</span>
                </h2>
                <div className="mx-auto mt-4 h-[1px] w-24 bg-[#6B2737]/20" />
                <p className="mx-auto mt-4 max-w-2xl font-sans text-sm font-light text-gray-500 leading-relaxed">
                  Have questions? Connect with our Greater Noida office or start a conversation with a luxury design consultant.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Geolocation Office details + Map embed column */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                    
                    <div className="space-y-2">
                      <span className="font-mono uppercase text-amber-800 tracking-wider text-[9px] font-bold block">
                        📍 Noida Office Headquarters
                      </span>
                      <p className="text-xs text-gray-800 font-bold leading-normal">
                        R-2, Sector 150,<br />
                        Noida Extension Area,<br />
                        Uttar Pradesh - 201310
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono">Near Ace Parkway Township</p>
                    </div>

                    <div className="space-y-2">
                      <span className="font-mono uppercase text-amber-800 tracking-wider text-[9px] font-bold block">
                        📞 Client Hotline & Social Link
                      </span>
                      <p className="text-xs text-gray-800 font-bold flex items-center space-x-1.5">
                        <Phone className="h-3.5 w-3.5 text-[#6B2737] shrink-0" />
                        <span>+91 98112 34567</span>
                      </p>
                      <p className="text-xs text-gray-800 font-bold flex items-center space-x-1.5">
                        <Mail className="h-3.5 w-3.5 text-[#6B2737] shrink-0" />
                        <span>hello@moonlooks.co.in</span>
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono">Callbacks: Mon-Sun (9AM - 8PM)</p>
                    </div>

                  </div>

                  {/* High Quality Responsive Interactive Google Map Embed in Sector 150 Noida UP */}
                  <div className="w-full relative overflow-hidden rounded-3xl border border-gray-150 h-80 shadow-md">
                    <iframe 
                      title="Moon Looks Office Map Noida Sector 150"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14023.753896562534!2d77.46985!3d28.436214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cc0f56a5c3785%3A0xeebd2a017cfbf663!2sSector%20150%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                      className="absolute inset-0 w-full h-full border-0"
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      id="google-maps-iframe"
                    />
                  </div>
                </div>

                {/* Quick Consultation Request Form Column */}
                <div className="lg:col-span-5 bg-white border border-gray-200/80 rounded-3xl p-8 shadow-sm flex flex-col justify-between text-left">
                  <div>
                    <h3 className="font-sans text-lg font-semibold text-gray-800 tracking-tight">
                      REQUEST A CALLBACK
                    </h3>
                    <p className="font-sans text-[11px] text-gray-500 font-light mt-1 mb-6 leading-relaxed">
                      Enter details below, and an executive interior design expert will coordinate a callback within 2 business hours.
                    </p>

                    {contactSuccess ? (
                      <div className="bg-emerald-50 border border-emerald-150 text-emerald-800 p-4 rounded-2xl text-xs space-y-1 animate-fade-in mb-6">
                        <div className="flex items-center space-x-1.5 font-bold">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>CALLBACK REQUEST REGISTERED</span>
                        </div>
                        <p className="text-[10px] text-emerald-700/80 leading-normal">
                          Thank you! Your reference details have been logged in our secure dispatcher console.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                            Your Name <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text" 
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="e.g. Aditi Sharma"
                            className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#6B2737] focus:bg-white text-gray-800 transition-all font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                            Indian Mobile Number <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="tel" 
                            required
                            pattern="[0-9]{10}"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            placeholder="e.g. 9811234567"
                            className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#6B2737] focus:bg-white text-gray-800 transition-all font-mono"
                          />
                          <p className="text-[9px] text-gray-400 font-sans mt-1">Please enter a valid 10-digit number</p>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                            Brief Project Details (Optional)
                          </label>
                          <textarea 
                            rows={3}
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            placeholder="e.g. 3BHK flat interior planning, Noida Sector 150."
                            className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#6B2737] focus:bg-white text-gray-800 transition-all font-sans resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={contactLoading || !contactName || !contactPhone}
                          className="w-full flex items-center justify-center space-x-2 rounded-full bg-[#6B2737] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#6B2737]/90 active:scale-95 disabled:opacity-50 transition-all cursor-pointer mt-4"
                        >
                          {contactLoading ? (
                            <span>REGISTERING BRIEF...</span>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              <span>Request callback</span>
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100 mt-4 text-center">
                    <span className="font-sans text-[11px] text-gray-400">
                      or ping us instantly on WhatsApp: {" "}
                      <a 
                        href="https://wa.me/919811234567" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[#6B2737] font-bold hover:underline"
                      >
                        +91 98112 34567
                      </a>
                    </span>
                  </div>

                </div>

              </div>
            </section>

          </div>
        )}

        {activeTab === "ai-assistant" && (
          <AiAssistant initialStyleStyle={selectedStyle} />
        )}

        {activeTab === "booking" && (
          <BookingConsultation
            currentUser={currentUser}
            selectedStyle={selectedStyle}
            selectedBudget={selectedBudget}
            selectedSize={selectedSize}
            selectedNotes={selectedNotes}
            onOpenAuth={() => {
              setAuthSubPage("login");
              setActiveTab("dashboard");
            }}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === "dashboard" && (
          currentUser ? (
            <DashboardPage onLogout={handleLogout} />
          ) : (
            <div className="py-12 px-4 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[500px]">
              {authSubPage === "login" && (
                <LoginPage
                  onNavigateToSignup={() => setAuthSubPage("signup")}
                  onNavigateToForgotPassword={() => setAuthSubPage("forgot-password")}
                  onLoginSuccess={() => setAuthSubPage("dashboard")}
                />
              )}
              {authSubPage === "signup" && (
                <SignupPage
                  onNavigateToLogin={() => setAuthSubPage("login")}
                  onSignupSuccess={() => setAuthSubPage("dashboard")}
                />
              )}
              {authSubPage === "forgot-password" && (
                <ForgotPasswordPage
                  onBackToLogin={() => setAuthSubPage("login")}
                />
              )}
            </div>
          )
        )}
      </main>

      {/* Luxurious Warm Maroon and Gold Footer */}
      <footer className="bg-[#6B2737] text-white/90 py-16 border-t-2 border-amber-200/35 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] select-none pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FAF9F5 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-left relative z-10">
          <div className="space-y-4">
            <h4 className="font-sans text-xl font-bold tracking-[0.25em] text-[#FFFAE1]">MOON LOOKS</h4>
            <p className="font-mono text-[8px] tracking-[0.3em] uppercase text-[#FFFAE1]/65">MODERN INTERIOR architecture</p>
            <p className="font-sans text-xs font-light text-gray-300 leading-relaxed">
              Crafting comfortable residential sanctuaries throughout Noida, Gurgaon, Pune, and Bangalore through scientific space planning and transparent material standards.
            </p>
          </div>
          <div className="space-y-4 font-sans text-xs">
            <h5 className="font-mono uppercase text-amber-200 tracking-wider text-[10px] font-bold">DESIGN HUBS</h5>
            <ul className="space-y-2.5 text-gray-300 font-light">
              <li>Sector 150, Noida Headquarters, UP</li>
              <li>DLF Phase 3, Gurgaon Catalyst, HR</li>
              <li>Koregaon Park, Pune Annex, MH</li>
              <li>Koramangala 4th Block, Bangalore, KA</li>
            </ul>
          </div>
          <div className="space-y-4 font-sans text-xs">
            <h5 className="font-mono uppercase text-amber-200 tracking-wider text-[10px] font-bold">OUR SPECIALTIES</h5>
            <ul className="space-y-2 text-gray-300 font-light cursor-pointer">
              <li className="hover:text-amber-200" onClick={() => { setSelectedStyle("Contemporary Flat Modular Layout"); setActiveTab("booking"); }}>Premium Modular Kitchens</li>
              <li className="hover:text-amber-200" onClick={() => { setSelectedStyle("Luxury Bedroom Concept"); setActiveTab("booking"); }}>Bespoke Wardrobes & Storage</li>
              <li className="hover:text-amber-200" onClick={() => { setSelectedStyle("Minimalist Living Room System"); setActiveTab("booking"); }}>Gypsum False Ceilings & Lighting</li>
              <li className="hover:text-amber-200" onClick={() => { setSelectedStyle("Japandi Concept Mapping"); setActiveTab("ai-assistant"); }}>Scientific Space Circulation Analysis</li>
            </ul>
          </div>
          <div className="space-y-4 font-sans text-xs">
            <h5 className="font-mono uppercase text-amber-200 tracking-wider text-[10px] font-bold">STUDIO CONTACTS</h5>
            <ul className="space-y-2.5 text-gray-300 font-light">
              <li className="flex items-center space-x-1.5">
                <Phone className="h-3.5 w-3.5 text-amber-200 shrink-0" />
                <span>+91 98112 34567</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Mail className="h-3.5 w-3.5 text-amber-200 shrink-0" />
                <span>hello@moonlooks.co.in</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <MapPin className="h-3.5 w-3.5 text-amber-200 shrink-0" />
                <span>Greater Noida Extension, UP, India</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-[9.5px] text-gray-300/60 font-mono tracking-wider relative z-10">
          <span>© 2026 MOON LOOKS STUDIO. COUNCIL REGISTERED DESIGN FIRM.</span>
          <span>DEVELOPED FOR AUTHENTIC HOMEOWNERS • SECURE WORKSPACE CONTRACTED</span>
        </div>
      </footer>

      {/* FLOATING ACTION DIRECT WHATSAPP CHAT DISPATCH */}
      <WhatsAppFab />

    </div>
  );
}
