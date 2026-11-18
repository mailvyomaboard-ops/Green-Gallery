// Data types for Green Gallery

export type ClientType =
  | "Builder or Developer"
  | "Homeowner"
  | "Architect or Consultant"
  | "Other";

export type ProjectStage =
  | "Planning & Concepts"
  | "Civil Structure Ready"
  | "Interior / Finishing Stage"
  | "Existing Landscape Renovation";

export type TimeSlot = "Morning (9 AM - 12 PM)" | "Afternoon (12 PM - 4 PM)" | "Evening (4 PM - 7 PM)";

export interface LeadSubmission {
  id: string;
  type: "consultation" | "quote" | "general";
  name: string;
  phone: string;
  email: string;
  clientType?: ClientType;
  projectType?: string;
  siteLocation?: string;
  approxArea?: string | number;
  preferredDate?: string;
  preferredTimeSlot?: TimeSlot;
  notes?: string;
  // Quote specific fields
  company?: string;
  projectName?: string;
  city?: string;
  projectStage?: ProjectStage;
  scope?: string[];
  budgetRange?: string;
  timeline?: string;
  drawingFileName?: string;
  drawingFileUrl?: string;
  // General specific
  message?: string;
  // Metadata
  sourcePage: string;
  createdAt: string;
  status: "New" | "Contacted" | "Site Visit Scheduled" | "Quotation Preparation" | "Quotation Sent" | "Negotiation" | "Won" | "Lost" | "Consultation Scheduled" | "Proposal Sent" | "Closed";
  followUpDate?: string;
  notesLog?: { date: string; note: string; author?: string }[];
}

export interface InventoryItem {
  id: string;
  name: string;
  botanicalName: string;
  category: "Indoor Plants" | "Outdoor Plants" | "Trees and Palms" | "Shrubs and Hedges" | "Planters and Pots" | "Soil and Care Products";
  sizeOrHeight: string;
  potSize: string;
  quantityInStock: number;
  status: "In Stock" | "Low Stock" | "Made to Order" | "Out of Stock";
  priceBand: string; // e.g. "₹850 - ₹1,200" or single price
  price?: number;
  image?: string;
  description?: string;
  lightRequirement?: string;
  linkedProductId?: string;
  lastUpdated: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  inventoryQty: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  botanicalName: string;
  category: "Indoor Plants" | "Outdoor Plants" | "Trees and Palms" | "Shrubs and Hedges" | "Planters and Pots" | "Soil and Care Products";
  lightRequirement: "Full Sun" | "Partial Shade" | "Bright Indirect / Shade";
  sizeCategory: "Small (< 1 ft)" | "Medium (1 - 3 ft)" | "Large (3 - 6 ft)" | "Specimen (6+ ft)";
  price: number;
  stockLabel: "In Stock" | "Low Stock" | "Made to Order" | "Out of Stock";
  inStock: boolean;
  stockQuantity: number;
  bulkThreshold: number; // default 25
  mainImage: string;
  images: string[];
  description: string;
  careGuide: {
    light: string;
    water: string;
    height: string;
    temperature?: string;
    soil?: string;
  };
  variants: ProductVariant[];
  deliveryNote: string;
  isFeatured?: boolean;
}

export function convertInventoryToProduct(item: InventoryItem): Product {
  const slug = (item.name || "specimen")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return {
    id: item.linkedProductId || item.id,
    slug: slug || item.id,
    name: item.name,
    botanicalName: item.botanicalName,
    category: item.category,
    lightRequirement: "Bright Indirect / Shade",
    sizeCategory: "Specimen (6+ ft)",
    price: item.price || 0,
    stockLabel: item.status,
    inStock: item.quantityInStock > 0,
    stockQuantity: item.quantityInStock,
    bulkThreshold: 20,
    mainImage: item.image || "/images/hero-clean.webp",
    images: item.image ? [item.image] : ["/images/hero-clean.webp"],
    description:
      item.description ||
      `Premium acclimatized ${item.name} (${item.botanicalName}) staged at Alandi logistics depot. Size: ${item.sizeOrHeight}, Container: ${item.potSize}.`,
    careGuide: {
      light: item.lightRequirement || "Bright Indirect",
      water: "Moderate watering with good drainage.",
      height: item.sizeOrHeight || "Standard",
      soil: "Engineered rich organic soil mix",
    },
    variants: [
      {
        id: `var-${item.id}`,
        label: `${item.sizeOrHeight} (${item.potSize})`,
        price: item.price || 0,
        inventoryQty: item.quantityInStock,
      },
    ],
    deliveryNote: "Staged and conditioned at Alandi logistics depot.",
  };
}

export interface ClientPartner {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  logo: string;
  city: string;
  totalAreaHandled?: string;
  projectCount: number;
  highlightProjects: string[];
  scope: string[];
  description: string;
  featuredProjectSlug?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: "Residential" | "Commercial" | "Township and Large Developments" | "Terrace and Vertical" | "Interior";
  location: string;
  year: number;
  areaSqFt: number;
  clientName?: string;
  clientLogo?: string;
  coverImage: string;
  images: {
    url: string;
    caption: string;
    alt: string;
  }[];
  brief: string;
  plantsUsed: string[];
  servicesUsed: string[];
  isFeatured?: boolean;
  status?: "COMPLETED" | "ONGOING" | "CONCEPT";
}

export interface CartItem {
  productId: string;
  variantId?: string;
  productName: string;
  variantLabel?: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: "Commercial" | "Residential" | "Specialized" | "Maintenance";
  features: string[];
  scope: string[];
  deliverables: string[];
  idealFor: string;
  image?: string;
  faq?: { q: string; a: string }[];
}

export interface MaintenancePackageItem {
  id: string;
  name: string;
  target: string;
  frequency: string;
  highlights: string[];
  ctaText: string;
  type: "Residential" | "Society" | "Commercial";
  image?: string;
  priceNote?: string;
}

export interface ArchitectureCard {
  id: string;
  title: string;
  subtitle?: string;
  category: "Podium & Deck Architecture" | "Master Landscape Planning" | "3D Modeling & CAD" | "Villa & Estate Architecture" | "Biophilic Commercial Design" | "Urban Micro-Ecosystems";
  image?: string;
  video?: string;
  description: string;
  details?: string[];
  tags: string[];
  scaleArea?: string;
  featured?: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  company?: string;
  rating: number; // 1 to 5
  comment: string;
  project?: string;
  date: string;
  verified: boolean;
  createdAt: string;
}

export interface ShowcaseItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

export interface SiteContent {
  // Home Page
  heroImage: string;
  heroBadge: string;
  heroHeadline: string;
  heroDescription: string;
  heroStatCount?: string;
  heroStatLabel?: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  introHeadline?: string;
  introDescription?: string;
  servicesSectionTitle?: string;
  servicesSectionSubtitle?: string;
  b2bBadge?: string;
  b2bSectionTitle?: string;
  b2bSectionDescription?: string;
  processSectionTitle?: string;
  processSectionSubtitle?: string;
  bannerBadge?: string;
  bannerHeadline?: string;
  bannerDescription?: string;
  showcaseRow1: ShowcaseItem[];
  showcaseRow2: ShowcaseItem[];

  // About Page
  aboutBadge?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  aboutAlandiTitle?: string;
  aboutAlandiDescription?: string;
  aboutHighwayTitle?: string;
  aboutHighwayDescription?: string;
  aboutTeamCount?: string;
  aboutTeamDescription?: string;

  // Services Page
  servicesPageBadge?: string;
  servicesPageTitle?: string;
  servicesPageDescription?: string;

  // Projects Page
  projectsPageBadge?: string;
  projectsPageTitle?: string;
  projectsPageDescription?: string;

  // Plants Page
  plantsPageBadge?: string;
  plantsPageTitle?: string;
  plantsPageDescription?: string;

  // Maintenance Page
  maintenanceBadge?: string;
  maintenanceTitle?: string;
  maintenanceDescription?: string;
  maintenanceSocietyTitle?: string;
  maintenanceSocietyDesc?: string;
  maintenanceCommercialTitle?: string;
  maintenanceCommercialDesc?: string;
  maintenanceVillaTitle?: string;
  maintenanceVillaDesc?: string;

  // Contact Page
  contactBadge?: string;
  contactTitle?: string;
  contactDescription?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  contactEmail?: string;
  contactAlandiAddress?: string;
}

export const defaultSiteContent: SiteContent = {
  // Home Page
  heroImage: "/images/hero-clean.webp",
  heroBadge: "Landscape Design & Botanical Execution",
  heroHeadline: "Green Gallery",
  heroDescription:
    "Masterful landscape design, precision plantation execution, and ongoing botanical care for prestigious developments, commercial campuses, and private sanctuaries.",
  heroStatCount: "Turnkey Excellence",
  heroStatLabel: "Dedicated logistical staging, specimen nursery networks, and comprehensive site execution.",
  primaryButtonText: "Explore Services",
  secondaryButtonText: "Book Site Consultation",
  introHeadline: "Transforming Spaces Through Thoughtful Landscaping",
  introDescription:
    "From corporate campuses and residential developments to private villas and balcony gardens, we deliver tailored botanical solutions crafted with horticultural precision.",
  servicesSectionTitle: "Comprehensive Landscaping & Botanical Services",
  servicesSectionSubtitle: "From large-scale commercial campuses and developer podiums to private bungalow sanctuaries and urban botanical sanctuaries.",
  b2bBadge: "Enterprise & Builder Partnerships",
  b2bSectionTitle: "Turnkey Foliage & Landscaping for Real Estate Developers",
  b2bSectionDescription: "Comprehensive BOQ estimation, staged nursery supply, structural podium coordination, and scheduled tower handover landscaping.",
  processSectionTitle: "How We Work",
  processSectionSubtitle: "A structured, accountable 5-stage landscape delivery workflow built for rigorous architectural standards and civil handover timelines.",
  bannerBadge: "Start Your Botanical Project",
  bannerHeadline: "Partner with GreenGallery",
  bannerDescription:
    "Review site plans with our team, enquire about plant supply from our staging depot, or request formal developer BOQ pricing.",

  // About Page
  aboutBadge: "Botanical Foundation",
  aboutTitle: "Rooted in Excellence. Cultivating Enduring Landscapes.",
  aboutDescription: "GreenGallery provides professional landscape design, plantation execution, plant supply, and long-term garden maintenance.",
  aboutAlandiTitle: "Alandi Logistical Staging Depot",
  aboutAlandiDescription: "Logistical staging, inventory sorting, plant quarantine, and pre-delivery site conditioning facility in Alandi, Pune.",
  aboutHighwayTitle: "Old Mumbai–Pune Highway Setup",
  aboutHighwayDescription: "Our upcoming operations office and nursery facility along the Old Mumbai–Pune Highway is currently in active development.",
  aboutTeamCount: "~9 Working Professionals",
  aboutTeamDescription: "Backed by an experienced flexible regional site labor network and direct wholesale grower alliances across Maharashtra.",

  // Services Page
  servicesPageBadge: "Verified Execution Capabilities",
  servicesPageTitle: "Landscape Services & Horticultural Solutions",
  servicesPageDescription: "Tailored landscape design, execution, plant procurement, and garden maintenance for builders, architects, societies, and private residences.",

  // Projects Page
  projectsPageBadge: "Curated Portfolio",
  projectsPageTitle: "Landscape Projects & Developer Portfolios",
  projectsPageDescription: "Explore completed and ongoing podium greening, avenue plantations, and private estate landscapes executed with precision.",

  // Plants Page
  plantsPageBadge: "Direct Botanical Supply",
  plantsPageTitle: "Architectural Plant & Specimen Catalogue",
  plantsPageDescription: "Acclimatized indoor and outdoor foliage, specimen trees, and bulk landscaping palettes staged through our Alandi logistics depot.",

  // Maintenance Page
  maintenanceBadge: "Care & Health Guarantees",
  maintenanceTitle: "Annual Garden Maintenance Contracts (AMC)",
  maintenanceDescription: "Professional groundskeeping, pest control, pruning, fertilization, and automated irrigation management.",
  maintenanceSocietyTitle: "Residential Societies & Townships",
  maintenanceSocietyDesc: "Perimeter green buffers, central lawn aeration, clubhouse foliage maintenance, and seasonal monsoon drainage management.",
  maintenanceCommercialTitle: "Corporate & IT Campuses",
  maintenanceCommercialDesc: "Pristine entrance atriums, biophilic indoor plants, bi-weekly health audits, and executive courtyard grooming.",
  maintenanceVillaTitle: "Private Bungalows & Weekend Sanctuaries",
  maintenanceVillaDesc: "Tailored horticultural care, specimen tree styling, and evening uplighting checks for private estates in Koregaon Park, Khandala, and Lonavala.",

  // Contact Page
  contactBadge: "Direct Pune Coordination",
  contactTitle: "Initiate Your Landscape Project",
  contactDescription: "Connect directly with our horticultural team for site consultations, developer BOQ quotes, or staging depot procurement.",
  contactPhone: "+91 78230 80251",
  contactWhatsapp: "+91 78230 80251",
  contactEmail: "greengallery.landscapers@gmail.com",
  contactAlandiAddress: "Alandi Logistical Staging Depot, Pune, Maharashtra, India",
  showcaseRow1: [
    {
      id: "work-1",
      image: "/images/hero-clean.webp",
      title: "Architectural Villa Courtyard & Hearth",
      subtitle: "Private Estate Landscape · Koregaon Park",
    },
    {
      id: "work-2",
      image: "/images/frames/ezgif-frame-001.jpg",
      title: "Silver Gracia Signature Podium",
      subtitle: "Turnkey Podium Landscape · Ravet",
    },
    {
      id: "work-3",
      image: "/images/frames/ezgif-frame-003.jpg",
      title: "Keshav Crown Grand Avenue",
      subtitle: "Avenue Tree Plantation · Moshi",
    },
    {
      id: "work-4",
      image: "/images/frames/ezgif-frame-005.jpg",
      title: "Swastik Disa Eco-Deck",
      subtitle: "Lightweight Deck Greens · Wakad",
    },
    {
      id: "work-5",
      image: "/images/frames/ezgif-frame-007.jpg",
      title: "Tayal Commercial Plaza Boulevard",
      subtitle: "Acoustic Foliage Buffer · PCMC",
    },
    {
      id: "work-6",
      image: "/images/frames/ezgif-frame-009.jpg",
      title: "Nirman Greens Central Park",
      subtitle: "Multi-Acre Flora Installation · Ambegaon",
    },
  ],
  showcaseRow2: [
    {
      id: "flora-1",
      image: "/images/frames/ezgif-frame-013.jpg",
      title: "Wodyetia bifurcata",
      subtitle: "Specimen Foxtail Palm",
    },
    {
      id: "flora-2",
      image: "/images/frames/ezgif-frame-015.jpg",
      title: "Terminalia mantaly",
      subtitle: "Madagascar Almond Canopy",
    },
    {
      id: "flora-3",
      image: "/images/frames/ezgif-frame-017.jpg",
      title: "Michelia champaca",
      subtitle: "Fragrant Sonchampa Specimen",
    },
    {
      id: "flora-4",
      image: "/images/frames/ezgif-frame-019.jpg",
      title: "Plumeria obtusa",
      subtitle: "Architectural White Frangipani",
    },
    {
      id: "flora-5",
      image: "/images/frames/ezgif-frame-002.jpg",
      title: "Roystonea regia",
      subtitle: "Mature Royal Avenue Palm",
    },
    {
      id: "flora-6",
      image: "/images/frames/ezgif-frame-004.jpg",
      title: "Bambusa multiplex",
      subtitle: "Golden Goddess Screening Bamboo",
    },
  ],
};

export interface AnalyticsEvent {
  id: string;
  path: string;
  referrer: string;
  deviceType: "mobile" | "desktop" | "tablet";
  sessionId: string;
  timestamp: string;
}

export interface DailyMetric {
  date: string;
  label: string;
  count: number;
  unique: number;
}

export interface AnalyticsSummary {
  totalVisits: number;
  uniqueVisitors: number;
  inquiryCount: number;
  conversionRate: number; // e.g. 8.4%
  pageViewsByPath: Record<string, number>;
  visitsByDevice: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  visitsByReferrer: Record<string, number>;
  dailyTrends: DailyMetric[];
  recentVisits: AnalyticsEvent[];
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  punePincode: string;
  items: CartItem[];
  subtotal: number;
  gstAmount: number; // 18% or standard applicable
  deliveryFee: number;
  total: number;
  paymentMethod: "razorpay" | "cod";
  paymentStatus: "Paid" | "Pending COD Verification" | "Failed";
  razorpayPaymentId?: string;
  createdAt: string;
}

export interface AdminSettings {
  passcode: string;
  securityQuestion: string;
  securityAnswer: string;
  recoveryEmail: string;
  emergencyKey: string;
  lastPasscodeChange: string;
}

export const defaultAdminSettings: AdminSettings = {
  passcode: "S@batule123",
  securityQuestion: "What is your registered administrator email address?",
  securityAnswer: "mail.vyomaboard@gmail.com",
  recoveryEmail: "greengallery.landscapers@gmail.com",
  emergencyKey: "GG-SEC-RECOVERY-2026",
  lastPasscodeChange: new Date().toISOString(),
};
