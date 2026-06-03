import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, ShieldCheck, Sparkles } from "lucide-react";

export default function WhatsAppFab() {
  const [isHovered, setIsHovered] = useState(false);

  // Realistic premium Indian whatsapp consultation line (e.g., +91 98112 34567)
  const whatsAppNumber = "919811234567";
  const defaultText = encodeURIComponent(
    "Hi Moon Looks team, I would like to inquire about an interior design consultation or modular kitchen quote for my home."
  );
  const whatsAppLink = `https://wa.me/${whatsAppNumber}?text=${defaultText}`;

  return (
    <div 
      className="fixed bottom-16 xl:bottom-6 right-6 z-50 flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mr-3 bg-white text-gray-800 border border-gray-100 p-4 rounded-2xl shadow-xl flex flex-col pointer-events-none max-w-xs font-sans text-left"
          >
            <div className="flex items-center space-x-1.5 mb-1 bg-green-50 px-2 py-0.5 rounded-full w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-[9px] tracking-widest text-green-700 uppercase font-black">
                ONLINE CONSULTANT
              </span>
            </div>
            <p className="text-xs font-bold text-[#6B2737]">Chat via WhatsApp</p>
            <p className="text-[10px] text-gray-500 font-light mt-0.5 leading-relaxed">
              Connect in 1-click to estimate kitchen costs, bedroom layouts, or check studio catalog availability.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={whatsAppLink}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        className="h-14 w-14 rounded-full bg-[#6B2737] text-[#FFFAE1] flex items-center justify-center shadow-2xl border border-[#FFFAE1]/20 hover:bg-[#6B2737]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6B2737] focus:ring-offset-2 hover:shadow-emerald-950/20"
        aria-label="Direct WhatsApp inquiry dispatch line"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 flex items-center justify-center text-[8px] font-bold text-gray-950">
            !
          </span>
        </span>
        <MessageSquare className="h-6 w-6 stroke-[1.5]" />
      </motion.a>
    </div>
  );
}
