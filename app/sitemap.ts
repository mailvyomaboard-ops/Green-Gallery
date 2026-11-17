import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { initialProjects, initialProducts } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/gallery",
    "/store",
    "/contact",
    "/policies/delivery",
    "/policies/returns",
    "/policies/plant-care",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const projectRoutes = initialProjects.map((p) => ({
    url: `${siteConfig.url}/gallery/${p.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const productRoutes = initialProducts.map((prod) => ({
    url: `${siteConfig.url}/store/${prod.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...routes, ...projectRoutes, ...productRoutes];
}
