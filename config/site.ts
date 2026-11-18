export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: 'Commercial' | 'Residential' | 'Specialized' | 'Maintenance';
  features: string[];
  scope: string[];
  deliverables: string[];
  idealFor: string;
  image?: string;
  faq: { q: string; a: string }[];
}

export interface SiteConfig {
  name: string;
  url: string;
  legalStatus: string; // e.g. "GreenGallery Landscaping Services"
  tagline: string;
  description: string;
  primaryMarket: string;
  serviceRegions: string[];
  navItems: { label: string; href: string }[];
  social: {
    whatsappLink: string;
    instagram?: string;
    instagramHandle?: string;
    linkedin?: string;
  };
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
  };
  contact: {
    phone: string;
    phoneDisplay: string;
    email: string;
    whatsappNumber: string;
    whatsappDisplay: string;
    whatsappDefaultMessage: string;
    addressNote: string;
    consultationHours: string;
  };
  facilities: {
    stagingWarehouse: {
      location: string;
      role: string;
      isPublicShowroom: boolean;
    };
    nurseryHub: {
      location: string;
      status: string;
      isOperational: boolean;
    };
  };
  founder: {
    displayName: string;
    legalNameCandidates: string[];
    isPublished: boolean; // Kept false until business owner verifies legal identity
    note: string;
  };
  team: {
    coreProfessionalsCount: number;
    hasLaborNetwork: boolean;
    hasSupplierNetwork: boolean;
    summary: string;
  };
  verifiedCapabilities: string[];
  services: ServiceItem[];
  workflowSteps: {
    step: number;
    title: string;
    tagline: string;
    description: string;
  }[];
}

export const siteConfig: SiteConfig = {
  name: "GreenGallery",
  url: "https://greengallery.in",
  legalStatus: "GreenGallery Landscaping Services",
  tagline: "Landscape Design, Execution, Plantation & Garden Care",
  description:
    "Professional landscaping, turnkey plantation, and garden care services for real estate developers, commercial properties, institutions, and residential sanctuaries.",
  primaryMarket: "Pune, Maharashtra, India",
  seo: {
    defaultTitle: "GreenGallery — Professional Landscaping Services & Botanical Execution",
    titleTemplate: "%s | GreenGallery",
    defaultDescription:
      "Landscape design, turnkey execution, podium planting, tree plantation, plant supply, and garden maintenance across Maharashtra and beyond.",
  },
  navItems: [
    { label: "Home", href: "/" },
    { label: "Architecture & Design", href: "/architecture" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Plant Supply", href: "/plants" },
    { label: "Maintenance", href: "/maintenance" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  social: {
    whatsappLink: "https://wa.me/917823080251?text=Hello%20GreenGallery%2C%20I%27m%20interested%20in%20your%20services...",
    instagram: "https://instagram.com/greengallery.in",
    instagramHandle: "@greengallery.in",
  },
  serviceRegions: [
    "Pune Municipal Corporation (PMC)",
    "Pimpri-Chinchwad Municipal Corporation (PCMC)",
    "Hinjawadi & Western IT Corridors",
    "Baner, Balewadi & Wakad",
    "Kharadi, Hadapsar & Wagholi",
    "Kothrud, Bavdhan & Sinhagad Road",
    "Lonavala & Khandala Estates (By Consultation)"
  ],
  contact: {
    phone: "+917823080251",
    phoneDisplay: "+91 78230 80251",
    email: "greengallery.landscapers@gmail.com",
    whatsappNumber: "917823080251",
    whatsappDisplay: "+91 78230 80251",
    whatsappDefaultMessage: "Hello GreenGallery, I'm interested in your services...",
    addressNote: "Operational Staging Facility at Alandi, Pune. Site visits and consultations available across Pune & PCMC by appointment.",
    consultationHours: "Monday to Saturday, by appointment",
  },
  facilities: {
    stagingWarehouse: {
      location: "Alandi, Pune",
      role: "Operational logistical staging & material depot",
      isPublicShowroom: false
    },
    nurseryHub: {
      location: "Old Mumbai–Pune Highway",
      status: "In active development",
      isOperational: false
    }
  },
  founder: {
    displayName: "Founder & Lead Horticultural Director",
    legalNameCandidates: ["Shubham Batule", "Shrikant Batute"],
    isPublished: false,
    note: "Unpublished pending formal written legal confirmation from business owner."
  },
  team: {
    coreProfessionalsCount: 9,
    hasLaborNetwork: true,
    hasSupplierNetwork: true,
    summary: "A dedicated operational team of approximately 9 experienced landscaping professionals supported by an agile, on-demand site labour network and established regional grower nurseries."
  },
  verifiedCapabilities: [
    "Landscape design & execution",
    "Residential landscaping",
    "Commercial landscaping",
    "Apartment & housing society gardens",
    "Industrial landscaping",
    "Outdoor garden creation & revamping",
    "Indoor plantation & interior plantscaping",
    "Balcony design & balcony gardens",
    "Terrace gardens & container installations",
    "Tree plantation drives & avenue planning",
    "Bulk plant procurement & supply",
    "Living walls & vertical green partitions",
    "Container & planter gardens",
    "Comprehensive garden maintenance & pruning",
    "Pest control, fertilization & soil replenishment",
    "Drip & automated landscape irrigation setup",
    "Custom wooden & metal garden infrastructure"
  ],
  services: [
    {
      id: "commercial-landscaping",
      slug: "commercial-landscaping",
      title: "Commercial & Corporate Landscaping",
      category: "Commercial",
      shortDescription:
        "High-impact green landscapes for IT parks, commercial plazas, corporate campuses, hotels, and industrial sites across Pune.",
      fullDescription:
        "GreenGallery delivers commercial landscape solutions engineered for Pune's climatic zones. From corporate entrance focal points to sprawling campus greening, we handle earth preparation, planting matrices, micro-climatic zoning, and scheduled post-installation upkeep.",
      features: [
        "Architectural entrance landscaping",
        "Acoustic perimeter buffer planting",
        "Low-maintenance corporate courtyard vegetation",
        "Full BOQ compliance and stage-wise handover schedules"
      ],
      scope: [
        "Site inspection and microclimate assessment",
        "Civil coordination with main MEP and architectural teams",
        "Soil enrichment, grading, and drainage checks",
        "Plant supply, crane/forklift unloading coordination, and installation",
        "Initial 30-day root establishment monitoring"
      ],
      deliverables: [
        "Detailed BOQ estimation",
        "Plant palette selection report",
        "Installed and irrigated landscape zones",
        "Establishment care guidelines"
      ],
      idealFor: "Corporate Offices, Tech Parks, Showrooms, Industrial Plants, Hospitals & Hospitality Venues",
      faq: [
        {
          q: "How do you coordinate with our civil and MEP contractors?",
          a: "Our team coordinates directly with site project managers to align soil depth loads, drainage conduits, and irrigation lines with your master civil timeline."
        },
        {
          q: "Do you supply plants in bulk quantities for commercial sites?",
          a: "Yes. Through our Alandi logistics depot and grower network, we procure and stage bulk plant shipments verified for root health before site delivery."
        }
      ]
    },
    {
      id: "real-estate-developer-landscaping",
      slug: "real-estate-developer-landscaping",
      title: "Real Estate & Developer Landscapes",
      category: "Commercial",
      shortDescription:
        "Turnkey landscape execution for residential towers, podium decks, amenity zones, and township entrances.",
      fullDescription:
        "Built specifically for Pune's real estate developers, contractors, and project architects. We execute podium planting, clubhouse surrounds, boundary greening, and sales pavilion landscapes with structured handover timelines.",
      features: [
        "Lightweight media planting for podium slabs",
        "Tower handover perimeter hedging",
        "Amenity & clubhouse perimeter greening",
        "Phased delivery mapped to RERA completion schedules"
      ],
      scope: [
        "Drawing review and BOQ bill validation",
        "Staged material mobilization from our Alandi staging warehouse",
        "Planting execution with certified rootballs",
        "Testing of drip lines and automatic watering systems"
      ],
      deliverables: [
        "Executed podium and ground landscapes",
        "Sub-contractor handover sign-offs",
        "Maintenance transition roadmap"
      ],
      idealFor: "Real Estate Developers, Township Promoters, EPC Contractors, Project Management Consultants",
      faq: [
        {
          q: "Can you execute landscapes in phases across tower handovers?",
          a: "Yes, we structure supply and planting schedules according to your RERA tower possession milestones."
        }
      ]
    },
    {
      id: "apartment-society-gardens",
      slug: "apartment-society-gardens",
      title: "Apartment & Housing Society Gardens",
      category: "Commercial",
      shortDescription:
        "Garden upgrades, common area rejuvenation, and scheduled maintenance contracts for residential societies.",
      fullDescription:
        "We help Pune cooperative housing societies (CHS) and apartment managing committees revitalize tired gardens, redesign common lawns, introduce flowering avenues, and maintain healthy green campuses throughout the year.",
      features: [
        "Revival of overgrown or depleted gardens",
        "Society walking track and park planting",
        "Water-efficient irrigation system retrofits",
        "Flexible society maintenance contracts"
      ],
      scope: [
        "Society committee walkthrough and requirement survey",
        "Transparent quotation and committee proposal presentation",
        "Soil tilling, weeding, aeration, and specimen planting",
        "Scheduled gardener support and supervisor checks"
      ],
      deliverables: [
        "Renewed community landscape",
        "Monthly maintenance logs and water-saving guidance"
      ],
      idealFor: "Housing Societies, Residential RWA Committees, Apartment Complexes",
      faq: [
        {
          q: "Do you provide committee proposals for society AGM approvals?",
          a: "Yes, we provide itemized, transparent quotations and visual references suitable for managing committee reviews."
        }
      ]
    },
    {
      id: "residential-landscaping",
      slug: "residential-landscaping",
      title: "Residential Landscaping & Bungalow Gardens",
      category: "Residential",
      shortDescription:
        "Bespoke private gardens, perimeter borders, stepping stones, and curated botanical retreats for bungalows and villas.",
      fullDescription:
        "Turn your private residential space into a serene botanical retreat. Designed for Pune's climate and micro-conditions, we craft private lawns, courtyard plantations, water accents, and sensory flower borders.",
      features: [
        "Custom garden zoning for outdoor entertaining and quiet zones",
        "Native and drought-resilient plant palettes",
        "Natural stone stepping pathways and turf installation",
        "Evening garden low-voltage ambiance layout"
      ],
      scope: [
        "On-site consultation and sun-exposure analysis",
        "Personalized landscape master layout",
        "Bed preparation, organic compost enrichment, and installation",
        "Hands-on handover with homeowner plant care orientation"
      ],
      deliverables: [
        "Landscape layout visualizer",
        "Fully installed private garden",
        "Plant care manual and seasonal pruning roadmap"
      ],
      idealFor: "Bungalow Owners, Villa Residents, Weekend Farmhouses in Mulshi, Lonavala & Pune Suburbs",
      faq: [
        {
          q: "How much space is needed for a residential garden?",
          a: "Whether you have a 200 sq ft courtyard or a half-acre estate, we customize plant densities and arrangements to suit your footprint."
        }
      ]
    },
    {
      id: "balcony-terrace-gardens",
      slug: "balcony-terrace-gardens",
      title: "Balcony & Terrace Gardens",
      category: "Residential",
      shortDescription:
        "Transform urban balconies and open terraces into lush, private green havens with weather-resistant planters and lightweight soil.",
      fullDescription:
        "High-rise living doesn't mean sacrificing nature. We design compact, lush balcony setups and sprawling terrace lounges utilizing lightweight potting soils, wind-tolerant botanicals, and clean automated drip systems.",
      features: [
        "Lightweight potting mixes designed to protect floor loads",
        "Wind-resilient shrubs and privacy-screening bamboo or palms",
        "Drip micro-irrigation connected to standard balcony taps",
        "Custom wooden decks, wall trellises, and plant stand arrangements"
      ],
      scope: [
        "Balcony orientation and wind/sun evaluation",
        "Planter selection (fiberglass, terracotta, powder-coated metal)",
        "Pre-potted plant delivery and spatial staging",
        "Automatic battery/tap timer setup for hassle-free watering"
      ],
      deliverables: [
        "Fully styled balcony/terrace green haven",
        "Automated micro-watering kit configured",
        "Care kit instructions"
      ],
      idealFor: "Urban Apartment Dwellers, Penthouse Terraces, Duplex Balconies",
      faq: [
        {
          q: "Will terrace planters damage my roof waterproofing?",
          a: "We use raised stands, drainage trays, and lightweight potting mixes to prevent water stagnancy and protect floor surfaces."
        }
      ]
    },
    {
      id: "indoor-plantscaping",
      slug: "indoor-plantscaping",
      title: "Indoor Plantation & Interior Plantscaping",
      category: "Specialized",
      shortDescription:
        "Air-purifying and architectural indoor plants for luxury residences, hotel lobbies, cafes, and executive boardrooms.",
      fullDescription:
        "Bring the psychological and air-cleansing benefits of greenery indoors. We hand-select shade-tolerant specimens that thrive in indirect light and conditioned indoor air, matched with premium contemporary planters.",
      features: [
        "Low-light and indirect-light resilient plant selections",
        "Contemporary planters matching your interior design aesthetic",
        "Moisture-controlled sub-irrigation planters",
        "Preventive indoor pest management protocols"
      ],
      scope: [
        "Indoor lux level (light intensity) analysis",
        "Architectural planter styling consultation",
        "White-glove indoor placement and floor-protective mats",
        "Ongoing indoor plant health maintenance plans"
      ],
      deliverables: [
        "Interior plant styling package",
        "Installed indoor plants in designer planters",
        "Low-light watering schedule"
      ],
      idealFor: "Corporate Lounges, Executive Offices, Luxury Homes, Fine Dining Restaurants, Boutiques",
      faq: [
        {
          q: "What plants work best in air-conditioned offices?",
          a: "We utilize hardy varieties like Sansevieria, Zamioculcas (ZZ), Aglaonema, and Rhapis excelsa which handle regulated humidity and indoor temperatures gracefully."
        }
      ]
    },
    {
      id: "living-walls-vertical-gardens",
      slug: "living-walls-vertical-gardens",
      title: "Living Walls & Vertical Gardens",
      category: "Specialized",
      shortDescription:
        "High-density vertical green systems for perimeter boundary walls, facade accents, and space-saving urban courtyards.",
      fullDescription:
        "Maximize your green footprint when horizontal ground space is scarce. Our modular vertical garden panels incorporate automated drip irrigation and durable mounting systems to create lush living tapestries.",
      features: [
        "Modular UV-stabilized vertical panel frameworks",
        "Integrated automated drip-feeding irrigation lines",
        "Curated evergreen foliage patterns (Syngonium, Ferns, Philodendron)",
        "Indoor and exterior weather-rated hardware"
      ],
      scope: [
        "Structural backing and water supply feasibility check",
        "Frame installation and waterproofing isolation barrier",
        "Panel assembly, soil-less media packing, and planting",
        "Irrigation cycle calibration and maintenance routine"
      ],
      deliverables: [
        "Operational living green wall",
        "Automated timer control unit",
        "Quarterly inspection schedule"
      ],
      idealFor: "Commercial Entrance Walls, Villa Courtyard Walls, Restaurant Backdrops, Urban Compound Walls",
      faq: [
        {
          q: "How often do vertical gardens need watering?",
          a: "Our systems run on automated timers that deliver short, controlled moisture cycles 1 to 2 times daily, preventing water runoff."
        }
      ]
    },
    {
      id: "tree-plantation-avenues",
      slug: "tree-plantation-avenues",
      title: "Tree Plantation & Avenue Greenery",
      category: "Specialized",
      shortDescription:
        "Avenue shade trees, native plantation drives, and large-scale boundary tree planting for plots, institutions, and farms.",
      fullDescription:
        "We procure, transport, and properly establish native and ornamental trees for Pune roadsides, campus avenues, farm boundaries, and CSR greening drives. Every specimen is planted with structured root collars and stabilization stakes.",
      features: [
        "Native Western Maharashtra tree palettes (Neem, Gulmohar, Tabebuia, Badam)",
        "Sturdy bamboo and timber support staking",
        "Pre-treated planting pits with organic compost and termiticide",
        "High survival establishment management"
      ],
      scope: [
        "Soil condition survey and pit sizing excavation",
        "Procurement of healthy, straight-stem saplings and specimens",
        "Staged tree delivery from our Alandi logistics depot",
        "Planting with basal fertilizer and deep root watering basins"
      ],
      deliverables: [
        "Planted and staked avenue trees",
        "Fertilization calendar for the first 12 months",
        "Survival audit report"
      ],
      idealFor: "Educational Campuses, Industrial Boundaries, Farmhouse Estates, Urban Avenue Development",
      faq: [
        {
          q: "What tree species are most resilient for Pune soil and climate?",
          a: "We recommend native and acclimatized species such as Cassia fistula (Bahawa), Spathodea, Tabebuia rosea, Pongamia, and Neem for low water consumption and long-term vitality."
        }
      ]
    },
    {
      id: "plant-supply-bulk-procurement",
      slug: "plant-supply-bulk-procurement",
      title: "Plant Supply & Bulk Procurement",
      category: "Specialized",
      shortDescription:
        "Direct procurement and site delivery of acclimatized plants, groundcovers, shrubs, and ornamental palms for projects.",
      fullDescription:
        "For landscape contractors, architects, and institutions that already have an in-house execution team, GreenGallery acts as your trusted plant procurement partner. We source, batch-verify, and stage plant lots from our Alandi staging facility.",
      features: [
        "Extensive grower network across Western Maharashtra and Andhra nurseries",
        "Rigorous quality inspection for pest-free, vigorous root systems",
        "Direct-to-site logistical transport coordination across Pune",
        "Transparent batch pricing with itemized species specifications"
      ],
      scope: [
        "Bill of Quantities (BOQ) list review and species availability confirmation",
        "Staging and sorting at our Alandi depot",
        "Safe loading and transport to your project site",
        "Unloading inspection and count verification"
      ],
      deliverables: [
        "Delivered plant batches compliant with BOQ specifications",
        "Delivery challans and species tagging"
      ],
      idealFor: "Landscape Architects, General Contractors, Facility Managers, Institutional Estate Heads",
      faq: [
        {
          q: "Can I visit your nursery to pick plants?",
          a: "Our Alandi location is an operational staging depot rather than a retail walk-in nursery. Our upcoming nursery hub along the Old Mumbai–Pune Highway is currently under development. In the meantime, we provide photo catalogs and bring verified specimen batches directly to your project site."
        }
      ]
    },
    {
      id: "garden-maintenance-upkeep",
      slug: "garden-maintenance-upkeep",
      title: "Garden Maintenance & Horticultural Care",
      category: "Maintenance",
      shortDescription:
        "Weekly, monthly, or quarterly horticultural maintenance packages for corporate campuses, societies, and private villas.",
      fullDescription:
        "A landscape is only as beautiful as its ongoing care. GreenGallery's structured maintenance contracts ensure your lawns stay manicured, shrubs stay neatly pruned, and plants receive timely seasonal fertilization and pest protection.",
      features: [
        "Scheduled lawn mowing, edging, and weed eradication",
        "Horticultural pruning and canopy trimming",
        "Soil aeration, vermicompost feeding, and organic nutrient drenches",
        "Preventive organic pest control and fungicide applications"
      ],
      scope: [
        "Landscape health assessment and maintenance checklist creation",
        "Assigned garden technicians equipped with professional tools",
        "Supervisory audits by our senior horticultural staff",
        "Seasonal plant rotation recommendations"
      ],
      deliverables: [
        "Scheduled monthly service visits",
        "Service log sheet after every visit",
        "Emergency plant health callouts"
      ],
      idealFor: "Corporate Campuses, Housing Societies, Commercial Buildings, Private Villas & Estates",
      faq: [
        {
          q: "What maintenance plans do you offer?",
          a: "We offer flexible weekly, bi-weekly, or monthly contracts tailored to the scale of your landscape and seasonal needs."
        }
      ]
    }
  ],
  workflowSteps: [
    {
      step: 1,
      title: "Consultation & Site Assessment",
      tagline: "Understanding Your Space & Vision",
      description:
        "We begin with a detailed discussion or on-site walkthrough across Pune to evaluate sun exposure, soil conditions, water availability, and functional objectives."
    },
    {
      step: 2,
      title: "Concept Plan & Transparent Proposal",
      tagline: "Design & Clear Commercials",
      description:
        "We draft a plant palette, landscape layout, and an itemized Bill of Quantities (BOQ) with realistic timelines and no hidden expenses."
    },
    {
      step: 3,
      title: "Procurement & Quality Staging",
      tagline: "Healthy Specimens Staged in Alandi",
      description:
        "Plants and materials are sourced through our grower network and staged at our Alandi logistics depot, where root vigour and pest health are verified."
    },
    {
      step: 4,
      title: "Precision Execution & Installation",
      tagline: "Civil Coordination & Clean Planting",
      description:
        "Our skilled 9-member core operational team and site specialists handle ground preparation, soil enrichment, civil alignment, and drip watering setup."
    },
    {
      step: 5,
      title: "Handover & Structured Maintenance",
      tagline: "Long-Term Growth & Care Support",
      description:
        "We provide a comprehensive care orientation upon project completion, followed by scheduled horticultural upkeep packages to ensure lasting flourishing."
    }
  ]
};
