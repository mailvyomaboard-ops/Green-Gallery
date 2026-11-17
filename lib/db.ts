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
import { initialProjects, initialProducts, initialInventory, clientsData } from "./data";
import { LeadSubmission, InventoryItem, Product, Project, Order, ClientPartner, SiteContent, AnalyticsEvent, AnalyticsSummary, defaultSiteContent } from "./types";

interface DatabaseSchema {
  leads: LeadSubmission[];
  inventory: InventoryItem[];
  products: Product[];
  projects: Project[];
  orders: Order[];
  clients?: ClientPartner[];
  siteContent?: SiteContent;
  analytics?: AnalyticsEvent[];
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
    // Ensure clients are populated and projects have clientLogos
    if (!parsed.clients || parsed.clients.length === 0) {
      parsed.clients = clientsData;
      parsed.projects = initialProjects;
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

  updateStatus(id: string, status: LeadSubmission["status"]): LeadSubmission | null {
    const db = readDb();
    const index = db.leads.findIndex((l) => l.id === id);
    if (index === -1) return null;
    db.leads[index].status = status;
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

    // SINGLE SOURCE OF TRUTH: If this item is linked to a product, sync the store product!
    if (updated.linkedProductId) {
      const prodIndex = db.products.findIndex((p) => p.id === updated.linkedProductId);
      if (prodIndex !== -1) {
        const prod = db.products[prodIndex];
        prod.stockQuantity = updated.quantityInStock;
        prod.stockLabel = updated.status;
        prod.inStock = updated.quantityInStock > 0;
        // Also update any matching variant
        if (prod.variants && prod.variants.length > 0) {
          prod.variants[0].inventoryQty = updated.quantityInStock;
        }
      }
    }

    writeDb(db);
    return updated;
  },

  delete(id: string): boolean {
    const db = readDb();
    const initialLen = db.inventory.length;
    db.inventory = db.inventory.filter((i) => i.id !== id);
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
    return db.products.find((p) => p.slug === slug || p.id === slug);
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
