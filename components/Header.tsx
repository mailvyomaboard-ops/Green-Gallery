"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { useCart } from "@/lib/cart";
import { useTheme } from "@/components/ThemeProvider";
import { Sprout, ShoppingBag, Menu, X, ArrowUpRight, Sun, Moon } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { totalCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-3 z-50 px-4 sm:px-6 max-w-[1240px] mx-auto pointer-events-none mb-2">
      <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md border border-green-900/10 dark:border-white/10 rounded-full shadow-soft px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4 pointer-events-auto transition-all">
        {/* Brand Emblem Logo & Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-amber-500/30 dark:border-amber-400/40 bg-black shadow-md shrink-0 group-hover:scale-105 transition-all">
            <Image
              src="/images/logo.jpg"
              alt="GreenGallery Logo"
              fill
              className="object-cover scale-150 -translate-y-0.5"
              priority
              sizes="40px"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-green-950 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors leading-tight">
              GreenGallery
            </span>
            <span className="text-[9px] uppercase tracking-widest text-green-800/80 dark:text-amber-400/90 font-medium hidden sm:block -mt-0.5">
              Natural Elegance
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links — Pill Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-cream-50/80 dark:bg-black/30 p-1.5 rounded-full border border-green-900/10 dark:border-white/10">
          {siteConfig.navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-full transition-all ${
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
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Dark Mode Toggle Pill */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="w-10 h-10 rounded-full bg-cream-50 hover:bg-cream-100 dark:bg-white/10 dark:hover:bg-white/20 text-green-950 dark:text-green-300 border border-green-900/10 dark:border-white/20 flex items-center justify-center transition-all focus:outline-none cursor-pointer"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-green-950" />
            )}
          </button>

          {/* Cart Pill Icon */}
          <Link
            href="/store/cart"
            aria-label={`View Cart with ${totalCount} items`}
            className="relative w-10 h-10 rounded-full bg-cream-50 hover:bg-green-100 dark:bg-white/10 dark:hover:bg-white/20 text-green-950 dark:text-white border border-green-900/10 dark:border-white/10 flex items-center justify-center transition-colors focus:outline-none"
          >
            <ShoppingBag className="w-4 h-4 text-green-950 dark:text-white" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                {totalCount}
              </span>
            )}
          </Link>

          {/* Primary Action Button: Pill Button */}
          <Link
            href="/contact?type=consultation"
            className="min-h-[42px] px-5 sm:px-6 py-2 bg-green-950 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500 text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm whitespace-nowrap flex items-center gap-1.5 transition-all group"
          >
            <span>Book Consultation</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden w-10 h-10 rounded-full bg-cream-50 dark:bg-white/10 text-green-950 dark:text-white flex items-center justify-center border border-green-900/10 dark:border-white/10 hover:bg-cream-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 bg-white/95 dark:bg-black/95 backdrop-blur-md border border-green-900/10 dark:border-white/10 rounded-3xl p-6 shadow-xl animate-fadeIn pointer-events-auto">
          <nav className="flex flex-col space-y-3">
            {siteConfig.navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm uppercase tracking-wider font-semibold py-2.5 px-4 rounded-full transition-colors ${
                    isActive
                      ? "bg-green-950 dark:bg-green-700 text-cream-50"
                      : "text-ink-700 dark:text-white/80 hover:bg-cream-50 dark:hover:bg-white/10 hover:text-green-950 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-green-900/10 dark:border-white/10 flex items-center justify-between gap-3">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-cream-50 dark:bg-white/10 text-xs font-bold text-green-950 dark:text-white"
              >
                {theme === "dark" ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>

              <Link
                href="/contact?type=consultation"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 min-h-[44px] px-5 py-2.5 bg-green-950 dark:bg-green-600 text-white text-xs font-bold rounded-full shadow flex items-center justify-center gap-1.5"
              >
                <span>Book Consultation</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
