"use client";

import React, { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";
import { ClientType, ProjectStage, TimeSlot } from "@/lib/types";

interface LeadFormProps {
  formType: "consultation" | "quote" | "general";
  initialProjectType?: string;
  initialProjectName?: string;
  initialScope?: string;
  sourcePage?: string;
  onSuccess?: () => void;
  className?: string;
}

export function LeadForm({
  formType,
  initialProjectType = "",
  initialProjectName = "",
  initialScope = "",
  sourcePage = "unknown",
  onSuccess,
  className = "",
}: LeadFormProps) {
  // State for form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [clientType, setClientType] = useState<ClientType>("Builder or Developer");
  const [projectType, setProjectType] = useState(initialProjectType);
  const [siteLocation, setSiteLocation] = useState("");
  const [approxArea, setApproxArea] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<TimeSlot>("Morning (9 AM - 12 PM)");
  const [notes, setNotes] = useState("");

  // Quote fields
  const [company, setCompany] = useState("");
  const [projectName, setProjectName] = useState(initialProjectName);
  const [city, setCity] = useState("Pune");
  const [projectStage, setProjectStage] = useState<ProjectStage>("Planning & Concepts");
  const [selectedScope, setSelectedScope] = useState<string[]>(
    initialScope ? [initialScope] : ["Landscape Design and Installation"]
  );
  const [budgetRange, setBudgetRange] = useState("₹10L - ₹25L");
  const [timeline, setTimeline] = useState("Within 3 months");
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");

  // General fields
  const [message, setMessage] = useState("");

  // Anti-spam honeypot
  const [honeypot, setHoneypot] = useState("");

  // Sync props when user switches deep-linked tabs
  useEffect(() => {
    if (initialProjectType) {
      setProjectType(initialProjectType);
    }
  }, [initialProjectType]);

  useEffect(() => {
    if (initialScope) {
      setSelectedScope([initialScope]);
    }
  }, [initialScope]);

  // Status & Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState("");

  const handleScopeToggle = (service: string) => {
    setSelectedScope((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setFileError("Drawing file exceeds maximum allowed limit of 10 MB.");
      return;
    }
    const allowed = [".pdf", ".dwg", ".dxf", ".jpg", ".jpeg", ".png"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowed.includes(ext)) {
      setFileError("Please upload a PDF, DWG, DXF, or CAD image (under 10 MB).");
      return;
    }
    setFileName(file.name);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required.";
    if (!phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (!/^[0-9+() -]{8,15}$/.test(phone.trim())) {
      errs.phone = "Please enter a valid phone number.";
    }
    if (!email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    if (formType === "consultation") {
      if (!siteLocation.trim()) errs.siteLocation = "Site or property location is required.";
    }

    if (formType === "quote") {
      if (!company.trim()) errs.company = "Company or firm name is required.";
      if (!projectName.trim()) errs.projectName = "Project name or property title is required.";
      if (selectedScope.length === 0) errs.scope = "Please select at least one scope of service.";
    }

    if (formType === "general") {
      if (!message.trim()) errs.message = "Message cannot be empty.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Build clean WhatsApp message to GreenGallery team without AI-style emojis
  const buildWhatsAppMessage = () => {
    if (formType === "consultation") {
      return `*Green Gallery — Site Consultation Booking*
*Client Name:* ${name}
*Phone:* ${phone}
*Email:* ${email}
*Client Type:* ${clientType}
*Project Type:* ${projectType || "General Landscape"}
*Site Location:* ${siteLocation}
*Approx Area:* ${approxArea || "Not specified"}
*Preferred Date:* ${preferredDate || "Earliest available"}
*Slot:* ${preferredTimeSlot}
*Notes:* ${notes || "None"}
*Source:* ${sourcePage}`;
    } else if (formType === "quote") {
      return `*Green Gallery — Project Quotation Request*
*Company:* ${company}
*Contact Person:* ${name}
*Phone:* ${phone}
*Email:* ${email}
*Project Name:* ${projectName}
*City:* ${city}
*Project Stage:* ${projectStage}
*Scope of Work:* ${selectedScope.join(", ")}
*Budget:* ${budgetRange}
*Timeline:* ${timeline}
*Drawings Attached:* ${fileName || "Will send on WhatsApp"}
*Notes:* ${notes || "None"}`;
    } else {
      return `*Green Gallery — General Inquiry*
*Name:* ${name}
*Phone:* ${phone}
*Email:* ${email}
*Message:* ${message}
*Source:* ${sourcePage}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (honeypot) {
      setSubmitSuccess(true);
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        type: formType,
        name,
        phone,
        email,
        clientType,
        projectType,
        siteLocation,
        approxArea,
        preferredDate,
        preferredTimeSlot,
        notes,
        company,
        projectName,
        city,
        projectStage,
        scope: selectedScope,
        budgetRange,
        timeline,
        drawingFileName: fileName,
        message,
        sourcePage,
      };

      // 1. Save lead to system database
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // 2. Build direct WhatsApp URL for GreenGallery (+91 78230 80251)
      const waText = buildWhatsAppMessage();
      const waUrl = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(waText)}`;
      setGeneratedWhatsAppUrl(waUrl);

      setSubmitSuccess(true);

      // 3. Immediately launch GreenGallery WhatsApp in new window so lead is sent directly
      if (typeof window !== "undefined") {
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }

      if (onSuccess) {
        setTimeout(onSuccess, 5000);
      }
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit. Please message on WhatsApp directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-green-100/70 border border-green-700/30 p-6 md:p-8 rounded-brand text-green-900 animate-fadeIn">
        <div className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center mb-4 shadow">
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 2C6.5 2 2 6.484 2 12.008c0 1.954.563 3.782 1.536 5.334L2 22l4.82-1.499c1.488.88 3.218 1.385 5.211 1.385 5.531 0 10.031-4.484 10.031-10.008C22.062 6.484 17.562 2 12.031 2zm5.834 14.283c-.244.686-1.42 1.31-1.958 1.393-.509.078-1.157.112-3.714-.949-3.266-1.355-5.367-4.664-5.531-4.882-.158-.218-1.309-1.742-1.309-3.325 0-1.583.829-2.362 1.121-2.684.294-.323.642-.404.857-.404.214 0 .428.002.615.011.198.01.463-.075.725.556.269.646.917 2.235.998 2.398.081.163.136.353.027.57-.109.217-.163.353-.326.544-.163.19-.344.425-.49.57-.163.163-.333.34-.143.666.19.326.844 1.391 1.811 2.253 1.244 1.108 2.293 1.452 2.619 1.615.326.163.517.136.708-.082.19-.218.816-.952 1.034-1.278.217-.326.435-.272.734-.163.299.109 1.895.894 2.222 1.057.326.163.544.244.625.38.081.136.081.788-.163 1.474z" />
          </svg>
        </div>
        <h3 className="text-2xl font-serif font-semibold mb-2">Inquiry Saved & Ready to Send</h3>
        <p className="text-ink-900 mb-3 text-base">
          Thank you, <strong>{name}</strong>. Your inquiry has been formatted directly for <strong>GreenGallery’s Operational Desk</strong>.
        </p>
        <p className="text-sm text-ink-500 mb-5">
          If your WhatsApp did not open automatically, tap the button below to send your pre-filled inquiry to our WhatsApp desk (+91 78230 80251).
        </p>

        {generatedWhatsAppUrl && (
          <a
            href={generatedWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[48px] px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-medium text-sm rounded-brand shadow flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 2C6.5 2 2 6.484 2 12.008c0 1.954.563 3.782 1.536 5.334L2 22l4.82-1.499c1.488.88 3.218 1.385 5.211 1.385 5.531 0 10.031-4.484 10.031-10.008C22.062 6.484 17.562 2 12.031 2zm5.834 14.283c-.244.686-1.42 1.31-1.958 1.393-.509.078-1.157.112-3.714-.949-3.266-1.355-5.367-4.664-5.531-4.882-.158-.218-1.309-1.742-1.309-3.325 0-1.583.829-2.362 1.121-2.684.294-.323.642-.404.857-.404.214 0 .428.002.615.011.198.01.463-.075.725.556.269.646.917 2.235.998 2.398.081.163.136.353.027.57-.109.217-.163.353-.326.544-.163.19-.344.425-.49.57-.163.163-.333.34-.143.666.19.326.844 1.391 1.811 2.253 1.244 1.108 2.293 1.452 2.619 1.615.326.163.517.136.708-.082.19-.218.816-.952 1.034-1.278.217-.326.435-.272.734-.163.299.109 1.895.894 2.222 1.057.326.163.544.244.625.38.081.136.081.788-.163 1.474z" />
            </svg>
            <span>Open in WhatsApp & Chat with GreenGallery</span>
          </a>
        )}

        <div className="pt-4 mt-4 border-t border-green-900/10 flex flex-wrap gap-4 text-xs text-ink-500">
          <span>WhatsApp Business: {siteConfig.contact.whatsappDisplay}</span>
          <span>Operating Market: Pune &amp; PCMC</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={`space-y-5 ${className}`}>
      {/* Honeypot anti-spam field */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`website_hp_${formType}`}>Do not fill this</label>
        <input
          id={`website_hp_${formType}`}
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {submitError && (
        <div className="p-4 bg-red-50 border border-red-300 text-red-800 text-sm rounded-brand">
          {submitError}
        </div>
      )}

      {/* Notice indicating direct WhatsApp routing */}
      <div className="p-3 bg-green-100/50 border border-green-700/20 rounded-brand text-xs text-green-900 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#25D366]" />
        <span>Inquiries are forwarded directly to <strong>GreenGallery WhatsApp Business (+91 78230 80251)</strong>.</span>
      </div>

      {/* Row 1: Common Identity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink-900 mb-1">
            Full Name <span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Vikramaditya Bhosale"
            className={`w-full px-3.5 py-2.5 bg-cream-50 border ${
              errors.name ? "border-red-600" : "border-cream-200 focus:border-green-700"
            } rounded-brand text-ink-900 text-base focus:outline-none`}
          />
          {errors.name && <p className="text-xs text-red-700 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-900 mb-1">
            Phone / WhatsApp Number <span className="text-red-700">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +91 98220 00000"
            className={`w-full px-3.5 py-2.5 bg-cream-50 border ${
              errors.phone ? "border-red-600" : "border-cream-200 focus:border-green-700"
            } rounded-brand text-ink-900 text-base focus:outline-none`}
          />
          {errors.phone && <p className="text-xs text-red-700 mt-1">{errors.phone}</p>}
        </div>
      </div>

      {/* Row 2: Email */}
      <div>
        <label className="block text-sm font-medium text-ink-900 mb-1">
          Email Address <span className="text-red-700">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. contact@yourfirm.com"
          className={`w-full px-3.5 py-2.5 bg-cream-50 border ${
            errors.email ? "border-red-600" : "border-cream-200 focus:border-green-700"
          } rounded-brand text-ink-900 text-base focus:outline-none`}
        />
        {errors.email && <p className="text-xs text-red-700 mt-1">{errors.email}</p>}
      </div>

      {/* FORM TYPE 1: BOOK A SITE CONSULTATION */}
      {formType === "consultation" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-900 mb-1">Client Profile</label>
              <select
                value={clientType}
                onChange={(e) => setClientType(e.target.value as ClientType)}
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-200 rounded-brand text-ink-900 text-base focus:border-green-700 focus:outline-none"
              >
                <option value="Builder or Developer">Builder or Developer</option>
                <option value="Homeowner">Homeowner / Estate Owner</option>
                <option value="Architect or Consultant">Architect or Landscape Consultant</option>
                <option value="Other">Corporate / Institutional / Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-900 mb-1">Project Category</label>
              <input
                type="text"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                placeholder="e.g. Penthouse Terrace / Residential Township"
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-200 rounded-brand text-ink-900 text-base focus:border-green-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-900 mb-1">
                Site Location (Pune / Nearby) <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                value={siteLocation}
                onChange={(e) => setSiteLocation(e.target.value)}
                placeholder="e.g. Koregaon Park / Baner / Lonavala"
                className={`w-full px-3.5 py-2.5 bg-cream-50 border ${
                  errors.siteLocation ? "border-red-600" : "border-cream-200 focus:border-green-700"
                } rounded-brand text-ink-900 text-base focus:outline-none`}
              />
              {errors.siteLocation && <p className="text-xs text-red-700 mt-1">{errors.siteLocation}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-900 mb-1">
                Approximate Area (Sq. Ft.)
              </label>
              <input
                type="text"
                value={approxArea}
                onChange={(e) => setApproxArea(e.target.value)}
                placeholder="e.g. 5,000 sq ft or 2 acres"
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-200 rounded-brand text-ink-900 text-base focus:border-green-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-900 mb-1">Preferred Consultation Date</label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-200 rounded-brand text-ink-900 text-base focus:border-green-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-900 mb-1">Preferred Time Window</label>
              <select
                value={preferredTimeSlot}
                onChange={(e) => setPreferredTimeSlot(e.target.value as TimeSlot)}
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-200 rounded-brand text-ink-900 text-base focus:border-green-700 focus:outline-none"
              >
                <option value="Morning (9 AM - 12 PM)">Morning (9:00 AM – 12:00 PM)</option>
                <option value="Afternoon (12 PM - 4 PM)">Afternoon (12:00 PM – 4:00 PM)</option>
                <option value="Evening (4 PM - 7 PM)">Evening (4:00 PM – 7:00 PM)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-900 mb-1">Project Brief or Specific Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tell our team about existing site conditions, civil readiness, or particular species you require..."
              className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-200 rounded-brand text-ink-900 text-base focus:border-green-700 focus:outline-none"
            />
          </div>
        </>
      )}

      {/* FORM TYPE 2: REQUEST A PROJECT QUOTE */}
      {formType === "quote" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-900 mb-1">
                Company / Developer Name <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Panchshil / Lodha / Kolte-Patil"
                className={`w-full px-3.5 py-2.5 bg-cream-50 border ${
                  errors.company ? "border-red-600" : "border-cream-200 focus:border-green-700"
                } rounded-brand text-ink-900 text-base focus:outline-none`}
              />
              {errors.company && <p className="text-xs text-red-700 mt-1">{errors.company}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-900 mb-1">
                Project Name <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Horizon Towers Phase 2"
                className={`w-full px-3.5 py-2.5 bg-cream-50 border ${
                  errors.projectName ? "border-red-600" : "border-cream-200 focus:border-green-700"
                } rounded-brand text-ink-900 text-base focus:outline-none`}
              />
              {errors.projectName && <p className="text-xs text-red-700 mt-1">{errors.projectName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-900 mb-1">City / Region</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Pune, Lonavala, Mumbai"
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-200 rounded-brand text-ink-900 text-base focus:border-green-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-900 mb-1">Project Stage</label>
              <select
                value={projectStage}
                onChange={(e) => setProjectStage(e.target.value as ProjectStage)}
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-200 rounded-brand text-ink-900 text-base focus:border-green-700 focus:outline-none"
              >
                <option value="Planning & Concepts">Planning & Concepts (Tender stage)</option>
                <option value="Civil Structure Ready">Civil Structure Ready (Podium/Ground slab poured)</option>
                <option value="Interior / Finishing Stage">Interior / Finishing Stage</option>
                <option value="Existing Landscape Renovation">Existing Landscape Renovation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-900 mb-2">
              Scope of Services Required <span className="text-red-700">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {siteConfig.services.map((srv) => (
                <label
                  key={srv.id}
                  className={`flex items-center gap-2 p-2.5 border rounded-brand text-sm cursor-pointer select-none transition-colors ${
                    selectedScope.includes(srv.title)
                      ? "bg-green-100/60 border-green-700 text-green-900 font-medium"
                      : "bg-cream-50 border-cream-200 text-ink-900 hover:border-green-700/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedScope.includes(srv.title)}
                    onChange={() => handleScopeToggle(srv.title)}
                    className="accent-green-900 w-4 h-4 rounded"
                  />
                  <span>{srv.title}</span>
                </label>
              ))}
            </div>
            {errors.scope && <p className="text-xs text-red-700 mt-1">{errors.scope}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-900 mb-1">Estimated Budget Range</label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-200 rounded-brand text-ink-900 text-base focus:border-green-700 focus:outline-none"
              >
                <option value="Under ₹10 Lakhs">Under ₹10 Lakhs</option>
                <option value="₹10L - ₹25L">₹10 Lakhs – ₹25 Lakhs</option>
                <option value="₹25L - ₹50L">₹25 Lakhs – ₹50 Lakhs</option>
                <option value="₹50L - ₹1 Crore">₹50 Lakhs – ₹1 Crore</option>
                <option value="₹1 Crore+">₹1 Crore+ (Township scale)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-900 mb-1">Expected Timeline</label>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="e.g. Immediate (30 days) or Q1 2027"
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-200 rounded-brand text-ink-900 text-base focus:border-green-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-900 mb-1">
              Upload Architectural Layouts / Drawings (PDF, max 10 MB)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                id="drawing-file-input"
                onChange={handleFileUpload}
                accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg"
                className="text-sm text-ink-500 file:mr-4 file:py-2 file:px-4 file:rounded-brand file:border-0 file:text-sm file:font-medium file:bg-green-100 file:text-green-900 hover:file:bg-green-700 hover:file:text-cream-50 cursor-pointer"
              />
            </div>
            {fileName && <p className="text-xs text-green-700 mt-1">Attached: {fileName}</p>}
            {fileError && <p className="text-xs text-red-700 mt-1">{fileError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-900 mb-1">Additional Scope Requirements</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Specify species required, phased delivery schedules, or nursery holding requirements..."
              className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-200 rounded-brand text-ink-900 text-base focus:border-green-700 focus:outline-none"
            />
          </div>
        </>
      )}

      {/* FORM TYPE 3: GENERAL ENQUIRY */}
      {formType === "general" && (
        <div>
          <label className="block text-sm font-medium text-ink-900 mb-1">
            Message for GreenGallery Team <span className="text-red-700">*</span>
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can our GreenGallery horticultural team assist you today?"
            className={`w-full px-3.5 py-2.5 bg-cream-50 border ${
              errors.message ? "border-red-600" : "border-cream-200 focus:border-green-700"
            } rounded-brand text-ink-900 text-base focus:outline-none`}
          />
          {errors.message && <p className="text-xs text-red-700 mt-1">{errors.message}</p>}
        </div>
      )}

      {/* Consent & Data Policy notice */}
      <div className="text-xs text-ink-500 pt-1 leading-relaxed">
        By submitting this form, you will be connected directly to GreenGallery via WhatsApp Business to coordinate your site assessment or project inquiry.
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full min-h-[50px] bg-green-950 hover:bg-green-800 text-white font-bold px-6 py-3.5 rounded-full shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
      >
        {isSubmitting ? (
          <span>Routing to GreenGallery on WhatsApp...</span>
        ) : (
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 fill-current text-[#25D366]" viewBox="0 0 24 24">
              <path d="M12.031 2C6.5 2 2 6.484 2 12.008c0 1.954.563 3.782 1.536 5.334L2 22l4.82-1.499c1.488.88 3.218 1.385 5.211 1.385 5.531 0 10.031-4.484 10.031-10.008C22.062 6.484 17.562 2 12.031 2zm5.834 14.283c-.244.686-1.42 1.31-1.958 1.393-.509.078-1.157.112-3.714-.949-3.266-1.355-5.367-4.664-5.531-4.882-.158-.218-1.309-1.742-1.309-3.325 0-1.583.829-2.362 1.121-2.684.294-.323.642-.404.857-.404.214 0 .428.002.615.011.198.01.463-.075.725.556.269.646.917 2.235.998 2.398.081.163.136.353.027.57-.109.217-.163.353-.326.544-.163.19-.344.425-.49.57-.163.163-.333.34-.143.666.19.326.844 1.391 1.811 2.253 1.244 1.108 2.293 1.452 2.619 1.615.326.163.517.136.708-.082.19-.218.816-.952 1.034-1.278.217-.326.435-.272.734-.163.299.109 1.895.894 2.222 1.057.326.163.544.244.625.38.081.136.081.788-.163 1.474z" />
            </svg>
            <span>
              {formType === "consultation"
                ? "Submit & Send on WhatsApp"
                : formType === "quote"
                ? "Submit Quote & Open WhatsApp"
                : "Send Message via WhatsApp"}
            </span>
          </div>
        )}
      </button>
    </form>
  );
}
