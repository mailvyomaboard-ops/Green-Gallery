// Green Gallery — Site Configuration & Placeholders
// Centralized configuration for Green Gallery, Pune.
// Founder & Owner: Shubham Batule (+91 78230 80251)
// Primary communication: WhatsApp Business (no direct telephone calls)

export const siteConfig = {
  name: "Green Gallery",
  tagline: "Landscaping and greenery for architecture that lasts",
  description:
    "Comprehensive landscape design, turnkey installation, nursery specimen supply, and long-term estate grounds maintenance for developers, builders, architects, and luxury estates in Pune and Western India.",
  url: "https://greengallery.in",

  // Founder & Leadership
  founder: {
    name: "Shubham Batule",
    title: "Owner & Founder",
    company: "Green Gallery",
  },

  // Business Contacts & Communication Channels
  contact: {
    // Official WhatsApp Business Number of Shubham Batule (Owner & Founder)
    whatsappNumber: "917823080251",
    whatsappDisplay: "+91 78230 80251",
    phoneDisplay: "+91 78230 80251",
    phoneTel: "+917823080251",

    // Official sales & inquiry email
    salesEmail: "inquiries@greengallery.in",
    supportEmail: "support@greengallery.in",

    // Registered nursery and corporate office address in Pune
    address: {
      line1: "Green Gallery Estate & Nursery, Survey No. 48/2",
      line2: "Off Mumbai-Pune Expressway, Tathawade",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411033",
      country: "India",
      googleMapsEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121058.92836592288!2d73.7929267981559!3d18.52476632616226!2m3!1f0!2f0!3f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d3e3f32!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      googleBusinessProfileUrl: "https://maps.google.com/?cid=greengallerypune",
    },

    // Operating hours
    businessHours: {
      weekdays: "Monday – Saturday: 8:30 AM – 6:30 PM",
      sunday: "Sunday: By Prior Appointment Only",
      notice: "Direct all inquiries through WhatsApp Business. Shubham Batule and our team review and respond promptly.",
    },

    // Response guarantee
    responseGuarantee: "All consultation and quotation requests are delivered directly to Shubham Batule's WhatsApp Business desk with prompt response within one working day.",

    // GST identification number
    gstNumber: "27AAACG1234F1Z8",
  },

  // Operational metrics
  stats: [
    { label: "Years of Practice", value: "18+", note: "Serving Pune since 2008" },
    { label: "Commercial & Estate Projects", value: "450+", note: "Turnkey delivery" },
    { label: "Specimen Trees & Plants Supplied", value: "350,000+", note: "Acclimatized stock" },
    { label: "Regional Hubs Served", value: "4", note: "Pune, Mumbai, Nashik, Lonavala" },
  ],

  // Social & Direct WhatsApp link
  social: {
    instagram: "https://instagram.com/greengallerypune",
    linkedin: "https://linkedin.com/company/greengallery",
    facebook: "https://facebook.com/greengallerypune",
    whatsappLink: "https://wa.me/917823080251",
  },

  // Navigation Items
  navItems: [
    { label: "Home", href: "/" },
    { label: "Clients & Portfolio", href: "/gallery" },
    { label: "Store", href: "/store" },
    { label: "Contact", href: "/contact" },
  ],

  // Service Offerings
  services: [
    {
      id: "landscape-design-installation",
      title: "Landscape Design and Installation",
      description: "End-to-end master planning, earth profiling, hardscaping, soil preparation, and complete vegetative planting for luxury residences and institutional campuses.",
      image: "/images/projects/project-1.jpg",
    },
    {
      id: "project-foliage-builders",
      title: "Project Foliage for Builders",
      description: "Phased bulk specimen procurement, boundary hedge curtains, grand entrance road avenues, and green buffer zones for high-density township developments.",
      image: "/images/projects/project-2.jpg",
    },
    {
      id: "terrace-vertical-gardens",
      title: "Terrace and Vertical Gardens",
      description: "Engineered lightweight substrate living walls, rooftop amenity decks, automated micro-drip fertigation, and structural waterproofing coordination.",
      image: "/images/projects/project-3.jpg",
    },
    {
      id: "plant-supply-bulk",
      title: "Plant Supply (Retail and Bulk)",
      description: "Over 500 species of direct nursery-grown specimen trees, architectural palms, drought-hardy shrubs, and native groundcovers ready for direct delivery.",
      image: "/images/projects/project-4.jpg",
    },
    {
      id: "garden-maintenance-contracts",
      title: "Garden Maintenance Contracts",
      description: "Dedicated on-site horticultural teams, quarterly soil conditioning, seasonal pruning, integrated organic pest mitigation, and irrigation audit programs.",
      image: "/images/projects/project-5.jpg",
    },
    {
      id: "interior-plantscaping",
      title: "Interior Plantscaping",
      description: "Low-light botanical installations, architectural self-watering planters, corporate biophilic atriums, and air-purifying foliage programs.",
      image: "/images/projects/project-6.jpg",
    },
  ],

  // Process Steps
  processSteps: [
    {
      step: "01",
      title: "Consultation",
      description: "Initial client brief evaluation, architectural drawing review, micro-climate analysis, and programmatic landscaping goals via WhatsApp.",
    },
    {
      step: "02",
      title: "Site Visit & Proposal",
      description: "Comprehensive topography audit, soil & sunlight testing, CAD planting plans, BOQ costing schedule, and timeline definition.",
    },
    {
      step: "03",
      title: "Installation",
      description: "Civil hardscape prep, specialized planting media mixing, specimen tree crane placement, and automated drip irrigation installation.",
    },
    {
      step: "04",
      title: "Maintenance",
      description: "Quarterly health diagnostics, seasonal nutrient feeding, canopy pruning, and guaranteed plant replacement programs under SLA.",
    },
  ],

  // Default SEO
  seo: {
    titleTemplate: "%s | Green Gallery — Landscaping & Specimen Nursery, Pune",
    defaultTitle: "Green Gallery — Landscaping & Foliage for Architecture that Lasts",
    defaultDescription:
      "Premier landscape architecture, builder greening solutions, and nursery supply in Pune. Founded by Shubham Batule. Specializing in high-end estates, township developments, and commercial properties.",
  },
};
