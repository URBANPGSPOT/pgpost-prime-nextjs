"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";

interface PostCategory {
  name: string;
  slug: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  date: string;
  categories: {
    nodes: PostCategory[];
  };
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
  isFeatured?: boolean;
}

interface BlogListingClientProps {
  initialPosts: BlogPost[];
}

export default function BlogListingClient({ initialPosts }: BlogListingClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Helper to strip HTML tags from excerpt/description
  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").trim();
  };

  // Format date cleanly
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Dynamically calculate read time based on word count
  const calculateReadTime = (post: BlogPost) => {
    const text = post.content || post.excerpt || "";
    const words = text.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const minutes = Math.max(3, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  // Pre-defined categories matching the design mockup screenshots
  const categoriesList = [
    "All",
    "Student Life",
    "Working Professionals",
    "Room Setup",
    "Food & Health",
    "Ahmedabad Guide"
  ];

  // Filter posts based on search query and category pill selection
  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const cleanExcerpt = stripHtml(post.excerpt);
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cleanExcerpt.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        post.categories?.nodes?.some(
          (cat) => cat.name.toLowerCase() === selectedCategory.toLowerCase()
        );

      return matchesSearch && matchesCategory;
    });
  }, [initialPosts, searchQuery, selectedCategory]);

  // Identify featured article (either marked, or the first one in the list when showing "All" categories)
  const featuredPost = useMemo(() => {
    if (searchQuery || selectedCategory !== "All") return null;
    return filteredPosts.find((p) => p.isFeatured) || filteredPosts[0] || null;
  }, [filteredPosts, searchQuery, selectedCategory]);

  // Remaining articles inside the grid layout
  const gridPosts = useMemo(() => {
    if (!featuredPost) return filteredPosts;
    return filteredPosts.filter((post) => post.id !== featuredPost.id);
  }, [filteredPosts, featuredPost]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Info */}
      <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
        <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent mb-6">
          Journal
        </span>
        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-none mb-6">
          PGSPOT <span className="text-[#f0c229]">Blog</span>
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          Tips, guides, and stories for students and professionals making the most of their PG life.
        </p>
      </div>

      {/* Search Bar & Filters Section */}
      <div className="max-w-xl mx-auto mb-8 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f0c229] focus:border-[#f0c229] text-base transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* Category Filters Grid */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-16 max-w-4xl mx-auto">
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer ${
              selectedCategory === cat
                ? "bg-slate-900 border-slate-900 text-white shadow"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Post (Big Horizontal Block) */}
      {featuredPost && (
        <div className="mb-12 animate-fade-in-up">
          <Link
            href={`/blog/${featuredPost.slug}/`}
            className="group block rounded-3xl bg-white border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Left Column: Image */}
              <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto relative bg-slate-100 min-h-[300px]">
                {featuredPost.featuredImage?.node?.sourceUrl ? (
                  <img
                    src={featuredPost.featuredImage.node.sourceUrl}
                    alt={featuredPost.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 font-semibold">
                    Featured Article Image
                  </div>
                )}
              </div>

              {/* Right Column: Metadata */}
              <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#f0c229] bg-amber-50 px-2.5 py-1 rounded-md">
                    {featuredPost.categories?.nodes[0]?.name || "Student Life"}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Featured
                  </span>
                </div>

                <h2 className="text-2xl lg:text-3.5xl font-extrabold text-slate-950 mb-4 leading-tight group-hover:text-[#f0c229] transition-colors line-clamp-3">
                  {featuredPost.title}
                </h2>

                <p className="text-slate-500 text-base leading-relaxed mb-6 line-clamp-3">
                  {stripHtml(featuredPost.excerpt)}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100 text-xs text-slate-400 mt-auto">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 stroke-[2]" />
                    <span>{formatDate(featuredPost.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 stroke-[2]" />
                    <span>{calculateReadTime(featuredPost)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Grid of Remaining Posts */}
      {gridPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {gridPosts.map((post, index) => (
            <article
              key={post.id}
              className="group flex flex-col h-full bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-100 animate-fade-in-up"
              style={{ animationDelay: `${(index + 1) * 75}ms` }}
            >
              <Link href={`/blog/${post.slug}/`} className="flex flex-col h-full">
                {/* Blog Image */}
                <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 relative">
                  {post.featuredImage?.node?.sourceUrl ? (
                    <img
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-155 flex items-center justify-center text-slate-400 font-semibold text-sm">
                      Blog Image
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#f0c229] bg-amber-50 px-2 py-0.5 rounded-md">
                      {post.categories?.nodes[0]?.name || "Uncategorized"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#f0c229] transition-colors leading-snug mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-6">
                    {stripHtml(post.excerpt)}
                  </p>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{calculateReadTime(post)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl p-8 max-w-2xl mx-auto mb-16">
          <p className="text-slate-400 italic text-base">No articles found matching your query.</p>
        </div>
      )}
    </div>
  );
}
