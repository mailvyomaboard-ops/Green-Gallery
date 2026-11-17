import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { initialProducts } from "@/lib/data";
import { productsRepo } from "@/lib/db";
import { siteConfig } from "@/config/site";
import {
  ChevronRight,
  Sun,
  Droplets,
  Ruler,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Phone,
  MapPin
} from "lucide-react";
import PlantDetailClient from "./PlantDetailClient";

export const dynamicParams = true;

export function generateStaticParams() {
  const products = productsRepo.getAll();
  return products.map((prod) => ({
    slug: prod.slug,
  }));
}

export default async function PlantDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product =
    productsRepo.getBySlug(slug) ||
    initialProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-ink-500 dark:text-white/60">
        <Link href="/" className="hover:text-green-950 dark:hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/plants" className="hover:text-green-950 dark:hover:text-white">Plants</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-green-950 dark:text-white font-semibold truncate">{product.name}</span>
      </nav>

      {/* Main Product Layout with Client Interactions */}
      <PlantDetailClient product={product} />
    </div>
  );
}
