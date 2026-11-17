"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { useCart } from "@/lib/cart";
import { useTheme } from "@/components/ThemeProvider";
import { ShoppingBag, ArrowUpRight, Sun, Moon } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { totalCount } = useCart();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-2 sm:top-3 z-40 px-3 sm:px-6 max-w-[1240px] mx-auto pointer-events-none mb-2">
      <div className="bg-white/95 dark:bg-black/90 backdrop-blur-md border border-green-900/10 dark:border-white/10 rounded-full shadow-soft px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 pointer-events-auto transition-all">
        {/* Brand Emblem Logo & Wordmark */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group focus:outline-none shrink-0">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-amber-500/40 dark:border-amber-400/50 bg-[#08150E] shadow-sm shrink-0 group-hover:scale-105 transition-all p-0.5">
            <Image
              src="/images/logo.jpg"
              alt="GreenGallery Logo"
              fill
              className="object-contain"
              priority
              sizes="44px"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-green-950 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors leading-tight">
              GreenGallery
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-green-800/80 dark:text-amber-400/90 font-medium hidden xs:block -mt-0.5">
              Natural Elegance
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links — Pill Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-cream-50/80 dark:bg-black/40 p-1 rounded-full border border-green-900/10 dark:border-white/10">
          {siteConfig.navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs uppercase tracking-wider font-semibold px-3.5 py-1.5 rounded-full transition-all ${
                  isActive
                    ? "bg-green-950 dark:bg-green-700 text-cream-50 shadow-sm"
                    : "text-ink-700 dark:text-white/80 hover:text-green-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA, Dark Mode Toggle and Cart */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Dark Mode Toggle Pill */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-cream-50 hover:bg-cream-100 dark:bg-white/10 dark:hover:bg-white/20 text-green-950 dark:text-green-300 border border-green-900/10 dark:border-white/20 flex items-center justify-center transition-all focus:outline-none cursor-pointer"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-green-950" />
            )}
          </button>

          {/* Cart Pill Icon */}
          <Link
            href="/store/cart"
            aria-label={`View Cart with ${totalCount} items`}
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-cream-50 hover:bg-green-100 dark:bg-white/10 dark:hover:bg-white/20 text-green-950 dark:text-white border border-green-900/10 dark:border-white/10 flex items-center justify-center transition-colors focus:outline-none"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-green-950 dark:text-white" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                {totalCount}
              </span>
            )}
          </Link>

          {/* Primary Action Button: Contained and properly sized */}
          <Link
            href="/contact?type=consultation"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 bg-green-950 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500 text-white text-xs font-semibold rounded-full shadow-sm whitespace-nowrap transition-all group shrink-0"
          >
            <span>Book Consultation</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </header>
  );
}
