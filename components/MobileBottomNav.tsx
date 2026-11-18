"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Layers,
  Building2,
  Sprout,
  ShieldCheck,
  CalendarCheck,
} from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  // Don't render on the admin portal to keep the operations console clear
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Design", href: "/architecture", icon: Compass },
    { label: "Services", href: "/services", icon: Layers },
    { label: "Projects", href: "/projects", icon: Building2 },
    { label: "Plants", href: "/plants", icon: Sprout },
    { label: "Book", href: "/contact?type=consultation", icon: CalendarCheck, isSpecial: true },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-2.5 inset-x-2.5 xs:inset-x-4 z-50 lg:hidden pointer-events-auto"
    >
      <div className="bg-white/95 dark:bg-[#07130D]/95 backdrop-blur-xl border border-green-900/15 dark:border-emerald-500/25 rounded-full shadow-2xl p-1.5 flex items-center justify-around gap-1 max-w-md mx-auto transition-all">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href.split("?")[0]);

          if (item.isSpecial) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center px-3 py-1.5 rounded-full bg-green-950 dark:bg-green-600 text-white shadow-md active:scale-95 transition-transform shrink-0"
              >
                <item.icon className="w-4 h-4 text-emerald-300 dark:text-white" />
                <span className="text-[9px] font-bold tracking-tight uppercase mt-0.5">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all active:scale-95 ${
                isActive
                  ? "bg-green-100/90 dark:bg-white/15 text-green-950 dark:text-emerald-300 font-bold"
                  : "text-ink-600 dark:text-white/70 hover:text-green-950 dark:hover:text-white"
              }`}
            >
              <item.icon
                className={`w-4 h-4 transition-transform ${
                  isActive ? "scale-110 text-green-900 dark:text-emerald-300" : ""
                }`}
              />
              <span className="text-[9px] tracking-tight mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
