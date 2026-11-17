"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

export function FloatingWhatsApp() {
  const pathname = usePathname();

  // Adapt message based on the current page route
  let message = siteConfig.contact.whatsappDefaultMessage;
  if (pathname.includes("/plants") || pathname.includes("/store")) {
    message = "Hello GreenGallery, I'm interested in plant supply and bulk procurement...";
  } else if (pathname.includes("/projects") || pathname.includes("/gallery")) {
    message = "Hello GreenGallery, I was reviewing your portfolio and would like to discuss a landscape project...";
  } else if (pathname.includes("/services")) {
    message = "Hello GreenGallery, I'm interested in your landscaping services...";
  } else if (pathname.includes("/maintenance")) {
    message = "Hello GreenGallery, I would like to enquire about garden maintenance packages...";
  }

  const encodedUrl = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <aside aria-label="WhatsApp quick contact">
      <a
        href={encodedUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with GreenGallery"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 cursor-pointer"
      >
        <svg
          className="w-8 h-8 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.031 2C6.5 2 2 6.484 2 12.008c0 1.954.563 3.782 1.536 5.334L2 22l4.82-1.499c1.488.88 3.218 1.385 5.211 1.385 5.531 0 10.031-4.484 10.031-10.008C22.062 6.484 17.562 2 12.031 2zm5.834 14.283c-.244.686-1.42 1.31-1.958 1.393-.509.078-1.157.112-3.714-.949-3.266-1.355-5.367-4.664-5.531-4.882-.158-.218-1.309-1.742-1.309-3.325 0-1.583.829-2.362 1.121-2.684.294-.323.642-.404.857-.404.214 0 .428.002.615.011.198.01.463-.075.725.556.269.646.917 2.235.998 2.398.081.163.136.353.027.57-.109.217-.163.353-.326.544-.163.19-.344.425-.49.57-.163.163-.333.34-.143.666.19.326.844 1.391 1.811 2.253 1.244 1.108 2.293 1.452 2.619 1.615.326.163.517.136.708-.082.19-.218.816-.952 1.034-1.278.217-.326.435-.272.734-.163.299.109 1.895.894 2.222 1.057.326.163.544.244.625.38.081.136.081.788-.163 1.474z" />
        </svg>
      </a>
    </aside>
  );
}
