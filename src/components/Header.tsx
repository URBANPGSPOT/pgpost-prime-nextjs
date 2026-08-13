"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Phone,
  FileText,
  ChevronDown,
  Menu,
  X,
  Building2,
  Home,
  Image as ImageIcon,
  BookOpen,
  Info,
  Mail,
  MapPin,
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setPropertiesOpen(false);
  }

  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-3 select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f0c229] rounded-xl"
            aria-label="PGSPOT Home"
          >
            <div className="bg-[#f0c229] w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex flex-col items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950">
                <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
              </svg>
              <span className="text-[7px] sm:text-[8px] font-extrabold text-slate-950 -mt-0.5 tracking-tighter">
                pgspot
              </span>
            </div>
            <div className="flex items-center gap-0.5 text-2xl font-black font-heading tracking-tight">
              <span className="text-[#1a1a1a]">PG</span>
              <span className="text-[#f0c229]">Spot</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7" aria-label="Main Navigation">
            <Link
              href="/"
              className={`text-sm font-semibold transition-colors py-1 relative ${
                pathname === "/"
                  ? "text-[#e0b21a] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#f0c229] after:rounded-full"
                  : "text-slate-700 hover:text-[#f0c229]"
              }`}
            >
              Home
            </Link>

            {/* Properties Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className={`flex items-center gap-1 text-sm font-semibold transition-colors py-2 focus:outline-none ${
                  pathname.startsWith("/properties")
                    ? "text-[#e0b21a] font-bold"
                    : "text-slate-700 hover:text-[#f0c229]"
                }`}
                aria-haspopup="true"
              >
                Properties
                <ChevronDown className="w-4 h-4 stroke-[2.5] group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-slate-100 shadow-xl rounded-xl py-2 min-w-[220px] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <Link
                  href="/properties/mansi-residency/"
                  className={`block px-4 py-2.5 text-sm transition-colors ${
                    pathname === "/properties/mansi-residency" || pathname === "/properties/mansi-residency/"
                      ? "text-[#e0b21a] bg-amber-50/60 font-semibold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-[#f0c229]"
                  }`}
                >
                  Mansi Residency
                </Link>
                <Link
                  href="/properties/thaltej-smart-living/"
                  className={`block px-4 py-2.5 text-sm transition-colors ${
                    pathname === "/properties/thaltej-smart-living" || pathname === "/properties/thaltej-smart-living/"
                      ? "text-[#e0b21a] bg-amber-50/60 font-semibold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-[#f0c229]"
                  }`}
                >
                  Thaltej Smart Living
                </Link>
              </div>
            </div>

            <Link
              href="/#gallery"
              className="text-sm font-semibold text-slate-700 hover:text-[#f0c229] transition-colors py-1"
            >
              Photos
            </Link>

            <Link
              href="/blogs/"
              className={`text-sm font-semibold transition-colors py-1 relative ${
                pathname.startsWith("/blog")
                  ? "text-[#e0b21a] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#f0c229] after:rounded-full"
                  : "text-slate-700 hover:text-[#f0c229]"
              }`}
            >
              Blogs
            </Link>
            <Link
              href="/about-us/"
              className={`text-sm font-semibold transition-colors py-1 relative ${
                pathname.startsWith("/about-us")
                  ? "text-[#e0b21a] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#f0c229] after:rounded-full"
                  : "text-slate-700 hover:text-[#f0c229]"
              }`}
            >
              About Us
            </Link>
            <Link
              href="/contact-us/"
              className={`text-sm font-semibold transition-colors py-1 relative ${
                pathname.startsWith("/contact-us")
                  ? "text-[#e0b21a] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#f0c229] after:rounded-full"
                  : "text-slate-700 hover:text-[#f0c229]"
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Actions & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop & Tablet Call Button */}
            <a
              href="tel:+919099291915"
              className="hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-4 sm:px-6 py-2.5 sm:py-3 border border-slate-950 text-slate-950 rounded-full hover:bg-slate-50 transition-all font-heading"
            >
              <Phone className="w-4 h-4 fill-slate-950 stroke-[2.5]" />
              <span>Call Now</span>
            </a>

            {/* Enquire Now CTA Button */}
            <Link
              href="/contact-us/"
              className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold px-4 sm:px-6 py-2.5 sm:py-3 bg-[#f5c324] text-slate-950 rounded-full hover:bg-[#e0b21a] shadow-sm hover:shadow transition-all font-heading"
            >
              <FileText className="w-4 h-4 stroke-[2.5]" />
              <span>Enquire Now</span>
            </Link>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              className="lg:hidden inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 text-slate-800 hover:text-slate-950 hover:bg-slate-100 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#f0c229]"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 stroke-[2.5]" />
              ) : (
                <Menu className="w-6 h-6 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div
          role="presentation"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Mobile Slide-in Navigation Drawer */}
      <div
        id="mobile-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5"
          >
            <div className="bg-[#f0c229] w-10 h-10 rounded-xl flex flex-col items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-950">
                <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
              </svg>
              <span className="text-[7px] font-extrabold text-slate-950 -mt-0.5 tracking-tighter">
                pgspot
              </span>
            </div>
            <div className="flex items-center gap-0.5 text-xl font-black font-heading tracking-tight">
              <span className="text-[#1a1a1a]">PG</span>
              <span className="text-[#f0c229]">Spot</span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#f0c229]"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Drawer Nav Links */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-1">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
              pathname === "/"
                ? "bg-amber-50 text-[#b38500] font-bold"
                : "text-slate-700 hover:bg-slate-50 hover:text-[#f0c229]"
            }`}
          >
            <Home className="w-5 h-5 shrink-0 stroke-[2.2]" />
            <span>Home</span>
          </Link>

          {/* Properties Dropdown Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setPropertiesOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                pathname.startsWith("/properties")
                  ? "bg-amber-50/60 text-[#b38500] font-bold"
                  : "text-slate-700 hover:bg-slate-50 hover:text-[#f0c229]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 shrink-0 stroke-[2.2]" />
                <span>Properties</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 stroke-[2.5] transition-transform duration-200 ${
                  propertiesOpen ? "rotate-180 text-[#f0c229]" : "text-slate-400"
                }`}
              />
            </button>

            {propertiesOpen && (
              <div className="ml-9 mt-1 pl-3 border-l-2 border-amber-200 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <Link
                  href="/properties/mansi-residency/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    pathname === "/properties/mansi-residency" || pathname === "/properties/mansi-residency/"
                      ? "text-[#b38500] font-bold bg-amber-50"
                      : "text-slate-600 hover:text-[#f0c229] hover:bg-slate-50"
                  }`}
                >
                  Mansi Residency
                </Link>
                <Link
                  href="/properties/thaltej-smart-living/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    pathname === "/properties/thaltej-smart-living" || pathname === "/properties/thaltej-smart-living/"
                      ? "text-[#b38500] font-bold bg-amber-50"
                      : "text-slate-600 hover:text-[#f0c229] hover:bg-slate-50"
                  }`}
                >
                  Thaltej Smart Living
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/#gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#f0c229] transition-all"
          >
            <ImageIcon className="w-5 h-5 shrink-0 stroke-[2.2]" />
            <span>Photos</span>
          </Link>

          <Link
            href="/blogs/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
              pathname.startsWith("/blog")
                ? "bg-amber-50 text-[#b38500] font-bold"
                : "text-slate-700 hover:bg-slate-50 hover:text-[#f0c229]"
            }`}
          >
            <BookOpen className="w-5 h-5 shrink-0 stroke-[2.2]" />
            <span>Blogs</span>
          </Link>

          <Link
            href="/about-us/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
              pathname.startsWith("/about-us")
                ? "bg-amber-50 text-[#b38500] font-bold"
                : "text-slate-700 hover:bg-slate-50 hover:text-[#f0c229]"
            }`}
          >
            <Info className="w-5 h-5 shrink-0 stroke-[2.2]" />
            <span>About Us</span>
          </Link>

          <Link
            href="/contact-us/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
              pathname.startsWith("/contact-us")
                ? "bg-amber-50 text-[#b38500] font-bold"
                : "text-slate-700 hover:bg-slate-50 hover:text-[#f0c229]"
            }`}
          >
            <Mail className="w-5 h-5 shrink-0 stroke-[2.2]" />
            <span>Contact Us</span>
          </Link>
        </div>

        {/* Drawer Bottom Actions & Quick Contact */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <a
            href="tel:+919099291915"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-slate-950 text-slate-950 font-bold rounded-xl text-sm hover:bg-slate-100 transition-colors font-heading shadow-sm"
          >
            <Phone className="w-4 h-4 fill-slate-950 stroke-[2.5]" />
            <span>Call +91 90992 91915</span>
          </a>

          <Link
            href="/contact-us/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#f5c324] text-slate-950 font-bold rounded-xl text-sm hover:bg-[#e0b21a] transition-colors font-heading shadow-sm"
          >
            <FileText className="w-4 h-4 stroke-[2.5]" />
            <span>Enquire Now</span>
          </Link>

          <div className="pt-2 text-center text-xs text-slate-500 space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#f0c229]" />
              <span>Ahmedabad, Gujarat, India</span>
            </div>
            <p className="text-[11px] text-slate-400">Premium Co-Living Spaces</p>
          </div>
        </div>
      </div>
    </>
  );
}
