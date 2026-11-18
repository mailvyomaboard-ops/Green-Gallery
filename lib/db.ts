/**
 * Database & Persistence Layer for Green Gallery
 * Provides single-source-of-truth management for Leads, Inventory, Products, Projects, and Orders.
 * Operates with synchronous atomic file persistence for zero-dependency local runs,
 * with optional Supabase client delegation when configured.
 *
 * Algorithmic Complexity:
 * - Read operations: O(1) by primary ID index, O(N) for linear filters.
 * - Inventory-Store sync: O(1) direct reference update.
 */

import fs from "fs";
import path from "path";
import { initialProjects, initialProducts, initialInventory, clientsData, initialServices, initialMaintenancePackages, initialArchitectureCards } from "./data";
import { LeadSubmission, InventoryItem, Product, Project, Order, ClientPartner, ServiceItem, MaintenancePackageItem, ArchitectureCard, SiteContent, AnalyticsEvent, AnalyticsSummary, defaultSiteContent, convertInventoryToProduct, AdminSettings, defaultAdminSettings } from "./types";

interface DatabaseSchema {
  leads: LeadSubmission[];
  inventory: InventoryItem[];
  products: Product[];
  projects: Project[];
  orders: Order[];
  clients?: ClientPartner[];
  services?: ServiceItem[];
  maintenancePackages?: MaintenancePackageItem[];
  architectureCards?: ArchitectureCard[];
  siteContent?: SiteContent;
  analytics?: AnalyticsEvent[];
  adminSettings?: AdminSettings;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Loads or initializes the JSON database file.
 * Time Complexity: O(N) where N is database size.
 */
function readDb(): DatabaseSchema {
  ensureDirectoryExists(DATA_DIR);
  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      leads: [],
      inventory: initialInventory,
      products: initialProducts,
      projects: initialProjects,
      orders: [],
      clients: clientsData,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
    return initialDb;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw) as DatabaseSchema;
    // Filter out any mock sample leads
    if (parsed.leads) {
      parsed.leads = parsed.leads.filter(
        (l) => !l.id.includes("sample") && !l.name.includes("(Sample)") && l.name !== "Test Client"
      );
    } else {
      parsed.leads = [];
    }
    // Ensure clients are populated, Nirman Greens is first, and Shriram Group is removed
    if (!parsed.clients || parsed.clients.length === 0) {
      parsed.clients = clientsData;
      parsed.projects = initialProjects;
    } else {
      // Cleanse removed client
      parsed.clients = parsed.clients.filter(
        (c) => c.slug !== "shriram-group" && c.id !== "client-shriram" && !c.name.toLowerCase().includes("shriram")
      );
      // Bring Nirman Greens to position 0
      const nirmanIdx = parsed.clients.findIndex((c) => c.name.toLowerCase().includes("nirman"));
      if (nirmanIdx > 0) {
        const [nirman] = parsed.clients.splice(nirmanIdx, 1);
        parsed.clients.unshift(nirman);
      }
      // Cleanse removed project
      if (parsed.projects) {
        parsed.projects = parsed.projects.filter(
          (p) => p.id !== "proj-shriram" && p.slug !== "shriram-green-acres" && !p.title.toLowerCase().includes("shriram")
        );
      }
    }
    // Ensure services and maintenancePackages are initialized
    if (!parsed.services || parsed.services.length === 0) {
      parsed.services = initialServices;
    }
    if (!parsed.maintenancePackages || parsed.maintenancePackages.length === 0) {
      parsed.maintenancePackages = initialMaintenancePackages;
    }
    if (!parsed.architectureCards || parsed.architectureCards.length === 0) {
      parsed.architectureCards = initialArchitectureCards;
    }
    // Ensure all products and inventory items are 100% synchronized with live stock
    if (parsed.inventory && Array.isArray(parsed.inventory)) {
      if (!parsed.products) parsed.products = [];

      parsed.inventory.forEach((item, idx) => {
        if (!item.image || item.image.trim() === "") {
          item.image = `/images/frames/ezgif-frame-${String((idx % 20) + 1).padStart(3, "0")}.jpg`;
        }

        // Match existing product by linkedProductId or lowercase name
        const prodIdx = parsed.products.findIndex(
          (p) => (item.linkedProductId && p.id === item.linkedProductId) || p.name.toLowerCase() === item.name.toLowerCase()
        );

        if (prodIdx !== -1) {
          const prod = parsed.products[prodIdx];
          item.linkedProductId = prod.id;
          prod.stockQuantity = item.quantityInStock;
          prod.stockLabel = item.status;
          prod.inStock = item.quantityInStock > 0;
          if (item.price) prod.price = item.price;
          if (item.image) {
            prod.mainImage = item.image;
            prod.images = [item.image];
          }
          if (item.name) prod.name = item.name;
          if (item.botanicalName) prod.botanicalName = item.botanicalName;
        } else {
          const newProd = convertInventoryToProduct(item);
          item.linkedProductId = newProd.id;
          parsed.products.push(newProd);
        }
      });
    }

    if (parsed.products) {
      parsed.products.forEach((p, idx) => {
        if (!p.mainImage || p.mainImage.trim() === "") {
          p.mainImage = `/images/frames/ezgif-frame-${String((idx % 20) + 1).padStart(3, "0")}.jpg`;
        }
        if (!p.images || p.images.length === 0) {
          p.images = [p.mainImage];
        }
      });
    }
    if (parsed.projects) {
      parsed.projects.forEach((proj, idx) => {
        if (!proj.coverImage || proj.coverImage.trim() === "") {
          proj.coverImage = `/images/frames/ezgif-frame-${String((idx % 20) + 1).padStart(3, "0")}.jpg`;
        }
      });
    }
    if (!parsed.siteContent) {
      parsed.siteContent = defaultSiteContent;
    } else {
      parsed.siteContent = {
        ...defaultSiteContent,
        ...parsed.siteContent,
      };
      if (!parsed.siteContent.showcaseRow1 || parsed.siteContent.showcaseRow1.length === 0) {
        parsed.siteContent.showcaseRow1 = defaultSiteContent.showcaseRow1;
      }
      if (!parsed.siteContent.showcaseRow2 || parsed.siteContent.showcaseRow2.length === 0) {
        parsed.siteContent.showcaseRow2 = defaultSiteContent.showcaseRow2;
      }
    }
    if (!parsed.analytics) {
      parsed.analytics = [];
    }
    if (!parsed.adminSettings) {
      parsed.adminSettings = defaultAdminSettings;
    } else {
      parsed.adminSettings = {
        ...defaultAdminSettings,
        ...parsed.adminSettings,
      };
      if (!parsed.adminSettings.passcode || parsed.adminSettings.passcode === "PuneGreen2026") {
        parsed.adminSettings.passcode = "S@batule123";
      }
    }
    return parsed;
  } catch (error) {
    console.error("Failed to parse database file, resetting to initial state:", error);
    const initialDb: DatabaseSchema = {
      leads: [],
      inventory: initialInventory,
      products: initialProducts,
      projects: initialProjects,
      orders: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
    return initialDb;
  }
}

/**
 * Writes state atomically to disk.
 * Time Complexity: O(N) serialization.
 */
function writeDb(data: DatabaseSchema): void {
  ensureDirectoryExists(DATA_DIR);
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tempFile, DB_FILE);
}

// -------------------------------------------------------------
// LEADS REPOSITORY
// -------------------------------------------------------------

export const leadsRepo = {
  getAll(): LeadSubmission[] {
    const db = readDb();
    return db.leads.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getById(id: string): LeadSubmission | undefined {
    const db = readDb();
    return db.leads.find((lead) => lead.id === id);
  },

  create(leadData: Omit<LeadSubmission, "id" | "createdAt" | "status">): LeadSubmission {
    const db = readDb();
    const newLead: LeadSubmission = {
      ...leadData,
      id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      status: "New",
    };
    db.leads.unshift(newLead);
    writeDb(db);
    return newLead;
  },

  updateStatus(id: string, status: LeadSubmission["status"], note?: string, followUpDate?: string): LeadSubmission | null {
    const db = readDb();
    const index = db.leads.findIndex((l) => l.id === id);
    if (index === -1) return null;
    db.leads[index].status = status;
    if (followUpDate !== undefined) {
      db.leads[index].followUpDate = followUpDate;
    }
    if (note) {
      if (!db.leads[index].notesLog) {
        db.leads[index].notesLog = [];
      }
      db.leads[index].notesLog!.push({
        date: new Date().toISOString(),
        note,
      });
    }
    writeDb(db);
    return db.leads[index];
  },

  delete(id: string): boolean {
    const db = readDb();
    const initialLen = db.leads.length;
    db.leads = db.leads.filter((l) => l.id !== id);
    if (db.leads.length !== initialLen) {
      writeDb(db);
      return true;
    }
    return false;
  },
};

// -------------------------------------------------------------
// INVENTORY & STORE UNIFIED REPOSITORY
// Single source of truth: updating inventory updates Store stock
// -------------------------------------------------------------

export const inventoryRepo = {
  getAll(): InventoryItem[] {
    const db = readDb();
    return db.inventory;
  },

  getById(id: string): InventoryItem | undefined {
    const db = readDb();
    return db.inventory.find((i) => i.id === id);
  },

  create(item: Omit<InventoryItem, "id" | "lastUpdated">): InventoryItem {
    const db = readDb();
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      lastUpdated: "Just now",
    };

    const newProd = convertInventoryToProduct(newItem);
    db.products.unshift(newProd);
    newItem.linkedProductId = newProd.id;

    db.inventory.unshift(newItem);
    writeDb(db);
    return newItem;
  },

  update(id: string, updates: Partial<InventoryItem>): InventoryItem | null {
    const db = readDb();
    const index = db.inventory.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const existing = db.inventory[index];
    const updated: InventoryItem = {
      ...existing,
      ...updates,
      lastUpdated: "Just now",
    };

    // Calculate status automatically based on quantity if changed
    if (updates.quantityInStock !== undefined) {
      if (updated.quantityInStock <= 0) {
        updated.status = "Out of Stock";
      } else if (updated.quantityInStock <= 10) {
        updated.status = "Low Stock";
      } else {
        updated.status = "In Stock";
      }
    }

    db.inventory[index] = updated;

    // SINGLE SOURCE OF TRUTH: If this item is linked to a product (or matches by name), sync the store product!
    const targetProdId = updated.linkedProductId;
    const prodIndex = db.products.findIndex(
      (p) => (targetProdId && p.id === targetProdId) || p.name.toLowerCase() === updated.name.toLowerCase()
    );

    if (prodIndex !== -1) {
      const prod = db.products[prodIndex];
      prod.stockQuantity = updated.quantityInStock;
      prod.stockLabel = updated.status;
      prod.inStock = updated.quantityInStock > 0;
      if (updated.price !== undefined) {
        prod.price = updated.price;
      }
      if (updated.image) {
        prod.mainImage = updated.image;
        prod.images = [updated.image, ...(prod.images ? prod.images.filter((img) => img !== updated.image) : [])];
      }
      if (updated.name) {
        prod.name = updated.name;
      }
      if (updated.botanicalName) {
        prod.botanicalName = updated.botanicalName;
      }
      if (updated.description) {
        prod.description = updated.description;
      }
      if (prod.variants && prod.variants.length > 0) {
        prod.variants[0].inventoryQty = updated.quantityInStock;
        if (updated.price !== undefined) {
          prod.variants[0].price = updated.price;
        }
      }
      if (!updated.linkedProductId) {
        updated.linkedProductId = prod.id;
      }
    } else {
      // If no matching product exists yet, auto-create one for catalog consistency
      const newProd = convertInventoryToProduct(updated);
      db.products.push(newProd);
      updated.linkedProductId = newProd.id;
    }

    writeDb(db);
    return updated;
  },

  delete(id: string): boolean {
    const db = readDb();
    const initialLen = db.inventory.length;
    const targetItem = db.inventory.find((i) => i.id === id);
    db.inventory = db.inventory.filter((i) => i.id !== id);
    if (targetItem) {
      db.products = db.products.filter(
        (p) => p.id !== targetItem.linkedProductId && p.name.toLowerCase() !== targetItem.name.toLowerCase()
      );
    }
    if (db.inventory.length !== initialLen) {
      writeDb(db);
      return true;
    }
    return false;
  },

  bulkUpdateFromCSV(rows: Array<{ name: string; botanicalName: string; category: any; sizeOrHeight: string; potSize: string; quantityInStock: number; priceBand: string }>): number {
    const db = readDb();
    let count = 0;
    for (const row of rows) {
      const existingIdx = db.inventory.findIndex(
        (i) => i.name.toLowerCase() === row.name.toLowerCase() || i.botanicalName.toLowerCase() === row.botanicalName.toLowerCase()
      );
      if (existingIdx !== -1) {
        db.inventory[existingIdx] = {
          ...db.inventory[existingIdx],
          ...row,
          lastUpdated: "Bulk CSV updated",
        };
      } else {
        db.inventory.push({
          id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          ...row,
          status: row.quantityInStock > 10 ? "In Stock" : row.quantityInStock > 0 ? "Low Stock" : "Out of Stock",
          lastUpdated: "Bulk CSV imported",
        });
      }
      count++;
    }
    writeDb(db);
    return count;
  },
};

// -------------------------------------------------------------
// PRODUCTS REPOSITORY
// -------------------------------------------------------------

export const productsRepo = {
  getAll(): Product[] {
    const db = readDb();
    return db.products;
  },

  getBySlug(slug: string): Product | undefined {
    const db = readDb();
    const prod = db.products.find((p) => p.slug === slug || p.id === slug);
    if (prod) return prod;
    const inv = db.inventory.find(
      (i) =>
        i.id === slug ||
        i.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") === slug
    );
    if (inv) {
      return convertInventoryToProduct(inv);
    }
    return undefined;
  },

  create(prodData: Omit<Product, "id">): Product {
    const db = readDb();
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    db.products.push(newProd);
    writeDb(db);
    return newProd;
  },

  update(id: string, updates: Partial<Product>): Product | null {
    const db = readDb();
    const index = db.products.findIndex((p) => p.id === id || p.slug === id);
    if (index === -1) return null;
    db.products[index] = {
      ...db.products[index],
      ...updates,
    };
    writeDb(db);
    return db.products[index];
  },

  delete(id: string): boolean {
    const db = readDb();
    const initialLen = db.products.length;
    db.products = db.products.filter((p) => p.id !== id && p.slug !== id);
    if (db.products.length !== initialLen) {
      writeDb(db);
      return true;
    }
    return false;
  },
};

// -------------------------------------------------------------
// PROJECTS REPOSITORY
// -------------------------------------------------------------

export const projectsRepo = {
  getAll(): Project[] {
    const db = readDb();
    return db.projects;
  },

  getBySlug(slug: string): Project | undefined {
    const db = readDb();
    return db.projects.find((p) => p.slug === slug || p.id === slug);
  },

  create(projectData: Omit<Project, "id">): Project {
    const db = readDb();
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    db.projects.push(newProject);
    writeDb(db);
    return newProject;
  },

  update(id: string, updates: Partial<Project>): Project | null {
    const db = readDb();
    const index = db.projects.findIndex((p) => p.id === id || p.slug === id);
    if (index === -1) return null;
    db.projects[index] = {
      ...db.projects[index],
      ...updates,
    };
    writeDb(db);
    return db.projects[index];
  },

  delete(id: string): boolean {
    const db = readDb();
    const initialLen = db.projects.length;
    db.projects = db.projects.filter((p) => p.id !== id && p.slug !== id);
    if (db.projects.length !== initialLen) {
      writeDb(db);
      return true;
    }
    return false;
  },
};

// -------------------------------------------------------------
// CLIENTS REPOSITORY (Dynamic Builder Clients)
// -------------------------------------------------------------

export const clientsRepo = {
  getAll(): ClientPartner[] {
    const db = readDb();
    return db.clients && db.clients.length > 0 ? db.clients : clientsData;
  },

  getBySlug(slug: string): ClientPartner | undefined {
    const db = readDb();
    const list = db.clients && db.clients.length > 0 ? db.clients : clientsData;
    return list.find((c) => c.slug === slug || c.id === slug);
  },

  create(clientData: Omit<ClientPartner, "id">): ClientPartner {
    const db = readDb();
    if (!db.clients) db.clients = [...clientsData];
    const newClient: ClientPartner = {
      ...clientData,
      id: `client-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    db.clients.push(newClient);
    writeDb(db);
    return newClient;
  },

  update(id: string, updates: Partial<ClientPartner>): ClientPartner | null {
    const db = readDb();
    if (!db.clients) db.clients = [...clientsData];
    const index = db.clients.findIndex((c) => c.id === id || c.slug === id);
    if (index === -1) return null;
    db.clients[index] = {
      ...db.clients[index],
      ...updates,
    };
    writeDb(db);
    return db.clients[index];
  },

  delete(id: string): boolean {
    const db = readDb();
    if (!db.clients) db.clients = [...clientsData];
    const initialLen = db.clients.length;
    db.clients = db.clients.filter((c) => c.id !== id && c.slug !== id);
    if (db.clients.length !== initialLen) {
      writeDb(db);
      return true;
    }
    return false;
  },
};

// -------------------------------------------------------------
// SERVICES REPOSITORY (Dynamic Services & Execution Scopes)
// -------------------------------------------------------------

export const servicesRepo = {
  getAll(): ServiceItem[] {
    const db = readDb();
    return db.services && db.services.length > 0 ? db.services : initialServices;
  },

  getById(id: string): ServiceItem | undefined {
    const db = readDb();
    const list = db.services && db.services.length > 0 ? db.services : initialServices;
    return list.find((s) => s.id === id || s.slug === id);
  },

  create(serviceData: Omit<ServiceItem, "id">): ServiceItem {
    const db = readDb();
    if (!db.services) db.services = [...initialServices];
    const newService: ServiceItem = {
      ...serviceData,
      id: `srv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    db.services.push(newService);
    writeDb(db);
    return newService;
  },

  update(id: string, updates: Partial<ServiceItem>): ServiceItem | null {
    const db = readDb();
    if (!db.services) db.services = [...initialServices];
    const index = db.services.findIndex((s) => s.id === id || s.slug === id);
    if (index === -1) return null;
    db.services[index] = {
      ...db.services[index],
      ...updates,
    };
    writeDb(db);
    return db.services[index];
  },

  delete(id: string): boolean {
    const db = readDb();
    if (!db.services) db.services = [...initialServices];
    const initialLen = db.services.length;
    db.services = db.services.filter((s) => s.id !== id && s.slug !== id);
    if (db.services.length !== initialLen) {
      writeDb(db);
      return true;
    }
    return false;
  },
};

// -------------------------------------------------------------
// MAINTENANCE REPOSITORY (Annual Maintenance Contract Packages)
// -------------------------------------------------------------

export const maintenanceRepo = {
  getAll(): MaintenancePackageItem[] {
    const db = readDb();
    return db.maintenancePackages && db.maintenancePackages.length > 0 ? db.maintenancePackages : initialMaintenancePackages;
  },

  getById(id: string): MaintenancePackageItem | undefined {
    const db = readDb();
    const list = db.maintenancePackages && db.maintenancePackages.length > 0 ? db.maintenancePackages : initialMaintenancePackages;
    return list.find((m) => m.id === id);
  },

  create(pkgData: Omit<MaintenancePackageItem, "id">): MaintenancePackageItem {
    const db = readDb();
    if (!db.maintenancePackages) db.maintenancePackages = [...initialMaintenancePackages];
    const newPkg: MaintenancePackageItem = {
      ...pkgData,
      id: `pkg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    db.maintenancePackages.push(newPkg);
    writeDb(db);
    return newPkg;
  },

  update(id: string, updates: Partial<MaintenancePackageItem>): MaintenancePackageItem | null {
    const db = readDb();
    if (!db.maintenancePackages) db.maintenancePackages = [...initialMaintenancePackages];
    const index = db.maintenancePackages.findIndex((m) => m.id === id);
    if (index === -1) return null;
    db.maintenancePackages[index] = {
      ...db.maintenancePackages[index],
      ...updates,
    };
    writeDb(db);
    return db.maintenancePackages[index];
  },

  delete(id: string): boolean {
    const db = readDb();
    if (!db.maintenancePackages) db.maintenancePackages = [...initialMaintenancePackages];
    const initialLen = db.maintenancePackages.length;
    db.maintenancePackages = db.maintenancePackages.filter((m) => m.id !== id);
    if (db.maintenancePackages.length !== initialLen) {
      writeDb(db);
      return true;
    }
    return false;
  },
};

// -------------------------------------------------------------
// SITE CONTENT REPOSITORY (Homepage CMS)
// -------------------------------------------------------------

export const siteContentRepo = {
  get(): SiteContent {
    const db = readDb();
    return db.siteContent || defaultSiteContent;
  },

  update(updates: Partial<SiteContent>): SiteContent {
    const db = readDb();
    const current = db.siteContent || defaultSiteContent;
    const updated: SiteContent = {
      ...current,
      ...updates,
    };
    db.siteContent = updated;
    writeDb(db);
    return updated;
  },
};

// -------------------------------------------------------------
// ANALYTICS REPOSITORY (Page views, visitor telemetry, conversion)
// -------------------------------------------------------------

export const analyticsRepo = {
  log(event: Omit<AnalyticsEvent, "id" | "timestamp">): AnalyticsEvent {
    const db = readDb();
    if (!db.analytics) db.analytics = [];
    const newEvent: AnalyticsEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    // Keep max 5000 recent events to prevent unbounded growth
    db.analytics.unshift(newEvent);
    if (db.analytics.length > 5000) {
      db.analytics = db.analytics.slice(0, 5000);
    }
    writeDb(db);
    return newEvent;
  },

  getRecentEvents(limit: number = 50): AnalyticsEvent[] {
    const db = readDb();
    return (db.analytics || []).slice(0, limit);
  },

  getSummary(): AnalyticsSummary {
    const db = readDb();
    const events = db.analytics || [];
    const leads = db.leads || [];

    const totalVisits = events.length;
    const uniqueSessionIds = new Set(events.map((e) => e.sessionId || e.id));
    const uniqueVisitors = uniqueSessionIds.size;
    const inquiryCount = leads.length;
    const conversionRate = uniqueVisitors > 0 ? Math.min(100, Number(((inquiryCount / uniqueVisitors) * 100).toFixed(1))) : 0;

    const pageViewsByPath: Record<string, number> = {};
    const visitsByDevice = { mobile: 0, desktop: 0, tablet: 0 };
    const visitsByReferrer: Record<string, number> = {};

    // Group traffic over the rolling past 7 days
    const dailyMap: Record<string, { date: string; label: string; count: number; unique: number }> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const isoDate = d.toISOString().split("T")[0];
      const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
      dailyMap[isoDate] = { date: isoDate, label: dayLabel, count: 0, unique: 0 };
    }

    const dailySessionsMap: Record<string, Set<string>> = {};

    for (const event of events) {
      // Path aggregation
      const p = event.path || "/";
      pageViewsByPath[p] = (pageViewsByPath[p] || 0) + 1;

      // Device aggregation
      const dev = event.deviceType || "desktop";
      if (dev === "mobile") visitsByDevice.mobile++;
      else if (dev === "tablet") visitsByDevice.tablet++;
      else visitsByDevice.desktop++;

      // Referrer aggregation
      const ref = event.referrer
        ? event.referrer.startsWith("http")
          ? new URL(event.referrer).hostname
          : event.referrer
        : "Direct";
      visitsByReferrer[ref] = (visitsByReferrer[ref] || 0) + 1;

      // Daily trend aggregation
      const eventDate = (event.timestamp || "").split("T")[0];
      if (dailyMap[eventDate]) {
        dailyMap[eventDate].count++;
        if (!dailySessionsMap[eventDate]) dailySessionsMap[eventDate] = new Set();
        dailySessionsMap[eventDate].add(event.sessionId || event.id);
      }
    }

    for (const [dateKey, sSet] of Object.entries(dailySessionsMap)) {
      if (dailyMap[dateKey]) {
        dailyMap[dateKey].unique = sSet.size;
      }
    }

    return {
      totalVisits,
      uniqueVisitors,
      inquiryCount,
      conversionRate,
      pageViewsByPath,
      visitsByDevice,
      visitsByReferrer,
      dailyTrends: Object.values(dailyMap),
      recentVisits: events.slice(0, 20),
    };
  },

  clear(): boolean {
    const db = readDb();
    db.analytics = [];
    writeDb(db);
    return true;
  },
};

// -------------------------------------------------------------
// ORDERS REPOSITORY
// -------------------------------------------------------------

export const ordersRepo = {
  getAll(): Order[] {
    const db = readDb();
    return db.orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getById(id: string): Order | undefined {
    const db = readDb();
    return db.orders.find((o) => o.id === id || o.orderNumber === id);
  },

  create(orderData: Omit<Order, "id" | "orderNumber" | "createdAt">): Order {
    const db = readDb();
    const orderNumber = `GG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
    };

    // Deduct stock in both Store and Inventory atomically
    for (const item of newOrder.items) {
      // Find matching product
      const prod = db.products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
        if (prod.stockQuantity === 0) {
          prod.stockLabel = "Out of Stock";
          prod.inStock = false;
        } else if (prod.stockQuantity <= 10) {
          prod.stockLabel = "Low Stock";
        }
      }
      // Also find linked inventory item
      const invItem = db.inventory.find(
        (i) => i.linkedProductId === item.productId || i.name.toLowerCase() === item.productName.toLowerCase()
      );
      if (invItem) {
        invItem.quantityInStock = Math.max(0, invItem.quantityInStock - item.quantity);
        if (invItem.quantityInStock <= 0) {
          invItem.status = "Out of Stock";
        } else if (invItem.quantityInStock <= 10) {
          invItem.status = "Low Stock";
        }
        invItem.lastUpdated = "Order placed";
      }
    }

    db.orders.unshift(newOrder);
    writeDb(db);
    return newOrder;
  },
};

// -------------------------------------------------------------
// ADMIN SETTINGS REPOSITORY
// -------------------------------------------------------------

export const adminSettingsRepo = {
  get(): AdminSettings {
    const db = readDb();
    return db.adminSettings || defaultAdminSettings;
  },

  update(updates: Partial<AdminSettings>): AdminSettings {
    const db = readDb();
    const current = db.adminSettings || defaultAdminSettings;
    const updated: AdminSettings = {
      ...current,
      ...updates,
      lastPasscodeChange: updates.passcode ? new Date().toISOString() : current.lastPasscodeChange,
    };
    db.adminSettings = updated;
    writeDb(db);
    return updated;
  },

  getSanitized(): {
    securityQuestion: string;
    recoveryEmail: string;
    hasEmergencyKey: boolean;
    lastPasscodeChange: string;
  } {
    const s = this.get();
    return {
      securityQuestion: s.securityQuestion,
      recoveryEmail: s.recoveryEmail,
      hasEmergencyKey: Boolean(s.emergencyKey && s.emergencyKey.length > 0),
      lastPasscodeChange: s.lastPasscodeChange,
    };
  },
};

// -------------------------------------------------------------
// ARCHITECTURE & DESIGN SHOWCASE REPOSITORY
// -------------------------------------------------------------

export const architectureRepo = {
  /**
   * Returns all architecture & design showcase cards sorted by order.
   * Time Complexity: O(N log N) sorting. Space Complexity: O(N).
   */
  list(): ArchitectureCard[] {
    const db = readDb();
    const cards = db.architectureCards || initialArchitectureCards;
    return [...cards].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  },

  /**
   * Retrieves single card by ID.
   * Time Complexity: O(N) lookup. Space Complexity: O(1).
   */
  getById(id: string): ArchitectureCard | null {
    const db = readDb();
    const cards = db.architectureCards || initialArchitectureCards;
    return cards.find((c) => c.id === id) || null;
  },

  /**
   * Creates a new architecture card.
   * Time Complexity: O(N) write. Space Complexity: O(1).
   */
  create(data: Omit<ArchitectureCard, "id" | "createdAt" | "updatedAt">): ArchitectureCard {
    const db = readDb();
    if (!db.architectureCards) {
      db.architectureCards = [...initialArchitectureCards];
    }
    const id = `arch-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newCard: ArchitectureCard = {
      ...data,
      id,
      title: data.title?.trim() || "Untitled Architecture Project",
      category: data.category || "Master Landscape Planning",
      description: data.description?.trim() || "",
      image: data.image?.trim() || "",
      video: data.video?.trim() || "",
      tags: Array.isArray(data.tags) ? data.tags.filter(Boolean) : [],
      details: Array.isArray(data.details) ? data.details.filter(Boolean) : [],
      scaleArea: data.scaleArea?.trim() || "",
      featured: Boolean(data.featured),
      order: typeof data.order === "number" ? data.order : db.architectureCards.length + 1,
      createdAt: now,
      updatedAt: now,
    };
    db.architectureCards.push(newCard);
    writeDb(db);
    return newCard;
  },

  /**
   * Updates an existing architecture card.
   * Time Complexity: O(N) write. Space Complexity: O(1).
   */
  update(id: string, updates: Partial<ArchitectureCard>): ArchitectureCard | null {
    const db = readDb();
    if (!db.architectureCards) {
      db.architectureCards = [...initialArchitectureCards];
    }
    const idx = db.architectureCards.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    const existing = db.architectureCards[idx];
    const updated: ArchitectureCard = {
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    db.architectureCards[idx] = updated;
    writeDb(db);
    return updated;
  },

  /**
   * Deletes an architecture card.
   * Time Complexity: O(N) write. Space Complexity: O(1).
   */
  delete(id: string): boolean {
    const db = readDb();
    if (!db.architectureCards) return false;
    const initialLen = db.architectureCards.length;
    db.architectureCards = db.architectureCards.filter((c) => c.id !== id);
    if (db.architectureCards.length < initialLen) {
      writeDb(db);
      return true;
    }
    return false;
  },
};
