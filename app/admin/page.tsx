"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Info,
  Settings,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Compass,
  Film,
  Camera,
  Play,
  Star,
  Video,
  ArrowUpRight,
} from "lucide-react";
import {
  LeadSubmission,
  InventoryItem,
  ClientPartner,
  Project,
  ServiceItem,
  MaintenancePackageItem,
  ArchitectureCard,
  Review,
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
  const [activeTab, setActiveTab] = useState<"analytics" | "leads" | "inventory" | "projects" | "clients" | "services" | "maintenance" | "architecture" | "reviews" | "cms" | "settings">("analytics");

  // Settings & Passcode Security state
  const [settingsData, setSettingsData] = useState<{
    securityQuestion: string;
    recoveryEmail: string;
    hasEmergencyKey: boolean;
    lastPasscodeChange: string;
  } | null>(null);
  const [currentPasscode, setCurrentPasscode] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isChangingPasscode, setIsChangingPasscode] = useState(false);
  const [passcodeStatus, setPasscodeStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  // Emergency Recovery Mode (on Login and inside Settings)
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryCredential, setRecoveryCredential] = useState("");
  const [recoveryNewPass, setRecoveryNewPass] = useState("");
  const [recoveryConfirmPass, setRecoveryConfirmPass] = useState("");
  const [recoveryStatus, setRecoveryStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const [isRecovering, setIsRecovering] = useState(false);
  const [showEmergencyKeyInSettings, setShowEmergencyKeyInSettings] = useState(false);

  // CMS Sub-page tab state
  const [cmsPageTab, setCmsPageTab] = useState<"home" | "about" | "services" | "projects" | "plants" | "maintenance" | "contact">("home");

  // Telemetry & Analytics state
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [recentEvents, setRecentEvents] = useState<AnalyticsEvent[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [clearingTelemetry, setClearingTelemetry] = useState(false);

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
  const [editingPlant, setEditingPlant] = useState<InventoryItem | null>(null);

  // Add plant form state
  const [newPlant, setNewPlant] = useState({
    name: "",
    botanicalName: "",
    category: "Trees and Palms" as InventoryItem["category"],
    sizeOrHeight: "6 - 8 ft",
    potSize: "18-inch Bag",
    quantityInStock: 20,
    price: 3500,
    priceBand: "₹2,500 - ₹5,000",
    image: "/images/hero-clean.webp",
    description: "",
  });

  // Edit plant form state
  const [editPlantForm, setEditPlantForm] = useState({
    name: "",
    botanicalName: "",
    category: "Trees and Palms" as InventoryItem["category"],
    sizeOrHeight: "",
    potSize: "",
    quantityInStock: 0,
    status: "In Stock" as InventoryItem["status"],
    price: 0,
    priceBand: "",
    image: "",
    description: "",
  });

  // Builder Clients & Projects state
  const [clients, setClients] = useState<ClientPartner[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientPartner | null>(null);
  const [clientForm, setClientForm] = useState({
    name: "",
    tagline: "",
    city: "Pune",
    location: "Pune, Maharashtra",
    logo: "/images/clients/nirman-greens.jpg",
    coverImage: "/images/frames/ezgif-frame-001.jpg",
    videoUrl: "",
    description: "",
    whatWeDid: "",
    plantsUsed: "",
    servicesUsed: "Landscape Design and Installation, Project Foliage for Builders",
    year: 2024,
    areaSqFt: 45000,
    category: "Township and Large Developments" as Project["category"],
    galleryImages: [] as string[],
    featuredProjectSlug: "",
  });

  // Services state
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceForm, setServiceForm] = useState({
    title: "",
    category: "Commercial" as ServiceItem["category"],
    shortDescription: "",
    fullDescription: "",
    idealFor: "Builders, developers & societies across Pune & PCMC",
    features: "Architectural CAD coordination, Engineered soil matrices, Staging from Alandi depot",
    scope: "Topographical assessment, Soil profiling, Specimen planting, Drip irrigation",
    image: "/images/frames/ezgif-frame-001.jpg",
  });

  // Maintenance packages state
  const [maintenancePackages, setMaintenancePackages] = useState<MaintenancePackageItem[]>([]);
  const [showAddPkgModal, setShowAddPkgModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState<MaintenancePackageItem | null>(null);
  const [pkgForm, setPkgForm] = useState({
    name: "",
    type: "Residential" as MaintenancePackageItem["type"],
    target: "Private Villas, Farmhouses & Penthouses in Pune, Mulshi, Lonavala",
    frequency: "Weekly or Bi-Weekly Visits",
    highlights: "Dedicated gardener visits, Lawn mowing, Organic vermicompost drenches, Plant health audits",
    ctaText: "Enquire for Villa",
    priceNote: "Custom proposal based on lawn square footage",
    image: "/images/hero-clean.webp",
  });

  // Architecture & Design cards state
  const [architectureCards, setArchitectureCards] = useState<ArchitectureCard[]>([]);
  const [showAddArchModal, setShowAddArchModal] = useState(false);
  const [editingArchCard, setEditingArchCard] = useState<ArchitectureCard | null>(null);
  const [archForm, setArchForm] = useState({
    title: "",
    subtitle: "",
    category: "Podium & Deck Architecture" as ArchitectureCard["category"],
    image: "",
    video: "",
    description: "",
    scaleArea: "",
    tags: "",
    details: "",
    featured: false,
    order: 0,
  });

  // Client Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    role: "Client",
    company: "",
    rating: 5,
    comment: "",
    project: "",
    date: "",
    verified: true,
    approved: true,
  });

  // Multi-Page CMS state
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [cmsSaving, setCmsSaving] = useState(false);
  const [cmsNotice, setCmsNotice] = useState("");

  // Uploading state for images
  const [uploadingImage, setUploadingImage] = useState(false);
  const plantImageFileInputRef = useRef<HTMLInputElement>(null);
  const editPlantImageFileInputRef = useRef<HTMLInputElement>(null);
  const clientImageFileInputRef = useRef<HTMLInputElement>(null);
  const clientCoverImageFileInputRef = useRef<HTMLInputElement>(null);
  const clientVideoFileInputRef = useRef<HTMLInputElement>(null);
  const clientGalleryImageFileInputRef = useRef<HTMLInputElement>(null);
  const serviceImageFileInputRef = useRef<HTMLInputElement>(null);
  const pkgImageFileInputRef = useRef<HTMLInputElement>(null);
  const archImageFileInputRef = useRef<HTMLInputElement>(null);
  const archVideoFileInputRef = useRef<HTMLInputElement>(null);
  const heroImageFileInputRef = useRef<HTMLInputElement>(null);

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

  // Secure Passcode Change Handler with Previous Passcode Verification
  const handleChangePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeStatus({ type: null, message: "" });

    if (!currentPasscode || !newPasscode || !confirmPasscode) {
      setPasscodeStatus({ type: "error", message: "Please fill in all passcode fields." });
      return;
    }

    if (newPasscode !== confirmPasscode) {
      setPasscodeStatus({ type: "error", message: "New passcode and confirmation do not match." });
      return;
    }

    if (newPasscode.length < 6) {
      setPasscodeStatus({ type: "error", message: "New passcode must be at least 6 characters." });
      return;
    }

    setIsChangingPasscode(true);
    try {
      const res = await fetch("/api/admin/settings/change-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPasscode,
          newPasscode,
          confirmPasscode,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasscodeStatus({ type: "success", message: "Passcode updated successfully! Next login requires this new passcode." });
        setCurrentPasscode("");
        setNewPasscode("");
        setConfirmPasscode("");
        // Refresh settings state
        fetch("/api/admin/settings")
          .then((r) => r.json())
          .then((d) => {
            if (d.success && d.settings) setSettingsData(d.settings);
          })
          .catch(() => {});
      } else {
        setPasscodeStatus({ type: "error", message: data.error || "Failed to change passcode. Verify previous passcode." });
      }
    } catch {
      setPasscodeStatus({ type: "error", message: "Network connection failure while updating passcode." });
    } finally {
      setIsChangingPasscode(false);
    }
  };

  // Emergency Passcode Recovery Handler
  const handleRecoverPasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryStatus({ type: null, message: "" });

    if (!recoveryCredential || !recoveryNewPass || !recoveryConfirmPass) {
      setRecoveryStatus({ type: "error", message: "All fields are required for recovery." });
      return;
    }

    if (recoveryNewPass !== recoveryConfirmPass) {
      setRecoveryStatus({ type: "error", message: "New passcode and confirmation do not match." });
      return;
    }

    if (recoveryNewPass.length < 6) {
      setRecoveryStatus({ type: "error", message: "New passcode must be at least 6 characters." });
      return;
    }

    setIsRecovering(true);
    try {
      const res = await fetch("/api/admin/settings/recover-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recoveryCredential,
          newPasscode: recoveryNewPass,
          confirmPasscode: recoveryConfirmPass,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRecoveryStatus({ type: "success", message: data.message || "Passcode successfully reset! Logging you in..." });
        setPasscode(recoveryNewPass);
        setTimeout(async () => {
          // Auto login with new passcode
          const loginRes = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ passcode: recoveryNewPass }),
          });
          const loginData = await loginRes.json();
          if (loginRes.ok && loginData.success) {
            setIsAuthenticated(true);
            setIsRecoveryMode(false);
            loadAllData();
          } else {
            setIsRecoveryMode(false);
          }
        }, 1200);
      } else {
        setRecoveryStatus({ type: "error", message: data.error || "Invalid recovery verification credential." });
      }
    } catch {
      setRecoveryStatus({ type: "error", message: "Network failure while processing recovery." });
    } finally {
      setIsRecovering(false);
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
      const [leadsRes, invRes, clientsRes, projectsRes, servicesRes, maintenanceRes, archRes, reviewsRes, cmsRes, analyticsRes, settingsRes] = await Promise.all([
        fetch("/api/leads").then((r) => r.json()).catch(() => ({ leads: [] })),
        fetch("/api/inventory").then((r) => r.json()).catch(() => ({ items: [] })),
        fetch("/api/clients").then((r) => r.json()).catch(() => ({ clients: [] })),
        fetch("/api/projects").then((r) => r.json()).catch(() => ({ projects: [] })),
        fetch("/api/services").then((r) => r.json()).catch(() => ({ services: [] })),
        fetch("/api/maintenance").then((r) => r.json()).catch(() => ({ packages: [] })),
        fetch("/api/architecture").then((r) => r.json()).catch(() => ({ cards: [] })),
        fetch("/api/reviews").then((r) => r.json()).catch(() => ({ reviews: [] })),
        fetch("/api/cms").then((r) => r.json()).catch(() => ({ content: defaultSiteContent })),
        fetch("/api/analytics").then((r) => r.json()).catch(() => ({ summary: null, recent: [] })),
        fetch("/api/admin/settings").then((r) => r.json()).catch(() => ({ settings: null })),
      ]);

      if (leadsRes.leads) setLeads(leadsRes.leads);
      if (invRes.items) setInventory(invRes.items);
      if (clientsRes.clients) setClients(clientsRes.clients);
      if (projectsRes.projects) setProjects(projectsRes.projects);
      if (servicesRes.services) setServices(servicesRes.services);
      if (maintenanceRes.packages) setMaintenancePackages(maintenanceRes.packages);
      if (archRes.cards) setArchitectureCards(archRes.cards);
      if (reviewsRes.reviews) setReviews(reviewsRes.reviews);
      if (cmsRes.content) setSiteContent({ ...defaultSiteContent, ...cmsRes.content });
      if (analyticsRes.summary) setAnalytics(analyticsRes.summary);
      if (analyticsRes.recent) setRecentEvents(analyticsRes.recent);
      if (settingsRes && settingsRes.settings) setSettingsData(settingsRes.settings);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Image file upload helper
  const handleFileUpload = async (file: File, onSuccess: (url: string) => void) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.url) {
        onSuccess(data.url);
      } else {
        alert(data.error || "Image upload failed");
      }
    } catch (e: any) {
      alert("Error uploading image: " + e.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Clear Telemetry Logs
  const handleClearTelemetry = async () => {
    if (!confirm("Are you sure you want to clear all staging telemetry logs?")) return;
    setClearingTelemetry(true);
    try {
      const res = await fetch("/api/analytics", { method: "DELETE" });
      if (res.ok) {
        setRecentEvents([]);
        if (analytics) {
          setAnalytics({
            ...analytics,
            totalVisits: 0,
            uniqueVisitors: 0,
            conversionRate: 0,
            pageViewsByPath: {},
            dailyTrends: [],
            recentVisits: [],
          });
        }
      }
    } catch (e) {
      console.error("Failed to clear telemetry", e);
    } finally {
      setClearingTelemetry(false);
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
  // INVENTORY ACTIONS (Editable & Images)
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

  const handleOpenEditPlant = (item: InventoryItem) => {
    setEditingPlant(item);
    setEditPlantForm({
      name: item.name,
      botanicalName: item.botanicalName,
      category: item.category,
      sizeOrHeight: item.sizeOrHeight,
      potSize: item.potSize,
      quantityInStock: item.quantityInStock,
      status: item.status,
      price: item.price || 0,
      priceBand: item.priceBand,
      image: item.image || "/images/hero-clean.webp",
      description: item.description || "",
    });
  };

  const handleSaveEditPlant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlant) return;

    try {
      const res = await fetch("/api/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingPlant.id,
          ...editPlantForm,
        }),
      });
      const data = await res.json();
      if (data.success && data.item) {
        setInventory((prev) => prev.map((i) => (i.id === editingPlant.id ? data.item : i)));
        setEditingPlant(null);
      } else {
        alert(data.error || "Failed to update specimen");
      }
    } catch (e: any) {
      alert("Error updating specimen: " + e.message);
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
          category: "Trees and Palms",
          sizeOrHeight: "6 - 8 ft",
          potSize: "18-inch Bag",
          quantityInStock: 20,
          price: 3500,
          priceBand: "₹2,500 - ₹5,000",
          image: "/images/hero-clean.webp",
          description: "",
        });
      }
    } catch (e) {
      console.error("Failed to create plant", e);
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
  // CLIENTS & PROJECTS ACTIONS
  // ---------------------------------------------------------------------------
  const openClientModal = (c?: ClientPartner) => {
    if (c) {
      setEditingClient(c);
      const matchingProj = projects.find(
        (p) => (c.featuredProjectSlug && p.slug === c.featuredProjectSlug) || p.slug === c.slug || p.clientName?.toLowerCase() === c.name.toLowerCase()
      );
      setClientForm({
        name: c.name,
        tagline: c.tagline || "",
        city: c.city || "Pune",
        location: matchingProj?.location || c.location || c.city || "Pune, Maharashtra",
        logo: c.logo || "/images/clients/nirman-greens.jpg",
        coverImage: matchingProj?.coverImage || c.logo || "/images/frames/ezgif-frame-001.jpg",
        videoUrl: matchingProj?.videoUrl || c.videoUrl || "",
        description: c.description || matchingProj?.brief || "",
        whatWeDid: (matchingProj?.whatWeDid || c.whatWeDid || []).join("\n"),
        plantsUsed: (matchingProj?.plantsUsed || []).join(", "),
        servicesUsed: (matchingProj?.servicesUsed || c.scope || []).join(", "),
        year: matchingProj?.year || 2024,
        areaSqFt: matchingProj?.areaSqFt || 45000,
        category: (matchingProj?.category || "Township and Large Developments") as Project["category"],
        galleryImages: (matchingProj?.images && matchingProj.images.length > 0)
          ? matchingProj.images.map((img: any) => img.url)
          : (c.galleryImages || []),
        featuredProjectSlug: c.featuredProjectSlug || matchingProj?.slug || "",
      });
    } else {
      setEditingClient(null);
      setClientForm({
        name: "",
        tagline: "",
        city: "Pune",
        location: "Pune, Maharashtra",
        logo: "/images/clients/nirman-greens.jpg",
        coverImage: "/images/frames/ezgif-frame-001.jpg",
        videoUrl: "",
        description: "",
        whatWeDid: "Engineered structural lightweight substrate formulation (<350 kg/m²)\nSpecimen mature canopy trees and avenue palms\nAutomated micro-drip irrigation running on STP water\nBasalt paver hardscape and perimeter acoustic foliage buffer",
        plantsUsed: "Terminalia mantaly, Foxtail Palms, Plumeria obtusa",
        servicesUsed: "Landscape Design and Installation, Project Foliage for Builders",
        year: new Date().getFullYear(),
        areaSqFt: 35000,
        category: "Township and Large Developments",
        galleryImages: ["/images/frames/ezgif-frame-001.jpg", "/images/frames/ezgif-frame-002.jpg"],
        featuredProjectSlug: "",
      });
    }
    setShowAddClientModal(true);
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.name || !clientForm.city) return;

    try {
      const parsedWhatWeDid = clientForm.whatWeDid
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedPlants = clientForm.plantsUsed
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedServices = clientForm.servicesUsed
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const clientPayload = {
        name: clientForm.name,
        tagline: clientForm.tagline,
        city: clientForm.city,
        location: clientForm.location,
        logo: clientForm.logo,
        description: clientForm.description,
        whatWeDid: parsedWhatWeDid,
        videoUrl: clientForm.videoUrl,
        galleryImages: clientForm.galleryImages,
        scope: parsedServices,
        featuredProjectSlug: clientForm.featuredProjectSlug || editingClient?.featuredProjectSlug,
      };

      let savedClient: ClientPartner | null = null;

      if (editingClient) {
        const res = await fetch("/api/clients", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingClient.id, ...clientPayload }),
        });
        const data = await res.json();
        if (data.success && data.client) {
          savedClient = data.client;
          setClients((prev) => prev.map((c) => (c.id === editingClient.id ? data.client : c)));
        }
      } else {
        const res = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clientPayload),
        });
        const data = await res.json();
        if (data.success && data.client) {
          savedClient = data.client;
          setClients((prev) => [...prev, data.client]);
        }
      }

      // Also create or sync matching project in projectsRepo via /api/projects
      const projectSlug = clientForm.featuredProjectSlug || editingClient?.featuredProjectSlug || clientForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const existingProject = projects.find(
        (p) => (projectSlug && p.slug === projectSlug) || p.clientName?.toLowerCase() === clientForm.name.toLowerCase()
      );

      const galleryImagesFormatted = clientForm.galleryImages.map((url, i) => ({
        url,
        caption: `${clientForm.name} photo ${i + 1}`,
        alt: clientForm.name,
      }));
      if (clientForm.coverImage && !galleryImagesFormatted.some((img) => img.url === clientForm.coverImage)) {
        galleryImagesFormatted.unshift({
          url: clientForm.coverImage,
          caption: `${clientForm.name} - Cover Showcase`,
          alt: clientForm.name,
        });
      }

      const projectPayload = {
        title: existingProject?.title || `${clientForm.name} Landscape Execution`,
        slug: existingProject?.slug || projectSlug,
        category: clientForm.category,
        location: clientForm.location || clientForm.city,
        year: Number(clientForm.year) || 2024,
        areaSqFt: Number(clientForm.areaSqFt) || 45000,
        clientName: clientForm.name,
        clientLogo: clientForm.logo,
        coverImage: clientForm.coverImage || clientForm.logo,
        videoUrl: clientForm.videoUrl,
        images: galleryImagesFormatted,
        brief: clientForm.description,
        whatWeDid: parsedWhatWeDid,
        plantsUsed: parsedPlants,
        servicesUsed: parsedServices,
        isFeatured: true,
        status: "COMPLETED",
      };

      if (existingProject) {
        const pRes = await fetch("/api/projects", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: existingProject.id, ...projectPayload }),
        });
        const pData = await pRes.json();
        if (pData.success && pData.project) {
          setProjects((prev) => prev.map((p) => (p.id === existingProject.id ? pData.project : p)));
        }
      } else {
        const pRes = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectPayload),
        });
        const pData = await pRes.json();
        if (pData.success && pData.project) {
          setProjects((prev) => [...prev, pData.project]);
          if (savedClient) {
            await fetch("/api/clients", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: savedClient.id, featuredProjectSlug: pData.project.slug }),
            });
          }
        }
      }

      setShowAddClientModal(false);
      setEditingClient(null);
    } catch (e) {
      console.error("Failed to save client and project", e);
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
  // SERVICES ACTIONS
  // ---------------------------------------------------------------------------
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title) return;

    const payload = {
      ...serviceForm,
      features: typeof serviceForm.features === "string" ? serviceForm.features.split(",").map((s) => s.trim()).filter(Boolean) : serviceForm.features,
      scope: typeof serviceForm.scope === "string" ? serviceForm.scope.split(",").map((s) => s.trim()).filter(Boolean) : serviceForm.scope,
    };

    try {
      if (editingService) {
        const res = await fetch("/api/services", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingService.id, ...payload }),
        });
        const data = await res.json();
        if (data.success && data.service) {
          setServices((prev) => prev.map((s) => (s.id === editingService.id ? data.service : s)));
          setEditingService(null);
          setShowAddServiceModal(false);
        } else {
          alert(data.error || "Failed to update service");
        }
      } else {
        const res = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.service) {
          setServices((prev) => [data.service, ...prev]);
          setShowAddServiceModal(false);
          setServiceForm({
            title: "",
            category: "Commercial",
            shortDescription: "",
            fullDescription: "",
            idealFor: "Properties in Pune & PCMC",
            features: "Architectural CAD coordination, Engineered soil matrices, Staging from Alandi depot",
            scope: "Topographical assessment, Soil profiling, Specimen planting, Drip irrigation",
            image: "/images/frames/ezgif-frame-001.jpg",
          });
        } else {
          alert(data.error || "Failed to create service");
        }
      }
    } catch (e: any) {
      alert("Error saving service: " + e.message);
    }
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete service "${title}"?`)) return;
    try {
      const res = await fetch(`/api/services?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert(data.error || "Failed to delete service");
      }
    } catch (e: any) {
      alert("Error deleting service: " + e.message);
    }
  };

  // ---------------------------------------------------------------------------
  // MAINTENANCE ACTIONS
  // ---------------------------------------------------------------------------
  const handleSaveMaintenancePkg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgForm.name) return;

    const payload = {
      ...pkgForm,
      highlights: typeof pkgForm.highlights === "string" ? pkgForm.highlights.split(",").map((s) => s.trim()).filter(Boolean) : pkgForm.highlights,
    };

    try {
      if (editingPkg) {
        const res = await fetch("/api/maintenance", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingPkg.id, ...payload }),
        });
        const data = await res.json();
        if (data.success && data.package) {
          setMaintenancePackages((prev) => prev.map((p) => (p.id === editingPkg.id ? data.package : p)));
          setEditingPkg(null);
          setShowAddPkgModal(false);
        } else {
          alert(data.error || "Failed to update package");
        }
      } else {
        const res = await fetch("/api/maintenance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.package) {
          setMaintenancePackages((prev) => [...prev, data.package]);
          setShowAddPkgModal(false);
          setPkgForm({
            name: "",
            type: "Residential",
            target: "Private residences in Pune",
            frequency: "Weekly Visits",
            highlights: "Gardener visits, Lawn mowing, Organic vermicompost, Plant health audits",
            ctaText: "Enquire Now",
            priceNote: "Custom pricing",
            image: "/images/hero-clean.webp",
          });
        } else {
          alert(data.error || "Failed to create package");
        }
      }
    } catch (e: any) {
      alert("Error saving maintenance package: " + e.message);
    }
  };

  const handleDeleteMaintenancePkg = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete maintenance package "${name}"?`)) return;
    try {
      const res = await fetch(`/api/maintenance?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMaintenancePackages((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.error || "Failed to delete maintenance package");
      }
    } catch (e: any) {
      alert("Error deleting package: " + e.message);
    }
  };

  // ---------------------------------------------------------------------------
  // ARCHITECTURE & DESIGN ACTIONS
  // ---------------------------------------------------------------------------
  const handleSaveArchitectureCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archForm.title) {
      alert("Please provide a title for the architecture project card.");
      return;
    }

    try {
      const detailsArray = archForm.details
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const tagsArray = archForm.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: archForm.title,
        subtitle: archForm.subtitle,
        category: archForm.category,
        image: archForm.image,
        video: archForm.video,
        description: archForm.description,
        scaleArea: archForm.scaleArea,
        tags: tagsArray,
        details: detailsArray,
        featured: archForm.featured,
        order: Number(archForm.order) || 0,
      };

      if (editingArchCard) {
        const res = await fetch("/api/architecture", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingArchCard.id, ...payload }),
        });
        const data = await res.json();
        if (data.success && data.card) {
          setArchitectureCards((prev) =>
            prev.map((c) => (c.id === editingArchCard.id ? data.card : c))
          );
          setShowAddArchModal(false);
          setEditingArchCard(null);
        } else {
          alert(data.error || "Failed to update card");
        }
      } else {
        const res = await fetch("/api/architecture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.card) {
          setArchitectureCards((prev) => [...prev, data.card]);
          setShowAddArchModal(false);
          setArchForm({
            title: "",
            subtitle: "",
            category: "Podium & Deck Architecture",
            image: "",
            video: "",
            description: "",
            scaleArea: "",
            tags: "",
            details: "",
            featured: false,
            order: 0,
          });
        } else {
          alert(data.error || "Failed to create card");
        }
      }
    } catch (e: any) {
      alert("Error saving architecture card: " + e.message);
    }
  };

  const handleDeleteArchitectureCard = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete architecture card "${title}"?`)) return;
    try {
      const res = await fetch(`/api/architecture?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setArchitectureCards((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(data.error || "Failed to delete card");
      }
    } catch (e: any) {
      alert("Error deleting architecture card: " + e.message);
    }
  };

  // ---------------------------------------------------------------------------
  // CLIENT REVIEWS & FEEDBACK ACTIONS
  // ---------------------------------------------------------------------------
  const openReviewModal = (rev?: Review) => {
    if (rev) {
      setEditingReview(rev);
      setReviewForm({
        name: rev.name || "",
        role: rev.role || "Client",
        company: rev.company || "",
        rating: rev.rating || 5,
        comment: rev.comment || "",
        project: rev.project || "",
        date: rev.date || "",
        verified: rev.verified !== undefined ? rev.verified : true,
        approved: rev.approved !== false,
      });
    } else {
      setEditingReview(null);
      const now = new Date();
      const monthYear = now.toLocaleString("en-US", { month: "long", year: "numeric" });
      setReviewForm({
        name: "",
        role: "Client",
        company: "",
        rating: 5,
        comment: "",
        project: "Landscape & Botanical Execution",
        date: monthYear,
        verified: true,
        approved: true,
      });
    }
    setShowReviewModal(true);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      alert("Name and review feedback comment are required.");
      return;
    }

    try {
      if (editingReview) {
        const res = await fetch("/api/reviews", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingReview.id,
            ...reviewForm,
          }),
        });
        const data = await res.json();
        if (data.success && data.review) {
          setReviews((prev) => prev.map((r) => (r.id === editingReview.id ? data.review : r)));
          setShowReviewModal(false);
          setEditingReview(null);
        } else {
          alert(data.error || "Failed to update review");
        }
      } else {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewForm),
        });
        const data = await res.json();
        if (data.success && data.review) {
          setReviews((prev) => [data.review, ...prev]);
          setShowReviewModal(false);
        } else {
          alert(data.error || "Failed to create review");
        }
      }
    } catch (e: any) {
      alert("Error saving review: " + e.message);
    }
  };

  const handleToggleApprovedReview = async (id: string) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "toggleApproved" }),
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviews((prev) => prev.map((r) => (r.id === id ? data.review : r)));
      } else {
        alert(data.error || "Failed to update review approval status");
      }
    } catch (e: any) {
      alert("Error updating review approval: " + e.message);
    }
  };

  const handleToggleVerifiedReview = async (id: string) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "toggleVerified" }),
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviews((prev) => prev.map((r) => (r.id === id ? data.review : r)));
      } else {
        alert(data.error || "Failed to update review status");
      }
    } catch (e: any) {
      alert("Error updating review: " + e.message);
    }
  };

  const handleDeleteReview = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete review from "${name}"?`)) return;
    try {
      const res = await fetch(`/api/reviews?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert(data.error || "Failed to delete review");
      }
    } catch (e: any) {
      alert("Error deleting review: " + e.message);
    }
  };

  // ---------------------------------------------------------------------------
  // MULTI-PAGE CMS ACTIONS
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
        setCmsNotice("All page updates successfully saved and published across the website!");
        setTimeout(() => setCmsNotice(""), 4000);
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
        image: "/images/hero-clean.webp",
        title: row === 1 ? "New Executed Landscape" : "New Botanical Specimen",
        subtitle: row === 1 ? "Podium & Estate Greening" : "Acclimatized Nursery Stock",
      });
      return { ...prev, [key]: list };
    });
  };

  const handleRemoveShowcaseItem = (row: 1 | 2, index: number) => {
    setSiteContent((prev) => {
      const key = row === 1 ? "showcaseRow1" : "showcaseRow2";
      const list = [...(prev[key] || defaultSiteContent[key])];
      list.splice(index, 1);
      return { ...prev, [key]: list };
    });
  };

  // ---------------------------------------------------------------------------
  // RENDER: LOGIN WALL (Unauthenticated)
  // ---------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white border border-[#283618]/15 rounded-brand p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="relative w-20 h-20 mx-auto mb-3 rounded-2xl overflow-hidden border border-amber-500/40 bg-[#08150E] p-1 shadow-md">
              <Image
                src="/images/emblem.jpg"
                alt="GreenGallery Emblem"
                fill
                className="object-cover rounded-xl"
                sizes="80px"
              />
            </div>
            <h1 className="text-2xl font-serif font-bold text-green-950 tracking-tight">
              GreenGallery
            </h1>
            <p className="text-[11px] text-amber-800 font-medium tracking-wide">
              {isRecoveryMode ? "Security Verification & Recovery" : "Cultivating Natural Elegance"}
            </p>
          </div>

          {!isRecoveryMode ? (
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

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRecoveryMode(true);
                    setPassError("");
                  }}
                  className="text-[11px] text-green-800 hover:text-green-950 font-medium underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Forgot passcode? Use emergency recovery
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRecoverPasscode} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium text-[#283618] uppercase tracking-wider mb-1 font-mono">
                  Registered Security Verification *
                </label>
                <input
                  type="text"
                  required
                  value={recoveryCredential}
                  onChange={(e) => setRecoveryCredential(e.target.value)}
                  placeholder="Administrator email or recovery key"
                  className="w-full px-3 py-2 bg-cream-50/60 border border-[#283618]/15 rounded-brand text-xs focus:outline-none focus:border-green-900"
                />
                <p className="text-[10px] text-ink-500 mt-0.5">
                  e.g. Registered operational email or emergency key.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#283618] uppercase tracking-wider mb-1 font-mono">
                  New Passcode *
                </label>
                <input
                  type="password"
                  required
                  value={recoveryNewPass}
                  onChange={(e) => setRecoveryNewPass(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 bg-cream-50/60 border border-[#283618]/15 rounded-brand text-xs font-mono focus:outline-none focus:border-green-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#283618] uppercase tracking-wider mb-1 font-mono">
                  Confirm New Passcode *
                </label>
                <input
                  type="password"
                  required
                  value={recoveryConfirmPass}
                  onChange={(e) => setRecoveryConfirmPass(e.target.value)}
                  placeholder="Re-enter new passcode"
                  className="w-full px-3 py-2 bg-cream-50/60 border border-[#283618]/15 rounded-brand text-xs font-mono focus:outline-none focus:border-green-900"
                />
              </div>

              {recoveryStatus.message && (
                <div
                  className={`p-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                    recoveryStatus.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  {recoveryStatus.type === "success" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{recoveryStatus.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isRecovering}
                className="w-full py-2.5 bg-green-900 hover:bg-[#1f2b13] text-cream-50 font-medium text-xs tracking-wider uppercase rounded-brand shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{isRecovering ? "Verifying..." : "Reset Passcode & Unlock"}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRecoveryMode(false);
                    setRecoveryStatus({ type: null, message: "" });
                  }}
                  className="text-[11px] text-ink-500 hover:text-ink-800 font-medium underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Back to standard passcode login
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-4 border-t border-[#283618]/10 text-center">
            <p className="text-[10px] text-ink-500 font-mono">
              Administrative Desk · Governance Security
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: AUTHENTICATED DASHBOARD
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full min-h-screen bg-cream-50 text-ink-900 pb-24 md:pb-16 font-sans">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#283618]/10 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-amber-500/40 bg-[#08150E] p-0.5 shadow-xs shrink-0">
              <Image
                src="/images/emblem.jpg"
                alt="GreenGallery Emblem"
                fill
                className="object-cover rounded-full"
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

          {/* Desktop Navigation Tabs */}
          <nav className="hidden xl:flex items-center gap-1 p-1 bg-cream-50/80 rounded-brand border border-[#283618]/10">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-3 py-1.5 rounded-brand text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "analytics"
                  ? "bg-green-900 text-cream-50 shadow-sm"
                  : "text-ink-500 hover:text-green-900"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Operations Hub</span>
            </button>

            <button
              onClick={() => setActiveTab("leads")}
              className={`px-3 py-1.5 rounded-brand text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
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
              className={`px-3 py-1.5 rounded-brand text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
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
              onClick={() => setActiveTab("projects")}
              className={`px-3 py-1.5 rounded-brand text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "projects"
                  ? "bg-green-900 text-cream-50 shadow-sm"
                  : "text-ink-500 hover:text-green-900"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Projects &amp; Clients</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/10 text-ink-900">
                {clients.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("services")}
              className={`px-3 py-1.5 rounded-brand text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "services"
                  ? "bg-green-900 text-cream-50 shadow-sm"
                  : "text-ink-500 hover:text-green-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Services</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/10 text-ink-900">
                {services.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("maintenance")}
              className={`px-3 py-1.5 rounded-brand text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "maintenance"
                  ? "bg-green-900 text-cream-50 shadow-sm"
                  : "text-ink-500 hover:text-green-900"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Maintenance AMC</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/10 text-ink-900">
                {maintenancePackages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("architecture")}
              className={`px-3 py-1.5 rounded-brand text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "architecture"
                  ? "bg-green-900 text-cream-50 shadow-sm"
                  : "text-ink-500 hover:text-green-900"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Architecture &amp; Design</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/10 text-ink-900">
                {architectureCards.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-3 py-1.5 rounded-brand text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "reviews"
                  ? "bg-green-900 text-cream-50 shadow-sm"
                  : "text-ink-500 hover:text-green-900"
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Reviews</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/10 text-ink-900">
                {reviews.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("cms")}
              className={`px-3 py-1.5 rounded-brand text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "cms"
                  ? "bg-green-900 text-cream-50 shadow-sm"
                  : "text-ink-500 hover:text-green-900"
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>CMS</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`px-3 py-1.5 rounded-brand text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "settings"
                  ? "bg-green-900 text-cream-50 shadow-sm"
                  : "text-ink-500 hover:text-green-900"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
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

        {/* Mobile / Compact Navigation Tab Strip (Horizontal Scroll) */}
        <div className="xl:hidden flex items-center gap-1.5 overflow-x-auto px-4 py-2 bg-cream-100/90 border-t border-[#283618]/10 no-scrollbar">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "analytics"
                ? "bg-green-900 text-white shadow-xs"
                : "bg-white text-ink-700 border border-[#283618]/10"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Hub</span>
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "leads"
                ? "bg-green-900 text-white shadow-xs"
                : "bg-white text-ink-700 border border-[#283618]/10"
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Leads ({leads.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "inventory"
                ? "bg-green-900 text-white shadow-xs"
                : "bg-white text-ink-700 border border-[#283618]/10"
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Stock ({inventory.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "projects"
                ? "bg-green-900 text-white shadow-xs"
                : "bg-white text-ink-700 border border-[#283618]/10"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Projects ({clients.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "services"
                ? "bg-green-900 text-white shadow-xs"
                : "bg-white text-ink-700 border border-[#283618]/10"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Services ({services.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("maintenance")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "maintenance"
                ? "bg-green-900 text-white shadow-xs"
                : "bg-white text-ink-700 border border-[#283618]/10"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>AMC ({maintenancePackages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("architecture")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "architecture"
                ? "bg-green-900 text-white shadow-xs"
                : "bg-white text-ink-700 border border-[#283618]/10"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Architecture ({architectureCards.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "reviews"
                ? "bg-green-900 text-white shadow-xs"
                : "bg-white text-ink-700 border border-[#283618]/10"
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Reviews ({reviews.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("cms")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "cms"
                ? "bg-green-900 text-white shadow-xs"
                : "bg-white text-ink-700 border border-[#283618]/10"
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>CMS</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "settings"
                ? "bg-green-900 text-white shadow-xs"
                : "bg-white text-ink-700 border border-[#283618]/10"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* ================================================================= */}
        {/* TAB 1: AUTHENTIC PRE-LAUNCH OPERATIONS HUB (NO FAKE NUMBERS)      */}
        {/* ================================================================= */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#283618]/10">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#283618]/70">
                  Pre-Launch Operations Desk
                </span>
                <h2 className="text-2xl font-serif font-semibold text-green-900 mt-0.5">
                  System Health & Staging Metrics
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-amber-50 text-amber-900 border border-amber-200 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Pre-Launch Staging Mode
                </span>
              </div>
            </div>

            {/* Pre-launch Transparency Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#283618]/15 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-green-900 font-bold text-sm">
                <Info className="w-4 h-4 text-green-700" />
                <span>Pre-Launch Staging Environment Notice</span>
              </div>
              <p className="text-xs text-ink-700 leading-relaxed font-light">
                This platform is currently staged in a development environment prior to live domain deployment on <strong>greengallery.in</strong>. All visitor telemetry charts and conversion metrics below show <strong>100% genuine database counts</strong>. No fake traffic, simulated clicks, or fabricated page view numbers are displayed.
              </p>
            </div>

            {/* Authentic KPI Metric Ledger */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#283618]/10 rounded-brand p-5 shadow-xs">
                <div className="text-[11px] font-mono text-ink-500 uppercase tracking-wider mb-2">
                  Captured Inquiries
                </div>
                <div className="text-3xl font-serif font-bold text-green-900">
                  {leads.length}
                </div>
                <div className="text-[11px] text-green-700 mt-2 font-mono">
                  {leads.length === 0 ? "Awaiting first client form" : `${leads.length} genuine submissions`}
                </div>
              </div>

              <div className="bg-white border border-[#283618]/10 rounded-brand p-5 shadow-xs">
                <div className="text-[11px] font-mono text-ink-500 uppercase tracking-wider mb-2">
                  Nursery Specimens
                </div>
                <div className="text-3xl font-serif font-bold text-green-900">
                  {inventory.length}
                </div>
                <div className="text-[11px] text-ink-500 mt-2 font-mono">
                  Active stock items staged
                </div>
              </div>

              <div className="bg-white border border-[#283618]/10 rounded-brand p-5 shadow-xs">
                <div className="text-[11px] font-mono text-ink-500 uppercase tracking-wider mb-2">
                  Developer Partners
                </div>
                <div className="text-3xl font-serif font-bold text-green-900">
                  {clients.length}
                </div>
                <div className="text-[11px] text-ink-500 mt-2 font-mono">
                  Pune real estate builders
                </div>
              </div>

              <div className="bg-white border border-[#283618]/10 rounded-brand p-5 shadow-xs">
                <div className="text-[11px] font-mono text-ink-500 uppercase tracking-wider mb-2">
                  Local Staging Hits
                </div>
                <div className="text-3xl font-serif font-bold text-gold-600">
                  {analytics?.totalVisits || 0}
                </div>
                <div className="text-[11px] text-ink-500 mt-2 font-mono">
                  Internal testing route events
                </div>
              </div>
            </div>

            {/* Operational Readiness Matrix */}
            <div className="bg-white border border-[#283618]/10 rounded-brand p-6 shadow-xs space-y-4">
              <h3 className="text-base font-serif font-semibold text-green-900">
                Pune Operational Infrastructure & Readiness
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-cream-50/70 border border-[#283618]/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-950 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-green-700" />
                      Alandi Logistical Staging Depot
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-100 text-green-800 font-bold">
                      Operational
                    </span>
                  </div>
                  <p className="text-ink-600 font-light text-[11px]">
                    Dedicated logistical depot for batch receiving, soil conditioning, and civil landscape dispatch across Pune.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-cream-50/70 border border-[#283618]/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-950 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600" />
                      Highway Botanical Nursery Hub
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                      In Development
                    </span>
                  </div>
                  <p className="text-ink-600 font-light text-[11px]">
                    Old Mumbai–Pune Highway facility under active development. Current deliveries staged through Alandi.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-cream-50/70 border border-[#283618]/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-950 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-green-700" />
                      Official WhatsApp / Phone Desk
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-100 text-green-800 font-bold">
                      Active (+91 7823080251)
                    </span>
                  </div>
                  <p className="text-ink-600 font-light text-[11px]">
                    Direct consultation channel configured with pre-filled landscape inquiry messages for visiting clients.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-cream-50/70 border border-[#283618]/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-950 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-green-700" />
                      Business Email Desk
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-100 text-green-800 font-bold">
                      greengallery.landscapers@gmail.com
                    </span>
                  </div>
                  <p className="text-ink-600 font-light text-[11px]">
                    Direct corporate desk for architect drawings, developer tender BOQ submissions, and contractor estimates.
                  </p>
                </div>
              </div>
            </div>

            {/* Genuine Local Staging Telemetry Log */}
            <div className="bg-white border border-[#283618]/10 rounded-brand p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-serif font-semibold text-green-900">
                    Staging Session Telemetry Log
                  </h3>
                  <p className="text-xs text-ink-500 font-light">
                    Real-time local event stream logged from test browsing sessions.
                  </p>
                </div>
                {recentEvents.length > 0 && (
                  <button
                    onClick={handleClearTelemetry}
                    disabled={clearingTelemetry}
                    className="px-3 py-1.5 text-xs text-red-700 hover:text-red-900 border border-red-200 hover:bg-red-50 rounded-brand transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    {clearingTelemetry ? "Clearing..." : "Clear Staging Telemetry"}
                  </button>
                )}
              </div>

              {recentEvents.length === 0 ? (
                <div className="text-center py-10 bg-cream-50/50 rounded-xl border border-dashed border-[#283618]/15 text-xs text-ink-500">
                  No local testing events logged yet. Browse pages on localhost to view live event telemetry.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-cream-50 text-ink-600 font-mono uppercase text-[10px] border-b border-[#283618]/10">
                      <tr>
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Route / Path</th>
                        <th className="py-2.5 px-3">Device</th>
                        <th className="py-2.5 px-3">Referrer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#283618]/5">
                      {recentEvents.slice(0, 10).map((evt) => (
                        <tr key={evt.id} className="hover:bg-cream-50/50">
                          <td className="py-2.5 px-3 font-mono text-[11px] text-ink-500">
                            {new Date(evt.timestamp).toLocaleTimeString()} · {new Date(evt.timestamp).toLocaleDateString()}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-green-950">
                            {evt.path}
                          </td>
                          <td className="py-2.5 px-3 capitalize font-mono text-ink-600">
                            {evt.deviceType}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-ink-500 truncate max-w-[150px]">
                            {evt.referrer || "Direct"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: INQUIRIES & LEADS MANAGEMENT                               */}
        {/* ================================================================= */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#283618]/10">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#283618]/70">
                  Lead Management
                </span>
                <h2 className="text-2xl font-serif font-semibold text-green-900 mt-0.5">
                  Captured Inquiries ({filteredLeads.length})
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportLeadsCSV}
                  className="px-3.5 py-2 border border-[#283618]/15 hover:bg-cream-200/50 text-[#283618] text-xs font-medium rounded-brand shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white border border-[#283618]/10 rounded-brand p-3.5 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-ink-500" />
                <input
                  type="text"
                  placeholder="Search by client, phone, company..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-cream-50/50 border border-[#283618]/10 rounded-brand text-xs focus:outline-none focus:border-green-900"
                />
              </div>

              <div className="w-full sm:w-auto flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {["all", "New", "Contacted", "Meeting Scheduled", "Closed"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setLeadStatusFilter(st)}
                    className={`px-3 py-1.5 rounded text-xs transition-colors cursor-pointer font-mono whitespace-nowrap ${
                      leadStatusFilter === st
                        ? "bg-green-900 text-cream-50"
                        : "text-ink-500 hover:text-green-900 hover:bg-cream-200/40"
                    }`}
                  >
                    {st === "all" ? "All Statuses" : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries Cards Grid */}
            {filteredLeads.length === 0 ? (
              <div className="bg-white border border-[#283618]/10 rounded-brand p-12 text-center">
                <Inbox className="w-8 h-8 text-ink-500 mx-auto mb-2" />
                <p className="text-sm text-ink-500 font-serif">No inquiries found matching criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white border border-[#283618]/10 rounded-brand p-5 shadow-xs flex flex-col justify-between hover:border-green-900/30 transition-colors"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cream-50 text-[#283618] border border-[#283618]/10">
                          {lead.type}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            lead.status === "New"
                              ? "bg-gold-50 text-gold-900 border-gold-200"
                              : lead.status === "Closed"
                              ? "bg-green-50 text-green-900 border-green-200"
                              : "bg-cream-100 text-ink-700 border-ink-200"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </div>

                      <h3 className="text-base font-serif font-semibold text-green-900">
                        {lead.name}
                      </h3>
                      {lead.company && (
                        <p className="text-xs text-ink-500 truncate">{lead.company}</p>
                      )}

                      <div className="space-y-1 my-3 text-xs font-mono text-ink-600">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#283618]" />
                          <span>{lead.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-[#283618]" />
                          <span className="truncate">{lead.email}</span>
                        </div>
                        {lead.siteLocation && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#283618]" />
                            <span className="truncate">{lead.siteLocation}</span>
                          </div>
                        )}
                      </div>

                      {(lead.notes || lead.message) && (
                        <p className="text-xs text-ink-900/80 line-clamp-2 italic bg-cream-50/50 p-2 rounded border border-[#283618]/5 font-light">
                          &ldquo;{lead.notes || lead.message}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="pt-3 mt-4 border-t border-[#283618]/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-green-900 font-medium hover:underline cursor-pointer"
                      >
                        View Full Details
                      </button>

                      <div className="flex items-center gap-2">
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                          className="px-2 py-1 bg-cream-50 border border-[#283618]/15 rounded text-[11px] font-mono cursor-pointer focus:outline-none focus:border-green-900"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Meeting Scheduled">Meeting</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: NURSERY STOCK & SPECIMEN MANAGER (FULLY EDITABLE & IMAGES) */}
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
                className="px-4 py-2 bg-green-900 hover:bg-[#1f2b13] text-cream-50 text-xs font-medium rounded-brand shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
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
                {["all", "Trees and Palms", "Outdoor Plants", "Indoor Plants", "Shrubs and Hedges"].map((cat) => (
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

            {/* Specimen Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredInventory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#283618]/10 rounded-brand p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-green-900/30 transition-colors"
                >
                  <div>
                    {/* Top 50% Dedicated Image Showcase Bay */}
                    <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden mb-3.5 bg-cream-100 border border-[#283618]/10 shadow-xs">
                      <Image
                        src={item.image || "/images/frames/ezgif-frame-001.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 360px"
                      />
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-mono text-green-300 border border-white/20">
                        {item.status}
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[10px] font-mono font-bold text-green-950 border border-black/10 shadow-xs">
                        {item.price ? `₹${item.price.toLocaleString("en-IN")}` : item.priceBand}
                      </div>
                    </div>

                    <div className="mb-2">
                      <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-cream-50 text-[#283618] border border-[#283618]/10 block w-fit mb-1">
                        {item.category}
                      </span>
                      <h3 className="text-base font-serif font-bold text-green-950 truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-ink-500 italic font-serif truncate">
                        {item.botanicalName}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs my-2.5 py-2 px-3 bg-cream-50/60 rounded border border-[#283618]/5">
                      <div>
                        <span className="text-ink-500 text-[10px] block font-mono">Height / Spec</span>
                        <span className="text-ink-900 font-light truncate block">{item.sizeOrHeight}</span>
                      </div>
                      <div>
                        <span className="text-ink-500 text-[10px] block font-mono">Container</span>
                        <span className="text-ink-900 font-light truncate block">{item.potSize}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stock Quantity Steppers & Actions */}
                  <div className="pt-3 border-t border-[#283618]/10 space-y-2">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-xs text-ink-500">In Stock:</span>
                      <span className="text-base font-bold text-green-900">
                        {item.quantityInStock} units
                      </span>
                    </div>

                    {/* Stepper buttons wrapped nicely */}
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => handleUpdateStockDelta(item.id, item.quantityInStock, -10)}
                        className="flex-1 min-w-[40px] py-1 border border-[#283618]/15 hover:bg-cream-200/50 text-xs font-mono rounded cursor-pointer transition-colors text-center"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => handleUpdateStockDelta(item.id, item.quantityInStock, -1)}
                        className="flex-1 min-w-[40px] py-1 border border-[#283618]/15 hover:bg-cream-200/50 text-xs font-mono rounded cursor-pointer transition-colors text-center"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => handleUpdateStockDelta(item.id, item.quantityInStock, 1)}
                        className="flex-1 min-w-[40px] py-1 border border-[#283618]/15 hover:bg-cream-200/50 text-xs font-mono rounded cursor-pointer transition-colors text-center"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => handleUpdateStockDelta(item.id, item.quantityInStock, 10)}
                        className="flex-1 min-w-[40px] py-1 border border-[#283618]/15 hover:bg-cream-200/50 text-xs font-mono rounded cursor-pointer transition-colors text-center"
                      >
                        +10
                      </button>
                    </div>

                    {/* Action buttons: Edit and Remove */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#283618]/5 text-xs">
                      <button
                        onClick={() => handleOpenEditPlant(item)}
                        className="px-3 py-1 bg-green-50 text-green-900 hover:bg-green-100 rounded border border-green-200 font-medium cursor-pointer flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Specimen</span>
                      </button>
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
        {/* TAB 4: PROJECTS & DEVELOPER COLLABORATIONS MANAGER                */}
        {/* ================================================================= */}
        {(activeTab === "projects" || activeTab === "clients") && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#283618]/10">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#283618]/70">
                  Developer Collaborations &amp; Portfolio
                </span>
                <h2 className="text-2xl font-serif font-semibold text-green-900 mt-0.5">
                  Projects &amp; Client Cards ({clients.length})
                </h2>
              </div>
              <button
                onClick={() => openClientModal()}
                className="px-3.5 py-2 bg-green-900 hover:bg-[#1f2b13] text-cream-50 text-xs font-medium rounded-brand shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project / Client Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map((c, idx) => {
                const matchingProj = projects.find(
                  (p) => (c.featuredProjectSlug && p.slug === c.featuredProjectSlug) || p.slug === c.slug || p.clientName?.toLowerCase() === c.name.toLowerCase()
                );
                const hasVideo = Boolean(c.videoUrl || matchingProj?.videoUrl);
                const photoCount = matchingProj?.images?.length || (c.galleryImages?.length || 1);
                const whatWeDidCount = (matchingProj?.whatWeDid?.length || c.whatWeDid?.length || 0);
                const liveUrl = `/projects/${c.featuredProjectSlug || matchingProj?.slug || c.slug}`;

                return (
                  <div
                    key={c.id}
                    className="bg-white border border-[#283618]/10 rounded-brand p-5 shadow-xs flex flex-col justify-between hover:border-green-900/30 transition-colors group"
                  >
                    <div>
                      {/* Top Image Showcase Bay */}
                      <div className="relative w-full h-44 sm:h-48 rounded-2xl bg-white border border-[#283618]/10 flex items-center justify-center p-4 mb-4 shadow-xs overflow-hidden">
                        <Image
                          src={c.logo}
                          alt={c.name}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 360px"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-green-950/80 backdrop-blur-md text-[9px] font-mono font-bold text-green-300 uppercase tracking-wider border border-white/10">
                          Project #{idx + 1}
                        </div>

                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                          {hasVideo && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono font-bold flex items-center gap-1">
                              <Video className="w-2.5 h-2.5 text-emerald-400" />
                              <span>Video</span>
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full bg-black/60 text-white border border-white/10 text-[9px] font-mono">
                            {photoCount} {photoCount === 1 ? "Photo" : "Photos"}
                          </span>
                        </div>
                      </div>

                      <div className="min-w-0 mb-3">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-base font-serif font-semibold text-green-900 truncate">
                            {c.name}
                          </h3>
                          <span className="text-[10px] font-mono text-[#283618] bg-cream-50 border border-[#283618]/10 px-2 py-0.5 rounded shrink-0 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-emerald-600" />
                            <span>{c.location || c.city}</span>
                          </span>
                        </div>
                        {c.tagline && (
                          <p className="text-xs text-ink-500 italic truncate mt-0.5">{c.tagline}</p>
                        )}
                      </div>

                      <p className="text-xs text-ink-900/80 leading-relaxed line-clamp-2 mb-3 font-light">
                        {c.description}
                      </p>

                      {whatWeDidCount > 0 && (
                        <div className="mb-3 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/50 text-[10px] text-emerald-900 flex items-center justify-between">
                          <span>Execution Deliverables</span>
                          <strong className="font-mono">{whatWeDidCount} Scope Points</strong>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#283618]/10 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openClientModal(c)}
                          className="px-3 py-1 bg-green-50 text-green-900 hover:bg-green-100 rounded border border-green-200 font-medium cursor-pointer transition-colors"
                        >
                          Edit Project &amp; Media
                        </button>
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-cream-100 hover:bg-cream-200 text-ink-700 rounded border border-[#283618]/10 text-[11px] font-medium flex items-center gap-1"
                        >
                          <span>Live</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
                      <button
                        onClick={() => handleDeleteClient(c.id, c.name)}
                        className="text-red-700 hover:text-red-900 cursor-pointer font-medium text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: SERVICES MANAGER                                           */}
        {/* ================================================================= */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#283618]/10">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#283618]/70">
                  Landscaping Offerings
                </span>
                <h2 className="text-2xl font-serif font-semibold text-green-900 mt-0.5">
                  Service Cards ({services.length})
                </h2>
              </div>
              <button
                onClick={() => {
                  setServiceForm({
                    title: "",
                    category: "Commercial",
                    shortDescription: "",
                    fullDescription: "",
                    idealFor: "Builders & developers in Pune",
                    features: "Architectural CAD integration, Soil matrices, Turnkey staging",
                    scope: "Topographical assessment, Planting, Drip irrigation",
                    image: "/images/frames/ezgif-frame-001.jpg",
                  });
                  setEditingService(null);
                  setShowAddServiceModal(true);
                }}
                className="px-3.5 py-2 bg-green-900 hover:bg-[#1f2b13] text-cream-50 text-xs font-medium rounded-brand shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Service Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="bg-white border border-[#283618]/10 rounded-brand p-5 shadow-xs flex flex-col justify-between hover:border-green-900/30 transition-colors"
                >
                  <div>
                    {/* Top 50% Image Showcase Bay */}
                    <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-green-950 via-[#0B2B1E] to-[#040E0A] border border-green-800/30 shadow-xs">
                      {s.image && (
                        <Image
                          src={s.image}
                          alt={s.title}
                          fill
                          className="object-cover opacity-75"
                          sizes="(max-width: 768px) 100vw, 360px"
                        />
                      )}
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-mono text-green-300 border border-white/20">
                        {s.category}
                      </div>
                    </div>

                    <h3 className="text-base font-serif font-bold text-green-950 mb-1 truncate">
                      {s.title}
                    </h3>
                    <p className="text-xs text-ink-700/80 line-clamp-2 mb-3 font-light">
                      {s.shortDescription}
                    </p>

                    <div className="text-[10px] text-ink-500 font-mono bg-cream-50 p-2 rounded border border-[#283618]/5 mb-3 truncate">
                      Target: {s.idealFor}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#283618]/10 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setEditingService(s);
                        setServiceForm({
                          title: s.title,
                          category: s.category,
                          shortDescription: s.shortDescription,
                          fullDescription: s.fullDescription,
                          idealFor: s.idealFor,
                          features: Array.isArray(s.features) ? s.features.join(", ") : "",
                          scope: Array.isArray(s.scope) ? s.scope.join(", ") : "",
                          image: s.image || "/images/frames/ezgif-frame-001.jpg",
                        });
                        setShowAddServiceModal(true);
                      }}
                      className="px-3 py-1 bg-green-50 text-green-900 hover:bg-green-100 rounded border border-green-200 font-medium cursor-pointer transition-colors"
                    >
                      Edit Card
                    </button>
                    <button
                      onClick={() => handleDeleteService(s.id, s.title)}
                      className="text-red-700 hover:text-red-900 cursor-pointer font-medium"
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
        {/* TAB 6: MAINTENANCE AMC PACKAGES MANAGER                           */}
        {/* ================================================================= */}
        {activeTab === "maintenance" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#283618]/10">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#283618]/70">
                  Annual Maintenance Contracts
                </span>
                <h2 className="text-2xl font-serif font-semibold text-green-900 mt-0.5">
                  Maintenance Package Cards ({maintenancePackages.length})
                </h2>
              </div>
              <button
                onClick={() => {
                  setPkgForm({
                    name: "",
                    type: "Residential",
                    target: "Villas & Penthouses in Pune",
                    frequency: "Weekly Visits",
                    highlights: "Dedicated gardener, Mowing, Organic vermicompost, Plant health check",
                    ctaText: "Enquire for Villa",
                    priceNote: "Custom pricing based on lawn area",
                    image: "/images/hero-clean.webp",
                  });
                  setEditingPkg(null);
                  setShowAddPkgModal(true);
                }}
                className="px-3.5 py-2 bg-green-900 hover:bg-[#1f2b13] text-cream-50 text-xs font-medium rounded-brand shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Maintenance Package</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {maintenancePackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white border border-[#283618]/10 rounded-brand p-5 shadow-xs flex flex-col justify-between hover:border-green-900/30 transition-colors"
                >
                  <div>
                    {/* Top 50% Image Showcase Bay */}
                    <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-green-950 via-[#0B2B1E] to-[#040E0A] border border-green-800/30 shadow-xs">
                      {pkg.image && (
                        <Image
                          src={pkg.image}
                          alt={pkg.name}
                          fill
                          className="object-cover opacity-75"
                          sizes="(max-width: 768px) 100vw, 360px"
                        />
                      )}
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-mono text-green-300 border border-white/20">
                        {pkg.type} AMC
                      </div>
                    </div>

                    <h3 className="text-base font-serif font-bold text-green-950 mb-1 truncate">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-ink-700/80 mb-2 font-light">
                      {pkg.target}
                    </p>
                    <div className="text-[10px] font-mono text-ink-500 mb-2">
                      Cadence: {pkg.frequency}
                    </div>
                    {pkg.priceNote && (
                      <div className="text-[11px] font-bold text-green-900 bg-green-50 p-2 rounded border border-green-200 mb-3">
                        {pkg.priceNote}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#283618]/10 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setEditingPkg(pkg);
                        setPkgForm({
                          name: pkg.name,
                          type: pkg.type,
                          target: pkg.target,
                          frequency: pkg.frequency,
                          highlights: Array.isArray(pkg.highlights) ? pkg.highlights.join(", ") : "",
                          ctaText: pkg.ctaText,
                          priceNote: pkg.priceNote || "",
                          image: pkg.image || "/images/hero-clean.webp",
                        });
                        setShowAddPkgModal(true);
                      }}
                      className="px-3 py-1 bg-green-50 text-green-900 hover:bg-green-100 rounded border border-green-200 font-medium cursor-pointer transition-colors"
                    >
                      Edit Card
                    </button>
                    <button
                      onClick={() => handleDeleteMaintenancePkg(pkg.id, pkg.name)}
                      className="text-red-700 hover:text-red-900 cursor-pointer font-medium"
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
        {/* TAB 4.5: ARCHITECTURE & DESIGN SHOWCASE CARDS                     */}
        {/* ================================================================= */}
        {activeTab === "architecture" && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#283618]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#283618]/70">
                  Architectural Portfolio &amp; 3D Masterplans
                </span>
                <h2 className="text-2xl font-serif font-semibold text-green-900 mt-0.5">
                  Architecture &amp; Design Cards ({architectureCards.length})
                </h2>
                <p className="text-xs text-ink-600 mt-1">
                  Manage multimedia cards on the /architecture page. Each card can feature an Image, Video walkthrough, Technical Text, or all combined.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setEditingArchCard(null);
                    setArchForm({
                      title: "",
                      subtitle: "",
                      category: "Podium & Deck Architecture",
                      image: "/images/frames/ezgif-frame-005.jpg",
                      video: "",
                      description: "",
                      scaleArea: "",
                      tags: "Podium, 3D CAD, Civil Integration",
                      details: "Engineered load threshold: < 350 kg/m²\nAutomated capillary drip network\nPerimeter acoustic foliage buffering",
                      featured: false,
                      order: architectureCards.length + 1,
                    });
                    setShowAddArchModal(true);
                  }}
                  className="px-4 py-2 bg-green-900 hover:bg-[#1f2b13] text-cream-50 font-bold text-xs uppercase tracking-wider rounded-brand shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Architecture Card</span>
                </button>
              </div>
            </div>

            {/* Architecture Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {architectureCards.map((card) => {
                const hasImg = Boolean(card.image && card.image.trim().length > 0);
                const hasVid = Boolean(card.video && card.video.trim().length > 0);

                return (
                  <div
                    key={card.id}
                    className="bg-white border border-[#283618]/15 rounded-brand overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      {/* Media Preview Box */}
                      <div className="relative h-44 w-full bg-[#08150E] overflow-hidden border-b border-[#283618]/10">
                        {hasImg ? (
                          <Image
                            src={card.image!}
                            alt={card.title}
                            fill
                            className="object-cover"
                            sizes="380px"
                          />
                        ) : hasVid ? (
                          <div className="w-full h-full flex flex-col items-center justify-center text-emerald-400 gap-2 p-4">
                            <Film className="w-8 h-8" />
                            <span className="text-[11px] font-mono text-white/80 truncate max-w-full">
                              Video: {card.video}
                            </span>
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-amber-300 gap-1.5 p-4 bg-gradient-to-br from-green-950 to-[#040E0A]">
                            <Compass className="w-7 h-7 text-emerald-400" />
                            <span className="text-xs font-mono uppercase tracking-wider font-bold">
                              Text-Only Manifesto Card
                            </span>
                          </div>
                        )}

                        {/* Badges Overlay */}
                        <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/75 text-emerald-300 border border-emerald-500/30 uppercase">
                            {card.category}
                          </span>
                          {hasImg && hasVid && (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">
                              IMG + VIDEO
                            </span>
                          )}
                          {!hasImg && hasVid && (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-600 text-white font-bold">
                              VIDEO ONLY
                            </span>
                          )}
                        </div>

                        {card.scaleArea && (
                          <span className="absolute bottom-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-white border border-white/20">
                            {card.scaleArea}
                          </span>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-serif font-bold text-green-950 truncate">
                            {card.title}
                          </h3>
                          {card.featured && (
                            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold border border-amber-300">
                              Featured
                            </span>
                          )}
                        </div>

                        {card.subtitle && (
                          <p className="text-[11px] text-amber-900 font-serif italic truncate">
                            {card.subtitle}
                          </p>
                        )}

                        <p className="text-xs text-ink-700/80 font-light line-clamp-3">
                          {card.description}
                        </p>

                        {/* Video URL indication if exists */}
                        {hasVid && (
                          <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded truncate border border-emerald-200">
                            🎥 {card.video}
                          </div>
                        )}

                        {/* Tags */}
                        {card.tags && card.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {card.tags.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="text-[9px] font-mono bg-cream-100 text-ink-600 px-1.5 py-0.2 rounded"
                              >
                                #{t}
                              </span>
                            ))}
                            {card.tags.length > 3 && (
                              <span className="text-[9px] text-ink-400">+{card.tags.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-4 pt-2 border-t border-[#283618]/10 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setEditingArchCard(card);
                          setArchForm({
                            title: card.title,
                            subtitle: card.subtitle || "",
                            category: card.category,
                            image: card.image || "",
                            video: card.video || "",
                            description: card.description || "",
                            scaleArea: card.scaleArea || "",
                            tags: Array.isArray(card.tags) ? card.tags.join(", ") : "",
                            details: Array.isArray(card.details) ? card.details.join("\n") : "",
                            featured: Boolean(card.featured),
                            order: card.order ?? 0,
                          });
                          setShowAddArchModal(true);
                        }}
                        className="px-3 py-1 bg-green-50 text-green-900 hover:bg-green-100 rounded border border-green-200 font-medium cursor-pointer transition-colors"
                      >
                        Edit Card
                      </button>
                      <button
                        onClick={() => handleDeleteArchitectureCard(card.id, card.title)}
                        className="text-red-700 hover:text-red-900 cursor-pointer font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {architectureCards.length === 0 && (
              <div className="p-8 text-center bg-cream-50 rounded-brand border border-[#283618]/15 text-xs text-ink-600">
                No architecture project cards created yet. Click "+ Add Architecture Card" to add your first masterplan.
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4.75: CLIENT REVIEWS & TESTIMONIALS MODERATION                */}
        {/* ================================================================= */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#283618]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#283618]/70">
                  Client Feedback, Testimonials &amp; Moderation
                </span>
                <h2 className="text-2xl font-serif font-semibold text-green-900 mt-0.5">
                  Client Reviews &amp; Endorsements ({reviews.length})
                </h2>
                <p className="text-xs text-ink-600 mt-1">
                  Manage infinite marquee reviews. Public visitor submissions appear here for moderation, and are visible to the author on their device.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-full">
                  ★ Avg Rating: {(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1)} / 5.0
                </span>

                <button
                  type="button"
                  onClick={() => openReviewModal()}
                  className="px-3.5 py-2 bg-green-900 hover:bg-[#1f2b13] text-cream-50 text-xs font-medium rounded-brand shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Review</span>
                </button>
              </div>
            </div>

            {/* Status Metric Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-medium">
                {reviews.filter((r) => r.approved !== false).length} Approved &amp; Live for All
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-medium">
                {reviews.filter((r) => r.approved === false).length} Pending Moderation (Private to Author)
              </span>
            </div>

            {/* Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((rev) => {
                const isPending = rev.approved === false;

                return (
                  <div
                    key={rev.id}
                    className={`bg-white border ${
                      isPending ? "border-amber-400 ring-1 ring-amber-300" : "border-[#283618]/15"
                    } rounded-brand p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow`}
                  >
                    <div className="space-y-3">
                      {/* Top Badges: Stars + Approval Status + Verified Status */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= rev.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isPending ? (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                              Pending Approval
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                              ✓ Live
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleToggleVerifiedReview(rev.id)}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border cursor-pointer transition-colors ${
                              rev.verified
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : "bg-gray-100 text-gray-600 border-gray-300"
                            }`}
                            title="Click to toggle verified badge"
                          >
                            {rev.verified ? "Verified" : "Unverified"}
                          </button>
                        </div>
                      </div>

                      {/* Review text */}
                      <p className="text-xs text-ink-800 font-light italic leading-relaxed">
                        &ldquo;{rev.comment}&rdquo;
                      </p>

                      {/* Project tag */}
                      {rev.project && (
                        <div className="text-[10px] font-mono text-emerald-800 bg-emerald-50/70 px-2 py-0.5 rounded border border-emerald-200 truncate">
                          Scope: {rev.project}
                        </div>
                      )}

                      {rev.authorToken && (
                        <div className="text-[9px] font-mono text-ink-400 truncate">
                          Author Token: {rev.authorToken.substring(0, 16)}... (Visible to author on device)
                        </div>
                      )}
                    </div>

                    {/* Reviewer Details & Actions */}
                    <div className="pt-4 mt-4 border-t border-[#283618]/10 space-y-3">
                      <div className="truncate">
                        <div className="font-serif font-bold text-green-950 truncate">{rev.name}</div>
                        <div className="text-[11px] text-ink-600 truncate">
                          {rev.role}
                          {rev.company ? ` · ${rev.company}` : ""}
                        </div>
                        <div className="text-[10px] font-mono text-ink-400 mt-0.5">{rev.date}</div>
                      </div>

                      <div className="flex items-center justify-between gap-1.5 pt-1 text-xs">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openReviewModal(rev)}
                            className="px-2.5 py-1 bg-green-50 text-green-900 hover:bg-green-100 rounded border border-green-200 font-medium cursor-pointer flex items-center gap-1 text-[11px]"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleApprovedReview(rev.id)}
                            className={`px-2.5 py-1 rounded border font-medium cursor-pointer text-[11px] transition-colors ${
                              isPending
                                ? "bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600"
                                : "bg-cream-100 text-ink-700 hover:bg-cream-200 border-[#283618]/15"
                            }`}
                          >
                            {isPending ? "Approve for Public" : "Unapprove"}
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev.id, rev.name)}
                          className="px-2.5 py-1 text-red-700 hover:bg-red-50 rounded border border-red-200 cursor-pointer text-[11px] font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {reviews.length === 0 && (
              <div className="p-8 text-center bg-cream-50 rounded-brand border border-[#283618]/15 text-xs text-ink-600">
                No client reviews recorded yet. Reviews submitted from the homepage will appear here.
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: MULTI-PAGE CMS SUITE (ALL PAGES EDITABLE)                  */}
        {/* ================================================================= */}
        {activeTab === "cms" && (
          <div className="space-y-6 max-w-4xl">
            <div className="pb-4 border-b border-[#283618]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#283618]/70">
                  Comprehensive Content Manager
                </span>
                <h2 className="text-2xl font-serif font-semibold text-green-900 mt-0.5">
                  Multi-Page CMS Suite
                </h2>
              </div>
              <button
                type="button"
                onClick={handleSaveCms}
                disabled={cmsSaving}
                className="px-5 py-2.5 bg-green-900 hover:bg-[#1f2b13] text-cream-50 font-bold text-xs uppercase tracking-wider rounded-brand shadow-sm transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
              >
                <Check className="w-4 h-4" />
                <span>{cmsSaving ? "Publishing Changes..." : "Save & Publish All Pages"}</span>
              </button>
            </div>

            {cmsNotice && (
              <div className="p-4 bg-green-50 border border-green-300 text-green-900 text-xs rounded-xl flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                <span>{cmsNotice}</span>
              </div>
            )}

            {/* Page Sub-Tabs Strip */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-[#283618]/10 rounded-xl">
              {[
                { id: "home", label: "🏠 Home Page" },
                { id: "about", label: "🏢 About Us" },
                { id: "services", label: "🌿 Services" },
                { id: "projects", label: "🏗️ Projects" },
                { id: "plants", label: "🪴 Plant Catalog" },
                { id: "maintenance", label: "🛠️ Maintenance" },
                { id: "contact", label: "📞 Contact Desk" },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setCmsPageTab(sub.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    cmsPageTab === sub.id
                      ? "bg-green-950 text-white shadow-xs"
                      : "text-ink-600 hover:text-green-900 hover:bg-cream-100"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveCms} className="bg-white border border-[#283618]/10 rounded-brand p-6 shadow-xs space-y-6">
              {/* SUB-TAB: HOME PAGE */}
              {cmsPageTab === "home" && (
                <div className="space-y-6">
                  <div className="pb-2 border-b border-[#283618]/10">
                    <h3 className="text-base font-serif font-bold text-green-900">
                      Home Page: Hero, B2B Section & Process
                    </h3>
                  </div>

                  {/* Hero Image with Preview */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-green-900">
                      Hero Background Image URL / File
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={siteContent.heroImage}
                        onChange={(e) => setSiteContent({ ...siteContent, heroImage: e.target.value })}
                        className="flex-1 px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                      />
                      <input
                        type="file"
                        ref={heroImageFileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, (url) => setSiteContent({ ...siteContent, heroImage: url }));
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => heroImageFileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 border border-[#283618]/15 text-xs rounded font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? "Uploading..." : "Upload from Computer"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSiteContent({ ...siteContent, heroImage: "/images/hero-clean.webp" })}
                        className="px-3 py-1.5 border border-[#283618]/15 hover:bg-cream-100 text-xs rounded font-mono"
                      >
                        Reset Clean
                      </button>
                    </div>
                    {/* Live Preview Thumbnail */}
                    <div className="relative w-full h-40 rounded-xl overflow-hidden bg-black/90 border border-green-800 mt-2">
                      <Image
                        src={siteContent.heroImage || "/images/hero-clean.webp"}
                        alt="Hero Preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-xs font-mono bg-black/60 px-3 py-1 rounded-full border border-white/20">
                          Hero Visual Live Reflection
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-green-900 mb-1">
                        Hero Top Badge
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
                        Hero Brand Title (e.g. &quot;Green Gallery&quot;)
                      </label>
                      <input
                        type="text"
                        value={siteContent.heroHeadline}
                        onChange={(e) => setSiteContent({ ...siteContent, heroHeadline: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-bold focus:outline-none focus:border-green-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-green-900 mb-1">
                      Hero Description Paragraph
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
                        Primary CTA Button
                      </label>
                      <input
                        type="text"
                        value={siteContent.primaryButtonText}
                        onChange={(e) => setSiteContent({ ...siteContent, primaryButtonText: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-green-900 mb-1">
                        Secondary CTA Button
                      </label>
                      <input
                        type="text"
                        value={siteContent.secondaryButtonText}
                        onChange={(e) => setSiteContent({ ...siteContent, secondaryButtonText: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                      />
                    </div>
                  </div>

                  {/* Services & B2B Section Headings */}
                  <div className="pt-4 border-t border-[#283618]/10 space-y-4">
                    <h4 className="text-xs font-mono font-bold uppercase text-green-800">
                      Homepage Services & B2B Partnerships Headers
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                          Services Section Title
                        </label>
                        <input
                          type="text"
                          value={siteContent.servicesSectionTitle || ""}
                          onChange={(e) => setSiteContent({ ...siteContent, servicesSectionTitle: e.target.value })}
                          className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                          Services Section Subtitle
                        </label>
                        <input
                          type="text"
                          value={siteContent.servicesSectionSubtitle || ""}
                          onChange={(e) => setSiteContent({ ...siteContent, servicesSectionSubtitle: e.target.value })}
                          className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                          B2B Section Title
                        </label>
                        <input
                          type="text"
                          value={siteContent.b2bSectionTitle || ""}
                          onChange={(e) => setSiteContent({ ...siteContent, b2bSectionTitle: e.target.value })}
                          className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                          Process Section Title
                        </label>
                        <input
                          type="text"
                          value={siteContent.processSectionTitle || ""}
                          onChange={(e) => setSiteContent({ ...siteContent, processSectionTitle: e.target.value })}
                          className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB: ABOUT US */}
              {cmsPageTab === "about" && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-[#283618]/10">
                    <h3 className="text-base font-serif font-bold text-green-900">
                      About Us Page Content
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                        Header Badge
                      </label>
                      <input
                        type="text"
                        value={siteContent.aboutBadge || ""}
                        onChange={(e) => setSiteContent({ ...siteContent, aboutBadge: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                        Page Title
                      </label>
                      <input
                        type="text"
                        value={siteContent.aboutTitle || ""}
                        onChange={(e) => setSiteContent({ ...siteContent, aboutTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-bold focus:outline-none focus:border-green-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                      Intro Description
                    </label>
                    <textarea
                      rows={2}
                      value={siteContent.aboutDescription || ""}
                      onChange={(e) => setSiteContent({ ...siteContent, aboutDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                    />
                  </div>

                  {/* Alandi and Highway facilities text */}
                  <div className="pt-3 border-t border-[#283618]/10 space-y-4">
                    <h4 className="text-xs font-mono font-bold uppercase text-green-800">
                      Operational Facilities Descriptions
                    </h4>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                        Alandi Logistics Depot Title
                      </label>
                      <input
                        type="text"
                        value={siteContent.aboutAlandiTitle || ""}
                        onChange={(e) => setSiteContent({ ...siteContent, aboutAlandiTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                        Alandi Logistics Depot Description
                      </label>
                      <textarea
                        rows={2}
                        value={siteContent.aboutAlandiDescription || ""}
                        onChange={(e) => setSiteContent({ ...siteContent, aboutAlandiDescription: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                        Highway Nursery Hub Title
                      </label>
                      <input
                        type="text"
                        value={siteContent.aboutHighwayTitle || ""}
                        onChange={(e) => setSiteContent({ ...siteContent, aboutHighwayTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                        Highway Nursery Hub Description
                      </label>
                      <textarea
                        rows={2}
                        value={siteContent.aboutHighwayDescription || ""}
                        onChange={(e) => setSiteContent({ ...siteContent, aboutHighwayDescription: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                          Team Specialists Headline
                        </label>
                        <input
                          type="text"
                          value={siteContent.aboutTeamCount || ""}
                          onChange={(e) => setSiteContent({ ...siteContent, aboutTeamCount: e.target.value })}
                          className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                          Team Description
                        </label>
                        <input
                          type="text"
                          value={siteContent.aboutTeamDescription || ""}
                          onChange={(e) => setSiteContent({ ...siteContent, aboutTeamDescription: e.target.value })}
                          className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB: SERVICES */}
              {cmsPageTab === "services" && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-[#283618]/10">
                    <h3 className="text-base font-serif font-bold text-green-900">
                      Services Page Header & Overview
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                        Services Page Badge
                      </label>
                      <input
                        type="text"
                        value={siteContent.servicesPageBadge || ""}
                        onChange={(e) => setSiteContent({ ...siteContent, servicesPageBadge: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                        Services Page Title
                      </label>
                      <input
                        type="text"
                        value={siteContent.servicesPageTitle || ""}
                        onChange={(e) => setSiteContent({ ...siteContent, servicesPageTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-bold focus:outline-none focus:border-green-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                      Services Page Description
                    </label>
                    <textarea
                      rows={3}
                      value={siteContent.servicesPageDescription || ""}
                      onChange={(e) => setSiteContent({ ...siteContent, servicesPageDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                    />
                  </div>
                </div>
              )}

              {/* SUB-TAB: PROJECTS */}
              {cmsPageTab === "projects" && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-[#283618]/10">
                    <h3 className="text-base font-serif font-bold text-green-900">
                      Projects & Portfolio Page Header
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                        Projects Page Badge
                      </label>
                      <input
                        type="text"
                        value={siteContent.projectsPageBadge || ""}
                        onChange={(e) => setSiteContent({ ...siteContent, projectsPageBadge: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                        Projects Page Title
                      </label>
                      <input
                        type="text"
                        value={siteContent.projectsPageTitle || ""}
                        onChange={(e) => setSiteContent({ ...siteContent, projectsPageTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-bold focus:outline-none focus:border-green-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                      Projects Page Description
                    </label>
                    <textarea
                      rows={3}
                      value={siteContent.projectsPageDescription || ""}
                      onChange={(e) => setSiteContent({ ...siteContent, projectsPageDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                    />
                  </div>
                </div>
              )}

              {/* SUB-TAB: PLANTS */}
              {cmsPageTab === "plants" && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-[#283618]/10">
                    <h3 className="text-base font-serif font-bold text-green-900">
                      Plant & Specimen Catalog Page Header
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                        Catalog Page Badge
                      </label>
                      <input
                        type="text"
                        value={siteContent.plantsPageBadge || ""}
                        onChange={(e) => setSiteContent({ ...siteContent, plantsPageBadge: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                        Catalog Page Title
                      </label>
                      <input
                        type="text"
                        value={siteContent.plantsPageTitle || ""}
                        onChange={(e) => setSiteContent({ ...siteContent, plantsPageTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-bold focus:outline-none focus:border-green-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                      Catalog Page Description
                    </label>
                    <textarea
                      rows={3}
                      value={siteContent.plantsPageDescription || ""}
                      onChange={(e) => setSiteContent({ ...siteContent, plantsPageDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                    />
                  </div>
                </div>
              )}

              {/* SUB-TAB: MAINTENANCE */}
              {cmsPageTab === "maintenance" && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-[#283618]/10">
                    <h3 className="text-base font-serif font-bold text-green-900">
                      Maintenance & AMC Page Content
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                        Maintenance Badge
                      </label>
                      <input
                        type="text"
                        value={siteContent.maintenanceBadge || ""}
                        onChange={(e) => setSiteContent({ ...siteContent, maintenanceBadge: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                        Maintenance Page Title
                      </label>
                      <input
                        type="text"
                        value={siteContent.maintenanceTitle || ""}
                        onChange={(e) => setSiteContent({ ...siteContent, maintenanceTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-bold focus:outline-none focus:border-green-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                      Maintenance Description
                    </label>
                    <textarea
                      rows={3}
                      value={siteContent.maintenanceDescription || ""}
                      onChange={(e) => setSiteContent({ ...siteContent, maintenanceDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                    />
                  </div>
                </div>
              )}

              {/* SUB-TAB: CONTACT */}
              {cmsPageTab === "contact" && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-[#283618]/10">
                    <h3 className="text-base font-serif font-bold text-green-900">
                      Contact Desk & Channels
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                        Contact Page Badge
                      </label>
                      <input
                        type="text"
                        value={siteContent.contactBadge || ""}
                        onChange={(e) => setSiteContent({ ...siteContent, contactBadge: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                        Contact Page Title
                      </label>
                      <input
                        type="text"
                        value={siteContent.contactTitle || ""}
                        onChange={(e) => setSiteContent({ ...siteContent, contactTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-bold focus:outline-none focus:border-green-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                      Contact Page Description
                    </label>
                    <textarea
                      rows={2}
                      value={siteContent.contactDescription || ""}
                      onChange={(e) => setSiteContent({ ...siteContent, contactDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#283618]/10">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                        Direct Phone
                      </label>
                      <input
                        type="text"
                        value={siteContent.contactPhone || "+91 7823080251"}
                        onChange={(e) => setSiteContent({ ...siteContent, contactPhone: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={siteContent.contactWhatsapp || "+91 7823080251"}
                        onChange={(e) => setSiteContent({ ...siteContent, contactWhatsapp: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                        Desk Email
                      </label>
                      <input
                        type="text"
                        value={siteContent.contactEmail || "greengallery.landscapers@gmail.com"}
                        onChange={(e) => setSiteContent({ ...siteContent, contactEmail: e.target.value })}
                        className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Sticky Save Bar */}
              <div className="pt-4 border-t border-[#283618]/10 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-ink-500 font-mono">
                  All changes are published live upon clicking Save.
                </span>
                <button
                  type="submit"
                  disabled={cmsSaving}
                  className="px-6 py-2.5 bg-green-900 hover:bg-[#1f2b13] text-cream-50 font-bold text-xs uppercase tracking-wider rounded-brand shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{cmsSaving ? "Saving All Pages..." : "Save All Pages"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 8: ADMINISTRATIVE SETTINGS & SECURITY GOVERNANCE              */}
        {/* ================================================================= */}
        {activeTab === "settings" && (
          <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <div className="pb-4 border-b border-[#283618]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#283618]/70">
                  Governance &amp; Access Security
                </span>
                <h2 className="text-2xl font-serif font-semibold text-green-900 mt-0.5">
                  Administrative Settings
                </h2>
                <p className="text-xs text-ink-500 font-light mt-1">
                  Configure administrative passcodes, verify emergency credentials, and manage operational contacts.
                </p>
              </div>
            </div>

            {/* CARD 1: PASSCODE MANAGEMENT (WITH PREVIOUS PASSCODE VERIFICATION) */}
            <div className="bg-white border border-[#283618]/10 rounded-brand p-6 shadow-xs space-y-5">
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#283618]/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-900 shrink-0">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-green-900">
                      Change Access Passcode
                    </h3>
                    <p className="text-xs text-ink-500 font-light mt-0.5">
                      To protect administrative integrity, you must enter your previous passcode before saving a new one.
                    </p>
                  </div>
                </div>
                {settingsData?.lastPasscodeChange && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-ink-500 bg-cream-50 px-2.5 py-1 rounded border border-[#283618]/10">
                    <Clock className="w-3 h-3 text-green-800" />
                    Last changed: {new Date(settingsData.lastPasscodeChange).toLocaleDateString()}
                  </span>
                )}
              </div>

              {passcodeStatus.message && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    passcodeStatus.type === "success"
                      ? "bg-green-50 border border-green-300 text-green-900"
                      : "bg-red-50 border border-red-300 text-red-900"
                  }`}
                >
                  {passcodeStatus.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-green-700" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
                  )}
                  <span>{passcodeStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleChangePasscode} className="space-y-4 max-w-xl">
                {/* Field 1: Previous Passcode */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-green-900 mb-1">
                    Previous Passcode *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      required
                      value={currentPasscode}
                      onChange={(e) => setCurrentPasscode(e.target.value)}
                      placeholder="Enter your current passcode"
                      className="w-full pl-3 pr-10 py-2.5 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-800"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-ink-400 mt-1">
                    Verified cryptographically with constant-time equality check.
                  </p>
                </div>

                {/* Field 2 & 3: New Passcode & Confirmation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-green-900 mb-1">
                      New Passcode *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? "text" : "password"}
                        required
                        value={newPasscode}
                        onChange={(e) => setNewPasscode(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-3 pr-10 py-2.5 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-800"
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-green-900 mb-1">
                      Confirm New Passcode *
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPasscode}
                      onChange={(e) => setConfirmPasscode(e.target.value)}
                      placeholder="Re-enter new passcode"
                      className="w-full px-3 py-2.5 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={isChangingPasscode}
                    className="px-6 py-2.5 bg-green-900 hover:bg-[#1f2b13] text-cream-50 font-bold text-xs uppercase tracking-wider rounded-brand shadow-sm transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isChangingPasscode ? "Verifying & Updating..." : "Update Passcode"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRecoveryMode(true);
                      setRecoveryStatus({ type: null, message: "" });
                    }}
                    className="text-xs text-amber-900 hover:text-amber-950 font-medium underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    Forgot previous passcode? Use Security Recovery
                  </button>
                </div>
              </form>
            </div>

            {/* CARD 2: EMERGENCY RECOVERY & VERIFICATION INFO */}
            <div className="bg-white border border-[#283618]/10 rounded-brand p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#283618]/10">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-900 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-green-900">
                    Emergency Passcode Recovery Verification
                  </h3>
                  <p className="text-xs text-ink-500 font-light mt-0.5">
                    If you forget your previous passcode, you can unlock and reset it with your verified administrator credentials.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-cream-50 border border-[#283618]/10 space-y-1">
                  <span className="font-mono uppercase text-[10px] text-green-800 font-bold block">
                    Registered Security Email / Answer
                  </span>
                  <p className="font-mono text-sm text-green-950 font-semibold break-all">
                    {settingsData?.recoveryEmail || "mail.vyomaboard@gmail.com"}
                  </p>
                  <p className="text-[11px] text-ink-500">
                    Used to verify identity on the &ldquo;Forgot Passcode&rdquo; emergency reset prompt.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-cream-50 border border-[#283618]/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono uppercase text-[10px] text-green-800 font-bold block">
                      Master Emergency Recovery Key
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowEmergencyKeyInSettings(!showEmergencyKeyInSettings)}
                      className="text-[10px] text-green-900 underline font-medium cursor-pointer"
                    >
                      {showEmergencyKeyInSettings ? "Mask" : "Reveal Key"}
                    </button>
                  </div>
                  <p className="font-mono text-sm text-green-950 font-semibold">
                    {showEmergencyKeyInSettings ? "GG-SEC-RECOVERY-2026" : "GG-SEC-••••••••"}
                  </p>
                  <p className="text-[11px] text-ink-500">
                    Keep this key private in your password manager for offline recovery.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 3: OPERATIONS & NOTIFICATIONS DESK */}
            <div className="bg-white border border-[#283618]/10 rounded-brand p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#283618]/10">
                <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-green-900 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-green-900">
                    Administrative Notification Defaults
                  </h3>
                  <p className="text-xs text-ink-500 font-light mt-0.5">
                    Lead inquiries and developer tender RFQs are dispatched to these registered coordinates.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 bg-cream-50/50 rounded-lg border border-[#283618]/10">
                  <span className="text-[10px] text-ink-400 uppercase block mb-0.5">Desk Phone</span>
                  <span className="font-bold text-green-950">+91 78230 80251</span>
                </div>
                <div className="p-3 bg-cream-50/50 rounded-lg border border-[#283618]/10">
                  <span className="text-[10px] text-ink-400 uppercase block mb-0.5">Lead Inquiries Email</span>
                  <span className="font-bold text-green-950 truncate block">greengallery.landscapers@gmail.com</span>
                </div>
                <div className="p-3 bg-cream-50/50 rounded-lg border border-[#283618]/10">
                  <span className="text-[10px] text-ink-400 uppercase block mb-0.5">Staging Depot</span>
                  <span className="font-bold text-green-950">Alandi, Pune</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================================================================= */}
      {/* MODAL 1: ADD NEW NURSERY SPECIMEN (WITH IMAGE & PRICE)            */}
      {/* ================================================================= */}
      {showAddPlantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-[#283618]/15 rounded-2xl p-5 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#283618]/10 mb-4">
              <h3 className="text-base font-serif font-bold text-green-900">
                Add Botanical Specimen to Stock
              </h3>
              <button
                onClick={() => setShowAddPlantModal(false)}
                className="text-ink-500 hover:text-ink-900 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlant} className="space-y-4">
              {/* Image Input with Upload & Preview */}
              <div className="space-y-2">
                <label className="block text-[11px] font-mono uppercase text-green-900">Specimen Image *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPlant.image}
                    onChange={(e) => setNewPlant({ ...newPlant, image: e.target.value })}
                    placeholder="/images/... or https://..."
                    className="flex-1 px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                  />
                  <input
                    type="file"
                    ref={plantImageFileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, (url) => setNewPlant({ ...newPlant, image: url }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => plantImageFileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 border border-[#283618]/15 text-xs rounded font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? "Uploading..." : "Upload"}</span>
                  </button>
                </div>
                {/* Live Preview */}
                <div className="relative w-full h-32 rounded-xl overflow-hidden bg-cream-100 border border-[#283618]/10">
                  <Image
                    src={newPlant.image || "/images/hero-clean.webp"}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Common Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Foxtail Palm"
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
                    placeholder="e.g. Wodyetia bifurcata"
                    value={newPlant.botanicalName}
                    onChange={(e) => setNewPlant({ ...newPlant, botanicalName: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-serif italic focus:outline-none focus:border-green-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Category</label>
                  <select
                    value={newPlant.category}
                    onChange={(e) => setNewPlant({ ...newPlant, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  >
                    <option value="Trees and Palms">Trees and Palms</option>
                    <option value="Outdoor Plants">Outdoor Plants</option>
                    <option value="Indoor Plants">Indoor Plants</option>
                    <option value="Shrubs and Hedges">Shrubs and Hedges</option>
                    <option value="Planters and Pots">Planters and Pots</option>
                    <option value="Soil and Care Products">Soil and Care Products</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Quantity in Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={newPlant.quantityInStock}
                    onChange={(e) => setNewPlant({ ...newPlant, quantityInStock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newPlant.price}
                    onChange={(e) => setNewPlant({ ...newPlant, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Price Band / Label</label>
                  <input
                    type="text"
                    value={newPlant.priceBand}
                    onChange={(e) => setNewPlant({ ...newPlant, priceBand: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  className="px-5 py-2 bg-green-900 hover:bg-[#1f2b13] text-cream-50 text-xs font-bold uppercase tracking-wider rounded shadow-xs cursor-pointer"
                >
                  Save Specimen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 2: EDIT NURSERY SPECIMEN (IMAGE UPLOAD & FIELDS)            */}
      {/* ================================================================= */}
      {editingPlant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-[#283618]/15 rounded-2xl p-5 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#283618]/10 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#283618]/70">
                  Update Specimen
                </span>
                <h3 className="text-base font-serif font-bold text-green-900">
                  Edit &quot;{editingPlant.name}&quot;
                </h3>
              </div>
              <button
                onClick={() => setEditingPlant(null)}
                className="text-ink-500 hover:text-ink-900 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditPlant} className="space-y-4">
              {/* Image Input with Upload & Preview */}
              <div className="space-y-2">
                <label className="block text-[11px] font-mono uppercase text-green-900">Specimen Image *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editPlantForm.image}
                    onChange={(e) => setEditPlantForm({ ...editPlantForm, image: e.target.value })}
                    placeholder="/images/... or https://..."
                    className="flex-1 px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                  />
                  <input
                    type="file"
                    ref={editPlantImageFileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, (url) => setEditPlantForm({ ...editPlantForm, image: url }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => editPlantImageFileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 border border-[#283618]/15 text-xs rounded font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? "Uploading..." : "Upload"}</span>
                  </button>
                </div>
                {/* Live Preview */}
                <div className="relative w-full h-32 rounded-xl overflow-hidden bg-cream-100 border border-[#283618]/10">
                  <Image
                    src={editPlantForm.image || "/images/hero-clean.webp"}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Common Name *</label>
                  <input
                    type="text"
                    required
                    value={editPlantForm.name}
                    onChange={(e) => setEditPlantForm({ ...editPlantForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Botanical Name *</label>
                  <input
                    type="text"
                    required
                    value={editPlantForm.botanicalName}
                    onChange={(e) => setEditPlantForm({ ...editPlantForm, botanicalName: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-serif italic focus:outline-none focus:border-green-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Category</label>
                  <select
                    value={editPlantForm.category}
                    onChange={(e) => setEditPlantForm({ ...editPlantForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  >
                    <option value="Trees and Palms">Trees and Palms</option>
                    <option value="Outdoor Plants">Outdoor Plants</option>
                    <option value="Indoor Plants">Indoor Plants</option>
                    <option value="Shrubs and Hedges">Shrubs and Hedges</option>
                    <option value="Planters and Pots">Planters and Pots</option>
                    <option value="Soil and Care Products">Soil and Care Products</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Status</label>
                  <select
                    value={editPlantForm.status}
                    onChange={(e) => setEditPlantForm({ ...editPlantForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Live Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={editPlantForm.quantityInStock}
                    onChange={(e) => setEditPlantForm({ ...editPlantForm, quantityInStock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={editPlantForm.price}
                    onChange={(e) => setEditPlantForm({ ...editPlantForm, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Height / Size</label>
                  <input
                    type="text"
                    value={editPlantForm.sizeOrHeight}
                    onChange={(e) => setEditPlantForm({ ...editPlantForm, sizeOrHeight: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Container</label>
                  <input
                    type="text"
                    value={editPlantForm.potSize}
                    onChange={(e) => setEditPlantForm({ ...editPlantForm, potSize: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Specimen Description</label>
                <textarea
                  rows={2}
                  value={editPlantForm.description}
                  onChange={(e) => setEditPlantForm({ ...editPlantForm, description: e.target.value })}
                  placeholder="Cultivated for Western Maharashtra climate..."
                  className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                />
              </div>

              <div className="pt-3 border-t border-[#283618]/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPlant(null)}
                  className="px-3 py-1.5 text-xs text-ink-500 hover:text-ink-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-900 hover:bg-[#1f2b13] text-cream-50 text-xs font-bold uppercase tracking-wider rounded shadow-xs cursor-pointer"
                >
                  Update Specimen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 3: ADD / EDIT CLIENT PARTNER & PROJECT CASE STUDY           */}
      {/* ================================================================= */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-[#283618]/15 rounded-2xl p-5 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#283618]/10 mb-5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold">
                  Portfolio Operations
                </span>
                <h3 className="text-lg font-serif font-bold text-green-950">
                  {editingClient ? `Edit Project: ${editingClient.name}` : "Add Developer Project & Case Study"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAddClientModal(false);
                  setEditingClient(null);
                }}
                className="text-ink-500 hover:text-ink-900 cursor-pointer p-1 rounded-lg hover:bg-cream-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-5">
              {/* SECTION 1: IDENTITY & SITE LOCATION */}
              <div className="space-y-3 p-4 rounded-xl bg-cream-50/60 border border-[#283618]/10">
                <span className="text-[11px] font-mono uppercase text-green-900 font-bold block">
                  1. Project &amp; Developer Identity
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-ink-700 mb-1">Developer / Client Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Silver Group"
                      value={clientForm.name}
                      onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-ink-700 mb-1">Tagline / Sub-venture</label>
                    <input
                      type="text"
                      placeholder="e.g. A Kiran Sawant Venture"
                      value={clientForm.tagline}
                      onChange={(e) => setClientForm({ ...clientForm, tagline: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-ink-700 mb-1">Exact Site Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ravet / Punawale, PCMC, Pune"
                      value={clientForm.location}
                      onChange={(e) => setClientForm({ ...clientForm, location: e.target.value, city: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-ink-700 mb-1">Category</label>
                    <select
                      value={clientForm.category}
                      onChange={(e) => setClientForm({ ...clientForm, category: e.target.value as any })}
                      className="w-full px-3 py-2 bg-white border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                    >
                      <option value="Township and Large Developments">Township and Large Developments</option>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Terrace and Vertical">Terrace and Vertical</option>
                      <option value="Interior">Interior</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-ink-700 mb-1">Execution Year</label>
                    <input
                      type="number"
                      placeholder="2024"
                      value={clientForm.year}
                      onChange={(e) => setClientForm({ ...clientForm, year: Number(e.target.value) || 2024 })}
                      className="w-full px-3 py-2 bg-white border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-ink-700 mb-1">Total Scale / Area (Sq. Ft.)</label>
                    <input
                      type="number"
                      placeholder="45000"
                      value={clientForm.areaSqFt}
                      onChange={(e) => setClientForm({ ...clientForm, areaSqFt: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: "WHAT WE DID FOR THEM" */}
              <div className="space-y-2 p-4 rounded-xl bg-cream-50/60 border border-[#283618]/10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-green-900 font-bold block">
                    2. What We Did For Them (Scope Deliverables)
                  </span>
                  <span className="text-[10px] text-ink-500">1 point per line</span>
                </div>
                <p className="text-[11px] text-ink-600 font-light">
                  Enter each technical deliverable, civil coordination milestone, or botanical installation point on its own line:
                </p>
                <textarea
                  rows={4}
                  required
                  placeholder="Engineered structural lightweight substrate formulation (<350 kg/m²)&#10;Specimen mature canopy trees and avenue palms hoisted via crane&#10;Automated pressure-compensating micro-drip irrigation running on STP water&#10;Basalt paver hardscape and perimeter acoustic foliage buffer"
                  value={clientForm.whatWeDid}
                  onChange={(e) => setClientForm({ ...clientForm, whatWeDid: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900 leading-relaxed"
                />
              </div>

              {/* SECTION 3: OVERVIEW & BRIEF */}
              <div className="space-y-2 p-4 rounded-xl bg-cream-50/60 border border-[#283618]/10">
                <span className="text-[11px] font-mono uppercase text-green-900 font-bold block">
                  3. Project Narrative &amp; Overview
                </span>
                <textarea
                  rows={3}
                  required
                  placeholder="Comprehensive architectural narrative of the landscape project..."
                  value={clientForm.description}
                  onChange={(e) => setClientForm({ ...clientForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900 leading-relaxed"
                />
              </div>

              {/* SECTION 4: PHOTOS & VIDEOS BAY */}
              <div className="space-y-4 p-4 rounded-xl bg-cream-50/60 border border-[#283618]/10">
                <span className="text-[11px] font-mono uppercase text-green-900 font-bold block">
                  4. Photos &amp; Video Walkthrough (Media Bay)
                </span>

                {/* Developer Logo */}
                <div>
                  <label className="block text-[11px] font-medium text-ink-700 mb-1">Developer Logo / Client Mark *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={clientForm.logo}
                      onChange={(e) => setClientForm({ ...clientForm, logo: e.target.value })}
                      placeholder="/images/clients/... or /uploads/..."
                      className="flex-1 px-3 py-2 bg-white border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                    />
                    <input
                      type="file"
                      ref={clientImageFileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, (url) => setClientForm({ ...clientForm, logo: url }));
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => clientImageFileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 border border-[#283618]/15 text-xs rounded font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? "Uploading..." : "Upload Logo"}</span>
                    </button>
                  </div>
                </div>

                {/* Cover Showcase Photo */}
                <div>
                  <label className="block text-[11px] font-medium text-ink-700 mb-1">Project Cover Photo</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={clientForm.coverImage}
                      onChange={(e) => setClientForm({ ...clientForm, coverImage: e.target.value })}
                      placeholder="/images/frames/... or /uploads/..."
                      className="flex-1 px-3 py-2 bg-white border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                    />
                    <input
                      type="file"
                      ref={clientCoverImageFileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, (url) => setClientForm({ ...clientForm, coverImage: url }));
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => clientCoverImageFileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 border border-[#283618]/15 text-xs rounded font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? "Uploading..." : "Upload Cover"}</span>
                    </button>
                  </div>
                  {clientForm.coverImage && (
                    <div className="relative w-full h-28 rounded-xl overflow-hidden bg-black/5 border border-[#283618]/10 mt-2">
                      <Image src={clientForm.coverImage} alt="Cover Preview" fill className="object-cover" sizes="300px" />
                    </div>
                  )}
                </div>

                {/* Video Walkthrough */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-medium text-ink-700">Video Walkthrough (URL or Video File)</label>
                    <span className="text-[10px] text-ink-500">MP4, WebM, MOV up to 50MB</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={clientForm.videoUrl}
                      onChange={(e) => setClientForm({ ...clientForm, videoUrl: e.target.value })}
                      placeholder="https://.../video.mp4 or /uploads/video_...mp4"
                      className="flex-1 px-3 py-2 bg-white border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                    />
                    <input
                      type="file"
                      ref={clientVideoFileInputRef}
                      className="hidden"
                      accept="video/mp4,video/webm,video/quicktime,video/ogg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, (url) => setClientForm({ ...clientForm, videoUrl: url }));
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => clientVideoFileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300 text-xs rounded font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{uploadingImage ? "Uploading..." : "Upload Video"}</span>
                    </button>
                  </div>

                  {clientForm.videoUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden bg-black border border-green-900/20 max-w-sm">
                      <video
                        src={clientForm.videoUrl}
                        controls
                        className="w-full max-h-40 object-cover"
                      >
                        Your browser does not support preview.
                      </video>
                      <div className="p-2 text-[10px] text-white/70 font-mono flex items-center justify-between">
                        <span>Video Walkthrough Linked</span>
                        <button
                          type="button"
                          onClick={() => setClientForm({ ...clientForm, videoUrl: "" })}
                          className="text-red-400 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Photo Gallery Images List */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-medium text-ink-700">Photo Gallery Images ({clientForm.galleryImages.length})</label>
                    <input
                      type="file"
                      ref={clientGalleryImageFileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, (url) =>
                            setClientForm({ ...clientForm, galleryImages: [...clientForm.galleryImages, url] })
                          );
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => clientGalleryImageFileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="text-xs text-emerald-800 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Upload &amp; Add Photo</span>
                    </button>
                  </div>

                  {clientForm.galleryImages.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                      {clientForm.galleryImages.map((imgUrl, i) => (
                        <div key={i} className="relative h-20 rounded-lg overflow-hidden border border-[#283618]/15 bg-black/5 group">
                          <Image src={imgUrl} alt={`Gallery ${i}`} fill className="object-cover" sizes="120px" />
                          <button
                            type="button"
                            onClick={() =>
                              setClientForm({
                                ...clientForm,
                                galleryImages: clientForm.galleryImages.filter((_, idx) => idx !== i),
                              })
                            }
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-ink-500 italic">No gallery photos added yet.</p>
                  )}
                </div>
              </div>

              {/* SECTION 5: BOTANICAL PALETTE & SERVICES */}
              <div className="space-y-3 p-4 rounded-xl bg-cream-50/60 border border-[#283618]/10">
                <span className="text-[11px] font-mono uppercase text-green-900 font-bold block">
                  5. Botanical Species &amp; Services Used
                </span>

                <div>
                  <label className="block text-[11px] font-medium text-ink-700 mb-1">Botanical Plants Used (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Terminalia mantaly, Foxtail Palm, Plumeria obtusa, Bermuda Grass"
                    value={clientForm.plantsUsed}
                    onChange={(e) => setClientForm({ ...clientForm, plantsUsed: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-ink-700 mb-1">Services Delivered (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Landscape Design and Installation, Project Foliage for Builders, Maintenance"
                    value={clientForm.servicesUsed}
                    onChange={(e) => setClientForm({ ...clientForm, servicesUsed: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#283618]/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddClientModal(false);
                    setEditingClient(null);
                  }}
                  className="px-4 py-2 text-xs text-ink-500 hover:text-ink-900 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-green-950 hover:bg-green-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md cursor-pointer transition-all"
                >
                  {editingClient ? "Save Project, Media & Case Study" : "Publish Project Case Study"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 5: ADD / EDIT LANDSCAPING SERVICE                           */}
      {/* ================================================================= */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-[#283618]/15 rounded-2xl p-5 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#283618]/10 mb-4">
              <h3 className="text-base font-serif font-bold text-green-900">
                {editingService ? `Edit ${editingService.title}` : "Add Landscaping Service Card"}
              </h3>
              <button
                onClick={() => {
                  setShowAddServiceModal(false);
                  setEditingService(null);
                }}
                className="text-ink-500 hover:text-ink-900 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3">
              {/* Service Cover Image with Local Upload */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Service Image *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={serviceForm.image}
                    onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                    placeholder="/images/frames/... or /uploads/..."
                    className="flex-1 px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                  />
                  <input
                    type="file"
                    ref={serviceImageFileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, (url) => setServiceForm({ ...serviceForm, image: url }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => serviceImageFileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 border border-[#283618]/15 text-xs rounded font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? "Uploading..." : "Upload"}</span>
                  </button>
                </div>
                {serviceForm.image && (
                  <div className="relative w-full h-28 rounded-xl overflow-hidden bg-cream-100 border border-[#283618]/10 mt-2">
                    <Image src={serviceForm.image} alt="Preview" fill className="object-cover" sizes="400px" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Podium Landscape Greening"
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Category</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  >
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                    <option value="Specialized">Specialized</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Short Description (for card)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summary shown on the service card..."
                  value={serviceForm.shortDescription}
                  onChange={(e) => setServiceForm({ ...serviceForm, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Target Property / Ideal For</label>
                <input
                  type="text"
                  placeholder="e.g. Builders, high-rise societies, and corporate parks in Pune"
                  value={serviceForm.idealFor}
                  onChange={(e) => setServiceForm({ ...serviceForm, idealFor: e.target.value })}
                  className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Key Features (comma separated)</label>
                  <input
                    type="text"
                    placeholder="CAD integration, Soil matrices, Drip networks"
                    value={serviceForm.features}
                    onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Scope Points (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Excavation, Planting, Irrigation assembly"
                    value={serviceForm.scope}
                    onChange={(e) => setServiceForm({ ...serviceForm, scope: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#283618]/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddServiceModal(false);
                    setEditingService(null);
                  }}
                  className="px-3 py-1.5 text-xs text-ink-500 hover:text-ink-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-900 hover:bg-[#1f2b13] text-cream-50 text-xs font-bold uppercase tracking-wider rounded shadow-xs cursor-pointer"
                >
                  {editingService ? "Update Service Card" : "Save Service Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 6: ADD / EDIT MAINTENANCE PACKAGE                           */}
      {/* ================================================================= */}
      {showAddPkgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-[#283618]/15 rounded-2xl p-5 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#283618]/10 mb-4">
              <h3 className="text-base font-serif font-bold text-green-900">
                {editingPkg ? `Edit ${editingPkg.name}` : "Add Maintenance AMC Package"}
              </h3>
              <button
                onClick={() => {
                  setShowAddPkgModal(false);
                  setEditingPkg(null);
                }}
                className="text-ink-500 hover:text-ink-900 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMaintenancePkg} className="space-y-3">
              {/* Package Cover Image with Local Upload */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Package Photo *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pkgForm.image}
                    onChange={(e) => setPkgForm({ ...pkgForm, image: e.target.value })}
                    placeholder="/images/... or /uploads/..."
                    className="flex-1 px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                  />
                  <input
                    type="file"
                    ref={pkgImageFileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, (url) => setPkgForm({ ...pkgForm, image: url }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => pkgImageFileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 border border-[#283618]/15 text-xs rounded font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? "Uploading..." : "Upload"}</span>
                  </button>
                </div>
                {pkgForm.image && (
                  <div className="relative w-full h-28 rounded-xl overflow-hidden bg-cream-100 border border-[#283618]/10 mt-2">
                    <Image src={pkgForm.image} alt="Preview" fill className="object-cover" sizes="400px" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Package Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Society AMC Comprehensive Care"
                    value={pkgForm.name}
                    onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Contract Type</label>
                  <select
                    value={pkgForm.type}
                    onChange={(e) => setPkgForm({ ...pkgForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Society">Society</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Target Property</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gated communities & CHS in Pune"
                    value={pkgForm.target}
                    onChange={(e) => setPkgForm({ ...pkgForm, target: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Cadence / Frequency</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Weekly or Bi-Weekly Visits"
                    value={pkgForm.frequency}
                    onChange={(e) => setPkgForm({ ...pkgForm, frequency: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Highlights (comma separated)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Dedicated gardener, Lawn mowing, Organic vermicompost drenches, Plant health audits"
                  value={pkgForm.highlights}
                  onChange={(e) => setPkgForm({ ...pkgForm, highlights: e.target.value })}
                  className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Button CTA Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Request Society Proposal"
                    value={pkgForm.ctaText}
                    onChange={(e) => setPkgForm({ ...pkgForm, ctaText: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">Pricing Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Custom quote based on society lawn area"
                    value={pkgForm.priceNote}
                    onChange={(e) => setPkgForm({ ...pkgForm, priceNote: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#283618]/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPkgModal(false);
                    setEditingPkg(null);
                  }}
                  className="px-3 py-1.5 text-xs text-ink-500 hover:text-ink-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-900 hover:bg-[#1f2b13] text-cream-50 text-xs font-bold uppercase tracking-wider rounded shadow-xs cursor-pointer"
                >
                  {editingPkg ? "Update Package" : "Save Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 3.75: ADD / EDIT ARCHITECTURE CARD                          */}
      {/* ================================================================= */}
      {showAddArchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white border border-[#283618]/15 rounded-2xl p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#283618]/10 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold">
                  Portfolio Curation
                </span>
                <h3 className="text-lg font-serif font-bold text-green-950">
                  {editingArchCard ? `Edit ${editingArchCard.title}` : "Add Architecture & Design Card"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAddArchModal(false);
                  setEditingArchCard(null);
                }}
                className="text-ink-500 hover:text-ink-900 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArchitectureCard} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                    Card Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cantilevered Biophilic Podium Architecture"
                    value={archForm.title}
                    onChange={(e) => setArchForm({ ...archForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                    Subtitle / Technical Hook
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Engineered Lightweight Matrix"
                    value={archForm.subtitle}
                    onChange={(e) => setArchForm({ ...archForm, subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                    Architectural Category
                  </label>
                  <select
                    value={archForm.category}
                    onChange={(e) => setArchForm({ ...archForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  >
                    <option value="Podium & Terrace Gardens">Podium &amp; Terrace Gardens</option>
                    <option value="Water Features & Hardscape">Water Features &amp; Hardscape</option>
                    <option value="Villa & Residential Landscaping">Villa &amp; Residential Landscaping</option>
                    <option value="Sustainable Landscape Planning">Sustainable Landscape Planning</option>
                    <option value="Commercial & Industrial Landscaping">Commercial &amp; Industrial Landscaping</option>
                    <option value="Podium & Deck Architecture">Podium &amp; Deck Architecture (Legacy)</option>
                    <option value="Master Landscape Planning">Master Landscape Planning (Legacy)</option>
                    <option value="3D Modeling & CAD">3D Modeling &amp; CAD (Legacy)</option>
                    <option value="Villa & Estate Architecture">Villa &amp; Estate Architecture (Legacy)</option>
                    <option value="Biophilic Commercial Design">Biophilic Commercial Design (Legacy)</option>
                    <option value="Urban Micro-Ecosystems">Urban Micro-Ecosystems (Legacy)</option>
                  </select>
                </div>
              </div>

              {/* MEDIA OPTION 1: IMAGE (URL OR UPLOAD) */}
              <div className="p-3 bg-cream-50/80 rounded-xl border border-[#283618]/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono uppercase text-green-900 font-bold flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Card Photo / Render (Optional if video/text provided)</span>
                  </label>
                  {archForm.image && (
                    <button
                      type="button"
                      onClick={() => setArchForm({ ...archForm, image: "" })}
                      className="text-[10px] text-red-700 hover:underline"
                    >
                      Clear Photo
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={archForm.image}
                    onChange={(e) => setArchForm({ ...archForm, image: e.target.value })}
                    placeholder="/images/... or /uploads/... or https://..."
                    className="flex-1 px-3 py-2 bg-white border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                  />
                  <input
                    type="file"
                    ref={archImageFileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, (url) => setArchForm({ ...archForm, image: url }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => archImageFileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-3 py-1.5 bg-cream-200 hover:bg-cream-300 border border-[#283618]/15 text-xs rounded font-medium flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                </div>

                {archForm.image && (
                  <div className="relative w-full h-28 rounded-lg overflow-hidden bg-black/10 border border-[#283618]/10 mt-1">
                    <Image src={archForm.image} alt="Preview" fill className="object-cover" sizes="400px" />
                  </div>
                )}
              </div>

              {/* MEDIA OPTION 2: VIDEO (URL OR UPLOAD) */}
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-900/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono uppercase text-emerald-950 font-bold flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Card Video / 3D Walkthrough (Optional)</span>
                  </label>
                  {archForm.video && (
                    <button
                      type="button"
                      onClick={() => setArchForm({ ...archForm, video: "" })}
                      className="text-[10px] text-red-700 hover:underline"
                    >
                      Clear Video
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={archForm.video}
                    onChange={(e) => setArchForm({ ...archForm, video: e.target.value })}
                    placeholder="https://...mp4 or /uploads/... or YouTube/Vimeo link"
                    className="flex-1 px-3 py-2 bg-white border border-emerald-900/20 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                  />
                  <input
                    type="file"
                    ref={archVideoFileInputRef}
                    className="hidden"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, (url) => setArchForm({ ...archForm, video: url }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => archVideoFileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 border border-emerald-900/20 text-xs rounded font-medium flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Video</span>
                  </button>
                </div>
                <p className="text-[10px] text-ink-500">
                  Tip: A card can have an image, a video, text, or all together on a single card.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                  Scope &amp; Engineering Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail the architectural concept, lightweight civil substrate, irrigation systems, and botanical aesthetics..."
                  value={archForm.description}
                  onChange={(e) => setArchForm({ ...archForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                    Approx. Scale / Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 45,000 sq. ft. / 3 Towers"
                    value={archForm.scaleArea}
                    onChange={(e) => setArchForm({ ...archForm, scaleArea: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Podium, 3D CAD, Basalt Stone, MEP"
                    value={archForm.tags}
                    onChange={(e) => setArchForm({ ...archForm, tags: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-green-900 mb-1">
                  Technical Specifications / Key Details (One line per bullet)
                </label>
                <textarea
                  rows={3}
                  placeholder="Engineered load threshold: < 350 kg/m²&#10;Automated capillary drip network&#10;Perimeter acoustic foliage buffering"
                  value={archForm.details}
                  onChange={(e) => setArchForm({ ...archForm, details: e.target.value })}
                  className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-mono focus:outline-none focus:border-green-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-ink-700">
                  <input
                    type="checkbox"
                    checked={archForm.featured}
                    onChange={(e) => setArchForm({ ...archForm, featured: e.target.checked })}
                    className="rounded text-green-900 focus:ring-green-900"
                  />
                  <span>Feature at top of page</span>
                </label>

                <div className="flex items-center gap-2 justify-end">
                  <span className="text-[11px] font-mono text-ink-600">Sort Order:</span>
                  <input
                    type="number"
                    value={archForm.order}
                    onChange={(e) => setArchForm({ ...archForm, order: Number(e.target.value) || 0 })}
                    className="w-16 px-2 py-1 bg-cream-50/50 border border-[#283618]/15 rounded text-xs font-mono text-center focus:outline-none focus:border-green-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#283618]/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddArchModal(false);
                    setEditingArchCard(null);
                  }}
                  className="px-3 py-1.5 text-xs text-ink-500 hover:text-ink-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-900 hover:bg-[#1f2b13] text-cream-50 text-xs font-bold uppercase tracking-wider rounded shadow-xs cursor-pointer"
                >
                  {editingArchCard ? "Update Card" : "Save Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ================================================================= */}
      {/* MODAL 6: ADD / EDIT CLIENT REVIEW                                 */}
      {/* ================================================================= */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-[#283618]/15 rounded-2xl p-5 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#283618]/10 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold">
                  Testimonial Operations
                </span>
                <h3 className="text-lg font-serif font-bold text-green-950">
                  {editingReview ? `Edit Review from ${editingReview.name}` : "Add New Client Review"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setEditingReview(null);
                }}
                className="text-ink-500 hover:text-ink-900 cursor-pointer p-1 rounded-lg hover:bg-cream-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-ink-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajeev Deshmukh"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-ink-700 mb-1">Role / Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Project Director / Villa Owner"
                    value={reviewForm.role}
                    onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-ink-700 mb-1">Company / Society / Estate</label>
                  <input
                    type="text"
                    placeholder="e.g. Nirman Greens / Baner Residence"
                    value={reviewForm.company}
                    onChange={(e) => setReviewForm({ ...reviewForm, company: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-ink-700 mb-1">Rating (1 to 5 Stars)</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) || 5 })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  >
                    <option value={5}>★★★★★ 5 Stars (Exceptional)</option>
                    <option value={4}>★★★★☆ 4 Stars (Very Good)</option>
                    <option value={3}>★★★☆☆ 3 Stars (Good)</option>
                    <option value={2}>★★☆☆☆ 2 Stars (Fair)</option>
                    <option value={1}>★☆☆☆☆ 1 Star (Poor)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-ink-700 mb-1">Project Scope / Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Central Park Landscape (85k sq. ft.)"
                    value={reviewForm.project}
                    onChange={(e) => setReviewForm({ ...reviewForm, project: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-ink-700 mb-1">Review Date</label>
                  <input
                    type="text"
                    placeholder="e.g. October 2024"
                    value={reviewForm.date}
                    onChange={(e) => setReviewForm({ ...reviewForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-ink-700 mb-1">Review Feedback Comment *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Review narrative and botanical feedback..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-3 py-2 bg-cream-50/50 border border-[#283618]/15 rounded text-xs focus:outline-none focus:border-green-900 leading-relaxed"
                />
              </div>

              {/* Status Toggles */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-cream-50 rounded-xl border border-[#283618]/10 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reviewForm.verified}
                    onChange={(e) => setReviewForm({ ...reviewForm, verified: e.target.checked })}
                    className="w-4 h-4 text-green-900 rounded focus:ring-green-900"
                  />
                  <span className="font-medium text-ink-800">Verified Client Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reviewForm.approved}
                    onChange={(e) => setReviewForm({ ...reviewForm, approved: e.target.checked })}
                    className="w-4 h-4 text-green-900 rounded focus:ring-green-900"
                  />
                  <span className="font-medium text-ink-800">Approved for Public Showcase</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#283618]/10 flex items-center justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setEditingReview(null);
                  }}
                  className="px-4 py-2 text-ink-500 hover:text-ink-900 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-green-950 hover:bg-green-900 text-white font-bold uppercase tracking-wider rounded-lg shadow-sm cursor-pointer transition-all"
                >
                  {editingReview ? "Save Review Changes" : "Publish Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-[#283618]/15 rounded-2xl p-5 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#283618]/10 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#283618]/70">
                  Inquiry Specifications
                </span>
                <h3 className="text-base font-serif font-bold text-green-900">
                  {selectedLead.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-ink-500 hover:text-ink-900 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
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
                  <span className="font-mono text-ink-900 truncate block">{selectedLead.email}</span>
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
