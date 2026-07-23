import Link from "next/link";
import {
  Phone,
  FileText,
  Mail,
  MapPin,
  ChevronDown,
} from "lucide-react";
import FormSubmitHandler from "../FormSubmitHandler";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-800">
      <FormSubmitHandler />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 select-none">
            <div className="bg-[#f0c229] w-12 h-12 rounded-xl flex flex-col items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-slate-950">
                <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
              </svg>
              <span className="text-[8px] font-extrabold text-slate-950 -mt-0.5 tracking-tighter">pgspot</span>
            </div>
            <div className="flex items-center gap-0.5 text-2xl font-black font-heading tracking-tight">
              <span className="text-[#1a1a1a]">PG</span>
              <span className="text-[#f0c229]">Spot</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            <Link
              href="/"
              className="text-sm font-semibold text-[#f0c229] hover:text-[#e0b21a] transition-colors"
            >
              Home
            </Link>

            {/* Properties Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-[#f0c229] transition-colors py-2 focus:outline-none">
                Properties <ChevronDown className="w-4 h-4 stroke-[2.5]" />
              </button>
              <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-slate-100 shadow-xl rounded-xl py-2 min-w-[200px] z-50">
                <Link
                  href="/properties/mansi-residency/"
                  className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#f0c229] transition-colors"
                >
                  Mansi Residency
                </Link>
                <Link
                  href="/properties/thaltej-smart-living/"
                  className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#f0c229] transition-colors"
                >
                  Thaltej Smart Living
                </Link>
              </div>
            </div>

            <Link
              href="/#gallery"
              className="text-sm font-semibold text-slate-700 hover:text-[#f0c229] transition-colors"
            >
              Photos
            </Link>

            <Link
              href="/blogs/"
              className="text-sm font-semibold text-slate-700 hover:text-[#f0c229] transition-colors"
            >
              Blogs
            </Link>
            <Link
              href="/about-us/"
              className="text-sm font-semibold text-slate-700 hover:text-[#f0c229] transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/contact-us/"
              className="text-sm font-semibold text-slate-700 hover:text-[#f0c229] transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+919876543210"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-bold px-6 py-3 border border-slate-950 text-slate-950 rounded-full hover:bg-slate-50 transition-all font-heading"
            >
              <Phone className="w-4 h-4 fill-slate-950 stroke-[2.5]" />
              Call Now
            </a>
            <Link
              href="/contact-us/"
              className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 bg-[#f5c324] text-slate-950 rounded-full hover:bg-[#e0b21a] shadow-sm hover:shadow transition-all font-heading"
            >
              <FileText className="w-4 h-4 stroke-[2.5]" />
              Enquire Now
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-white">{children}</main>

      {/* Footer */}
      <footer className="bg-[#141414] text-[#a1a1aa] pt-16 pb-8 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1 - Brand & Intro */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-1 select-none">
              <span className="text-white text-3xl font-black font-heading tracking-tight">PG</span>
              <span className="text-[#f0c229] text-3xl font-black font-heading tracking-tight">SPOT</span>
            </Link>
            <p className="text-sm leading-relaxed text-[#a1a1aa]">
              Premium co-living spaces designed for modern students and working professionals in Ahmedabad.
              Comfort, community, and convenience in one spot.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#f0c229] hover:border-[#f0c229] transition-all"
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
                className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#f0c229] hover:border-[#f0c229] transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#f0c229] hover:border-[#f0c229] transition-all"
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
                className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#f0c229] hover:border-[#f0c229] transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[#f0c229] text-xs font-black tracking-widest uppercase font-heading">
              Quick Links
            </h4>
            <ul className="space-y-3.5 text-sm">
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
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions/" className="hover:text-[#f0c229] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Our Properties & Contact */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[#f0c229] text-xs font-black tracking-widest uppercase font-heading">
              Our Properties
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link href="/properties/mansi-residency/" className="hover:text-[#f0c229] transition-colors">
                  PGSPOT Mansi
                </Link>
              </li>
              <li>
                <Link href="/properties/thaltej-smart-living/" className="hover:text-[#f0c229] transition-colors">
                  PGSPOT Thaltej
                </Link>
              </li>
            </ul>

            <div className="flex flex-col gap-3.5 mt-2 text-sm">
              <a href="tel:+919876543210" className="flex items-center gap-2.5 text-[#f0c229] hover:underline">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+91 98765 43210</span>
              </a>
              <a href="mailto:hello@pgspot.in" className="flex items-center gap-2.5 text-[#f0c229] hover:underline">
                <Mail className="w-4 h-4 shrink-0" />
                <span>hello@pgspot.in</span>
              </a>
              <div className="flex items-start gap-2.5 text-[#f0c229]">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Ahmedabad, Gujarat, India</span>
              </div>
            </div>
          </div>

          {/* Column 4 - Find Us / Map */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[#f0c229] text-xs font-black tracking-widest uppercase font-heading">
              Find Us
            </h4>
            <div className="w-full h-44 rounded-xl overflow-hidden border border-zinc-800 shadow-lg">
              <iframe
                title="PGSPOT Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117506.01217506941!2d72.5086111!3d23.0222222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fccd11707d5c9d4!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1718134567890!5m2!1sen!2sin"
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
