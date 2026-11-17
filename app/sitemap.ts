import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { initialProjects, initialProducts } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/services",
    "/projects",
    "/plants",
    "/maintenance",
    "/contact",
    "/privacy",
    "/terms",
    "/policies/delivery",
    "/policies/returns",
    "/policies/plant-care",
    "/gallery",
    "/store",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const serviceRoutes = siteConfig.services.map((s) => ({
    url: `${siteConfig.url}/services/${s.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const projectRoutes = initialProjects.map((p) => ({
    url: `${siteConfig.url}/projects/${p.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const productRoutes = initialProducts.map((prod) => ({
    url: `${siteConfig.url}/plants/${prod.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...routes, ...serviceRoutes, ...projectRoutes, ...productRoutes];
}
