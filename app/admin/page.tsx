"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  BarChart3,
  Inbox,
  Sprout,
  Building2,
  Layout,
  RefreshCw,
  LogOut,
  Download,
  Search,
  Plus,
  Trash2,
  Edit3,
  MessageSquare,
  Smartphone,
  Monitor,
  Tablet,
  Activity,
  Calendar,
  MapPin,
  Mail,
  Phone,
  X,
  TrendingUp,
  Check,
  Shield,
  Layers,
} from "lucide-react";
import {
  LeadSubmission,
  InventoryItem,
  ClientPartner,
  SiteContent,
  AnalyticsSummary,
  AnalyticsEvent,
  defaultSiteContent,
} from "@/lib/types";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passError, setPassError] = useState("");

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<"analytics" | "leads" | "inventory" | "clients" | "cms">("analytics");

  // Telemetry & Analytics state
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [recentEvents, setRecentEvents] = useState<AnalyticsEvent[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

  // Leads state
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [leadSearch, setLeadSearch] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<LeadSubmission | null>(null);

  // Inventory state
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [invSearch, setInvSearch] = useState("");
  const [invCategoryFilter, setInvCategoryFilter] = useState("all");
  const [showAddPlantModal, setShowAddPlantModal] = useState(false);
  const [newPlant, setNewPlant] = useState({
    name: "",
    botanicalName: "",
    category: "Specimen Trees" as const,
    sizeOrHeight: "6 - 8 ft",
    potSize: "18-inch Bag",
    quantityInStock: 20,
    priceBand: "₹2,500 - ₹5,000",
  });

  // Builder Clients state
  const [clients, setClients] = useState<ClientPartner[]>([]);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientPartner | null>(null);
  const [clientForm, setClientForm] = useState({
    name: "",
    tagline: "",
    city: "Pune",
    logo: "/images/clients/silver-group.jpg",
    description: "",
  });

  // Homepage CMS state
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [cmsSaving, setCmsSaving] = useState(false);
  const [cmsNotice, setCmsNotice] = useState("");

  // Check session cookie on mount
  useEffect(() => {
    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.authenticated) {
          setIsAuthenticated(true);
          loadAllData();
        }
      })
      .catch(() => {});
  }, []);

  // Secure Server-Side Passcode Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        loadAllData();
      } else {
        setPassError(data.message || "Invalid administrative credentials.");
      }
    } catch {
      setPassError("Authentication server error. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setIsAuthenticated(false);
  };

  const loadAllData = async () => {
    setIsRefreshing(true);
    try {
      const [leadsRes, invRes, clientsRes, cmsRes, analyticsRes] = await Promise.all([
        fetch("/api/leads").then((r) => r.json()).catch(() => ({ leads: [] })),
        fetch("/api/inventory").then((r) => r.json()).catch(() => ({ items: [] })),
        fetch("/api/clients").then((r) => r.json()).catch(() => ({ clients: [] })),
        fetch("/api/cms").then((r) => r.json()).catch(() => ({ content: defaultSiteContent })),
        fetch("/api/analytics").then((r) => r.json()).catch(() => ({ summary: null, recent: [] })),
      ]);

      if (leadsRes.leads) setLeads(leadsRes.leads);
      if (invRes.items) setInventory(invRes.items);
      if (clientsRes.clients) setClients(clientsRes.clients);
      if (cmsRes.content) setSiteContent(cmsRes.content);
      if (analyticsRes.summary) setAnalytics(analyticsRes.summary);
      if (analyticsRes.recent) setRecentEvents(analyticsRes.recent);
    } finally {
      setIsRefreshing(false);
    }
  };

  // ---------------------------------------------------------------------------
  // LEADS ACTIONS
  // ---------------------------------------------------------------------------
  const handleUpdateLeadStatus = async (id: string, status: LeadSubmission["status"]) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
        if (selectedLead?.id === id) {
          setSelectedLead((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this inquiry record?")) return;
    try {
      const res = await fetch(`/api/leads?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        if (selectedLead?.id === id) setSelectedLead(null);
      }
    } catch (e) {
      console.error("Failed to delete lead", e);
    }
  };

  const exportLeadsCSV = () => {
    const headers = [
      "ID",
      "Type",
      "Name",
      "Phone",
      "Email",
      "Company",
      "Project",
      "Location",
      "AreaSqFt",
      "PreferredDate",
      "TimeSlot",
      "Status",
      "CreatedAt",
      "Notes",
    ];
    const rows = leads.map((l) => [
      l.id,
      l.type,
      `"${l.name.replace(/"/g, '""')}"`,
      l.phone,
      l.email,
      `"${(l.company || "").replace(/"/g, '""')}"`,
      `"${(l.projectType || l.projectName || "").replace(/"/g, '""')}"`,
      `"${(l.siteLocation || l.city || "").replace(/"/g, '""')}"`,
      l.approxArea || "",
      l.preferredDate || "",
      l.preferredTimeSlot || "",
      l.status,
      l.createdAt,
      `"${(l.notes || l.message || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `green_gallery_inquiries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchesSearch =
        leadSearch === "" ||
        l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
        l.phone.includes(leadSearch) ||
        l.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
        (l.company && l.company.toLowerCase().includes(leadSearch.toLowerCase())) ||
        (l.projectName && l.projectName.toLowerCase().includes(leadSearch.toLowerCase()));

      const matchesStatus = leadStatusFilter === "all" || l.status === leadStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, leadSearch, leadStatusFilter]);

  // ---------------------------------------------------------------------------
  // INVENTORY ACTIONS
  // ---------------------------------------------------------------------------
  const handleUpdateStockDelta = async (id: string, currentQty: number, delta: number) => {
    const newQty = Math.max(0, currentQty + delta);
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantityInStock: newQty } : item))
    );
    try {
      const res = await fetch("/api/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantityInStock: newQty }),
      });
      const data = await res.json();
      if (data.success && data.item) {
        setInventory((prev) => prev.map((item) => (item.id === id ? data.item : item)));
      }
    } catch (e) {
      console.error("Failed to update stock delta", e);
    }
  };

  const handleUpdateStockDirect = async (id: string, qty: number) => {
    const newQty = Math.max(0, qty);
    try {
      const res = await fetch("/api/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantityInStock: newQty }),
      });
      const data = await res.json();
      if (data.success && data.item) {
        setInventory((prev) => prev.map((item) => (item.id === id ? data.item : item)));
      }
    } catch (e) {
      console.error("Failed to update stock", e);
    }
  };

  const handleDeletePlant = async (id: string) => {
    if (!confirm("Are you sure you want to remove this specimen from live nursery inventory?")) return;
    try {
      const res = await fetch(`/api/inventory?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setInventory((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (e) {
      console.error("Failed to delete plant", e);
    }
  };

  const handleCreatePlant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlant.name || !newPlant.botanicalName) return;
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlant),
      });
      const data = await res.json();
      if (data.success && data.item) {
        setInventory((prev) => [data.item, ...prev]);
        setShowAddPlantModal(false);
        setNewPlant({
          name: "",
          botanicalName: "",
          category: "Specimen Trees",
          sizeOrHeight: "6 - 8 ft",
          potSize: "18-inch Bag",
          quantityInStock: 20,
          priceBand: "₹2,500 - ₹5,000",
        });
      }
    } catch (e) {
      console.error("Failed to create plant", e);
    }
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        invSearch === "" ||
        item.name.toLowerCase().includes(invSearch.toLowerCase()) ||
        item.botanicalName.toLowerCase().includes(invSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(invSearch.toLowerCase());
      const matchesCat = invCategoryFilter === "all" || item.category === invCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [inventory, invSearch, invCategoryFilter]);

  // ---------------------------------------------------------------------------
  // CLIENTS ACTIONS
  // ---------------------------------------------------------------------------
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.name || !clientForm.city) return;

    try {
      if (editingClient) {
        const res = await fetch("/api/clients", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingClient.id, ...clientForm }),
        });
        const data = await res.json();
        if (data.success && data.client) {
          setClients((prev) => prev.map((c) => (c.id === editingClient.id ? data.client : c)));
          setEditingClient(null);
        }
      } else {
        const res = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clientForm),
        });
        const data = await res.json();
        if (data.success && data.client) {
          setClients((prev) => [...prev, data.client]);
          setShowAddClientModal(false);
          setClientForm({
            name: "",
            tagline: "",
            city: "Pune",
            logo: "/images/clients/silver-group.jpg",
            description: "",
          });
        }
      }
    } catch (e) {
      console.error("Failed to save client", e);
    }
  };

  const handleDeleteClient = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove developer client "${name}"?`)) return;
    try {
      const res = await fetch(`/api/clients?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setClients((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error("Failed to delete client", e);
    }
  };

  // ---------------------------------------------------------------------------
  // CMS ACTIONS
  // ---------------------------------------------------------------------------
  const handleSaveCms = async (e: React.FormEvent) => {
    e.preventDefault();
    setCmsSaving(true);
    setCmsNotice("");
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteContent),
      });
      const data = await res.json();
      if (data.success) {
        setCmsNotice("Homepage hero and dual-line image loops successfully saved and published.");
        setTimeout(() => setCmsNotice(""), 3500);
      }
    } catch (e) {
      setCmsNotice("Error updating site content.");
    } finally {
      setCmsSaving(false);
    }
  };

  const handleUpdateShowcaseItem = (row: 1 | 2, index: number, field: "image" | "title" | "subtitle", value: string) => {
    setSiteContent((prev) => {
      const key = row === 1 ? "showcaseRow1" : "showcaseRow2";
      const list = [...(prev[key] || defaultSiteContent[key])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [key]: list };
    });
  };

  const handleAddShowcaseItem = (row: 1 | 2) => {
    setSiteContent((prev) => {
      const key = row === 1 ? "showcaseRow1" : "showcaseRow2";
      const list = [...(prev[key] || defaultSiteContent[key])];
      list.push({
        id: `item-${Date.now()}`,
        image: "/images/frames/ezgif-frame-001.jpg",
        title: row === 1 ? "New Executed Landscape" : "New Botanical Specimen",
        subtitle: row === 1 ? "Podium & Estate Greening" : "Acclimatized Nursery Stock",
      });
      return { ...prev, [key]: list };
    });
  };

  const handleRemoveShowcaseItem = (row: 1 | 2, index: number) => {
    setSiteContent((prev) => {
      const key = row === 1 ? "showcaseRow1" : "showcaseRow2";
      const list = [...(prev[key] || defaultSiteContent[key])].filter((_, i) => i !== index);
      return { ...prev, [key]: list };
    });
  };

  const handleResetCms = () => {
    if (confirm("Reset homepage content to default system values?")) {
      setSiteContent(defaultSiteContent);
    }
  };

  // ---------------------------------------------------------------------------
  // REAL SVG TRENDS GRAPH CALCULATIONS
  // ---------------------------------------------------------------------------
  const trendsData = useMemo(() => {
    return analytics?.dailyTrends || [];
  }, [analytics]);

  const maxTrafficVal = useMemo(() => {
    const maxVal = Math.max(...trendsData.map((d) => d.count), 5);
    return Math.ceil(maxVal / 5) * 5;
  }, [trendsData]);

  // ---------------------------------------------------------------------------
  // RENDER: LOGIN VIEW (Clean Architectural Portal)
  // ---------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[82vh] flex items-center justify-center py-20 px-4 bg-cream-50">
        <div className="w-full max-w-sm bg-white border border-[#283618]/15 rounded-brand p-8 shadow-sm">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-amber-500/30 bg-black shadow-md mb-3">
              <Image
                src="/images/logo.jpg"
                alt="GreenGallery Logo"
                fill
                className="object-cover"
                priority
                sizes="80px"
              />
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#283618]/70">
                Operations Console
              </span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-green-950 tracking-tight">
              GreenGallery
            </h1>
            <p className="text-[11px] text-amber-800 font-medium tracking-wide">
              Cultivating Natural Elegance
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-[#283618] uppercase tracking-wider mb-1.5 font-mono">
                Access Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                autoFocus
                className="w-full px-3.5 py-2.5 bg-cream-50/60 border border-[#283618]/15 rounded-brand text-xs font-mono tracking-wider focus:outline-none focus:border-green-900 transition-colors"
              />
              {passError && <p className="text-[11px] text-red-700 mt-1.5 font-medium">{passError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-green-900 hover:bg-[#1f2b13] text-cream-50 font-medium text-xs tracking-wider uppercase rounded-brand shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Verify Access</span>
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-[#283618]/10 text-center">
            <p className="text-[10px] text-ink-500 font-mono">
              Direct founder channel: +91 78230 80251
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: AUTHENTICATED DASHBOARD (Sleek, Modern, Minimalist)
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full min-h-screen bg-cream-50 text-ink-900 pb-24 md:pb-16 font-sans">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#283618]/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-amber-500/30 bg-black shadow-xs shrink-0">
              <Image
                src="/images/logo.jpg"
                alt="GreenGallery Emblem"
                fill
                className="object-cover scale-150 -translate-y-0.5"
                sizes="32px"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold tracking-tight text-green-950">
                  GreenGallery
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded border border-[#283618]/20 text-[#283618] bg-cream-50 font-bold">
                  Operations Desk
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Text + Clean Lucide Icons) */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-cream-50/80 rounded-brand border border-[#283618]/10">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-3 py-1.5 rounded-brand text-xs font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === "analytics"
                  ? "bg-green-900 text-cream-50 shadow-sm"
                  : "text-ink-500 hover:text-green-900"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
              {analytics && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20 text-cream-50">
                  {analytics.totalVisits}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("leads")}
              className={`px-3 py-1.5 rounded-brand text-xs font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === "leads"
                  ? "bg-green-900 text-cream-50 shadow-sm"
                  : "text-ink-500 hover:text-green-900"
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Inquiries</span>
              {leads.length > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-gold-600 text-green-900 font-semibold">
                  {leads.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("inventory")}
              className={`px-3 py-1.5 rounded-brand text-xs font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === "inventory"
                  ? "bg-green-900 text-cream-50 shadow-sm"
                  : "text-ink-500 hover:text-green-900"
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Plant Stock</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/10 text-ink-900">
                {inventory.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("clients")}
              className={`px-3 py-1.5 rounded-brand text-xs font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === "clients"
                  ? "bg-green-900 text-cream-50 shadow-sm"
                  : "text-ink-500 hover:text-green-900"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Clients</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/10 text-ink-900">
                {clients.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("cms")}
              className={`px-3 py-1.5 rounded-brand text-xs font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === "cms"
                  ? "bg-green-900 text-cream-50 shadow-sm"
                  : "text-ink-500 hover:text-green-900"
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Hero CMS</span>
            </button>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={loadAllData}
              disabled={isRefreshing}
              title="Refresh telemetry"
              className="p-2 rounded-brand border border-[#283618]/15 hover:bg-cream-200/50 text-[#283618] text-xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-brand border border-red-800/20 hover:bg-red-50 text-red-800 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        {/* ================================================================= */}
        {/* TAB 1: DATA ANALYTICS & GENUINE TELEMETRY                          */}
        {/* ================================================================= */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#283618]/10">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#283618]/70">
                  Telemetry & Conversion Funnel
                </span>
                <h2 className="text-2xl font-serif font-semibold text-green-900 mt-0.5">
                  Traffic & Engagement Telemetry
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-green-900/5 text-green-900 border border-green-900/15">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-700 animate-pulse" />
                  Live Stream Active
                </span>
              </div>
            </div>

            {/* KPI Metric Ledger */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#283618]/10 rounded-brand p-5 shadow-xs">
                <div className="text-[11px] font-mono text-ink-500 uppercase tracking-wider mb-2">
                  Total Page Views
                </div>
                <div className="text-3xl font-serif font-bold text-green-900">
                  {analytics?.totalVisits || 0}
                </div>
                <div className="text-[11px] text-ink-500 mt-2 font-mono">
                  Recorded across client routes
                </div>
              </div>

              <div className="bg-white border border-[#283618]/10 rounded-brand p-5 shadow-xs">
                <div className="text-[11px] font-mono text-ink-500 uppercase tracking-wider mb-2">
                  Unique Sessions
                </div>
                <div className="text-3xl font-serif font-bold text-green-900">
                  {analytics?.uniqueVisitors || 0}
                </div>
                <div className="text-[11px] text-ink-500 mt-2 font-mono">
                  Distinct device sessions
                </div>
              </div>

              <div className="bg-white border border-[#283618]/10 rounded-brand p-5 shadow-xs">
                <div className="text-[11px] font-mono text-ink-500 uppercase tracking-wider mb-2">
                  Inquiries Received
                </div>
                <div className="text-3xl font-serif font-bold text-green-900">
                  {leads.length}
                </div>
                <div className="text-[11px] text-green-700 mt-2 font-mono">
                  {leads.length === 0 ? "Awaiting first submission" : `${leads.length} consultations captured`}
                </div>
              </div>

              <div className="bg-white border border-[#283618]/10 rounded-brand p-5 shadow-xs">
                <div className="text-[11px] font-mono text-ink-500 uppercase tracking-wider mb-2">
                  Visitor Conversion
                </div>
                <div className="text-3xl font-serif font-bold text-gold-600">
                  {analytics?.conversionRate || 0}%
                </div>
                <div className="text-[11px] text-ink-500 mt-2 font-mono">
                  Inquiries / Unique Sessions
                </div>
              </div>
            </div>

            {/* Genuine SVG 7-Day Traffic Sparkline & Chart */}
            <div className="bg-white border border-[#283618]/10 rounded-brand p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-base font-serif font-semibold text-green-900">
                    7-Day Visit Volume
                  </h3>
                  <p className="text-xs text-ink-500 font-light mt-0.5">
                    Authentic daily hit distribution over the rolling past week.
                  </p>
                </div>
                {hoveredDayIndex !== null && trendsData[hoveredDayIndex] && (
                  <div className="text-xs font-mono bg-cream-50 px-3 py-1 rounded border border-[#283618]/10 text-green-900">
                    {trendsData[hoveredDayIndex].date}:{" "}
                    <strong>{trendsData[hoveredDayIndex].count} views</strong> ({trendsData[hoveredDayIndex].unique} unique)
                  </div>
                )}
              </div>

              {/* Responsive SVG Chart */}
              <div className="w-full h-56 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#283618" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#283618" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guideline lines */}
                  {[0, 50, 100, 150].map((y) => (
                    <line
                      key={y}
                      x1="40"
                      y1={y}
                      x2="680"
                      y2={y}
                      stroke="rgba(40, 54, 24, 0.08)"
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Area fill */}
                  {trendsData.length > 0 && (
                    <path
                      d={`
                        M 40,180
                        ${trendsData
                          .map((d, i) => {
                            const x = 40 + i * (640 / (trendsData.length - 1 || 1));
                            const y = 180 - (d.count / maxTrafficVal) * 160;
                            return `L ${x},${y}`;
                          })
                          .join(" ")}
                        L 680,180 Z
                      `}
                      fill="url(#chartGradient)"
                    />
                  )}

                  {/* Line stroke */}
                  {trendsData.length > 0 && (
                    <path
                      d={`
                        M ${40},${180 - (trendsData[0]?.count / maxTrafficVal) * 160}
                        ${trendsData
                          .slice(1)
                          .map((d, i) => {
                            const x = 40 + (i + 1) * (640 / (trendsData.length - 1 || 1));
                            const y = 180 - (d.count / maxTrafficVal) * 160;
                            return `L ${x},${y}`;
                          })
                          .join(" ")}
                      `}
                      fill="none"
                      stroke="#283618"
                      strokeWidth="2.5"
                    />
                  )}

                  {/* Data Point Markers */}
                  {trendsData.map((d, i) => {
                    const x = 40 + i * (640 / (trendsData.length - 1 || 1));
                    const y = 180 - (d.count / maxTrafficVal) * 160;
                    const isHovered = hoveredDayIndex === i;

                    return (
                      <g
                        key={d.date}
                        className="cursor-pointer transition-transform"
                        onMouseEnter={() => setHoveredDayIndex(i)}
                        onMouseLeave={() => setHoveredDayIndex(null)}
                      >
                        <circle
                          cx={x}
                          cy={y}
                          r={isHovered ? 6 : 3.5}
                          fill={isHovered ? "#BC6C25" : "#283618"}
                          stroke="#FEFAE0"
                          strokeWidth="2"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* X-Axis Day Labels */}
                <div className="flex justify-between px-6 pt-2 text-[10px] font-mono text-ink-500 uppercase tracking-wider">
                  {trendsData.map((d, i) => (
                    <span
                      key={d.date}
                      className={hoveredDayIndex === i ? "text-green-900 font-bold" : ""}
                    >
                      {d.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Split Breakdown: Traffic by Page & Devices */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Traffic Distribution by Page */}
              <div className="lg:col-span-2 bg-white border border-[#283618]/10 rounded-brand p-6 shadow-xs">
                <h3 className="text-base font-serif font-semibold text-green-900 mb-1">
                  Page Route Distribution
                </h3>
                <p className="text-xs text-ink-500 font-light mb-6">
                  Exact volume of page views per internal route.
                </p>

                {analytics && Object.keys(analytics.pageViewsByPath).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(analytics.pageViewsByPath)
                      .sort(([, a], [, b]) => b - a)
                      .map(([pathName, count]) => {
                        const pct = Math.round((count / (analytics.totalVisits || 1)) * 100);
                        return (
                          <div key={pathName} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono text-green-900 font-medium">{pathName}</span>
                              <span className="font-mono text-ink-500 text-[11px]">
                                {count} hits · {pct}%
                              </span>
                            </div>
                            <div className="w-full bg-cream-50 rounded-full h-1.5 overflow-hidden border border-[#283618]/10">
                              <div
                                className="bg-green-900 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(4, pct)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-ink-500 font-light">
                    No route views logged yet.
                  </div>
                )}
              </div>

              {/* Devices & Referrers */}
              <div className="space-y-6">
                {/* Device Breakdown */}
                <div className="bg-white border border-[#283618]/10 rounded-brand p-6 shadow-xs">
                  <h3 className="text-base font-serif font-semibold text-green-900 mb-1">
                    Device Split
                  </h3>
                  <p className="text-xs text-ink-500 font-light mb-4">
                    Client viewport classifications.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-1.5 border-b border-[#283618]/5">
                      <div className="flex items-center gap-2 text-xs text-ink-900">
                        <Smartphone className="w-3.5 h-3.5 text-[#283618]" />
                        <span>Mobile</span>
                      </div>
                      <span className="font-mono text-xs text-green-900 font-medium">
                        {analytics?.visitsByDevice.mobile || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-[#283618]/5">
                      <div className="flex items-center gap-2 text-xs text-ink-900">
                        <Monitor className="w-3.5 h-3.5 text-[#283618]" />
                        <span>Desktop</span>
                      </div>
                      <span className="font-mono text-xs text-green-900 font-medium">
                        {analytics?.visitsByDevice.desktop || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2 text-xs text-ink-900">
                        <Tablet className="w-3.5 h-3.5 text-[#283618]" />
                        <span>Tablet</span>
                      </div>
                      <span className="font-mono text-xs text-green-900 font-medium">
                        {analytics?.visitsByDevice.tablet || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Referrers */}
                <div className="bg-white border border-[#283618]/10 rounded-brand p-6 shadow-xs">
                  <h3 className="text-base font-serif font-semibold text-green-900 mb-1">
                    Traffic Origins
                  </h3>
                  <div className="space-y-2 mt-4">
                    {analytics && Object.keys(analytics.visitsByReferrer).length > 0 ? (
                      Object.entries(analytics.visitsByReferrer).map(([src, count]) => (
                        <div key={src} className="flex items-center justify-between text-xs py-1 border-b border-[#283618]/5 last:border-0">
                          <span className="font-mono text-ink-900 truncate max-w-[150px]">{src || "Direct"}</span>
                          <span className="font-mono text-[11px] text-green-900 bg-cream-50 px-2 py-0.5 rounded border border-[#283618]/10">
                            {count}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-ink-500 font-light">Direct Navigation</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Telemetry Ledger */}
            <div className="bg-white border border-[#283618]/10 rounded-brand p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-serif font-semibold text-green-900">
                  Live Event Feed
                </h3>
                <span className="text-[10px] font-mono text-ink-500">
                  Showing {recentEvents.slice(0, 10).length} recent transactions
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#283618]/10 text-ink-500 uppercase tracking-widest text-[10px] font-mono">
                      <th className="pb-2.5">Time</th>
                      <th className="pb-2.5">Route</th>
                      <th className="pb-2.5">Device</th>
                      <th className="pb-2.5">Referrer</th>
                      <th className="pb-2.5">Session Token</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#283618]/5">
                    {recentEvents.length > 0 ? (
                      recentEvents.slice(0, 10).map((evt) => (
                        <tr key={evt.id} className="hover:bg-cream-50/50">
                          <td className="py-2.5 font-mono text-ink-500 whitespace-nowrap">
                            {new Date(evt.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                          </td>
                          <td className="py-2.5 font-mono text-green-900 font-medium">{evt.path}</td>
                          <td className="py-2.5 capitalize text-ink-900 font-light">{evt.deviceType}</td>
                          <td className="py-2.5 font-mono text-ink-500 truncate max-w-[200px]">{evt.referrer || "Direct"}</td>
                          <td className="py-2.5 font-mono text-[10px] text-ink-500">{evt.sessionId.slice(0, 14)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-xs text-ink-500 font-light">
                          No recent telemetry records.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: INQUIRIES & LEADS INBOX                                     */}
        {/* ================================================================= */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#283618]/10">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#283618]/70">
                  Client Submissions
                </span>
                <h2 className="text-2xl font-serif font-semibold text-green-900 mt-0.5">
                  Consultation Inquiries ({filteredLeads.length})
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportLeadsCSV}
                  disabled={leads.length === 0}
                  className="px-3.5 py-2 border border-[#283618]/20 hover:bg-cream-200/50 text-green-900 text-xs font-medium rounded-brand transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-[#283618]/10 rounded-brand p-3.5 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-ink-500" />
                <input
                  type="text"
                  placeholder="Filter by name, phone, company..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-cream-50/50 border border-[#283618]/10 rounded-brand text-xs focus:outline-none focus:border-green-900"
                />
              </div>

              <div className="w-full sm:w-auto flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {(["all", "New", "Contacted", "Site Visit Scheduled", "Quotation Preparation", "Quotation Sent", "Negotiation", "Won", "Lost"] as const).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setLeadStatusFilter(st)}
                      className={`px-3 py-1.5 rounded text-xs transition-colors cursor-pointer font-mono whitespace-nowrap ${
                        leadStatusFilter === st
                          ? "bg-green-900 text-cream-50"
                          : "text-ink-500 hover:text-green-900 hover:bg-cream-200/40"
                      }`}
                    >
                      {st === "all" ? "All" : st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Zero State (No Fake Leads) */}
            {filteredLeads.length === 0 && (
              <div className="py-16 text-center bg-white border border-[#283618]/10 rounded-brand p-8">
                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-cream-50 border border-[#283618]/10 flex items-center justify-center text-green-900">
                  <Inbox className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-serif font-semibold text-green-900">
                  No Active Inquiries
                </h3>
                <p className="text-xs text-ink-500 max-w-sm mx-auto mt-1 font-light leading-relaxed">
                  Real submissions from the site consultation form or developer quote modal will appear here immediately.
                </p>
              </div>
            )}

            {/* Cards Grid when genuine leads exist */}
            {filteredLeads.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredLeads.map((lead) => {
                  const phoneClean = lead.phone.replace(/[^0-9]/g, "");
                  const waUrl = `https://wa.me/${phoneClean.length === 10 ? `91${phoneClean}` : phoneClean}?text=${encodeURIComponent(
                    `Hello ${lead.name}, this is the GreenGallery team regarding your inquiry for ${
                      lead.projectType || lead.projectName || "your landscape project"
                    }.`
                  )}`;

                  return (
                    <div
                      key={lead.id}
                      className="bg-white border border-[#283618]/10 rounded-brand p-5 shadow-xs flex flex-col justify-between hover:border-green-900/40 transition-colors"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span
                            className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${
                              lead.status === "New"
                                ? "bg-amber-50 text-amber-900 border-amber-300"
                                : lead.status === "Contacted"
                                ? "bg-blue-50 text-blue-900 border-blue-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                            }`}
                          >
                            {lead.status}
                          </span>
                          <span className="text-[10px] font-mono text-ink-500">
                            {new Date(lead.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                          </span>
                        </div>

                        <h3 className="text-base font-serif font-semibold text-green-900">
                          {lead.name}
                        </h3>
                        {lead.company && (
                          <p className="text-xs text-ink-500 mt-0.5">{lead.company}</p>
                        )}

                        <div className="space-y-1.5 my-3 py-2 border-y border-[#283618]/5 text-xs">
                          <div className="flex items-center justify-between font-mono">
                            <span className="text-ink-500 text-[11px]">Phone</span>
                            <span className="text-green-900">{lead.phone}</span>
                          </div>
                          <div className="flex items-center justify-between font-mono">
                            <span className="text-ink-500 text-[11px]">Email</span>
                            <span className="text-ink-900 truncate max-w-[180px]">{lead.email}</span>
                          </div>
                          {(lead.siteLocation || lead.city) && (
                            <div className="flex items-center justify-between">
                              <span className="text-ink-500 text-[11px]">Location</span>
                              <span className="text-ink-900 font-light">{lead.siteLocation || lead.city}</span>
                            </div>
                          )}
                        </div>

                        {(lead.notes || lead.message) && (
                          <p className="text-xs text-ink-500 italic bg-cream-50/70 p-2.5 rounded border border-[#283618]/5 mb-3 line-clamp-2">
                            &ldquo;{lead.notes || lead.message}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-[#283618]/10 space-y-2">
                        <div className="flex items-center gap-2">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 px-3 bg-green-900 hover:bg-[#1f2b13] text-cream-50 text-xs font-medium rounded text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp Reply</span>
                          </a>

                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="py-2 px-3 border border-[#283618]/15 hover:bg-cream-200/50 text-green-900 text-xs rounded transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1 text-[11px]">
                          <span className="text-ink-500 font-mono">Status:</span>
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                            className="font-mono bg-cream-50 border border-[#283618]/15 rounded px-2 py-0.5 text-ink-900 focus:outline-none focus:border-green-900"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                            <option value="Quotation Preparation">Quotation Preparation</option>
                            <option value="Quotation Sent">Quotation Sent</option>
                            <option value="Negotiation">Negotiation</option>
                            <option value="Won">Won</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: NURSERY STOCK & INVENTORY MANAGER                           */}
        {/* ================================================================= */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#283618]/10">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#283618]/70">
                  Nursery Catalog
                </span>
                <h2 className="text-2xl font-serif font-semibold text-green-900 mt-0.5">
                  Stock Manager ({filteredInventory.length})
                </h2>
              </div>
              <button
                onClick={() => setShowAddPlantModal(true)}
                className="px-3.5 py-2 bg-green-900 hover:bg-[#1f2b13] text-cream-50 text-xs font-medium rounded-brand shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Specimen</span>
              </button>
            </div>

            {/* Filter & Search */}
            <div className="bg-white border border-[#283618]/10 rounded-brand p-3.5 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-ink-500" />
                <input
                  type="text"
                  placeholder="Filter botanical or common name..."
                  value={invSearch}
                  onChange={(e) => setInvSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-cream-50/50 border border-[#283618]/10 rounded-brand text-xs focus:outline-none focus:border-green-900"
                />
              </div>

              <div className="w-full sm:w-auto flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {["all", "Specimen Trees", "Outdoor Plants", "Avenue Palms", "Vertical & Foliage"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setInvCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded text-xs transition-colors cursor-pointer font-mono whitespace-nowrap ${
                      invCategoryFilter === cat
                        ? "bg-green-900 text-cream-50"
                        : "text-ink-500 hover:text-green-900 hover:bg-cream-200/40"
                    }`}
                  >
                    {cat === "all" ? "All" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Clean Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredInventory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#283618]/10 rounded-brand p-5 shadow-xs flex flex-col justify-between hover:border-green-900/30 transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cream-50 text-[#283618] border border-[#283618]/10">
                        {item.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          item.quantityInStock <= 0
                            ? "bg-red-50 text-red-900 border-red-200"
                            : item.quantityInStock <= 10
                            ? "bg-amber-50 text-amber-900 border-amber-200"
                            : "bg-green-50 text-green-900 border-green-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h3 className="text-base font-serif font-semibold text-green-900">
                      {item.name}
                    </h3>
                    <p className="text-xs text-ink-500 italic font-serif">
                      {item.botanicalName}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs my-3 py-2 px-3 bg-cream-50/60 rounded border border-[#283618]/5">
                      <div>
                        <span className="text-ink-500 text-[10px] block font-mono">Specification</span>
                        <span className="text-ink-900 font-light">{item.sizeOrHeight}</span>
                      </div>
                      <div>
                        <span className="text-ink-500 text-[10px] block font-mono">Container</span>
                        <span className="text-ink-900 font-light">{item.potSize}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stock Quantity Steppers */}
                  <div className="pt-3 border-t border-[#283618]/10">
                    <div className="flex items-center justify-between mb-2 font-mono">
                      <span className="text-xs text-ink-500">Live Count</span>
                      <span className="text-lg font-bold text-green-900">
                        {item.quantityInStock}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        onClick={() => handleUpdateStockDelta(item.id, item.quantityInStock, -10)}
                        className="py-1.5 border border-[#283618]/15 hover:bg-cream-200/50 text-xs font-mono rounded cursor-pointer transition-colors"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => handleUpdateStockDelta(item.id, item.quantityInStock, -1)}
                        className="py-1.5 border border-[#283618]/15 hover:bg-cream-200/50 text-xs font-mono rounded cursor-pointer transition-colors"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => handleUpdateStockDelta(item.id, item.quantityInStock, 1)}
                        className="py-1.5 border border-[#283618]/15 hover:bg-cream-200/50 text-xs font-mono rounded cursor-pointer transition-colors"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => handleUpdateStockDelta(item.id, item.quantityInStock, 10)}
                        className="py-1.5 border border-[#283618]/15 hover:bg-cream-200/50 text-xs font-mono rounded cursor-pointer transition-colors"
                      >
                        +10
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[#283618]/5 text-xs">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="text-ink-500">Set:</span>
                        <input
                          type="number"
                          defaultValue={item.quantityInStock}
                          onBlur={(e) => handleUpdateStockDirect(item.id, parseInt(e.target.value) || 0)}
                          className="w-16 px-1.5 py-0.5 bg-cream-50 border border-[#283618]/15 rounded text-center focus:outline-none focus:border-green-900"
                        />
                      </div>
                      <button
                        onClick={() => handleDeletePlant(item.id)}
                        className="text-red-700 hover:text-red-900 cursor-pointer text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: CLIENT PARTNERS MANAGER                                     */}
        {/* ================================================================= */}
        {activeTab === "clients" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#283618]/10">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#283618]/70">
                  Developer Collaborations
                </span>
                <h2 className="text-2xl font-serif font-semibold text-green-900 mt-0.5">
                  Builder Partners ({clients.length})
                </h2>
              </div>
              <button
                onClick={() => {
                  setClientForm({
                    name: "",
                    tagline: "",
                    city: "Pune",
                    logo: "/images/clients/silver-group.jpg",
                    description: "",
                  });
                  setEditingClient(null);
                  setShowAddClientModal(true);
                }}
                className="px-3.5 py-2 bg-green-900 hover:bg-[#1f2b13] text-cream-50 text-xs font-medium rounded-brand shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Partner</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map((c) => (
                <div
                  key={c.id}
                  className="bg-white border border-[#283618]/10 rounded-brand p-5 shadow-xs flex flex-col justify-between hover:border-green-900/30 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-[#283618]/10 flex items-center justify-center p-2.5 flex-shrink-0 shadow-xs">
                        <Image
                          src={c.logo}
                          alt={c.name}
                          fill
                          className="object-contain p-1.5"
                          sizes="80px"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-serif font-semibold text-green-900 truncate">
                          {c.name}
                        </h3>
                        {c.tagline && (
                          <p className="text-xs text-ink-500 italic truncate">{c.tagline}</p>
                        )}
                        <span className="inline-block mt-1 text-[10px] font-mono text-[#283618] bg-cream-50 border border-[#283618]/10 px-2 py-0.2 rounded">
                          {c.city}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-ink-900/80 leading-relaxed line-clamp-3 mb-4 font-light">
                      {c.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#283618]/10 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setEditingClient(c);
                        setClientForm({
                          name: c.name,
                          tagline: c.tagline || "",
                          city: c.city,
                          logo: c.logo,
                          description: c.description,
                        });
                        setShowAddClientModal(true);
                      }}
                      className="px-2.5 py-1 border border-[#283618]/15 hover:bg-cream-200/50 text-green-900 rounded cursor-pointer transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClient(c.id, c.name)}
                      className="text-red-700 hover:text-red-900 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: HOMEPAGE CMS                                                */}
        {/* ================================================================= */}
        {activeTab === "cms" && (
          <div className="space-y-6 max-w-3xl">
            <div className="pb-4 border-b border-[#283618]/10">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#283618]/70">
                Studio Presentation
              </span>
              <h2 className="text-2xl font-serif font-semibold text-green-900 mt-0.5">
                Hero Content CMS
              </h2>
            </div>

            {cmsNotice && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-900 text-xs rounded">
                {cmsNotice}
              </div>
            )}

            {/* Live Preview Card */}
            <div className="bg-white border border-[#283618]/10 rounded-brand p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-ink-500">
                  Live Landing Page Hero Preview
                </span>
                <span className="text-[10px] font-mono text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  Real-time visual reflection
                </span>
              </div>
              <div className="relative w-full min-h-[300px] rounded-2xl overflow-hidden bg-green-950 border border-green-800 flex flex-col justify-between p-6 sm:p-8 text-cream-50 shadow-inner">
                <Image
                  src={siteContent.heroImage || "/images/hero-clean.webp"}
                  alt="Preview"
                  fill
                  className="object-cover object-center scale-105"
                  sizes="(max-width: 1024px) 100vw, 750px"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#061A12]/85 via-[#0B2B1E]/70 to-[#061A12]/95" />
                
                {/* Top preview pill */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-semibold text-green-300 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span>{siteContent.heroBadge || "Architectural Botanical Engineering"}</span>
                  </div>
                </div>

                {/* Central giant title */}
                <div className="relative z-10 my-4 max-w-xl text-left">
                  <h3 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-none mb-2 drop-shadow">
                    {siteContent.heroHeadline || "growth"}
                  </h3>
                  <p className="text-xs sm:text-sm text-cream-50/90 line-clamp-2 max-w-md font-light leading-relaxed">
                    {siteContent.heroDescription}
                  </p>
                </div>

                {/* Bottom preview strip */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
                  <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <div>
                      <div className="font-bold text-white text-[11px] leading-tight">
                        {siteContent.heroStatCount || "Alandi Depot"}
                      </div>
                      <div className="text-[9px] text-cream-50/70 font-light truncate max-w-[180px]">
                        {siteContent.heroStatLabel || "Logistical Staging Depot"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white text-green-950 font-bold text-[10px] rounded-full shadow">
                      {siteContent.primaryButtonText || "Explore Specimen Store"}
                    </span>
                    <span className="px-3 py-1 bg-green-600 text-white font-bold text-[10px] rounded-full shadow">
                      {siteContent.secondaryButtonText || "Book Site Visit"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCms} className="bg-white border border-[#283618]/10 rounded-brand p-6 shadow-xs space-y-6">
              {/* Section A: Hero */}
              <div className="space-y-4">
                <div className="pb-2 border-b border-[#283618]/10 flex items-center justify-between">
                  <h3 className="text-sm font-serif font-semibold text-green-900">
                    1. Hero Section (Primary Visuals & Headlines)
                  </h3>
                  <span className="text-[10px] font-mono text-ink-500 uppercase">Top of Landing Page</span>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-green-900 mb-1">
                    Primary Giant Headline (e.g. &quot;growth&quot;)
                  </label>
                  <input
                    type="text"
                    value={siteContent.heroHeadline}
                    onChange={(e) => setSiteContent({ ...siteContent, heroHeadline: e.target.value })}
                    placeholder="growth"
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-sm font-bold focus:outline-none focus:border-green-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-green-900 mb-1">
                      Top Badge / Tagline
                    </label>
                    <input
                      type="text"
                      value={siteContent.heroBadge}
                      onChange={(e) => setSiteContent({ ...siteContent, heroBadge: e.target.value })}
                      className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-green-900 mb-1">
                      Hero Image Path / URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={siteContent.heroImage || "/images/hero-clean.webp"}
                        onChange={(e) => setSiteContent({ ...siteContent, heroImage: e.target.value })}
                        className="flex-1 px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                      />
                      <button
                        type="button"
                        onClick={() => setSiteContent({ ...siteContent, heroImage: "/images/hero-clean.webp" })}
                        className="px-2.5 py-1.5 border border-[#283618]/15 hover:bg-cream-200/50 text-[10px] font-mono rounded cursor-pointer"
                        title="AI Hero Image"
                      >
                        AI Hero Image
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-green-900 mb-1">
                    Hero Subtitle / Descriptive Paragraph
                  </label>
                  <textarea
                    rows={2}
                    value={siteContent.heroDescription}
                    onChange={(e) => setSiteContent({ ...siteContent, heroDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-green-900 mb-1">
                      Hero Floating Stat Title
                    </label>
                    <input
                      type="text"
                      value={siteContent.heroStatCount || "Alandi Depot"}
                      onChange={(e) => setSiteContent({ ...siteContent, heroStatCount: e.target.value })}
                      className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-semibold focus:outline-none focus:border-green-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-green-900 mb-1">
                      Hero Floating Stat Subtitle
                    </label>
                    <input
                      type="text"
                      value={siteContent.heroStatLabel || "Acclimatized avenue trees & palms ready for direct site installation."}
                      onChange={(e) => setSiteContent({ ...siteContent, heroStatLabel: e.target.value })}
                      className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-green-900 mb-1">
                      Primary Button Text
                    </label>
                    <input
                      type="text"
                      value={siteContent.primaryButtonText || "Explore Specimen Store"}
                      onChange={(e) => setSiteContent({ ...siteContent, primaryButtonText: e.target.value })}
                      className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-green-900 mb-1">
                      Secondary Button Text
                    </label>
                    <input
                      type="text"
                      value={siteContent.secondaryButtonText || "Book Site Visit"}
                      onChange={(e) => setSiteContent({ ...siteContent, secondaryButtonText: e.target.value })}
                      className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                    />
                  </div>
                </div>
              </div>

              {/* Section B: Architecture Intro */}
              <div className="space-y-4 pt-4 border-t border-[#283618]/10">
                <div className="pb-2 border-b border-[#283618]/10 flex items-center justify-between">
                  <h3 className="text-sm font-serif font-semibold text-green-900">
                    2. Architecture & Plants Intro Section
                  </h3>
                  <span className="text-[10px] font-mono text-ink-500 uppercase">Mid-Page Intro</span>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-green-900 mb-1">
                    Section Headline
                  </label>
                  <input
                    type="text"
                    value={siteContent.introHeadline || "Landscapes for Architecture"}
                    onChange={(e) => setSiteContent({ ...siteContent, introHeadline: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-semibold focus:outline-none focus:border-green-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-green-900 mb-1">
                    Section Subtext
                  </label>
                  <textarea
                    rows={2}
                    value={siteContent.introDescription || "Where horticultural engineering meets enduring architectural spaces. Cultivated for Western Maharashtra's climate."}
                    onChange={(e) => setSiteContent({ ...siteContent, introDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>
              </div>

              {/* Section C: Closing Call to Action Banner */}
              <div className="space-y-4 pt-4 border-t border-[#283618]/10">
                <div className="pb-2 border-b border-[#283618]/10 flex items-center justify-between">
                  <h3 className="text-sm font-serif font-semibold text-green-900">
                    3. Closing Botanical Conversion Banner
                  </h3>
                  <span className="text-[10px] font-mono text-ink-500 uppercase">Bottom of Landing Page</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-green-900 mb-1">
                      Banner Tagline
                    </label>
                    <input
                      type="text"
                      value={siteContent.bannerBadge || "Start Your Botanical Transformation"}
                      onChange={(e) => setSiteContent({ ...siteContent, bannerBadge: e.target.value })}
                      className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-green-900 mb-1">
                      Banner Headline
                    </label>
                    <input
                      type="text"
                      value={siteContent.bannerHeadline || "Build with Green Gallery"}
                      onChange={(e) => setSiteContent({ ...siteContent, bannerHeadline: e.target.value })}
                      className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-semibold focus:outline-none focus:border-green-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-green-900 mb-1">
                    Banner Description
                  </label>
                  <textarea
                    rows={2}
                    value={siteContent.bannerDescription || "Review CAD drawings with our team, enquire about plant supply from our staging depot, or request formal developer BOQ pricing."}
                    onChange={(e) => setSiteContent({ ...siteContent, bannerDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>
              </div>

              {/* Form Action Controls */}
              <div className="pt-4 border-t border-[#283618]/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetCms}
                  className="text-xs text-ink-500 hover:text-ink-900 cursor-pointer"
                >
                  Reset Defaults
                </button>
                <button
                  type="submit"
                  disabled={cmsSaving}
                  className="px-6 py-2.5 bg-green-900 hover:bg-[#1f2b13] text-cream-50 text-xs font-semibold rounded shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  {cmsSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save & Publish Changes Forever</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* 
              Showcase Marquee Line 1 Editor: Executed Landscape Works
            */}
            <div className="bg-white border border-[#283618]/10 rounded-brand p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#283618]/10">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-green-900">
                    Continuous Loop · Line 1
                  </span>
                  <h3 className="text-base font-serif font-semibold text-green-900">
                    Executed Works & Landscape Projects
                  </h3>
                  <p className="text-xs text-ink-500 font-light mt-0.5">
                    Images of completed projects that slide continuously on the landing page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddShowcaseItem(1)}
                  className="px-3 py-1.5 border border-[#283618]/15 hover:bg-cream-200/50 text-xs text-green-900 rounded font-medium cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project Card</span>
                </button>
              </div>

              <div className="space-y-3">
                {(siteContent.showcaseRow1 || defaultSiteContent.showcaseRow1).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3.5 bg-cream-50/50 border border-[#283618]/10 rounded-brand flex flex-col sm:flex-row items-start sm:items-center gap-3.5"
                  >
                    <div className="relative w-20 h-14 rounded overflow-hidden bg-cream-200 shrink-0 border border-[#283618]/10">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover object-center"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full text-xs">
                      <div>
                        <label className="block text-[10px] font-mono text-ink-500 uppercase">Project Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateShowcaseItem(1, idx, "title", e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-ink-500 uppercase">Subtitle / Scope</label>
                        <input
                          type="text"
                          value={item.subtitle}
                          onChange={(e) => handleUpdateShowcaseItem(1, idx, "subtitle", e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-ink-500 uppercase">Image URL / Path</label>
                        <input
                          type="text"
                          value={item.image}
                          onChange={(e) => handleUpdateShowcaseItem(1, idx, "image", e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveShowcaseItem(1, idx)}
                      className="p-1.5 text-red-700 hover:text-red-900 hover:bg-red-50 rounded cursor-pointer self-end sm:self-center"
                      title="Remove Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 
              Showcase Marquee Line 2 Editor: Specimen Plants & Flora
            */}
            <div className="bg-white border border-[#283618]/10 rounded-brand p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#283618]/10">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-green-900">
                    Continuous Loop · Line 2
                  </span>
                  <h3 className="text-base font-serif font-semibold text-green-900">
                    Specimen Plants & Flora Gallery
                  </h3>
                  <p className="text-xs text-ink-500 font-light mt-0.5">
                    Images of trees, palms, and nursery plants that slide continuously in reverse direction.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddShowcaseItem(2)}
                  className="px-3 py-1.5 border border-[#283618]/15 hover:bg-cream-200/50 text-xs text-green-900 rounded font-medium cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Flora Card</span>
                </button>
              </div>

              <div className="space-y-3">
                {(siteContent.showcaseRow2 || defaultSiteContent.showcaseRow2).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3.5 bg-cream-50/50 border border-[#283618]/10 rounded-brand flex flex-col sm:flex-row items-start sm:items-center gap-3.5"
                  >
                    <div className="relative w-20 h-14 rounded overflow-hidden bg-cream-200 shrink-0 border border-[#283618]/10">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover object-center"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full text-xs">
                      <div>
                        <label className="block text-[10px] font-mono text-ink-500 uppercase">Botanical Name</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateShowcaseItem(2, idx, "title", e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900 italic font-serif"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-ink-500 uppercase">Common Spec / Type</label>
                        <input
                          type="text"
                          value={item.subtitle}
                          onChange={(e) => handleUpdateShowcaseItem(2, idx, "subtitle", e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-ink-500 uppercase">Image URL / Path</label>
                        <input
                          type="text"
                          value={item.image}
                          onChange={(e) => handleUpdateShowcaseItem(2, idx, "image", e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveShowcaseItem(2, idx)}
                      className="p-1.5 text-red-700 hover:text-red-900 hover:bg-red-50 rounded cursor-pointer self-end sm:self-center"
                      title="Remove Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Sticky Save Bar for CMS */}
            <div className="bg-white border border-[#283618]/15 rounded-brand p-4 shadow-md flex items-center justify-between sticky bottom-4 z-20">
              <div>
                <p className="text-xs font-semibold text-green-950">
                  Ready to deploy homepage updates?
                </p>
                <p className="text-[11px] text-ink-500 font-light">
                  Persists immediately to database (<span className="font-mono">db.json</span>).
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveCms}
                disabled={cmsSaving}
                className="px-6 py-2.5 bg-green-900 hover:bg-[#1f2b13] text-cream-50 text-xs font-semibold rounded shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                {cmsSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save & Publish Changes Forever</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ================================================================= */}
      {/* MOBILE / TABLET DOCK (Clean SVG Icons, Zero Emojis)                */}
      {/* ================================================================= */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#283618]/15 md:hidden flex items-center justify-around py-2 px-1 shadow-lg">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded transition-colors cursor-pointer ${
            activeTab === "analytics" ? "text-green-900 font-semibold" : "text-ink-500"
          }`}
        >
          <BarChart3 className="w-4 h-4 stroke-[1.75]" />
          <span className="text-[10px] font-mono">Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab("leads")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded transition-colors cursor-pointer relative ${
            activeTab === "leads" ? "text-green-900 font-semibold" : "text-ink-500"
          }`}
        >
          <Inbox className="w-4 h-4 stroke-[1.75]" />
          <span className="text-[10px] font-mono">Inbox</span>
          {leads.length > 0 && (
            <span className="absolute top-0.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gold-600" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded transition-colors cursor-pointer ${
            activeTab === "inventory" ? "text-green-900 font-semibold" : "text-ink-500"
          }`}
        >
          <Sprout className="w-4 h-4 stroke-[1.75]" />
          <span className="text-[10px] font-mono">Stock</span>
        </button>

        <button
          onClick={() => setActiveTab("clients")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded transition-colors cursor-pointer ${
            activeTab === "clients" ? "text-green-900 font-semibold" : "text-ink-500"
          }`}
        >
          <Building2 className="w-4 h-4 stroke-[1.75]" />
          <span className="text-[10px] font-mono">Clients</span>
        </button>

        <button
          onClick={() => setActiveTab("cms")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded transition-colors cursor-pointer ${
            activeTab === "cms" ? "text-green-900 font-semibold" : "text-ink-500"
          }`}
        >
          <Layout className="w-4 h-4 stroke-[1.75]" />
          <span className="text-[10px] font-mono">CMS</span>
        </button>
      </div>

      {/* ================================================================= */}
      {/* MODAL 1: ADD PLANT SPECIMEN                                       */}
      {/* ================================================================= */}
      {showAddPlantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-[#283618]/15 rounded-brand p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#283618]/10 mb-4">
              <h3 className="text-base font-serif font-semibold text-green-900">
                Add Plant Specimen
              </h3>
              <button
                onClick={() => setShowAddPlantModal(false)}
                className="text-ink-500 hover:text-ink-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlant} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Common Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Palm"
                  value={newPlant.name}
                  onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
                  className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Botanical Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roystonea regia"
                  value={newPlant.botanicalName}
                  onChange={(e) => setNewPlant({ ...newPlant, botanicalName: e.target.value })}
                  className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs italic focus:outline-none focus:border-green-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Category</label>
                  <select
                    value={newPlant.category}
                    onChange={(e) => setNewPlant({ ...newPlant, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  >
                    <option value="Specimen Trees">Specimen Trees</option>
                    <option value="Outdoor Plants">Outdoor Plants</option>
                    <option value="Avenue Palms">Avenue Palms</option>
                    <option value="Vertical & Foliage">Vertical & Foliage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={newPlant.quantityInStock}
                    onChange={(e) => setNewPlant({ ...newPlant, quantityInStock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Height / Size</label>
                  <input
                    type="text"
                    value={newPlant.sizeOrHeight}
                    onChange={(e) => setNewPlant({ ...newPlant, sizeOrHeight: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Container</label>
                  <input
                    type="text"
                    value={newPlant.potSize}
                    onChange={(e) => setNewPlant({ ...newPlant, potSize: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#283618]/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPlantModal(false)}
                  className="px-3 py-1.5 text-xs text-ink-500 hover:text-ink-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-green-900 hover:bg-[#1f2b13] text-cream-50 text-xs font-medium rounded shadow-xs cursor-pointer"
                >
                  Save Specimen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 2: ADD / EDIT CLIENT PARTNER                                */}
      {/* ================================================================= */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-[#283618]/15 rounded-brand p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#283618]/10 mb-4">
              <h3 className="text-base font-serif font-semibold text-green-900">
                {editingClient ? `Edit ${editingClient.name}` : "Add Developer Client"}
              </h3>
              <button
                onClick={() => {
                  setShowAddClientModal(false);
                  setEditingClient(null);
                }}
                className="text-ink-500 hover:text-ink-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Developer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silver Group"
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Landmark Developments"
                  value={clientForm.tagline}
                  onChange={(e) => setClientForm({ ...clientForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">City / Region *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ravet, Pune"
                    value={clientForm.city}
                    onChange={(e) => setClientForm({ ...clientForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Logo URL</label>
                  <input
                    type="text"
                    value={clientForm.logo}
                    onChange={(e) => setClientForm({ ...clientForm, logo: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Scope Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summary of landscaping work delivered..."
                  value={clientForm.description}
                  onChange={(e) => setClientForm({ ...clientForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                />
              </div>

              <div className="pt-3 border-t border-[#283618]/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddClientModal(false);
                    setEditingClient(null);
                  }}
                  className="px-3 py-1.5 text-xs text-ink-500 hover:text-ink-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-green-900 hover:bg-[#1f2b13] text-cream-50 text-xs font-medium rounded shadow-xs cursor-pointer"
                >
                  {editingClient ? "Update Partner" : "Save Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 3: INQUIRY DETAILS                                          */}
      {/* ================================================================= */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-[#283618]/15 rounded-brand p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#283618]/10 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#283618]/70">
                  Inquiry Specifications
                </span>
                <h3 className="text-base font-serif font-semibold text-green-900">
                  {selectedLead.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-ink-500 hover:text-ink-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-cream-50/60 p-3 rounded border border-[#283618]/5">
                <div>
                  <span className="text-ink-500 text-[10px] block font-mono">Phone</span>
                  <span className="font-mono font-bold text-green-900">{selectedLead.phone}</span>
                </div>
                <div>
                  <span className="text-ink-500 text-[10px] block font-mono">Email</span>
                  <span className="font-mono text-ink-900">{selectedLead.email}</span>
                </div>
              </div>

              {selectedLead.company && (
                <div>
                  <span className="text-ink-500 text-[10px] block font-mono">Company</span>
                  <span className="text-ink-900 font-light">{selectedLead.company}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-ink-500 text-[10px] block font-mono">Classification</span>
                  <span className="text-ink-900 font-light">{selectedLead.clientType || "Direct"}</span>
                </div>
                <div>
                  <span className="text-ink-500 text-[10px] block font-mono">Scope Area</span>
                  <span className="text-ink-900 font-light">{selectedLead.approxArea ? `${selectedLead.approxArea} sq. ft.` : "Not specified"}</span>
                </div>
              </div>

              {(selectedLead.notes || selectedLead.message) && (
                <div>
                  <span className="text-ink-500 text-[10px] block font-mono">Notes</span>
                  <p className="bg-cream-50/70 p-3 rounded border border-[#283618]/5 text-ink-900 italic leading-relaxed">
                    &ldquo;{selectedLead.notes || selectedLead.message}&rdquo;
                  </p>
                </div>
              )}

              <div className="pt-2 text-[11px] font-mono text-ink-500">
                Submitted on {new Date(selectedLead.createdAt).toLocaleString()} · Route: {selectedLead.sourcePage}
              </div>
            </div>

            <div className="pt-4 border-t border-[#283618]/10 mt-5 flex items-center justify-between">
              <button
                onClick={() => handleDeleteLead(selectedLead.id)}
                className="text-xs text-red-700 hover:text-red-900 cursor-pointer"
              >
                Delete
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Hello ${selectedLead.name}, this is the GreenGallery team regarding your landscape inquiry.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-green-900 hover:bg-[#1f2b13] text-cream-50 text-xs font-medium rounded shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-3 py-1.5 border border-[#283618]/15 text-xs text-ink-900 rounded cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
