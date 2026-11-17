# 🌿 Green Gallery — Landscaping & Specimen Nursery Web Platform

Production-ready business website and e-commerce platform for **Green Gallery**, a premier landscape architecture, foliage contractor, and specimen plant nursery based in Tathawade, Pune, Maharashtra.

**Founder & Owner**: Shubham Batule  
**Direct WhatsApp Business Desk**: +91 78230 80251  
*(All client consultations, project quotation inquiries, and customer requests route directly to Shubham Batule's WhatsApp Business)*

---

## 1. Quick Start & Local Execution

### Prerequisites
- **Node.js**: v18.18+ or v20+ (Tested on Node.js v24)
- **Package Manager**: npm or yarn

### Installation
```bash
# Clone or navigate to the repository directory
cd "green gallery"

# Install production dependencies
npm install

# Start local Next.js development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Environment Variables (`.env.local`)

Copy the template below to `.env.local` to override default settings:

```env
# Site URL & Base
NEXT_PUBLIC_SITE_URL=https://greengallery.in

# Admin Authentication
ADMIN_PASSCODE=greengallery2026

# Razorpay Payment Gateway (Test Mode / Production)
RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=rzp_secret_placeholder

# Email Notifications (Resend / SMTP)
RESEND_API_KEY=re_placeholder
SALES_NOTIFICATION_EMAIL=inquiries@greengallery.in

# Supabase (Optional for direct PostgreSQL synchronization)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

*Note: The platform is built with an integrated local database engine (`.data/db.json`), ensuring it runs 100% out-of-the-box with zero third-party dependencies required.*

---

## 3. Brand Tokens & Design System

Defined in `app/globals.css` and `tailwind.config.ts`:

| Token | Hex Value | Primary Usage |
| :--- | :--- | :--- |
| `--green-900` | `#1F3D2B` | Header, footer, headings, primary filled CTA button |
| `--green-700` | `#2F5D3F` | Hover states, active links, icons, badges |
| `--green-100` | `#E3EBDD` | Light section backgrounds, tag pills |
| `--cream-50` | `#FAF6EC` | Page canvas background |
| `--cream-200` | `#EFE7D3` | Product cards, form fields, alternate panels |
| `--gold-600` | `#A88B4A` | Thin accents, rule dividers, small labels |
| `--ink-900` | `#1C1C1A` | High-contrast body text (WCAG AA compliant) |
| `--ink-500` | `#5C5C54` | Secondary explanatory copy |

### Typography
- **Headings**: `Cormorant Garamond` (Weights 500, 600)
- **Body & Navigation**: `Source Sans 3` (Weights 400, 500, 600)

---

## 4. Key Architectural Features

1. **Parallax Nature Scenery & 120fps Scroll-Video Scrubbing**:
   - Multi-layer differential parallax hero with Green Gallery typography.
   - Hardware-accelerated HTML5 `<canvas>` scrubber preloading the 20-frame landscape sequence from `public/images/frames/` (`ezgif-frame-001.jpg` to `020.jpg`).
2. **Tri-Channel Lead Generation**:
   - Universal `LeadForm` component handling Site Consultations, Project Quotations, and General Inquiries with cryptographic honeypot anti-spam.
   - Direct dial `tel:` with desktop selectable phone numbers.
   - Context-aware floating WhatsApp button adapting its message to the current page/project/product.
3. **E-Commerce Plant Store**:
   - Specimen catalog with sunlight, category, and price filters.
   - Product detail pages with care guides, variant selectors, and automatic bulk threshold shifting ($Q \ge 25$ switches to commercial quote).
   - Cart with real-time Pune pincode validation (`411xxx` / `412xxx`), 18% GST invoice computation, Razorpay test mode, and Pune Cash on Delivery.
4. **Interactive Finished Project Gallery**:
   - 12 comprehensive case studies across Pune, Lonavala, Mumbai, and Nashik.
   - Interactive modal lightbox with keyboard and click navigation.
   - "Request a Similar Project" pre-populating quote specifications.
5. **Live Plant Availability & Unified Inventory Sync**:
   - Searchable, sortable commercial plant table with botanical names and real-time status.
   - Single-source-of-truth database: editing stock in `/admin` updates both the Availability view and Store catalog simultaneously.
6. **Administrative Portal (`/admin`)**:
   - Passcode protected (`greengallery2026`).
   - Filter leads by type and date with 1-click CSV download.
   - Inline stock editor and bulk CSV inventory upload.

---

## 5. Deployment Guide

### Deploying to Vercel
```bash
# Push to GitHub, then run:
vercel --prod
```
Configure environment variables in the Vercel Project Settings dashboard.
