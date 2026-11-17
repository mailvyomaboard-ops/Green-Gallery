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

export interface ShowcaseItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

export interface SiteContent {
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
  bannerBadge?: string;
  bannerHeadline?: string;
  bannerDescription?: string;
  showcaseRow1: ShowcaseItem[];
  showcaseRow2: ShowcaseItem[];
}

export const defaultSiteContent: SiteContent = {
  heroImage: "/images/courtyard-modern.jpg",
  heroBadge: "Horticultural Landscape Execution · Pune",
  heroHeadline: "growth",
  heroDescription:
    "Professional landscape design, plantation execution, and ongoing botanical care across Pune and Western Maharashtra.",
  heroStatCount: "Pune & PCMC",
  heroStatLabel: "Dedicated operational staging and site execution network.",
  primaryButtonText: "Explore Services",
  secondaryButtonText: "Book Site Consultation",
  introHeadline: "Transforming Spaces Through Thoughtful Landscaping",
  introDescription:
    "From corporate campuses and residential developments to private villas and balcony gardens, we deliver tailored landscape solutions built for Pune's climate.",
  bannerBadge: "Start Your Botanical Project",
  bannerHeadline: "Partner with GreenGallery",
  bannerDescription:
    "Review site plans with our team, enquire about plant supply from our staging depot, or request formal developer BOQ pricing.",
  showcaseRow1: [
    {
      id: "work-1",
      image: "/images/courtyard-modern.jpg",
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
