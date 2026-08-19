import { getPropertyBySlug, getAllProperties } from "@/lib/api";
import { notFound } from "next/navigation";
import parse from "html-react-parser";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Sparkles, CheckCircle2, ShieldCheck, Dumbbell, Coffee, Compass } from "lucide-react";
import type { Metadata } from "next";

interface PropertyProps {
  params: Promise<{ slug: string }> | { slug: string };
}

interface PropertyItem {
  title: string;
  content: string;
  price: string;
  location: string;
  imageUrl: string;
  amenities: string[];
}

const mockProperties: Record<string, PropertyItem> = {
  "mansi-residency": {
    title: "PGSPOT Mansi (Boys)",
    content: `
      <p class="text-lg text-slate-600 leading-relaxed mb-6">Premium boy's suite near Mansi Circle. Perfectly suited for working professionals and students seeking a quiet, upscale environment with single/shared occupancy and full boarding options.</p>
      
      <h3 class="text-xl font-bold text-slate-900 mt-8 mb-4">Key Amenities</h3>
      <ul class="space-y-3">
        <li class="flex items-start gap-2.5"><span class="text-amber-500 font-bold">✓</span> High-Speed Broadband WiFi (Up to 300 Mbps)</li>
        <li class="flex items-start gap-2.5"><span class="text-amber-500 font-bold">✓</span> Hygienic Home-Style 3-Time Meal Plans</li>
        <li class="flex items-start gap-2.5"><span class="text-amber-500 font-bold">✓</span> 24/7 Professional Housekeeping</li>
        <li class="flex items-start gap-2.5"><span class="text-amber-500 font-bold">✓</span> Biometric Security Turnstile</li>
        <li class="flex items-start gap-2.5"><span class="text-amber-500 font-bold">✓</span> Power Backup for Study & Office Desks</li>
      </ul>
      
      <h3 class="text-xl font-bold text-slate-900 mt-8 mb-4">Location Benefits</h3>
      <p class="text-slate-600 leading-relaxed">Situated in the heart of Mansi Circle, Satellite, this property has easy access to shopping hubs, cafes, transit points, and key business offices in Ahmedabad.</p>
    `,
    price: "₹11,000",
    location: "Mansi Circle, Satellite, Ahmedabad",
    imageUrl: "/assets/mansi-exterior-CwXq_r7X.jpg",
    amenities: ["Boys Accommodation", "Single / Shared", "Full Boarding", "Gym Access"]
  },
  "thaltej-smart-living": {
    title: "PGSPOT Thaltej (Girls)",
    content: `
      <p class="text-lg text-slate-600 leading-relaxed mb-6">Modern & ultra-safe girl's co-living space near Thaltej Metro Station. Features extensive common areas, rooftop terrace, 24/7 on-site warden, and dedicated study zones.</p>
      
      <h3 class="text-xl font-bold text-slate-900 mt-8 mb-4">Key Amenities</h3>
      <ul class="space-y-3">
        <li class="flex items-start gap-2.5"><span class="text-amber-500 font-bold">✓</span> Superfast Fiber WiFi Connectivity</li>
        <li class="flex items-start gap-2.5"><span class="text-amber-500 font-bold">✓</span> Premium Studio Rooms</li>
        <li class="flex items-start gap-2.5"><span class="text-amber-500 font-bold">✓</span> Rooftop Cafe and Terrace Lounge</li>
        <li class="flex items-start gap-2.5"><span class="text-amber-500 font-bold">✓</span> 24/7 Female Warden & CCTV Security</li>
        <li class="flex items-start gap-2.5"><span class="text-amber-500 font-bold">✓</span> Biometric Entry Gates</li>
      </ul>
      
      <h3 class="text-xl font-bold text-slate-900 mt-8 mb-4">Location Benefits</h3>
      <p class="text-slate-600 leading-relaxed">Conveniently located near the Thaltej Metro Station, ensuring a quick and safe commute to key educational institutes and offices in Ahmedabad.</p>
    `,
    price: "₹9,000",
    location: "Near Metro, Thaltej, Ahmedabad",
    imageUrl: "/assets/thaltej-exterior-CUltz2k8.jpg",
    amenities: ["Girls Accommodation", "Studio Rooms", "24/7 Warden", "Biometric Security"]
  },
  "pgspot-thaltej": {
    title: "PGSPOT Thaltej (Girls)",
    content: `
      <p class="text-lg text-slate-600 leading-relaxed mb-6">Modern & ultra-safe girl's co-living space near Thaltej Metro Station. Features extensive common areas, rooftop terrace, 24/7 on-site warden, and dedicated study zones.</p>
    `,
    price: "₹9,000",
    location: "Thaltej, Ahmedabad",
    imageUrl: "/assets/thaltej-exterior-CUltz2k8.jpg",
    amenities: ["Girls Accommodation", "Studio Rooms", "24/7 Warden"]
  }
};

const stripHtml = (html: string) => html ? html.replace(/<[^>]*>/g, "").trim() : "";

export async function generateMetadata({ params }: PropertyProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (property) {
    return {
      title: `${property.title} - PGSPOT Properties`,
      description: stripHtml(property.excerpt) || "Explore premium co-living spaces with PGSPOT.",
    };
  }

  const mock = mockProperties[slug];
  if (mock) {
    return {
      title: `${mock.title} - PGSPOT Properties`,
      description: stripHtml(mock.content).slice(0, 160) || "Explore premium co-living spaces with PGSPOT.",
    };
  }

  return {
    title: "Premium Property - PGSPOT",
  };
}

export async function generateStaticParams() {
  const properties = await getAllProperties();
  const paths: { slug: string }[] = properties.map((prop: { slug: string }) => ({
    slug: prop.slug,
  }));

  // Add hardcoded fallback page paths so they build successfully
  if (!paths.some((p: { slug: string }) => p.slug === "mansi-residency")) {
    paths.push({ slug: "mansi-residency" });
  }
  if (!paths.some((p: { slug: string }) => p.slug === "thaltej-smart-living")) {
    paths.push({ slug: "thaltej-smart-living" });
  }
  
  return paths;
}

export default async function PropertyPage({ params }: PropertyProps) {
  const { slug } = await params;
  
  let property = await getPropertyBySlug(slug);
  let isMock = false;

  if (!property) {
    const mock = mockProperties[slug];
    if (!mock) {
      notFound();
    }
    property = {
      title: mock.title,
      content: mock.content,
      price: mock.price,
      location: mock.location,
      imageUrl: mock.imageUrl,
      amenities: mock.amenities
    };
    isMock = true;
  }

  const title = property.title;
  const content = property.content || "";
  const price = property.price || (slug === "mansi-residency" ? "₹11,000" : "₹9,000");
  const location = property.location || (slug === "mansi-residency" ? "Mansi Circle, Ahmedabad" : "Thaltej, Ahmedabad");
  const imageUrl = isMock 
    ? property.imageUrl 
    : (property.featuredImage?.node?.sourceUrl || "/assets/thaltej-exterior-CUltz2k8.jpg");
  const amenitiesList = property.amenities || (slug === "mansi-residency" 
    ? ["Premium Suite", "Single Occupancy", "Full Boarding", "Gym Access"]
    : ["Premium Studio", "Gym Access", "24/7 Security", "Rooftop Cafe"]);

  const mapUrl = slug === "mansi-residency" 
    ? "https://share.google/khKflKUlmyjLnoTBu" 
    : "https://share.google/pMMexZftjohzZWvHA";

  if (content && content.includes("<section")) {
    let parsedContent = content;
    // Hide Can't Visit in Person section
    parsedContent = parsedContent.replace(/<section\b[^>]*>(?:(?!<\/section>)[\s\S])*?Visit in Person[\s\S]*?<\/section>/gi, "");
    
    // Add (Boys) and (Girls) suffix
    parsedContent = parsedContent.replace(/PGSPOT Mansi(?!\s*\((?:Boys|Girls)\))/g, "PGSPOT Mansi (Boys)");
    parsedContent = parsedContent.replace(/Mansi Residency(?!\s*\((?:Boys|Girls)\))/g, "Mansi Residency (Boys)");
    parsedContent = parsedContent.replace(/PGSPOT Thaltej(?!\s*\((?:Boys|Girls)\))/g, "PGSPOT Thaltej (Girls)");
    parsedContent = parsedContent.replace(/Thaltej Smart Living(?!\s*\((?:Boys|Girls)\))/g, "Thaltej Smart Living (Girls)");

    // Update pricing with (Starting From)
    parsedContent = parsedContent.replace(
      /₹12,500(?:\s*<span[^>]*>\/mo<\/span>)?/g,
      '₹11,000<span class="text-xs font-semibold text-muted-foreground">/mo</span><span class="text-[11px] font-bold text-amber-600 block tracking-tight -mt-0.5">(Starting From)</span>'
    );
    parsedContent = parsedContent.replace(
      /₹14,000(?:\s*<span[^>]*>\/mo<\/span>)?/g,
      '₹9,000<span class="text-xs font-semibold text-muted-foreground">/mo</span><span class="text-[11px] font-bold text-amber-600 block tracking-tight -mt-0.5">(Starting From)</span>'
    );

    return (
      <div className="w-full">
        {parse(parsedContent)}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#f0c229] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Dynamic Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Main Column: Property Info & Content */}
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-4.5xl font-black text-slate-900 leading-tight mb-4 font-heading">
              {title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-8">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>{location}</span>
              </div>
              <span>•</span>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e0b21a] font-semibold hover:underline inline-flex items-center gap-1"
              >
                <span>View on Google Maps</span>
                <span>↗</span>
              </a>
            </div>

            {/* Featured Image */}
            <div className="w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-sm border border-slate-100 mb-10 bg-slate-100">
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Custom Amenities Badges */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 mb-10 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Highlights
              </h2>
              <div className="flex flex-wrap gap-3">
                {amenitiesList.map((amenity: string, idx: number) => (
                  <span 
                    key={idx} 
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 text-slate-800 text-xs font-bold border border-amber-100"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#f0c229] stroke-[2.5]" />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Content Body */}
            <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              {parse(content)}
            </div>
          </div>

          {/* Right Column: Sticky Booking / Enquiry Widget */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white border border-slate-100 shadow-xl rounded-3xl p-8 flex flex-col gap-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Starting From</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-slate-950 font-heading">{price}</span>
                  <span className="text-sm text-slate-500">/ month</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span>Fully-managed properties</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Dumbbell className="w-5 h-5 text-amber-500" />
                  <span>Gym and fitness area access</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Coffee className="w-5 h-5 text-amber-500" />
                  <span>Daily hot breakfast & dinner</span>
                </div>
              </div>

              <Link
                href="/contact-us/"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f0c229] hover:bg-[#e0b21a] py-4 text-sm font-bold text-slate-950 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Compass className="w-4 h-4 stroke-[2.5]" />
                Enquire for Booking
              </Link>

              <a
                href="tel:+919099291915"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 hover:bg-slate-50 py-4 text-sm font-bold text-slate-700 transition-all duration-200"
              >
                <Phone className="w-4 h-4" />
                Call Manager
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
