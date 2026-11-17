"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Sprout } from "lucide-react";

export function Footer() {
  const router = useRouter();
  const [tapCount, setTapCount] = useState(0);

  // Stealth desktop shortcut: Ctrl + Shift + A opens the private admin desk
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        router.push("/admin");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  // Stealth mobile/touch shortcut: Tap the copyright text 5 times rapidly
  const handleSecretTap = () => {
    const nextCount = tapCount + 1;
    setTapCount(nextCount);
    if (nextCount >= 5) {
      router.push("/admin");
      setTapCount(0);
    }
    setTimeout(() => setTapCount(0), 3000);
  };

  return (
    <footer className="bg-green-950 text-white pt-16 pb-12 border-t border-green-900/60">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                <Sprout className="w-4 h-4 text-green-200" />
              </div>
              <h3 className="font-display text-2xl font-extrabold text-white">green gallery</h3>
            </div>
            <p className="text-sm text-white/80 leading-relaxed font-light">
              Landscape architecture, structural podium planting, specimen nursery supply, and estate grounds care across Western Maharashtra.
            </p>
            <div className="text-xs text-green-300/80 pt-2 space-y-1 font-mono">
              <p>GSTIN: {siteConfig.contact.gstNumber}</p>
              <p>14-Acre Nursery Bays · Tathawade, Pune</p>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-green-400">Works & Studio</h4>
            <ul className="space-y-2 text-sm text-white/80 font-light">
              <li>
                <Link href="/" className="hover:text-green-300 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-green-300 transition-colors">Developer Collaborations</Link>
              </li>
              <li>
                <Link href="/store" className="hover:text-green-300 transition-colors">Nursery Specimen Store</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-green-300 transition-colors">Consultation Booking</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Nursery Policies & Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-green-400">Policies & Manuals</h4>
            <ul className="space-y-2 text-sm text-white/80 font-light">
              <li>
                <Link href="/policies/delivery" className="hover:text-green-300 transition-colors">Delivery & Transit Terms</Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-green-300 transition-colors">Replacement Assurance</Link>
              </li>
              <li>
                <Link href="/policies/plant-care" className="hover:text-green-300 transition-colors">Pune Climate Care Manual</Link>
              </li>
              <li>
                <a
                  href={siteConfig.contact.address.googleBusinessProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-300 transition-colors flex items-center gap-1.5"
                >
                  <span>Google Business Profile</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Operating Desk */}
          <div className="space-y-3 text-sm text-white/80 font-light">
            <h4 className="text-xs font-bold uppercase tracking-widest text-green-400">Founder Desk</h4>
            <p className="leading-relaxed">
              <strong className="font-semibold text-white">Shubham Batule</strong> (Founder)<br />
              {siteConfig.contact.address.line1}<br />
              {siteConfig.contact.address.line2}<br />
              {siteConfig.contact.address.city}, {siteConfig.contact.address.state}
            </p>
            <div className="pt-2 space-y-1 font-mono text-xs">
              <p>
                <span className="text-white/60">WhatsApp: </span>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white underline text-green-400 font-semibold"
                >
                  {siteConfig.contact.whatsappDisplay}
                </a>
              </p>
              <p>
                <span className="text-white/60">Email: </span>
                <a href={`mailto:${siteConfig.contact.salesEmail}`} className="hover:text-white underline">
                  {siteConfig.contact.salesEmail}
                </a>
              </p>
              <p>
                <span className="text-white/60">Hours: </span>
                <span>{siteConfig.contact.businessHours.weekdays}</span>
              </p>
            </div>
            <div className="pt-3 flex gap-3 text-white/80 text-xs">
              <a href={siteConfig.social.whatsappLink} target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-green-300 font-medium">
                WhatsApp Chat
              </a>
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20">
                Instagram
              </a>
              <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Discreet 5-tap stealth access on copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p onClick={handleSecretTap} className="cursor-default select-none" title="">
            © {new Date().getFullYear()} Green Gallery. All rights reserved. Landscaping Architecture & Specimen Nursery, Pune.
          </p>
          <p className="text-right">Designed for architects, builders, and estate owners.</p>
        </div>
      </div>
    </footer>
  );
}
