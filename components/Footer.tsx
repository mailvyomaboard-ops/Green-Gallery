"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Sprout, Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

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
    <footer className="bg-[#11241a] text-white pt-16 pb-12 border-t border-green-900/40">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Operational Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-amber-400/40 bg-[#08150E] shadow-md shrink-0 p-0.5">
                <Image
                  src="/images/emblem.jpg"
                  alt="GreenGallery Emblem"
                  fill
                  className="object-cover rounded-full"
                  sizes="48px"
                />
              </div>
              <div>
                <h3 className="font-display text-2xl font-extrabold text-white tracking-tight leading-tight">GreenGallery</h3>
                <span className="text-[10px] uppercase tracking-widest text-amber-300 font-medium block">
                  Cultivating Natural Elegance
                </span>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed font-light">
              Landscape design, execution, plantation, and garden care services across Pune and Western Maharashtra.
            </p>
            <div className="text-xs text-green-300/90 pt-2 space-y-1.5 font-sans">
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                <span>Operational Staging Depot: Alandi, Pune</span>
              </p>
              <p className="text-white/60 text-[11px] pl-5">
                (Upcoming nursery facility along Old Mumbai–Pune Highway currently in development)
              </p>
            </div>
          </div>

          {/* Column 2: Core Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-green-400">Services</h4>
            <ul className="space-y-2 text-sm text-white/80 font-light">
              <li>
                <Link href="/services/commercial-landscaping" className="hover:text-green-300 transition-colors">Commercial Landscaping</Link>
              </li>
              <li>
                <Link href="/services/real-estate-developer-landscaping" className="hover:text-green-300 transition-colors">Real Estate & Podiums</Link>
              </li>
              <li>
                <Link href="/services/residential-landscaping" className="hover:text-green-300 transition-colors">Residential & Villa Gardens</Link>
              </li>
              <li>
                <Link href="/services/balcony-terrace-gardens" className="hover:text-green-300 transition-colors">Balcony & Terrace Gardens</Link>
              </li>
              <li>
                <Link href="/services/living-walls-vertical-gardens" className="hover:text-green-300 transition-colors">Living Walls & Vertical Gardens</Link>
              </li>
              <li>
                <Link href="/maintenance" className="hover:text-green-300 transition-colors">Garden Maintenance Packages</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Navigation & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-green-400">Navigation & Policies</h4>
            <ul className="space-y-2 text-sm text-white/80 font-light">
              <li>
                <Link href="/architecture" className="hover:text-green-300 transition-colors font-medium text-amber-200">Architecture & Design</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-green-300 transition-colors">All Services</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-green-300 transition-colors">Project Portfolio</Link>
              </li>
              <li>
                <Link href="/plants" className="hover:text-green-300 transition-colors">Plant Supply Catalogue</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-green-300 transition-colors">About GreenGallery</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-green-300 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-green-300 transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Consultations */}
          <div className="space-y-3 text-sm text-white/80 font-light">
            <h4 className="text-xs font-bold uppercase tracking-widest text-green-400">Get in Touch</h4>
            <p className="text-xs text-white/70">
              Consultations and on-site visits across PMC and PCMC by prior appointment.
            </p>
            <div className="pt-2 space-y-2.5 text-xs">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-green-400 shrink-0" />
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="hover:text-white font-medium"
                >
                  {siteConfig.contact.phoneDisplay}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-green-400 shrink-0" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-white font-medium"
                >
                  {siteConfig.contact.email}
                </a>
              </p>
            </div>
            <div className="pt-3 flex flex-wrap gap-2">
              <a
                href={siteConfig.social.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-green-700 hover:bg-green-600 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <span>WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={siteConfig.social.instagram || "https://www.instagram.com/greengallery_landscaping/"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-95 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Instagram</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Discreet 5-tap stealth access on copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p onClick={handleSecretTap} className="cursor-default select-none" title="GreenGallery Pune">
            © {new Date().getFullYear()} GreenGallery. All rights reserved. Landscaping Services in Pune.
          </p>
          <p className="text-right">Serving Real Estate Developers, Commercial Properties, and Residential Estates.</p>
        </div>
      </div>
    </footer>
  );
}
