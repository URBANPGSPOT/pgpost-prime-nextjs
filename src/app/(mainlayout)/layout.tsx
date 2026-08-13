import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import FormSubmitHandler from "../FormSubmitHandler";
import Header from "@/components/Header";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-800">
      <FormSubmitHandler />
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow bg-white">{children}</main>

      {/* Footer */}
      <footer className="bg-[#141414] text-[#a1a1aa] pt-16 pb-8 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[minmax(0,320px)_max-content_1fr_1fr] gap-10 lg:gap-10 mb-12">
          {/* Column 1 - Brand & Intro */}
          <div className="flex flex-col gap-6 max-w-[320px] w-full" style={{ maxWidth: "320px" }}>
            <Link href="/" className="flex items-center gap-1 select-none">
              <span className="text-white text-3xl font-black font-heading tracking-tight">PG</span>
              <span className="text-[#f0c229] text-3xl font-black font-heading tracking-tight">SPOT</span>
            </Link>
            <p className="text-sm leading-relaxed text-[#a1a1aa]">
              Premium co-living spaces designed for modern students and working professionals in Ahmedabad.
              Comfort, community, and convenience in one spot.
            </p>

            <div className="flex flex-col gap-3 text-sm">
              <a href="tel:+919099291915" className="flex items-center gap-2.5 text-[#f0c229] hover:underline">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+91 90992 91915</span>
              </a>
              <a href="mailto:urbanpgspot@gmail.com" className="flex items-center gap-2.5 text-[#f0c229] hover:underline">
                <Mail className="w-4 h-4 shrink-0" />
                <span>urbanpgspot@gmail.com</span>
              </a>
              <div className="flex items-start gap-2.5 text-[#f0c229]">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Ahmedabad, Gujarat, India</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#f0c229] hover:border-[#f0c229] transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#f0c229] hover:border-[#f0c229] transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#f0c229] hover:border-[#f0c229] transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#f0c229] hover:border-[#f0c229] transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="flex flex-col gap-6 max-w-fit w-fit" style={{ maxWidth: "fit-content" }}>
            <h4 className="text-[#f0c229] text-xs font-black tracking-widest uppercase font-heading">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-[#f0c229] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties/mansi-residency/" className="hover:text-[#f0c229] transition-colors">
                  Mansi Residency
                </Link>
              </li>
              <li>
                <Link href="/properties/thaltej-smart-living/" className="hover:text-[#f0c229] transition-colors">
                  Thaltej Smart Living
                </Link>
              </li>
              <li>
                <Link href="/#gallery" className="hover:text-[#f0c229] transition-colors">
                  Photos
                </Link>
              </li>
              <li>
                <Link href="/blogs/" className="hover:text-[#f0c229] transition-colors">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/about-us/" className="hover:text-[#f0c229] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact-us/" className="hover:text-[#f0c229] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Map 1: Mansi Residency */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[#f0c229] text-xs font-black tracking-widest uppercase font-heading">
                PGSPOT Mansi
              </h4>
              <a
                href="https://share.google/khKflKUlmyjLnoTBu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#f0c229] hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <span>Map</span>
                <span>↗</span>
              </a>
            </div>
            <p className="text-xs text-zinc-400">Mansi Circle, Satellite, Ahmedabad</p>
            <div className="w-full h-36 rounded-xl overflow-hidden border border-zinc-800 shadow-md">
              <iframe
                title="PGSPOT Mansi Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14686.84501659223!2d72.5204!3d23.0305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f5091c5305%3A0xb308a0d4c9d5d7cb!2sMansi%20Circle%2C%20Ahmedabad!5e0!3m2!1sen!2sin!4v1718134567890!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Column 4 - Map 2: Thaltej Smart Living */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[#f0c229] text-xs font-black tracking-widest uppercase font-heading">
                PGSPOT Thaltej
              </h4>
              <a
                href="https://share.google/pMMexZftjohzZWvHA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#f0c229] hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <span>Map</span>
                <span>↗</span>
              </a>
            </div>
            <p className="text-xs text-zinc-400">Thaltej, Near Metro Station, Ahmedabad</p>
            <div className="w-full h-36 rounded-xl overflow-hidden border border-zinc-800 shadow-md">
              <iframe
                title="PGSPOT Thaltej Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14684.092044810777!2d72.5050!3d23.0535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9b4695b7194f%3A0xe961f609e25e17ba!2sThaltej%2C%20Ahmedabad!5e0!3m2!1sen!2sin!4v1718134567891!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-800/60 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} PGSPOT Premium Co-Living. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms-conditions/" className="hover:text-zinc-400 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy-policy/" className="hover:text-zinc-400 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
