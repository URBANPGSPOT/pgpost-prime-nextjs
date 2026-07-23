import { getPostBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import parse from "html-react-parser";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import type { Metadata } from "next";

interface PostProps {
  params: Promise<{ slug: string }> | { slug: string };
}

// Fallback mock posts data for local development/preview before creating them in WordPress
const mockPosts: Record<string, any> = {
  "things-to-check-before-booking-pg-ahmedabad": {
    title: "10 Things to Check Before Booking a PG in Ahmedabad",
    content: `
      <p>Moving to a new city like Ahmedabad is an exciting journey, but finding the right PG accommodation can make or break your initial experience. To help you make a smart choice, here is a complete checklist of things you must verify before paying a booking deposit:</p>
      
      <h3>1. Location and Commute Times</h3>
      <p>Ensure the PG is close to your college or workplace. Traffic during peak hours in Satellite, SG Highway, or Navrangpura can be heavy. A PG close to a metro station or Bus Rapid Transit (BRTS) corridor is always preferred.</p>

      <h3>2. Quality of Meals</h3>
      <p>Ask if food is cooked on-site or catered from a central kitchen. Try to visit during lunch or dinner time to sample the food. At PGSPOT, we prepare hygienic, home-style meals in our own kitchens to guarantee freshness.</p>

      <h3>3. WiFi Speed & Connectivity</h3>
      <p>Test the cellular network signals inside the actual room you are booking. If you are a student attending online classes or a professional working from home, high-speed, stable broadband WiFi is non-negotiable.</p>

      <h3>4. Security & Biometrics</h3>
      <p>Your safety is paramount. Check if the building has biometric entry gates, CCTV surveillance in public corridors, and 24/7 on-site warden or security personnel.</p>

      <h3>5. Electricity & Power Backup</h3>
      <p>Ahmedabad summers can be intense, reaching up to 45°C. Check if the PG has power backups for fans and study lights, and verify how the electricity bill is calculated (individual meters or sub-divided).</p>
    `,
    date: "2026-06-11T12:00:00.000Z",
    category: "Student Life",
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80"
  },
  "create-perfect-study-corner-pg-room": {
    title: "How to Create the Perfect Study Corner in Your PG Room",
    content: `
      <p>Having a dedicated space for work and study is key to staying productive in a co-living environment. Even in a shared room, a few quick modifications can help you build a focused study corner:</p>
      
      <h3>1. Choose the Right Desk Lighting</h3>
      <p>Avoid overhead fluorescent glare. Instead, invest in a small LED desk lamp with adjustable brightness and color temperatures (cool white for focus, warm white for evening reading).</p>

      <h3>2. Ergonomic Seat Comfort</h3>
      <p>Since standard PG chairs can be hard on the back, add an orthopedic memory foam seat cushion and a lumbar support pillow to maintain proper posture during long hours.</p>

      <h3>3. Organize Digitally and Physically</h3>
      <p>Minimize desk clutter. Use vertical organizers, cable management sleeves, and laptop stands to keep your workstation tidy and spacious.</p>
    `,
    date: "2026-05-10T12:00:00.000Z",
    category: "Room Setup",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
  },
  "ultimate-guide-living-satellite-ahmedabad": {
    title: "The Ultimate Guide to Living in Satellite, Ahmedabad",
    content: `
      <p>Satellite is one of the most vibrant and sought-after neighborhoods in Ahmedabad. If you are moving to this side of town, here is what you need to know to make the most of it:</p>
      
      <h3>1. Food & Cafes</h3>
      <p>From local street food near Mansi Circle to premium cafes along the SG Highway, you are never short of food options. Try the famous Gujarati snacks, maska bun, and late-night tea spots.</p>

      <h3>2. Commuting & Connectivity</h3>
      <p>The neighborhood is exceptionally well-connected. With local AMTS buses, metro corridors, and auto-rickshaws readily available, you can travel anywhere in Ahmedabad quickly.</p>

      <h3>3. Recreation & Fitness</h3>
      <p>There are multiple premium gyms, jogging parks, and shopping malls (like Alpha One Mall) within a 2-kilometer radius, ensuring you have plenty of weekend relaxation options.</p>
    `,
    date: "2026-05-05T12:00:00.000Z",
    category: "Ahmedabad Guide",
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80"
  },
  "meal-prep-busy-professionals-pg-edition": {
    title: "Meal Prep for Busy Professionals: PG Edition",
    content: `
      <p>When staying in a PG, maintaining a balanced diet can sometimes be a challenge. If you don't have access to a full kitchen, here are some simple ways to keep your nutrition on track:</p>
      
      <h3>1. Smart Snacking</h3>
      <p>Keep a supply of healthy raw snacks like almonds, walnuts, roasted chickpeas (chana), and fresh seasonal fruits (bananas, apples) to avoid ordering junk food during study breaks.</p>

      <h3>2. Supplement with Fresh Greens</h3>
      <p>If your PG meals are high in carbohydrates, supplement them by ordering fresh cucumber, tomato, or beetroot salads from local outlets, or buy fresh yogurt (curd) daily.</p>

      <h3>3. Hydration Balance</h3>
      <p>Drinking enough water is simple but vital. Keep a dedicated water bottle at your desk, and opt for healthy liquids like coconut water or buttermilk (chaas) over carbonated sodas.</p>
    `,
    date: "2026-04-28T12:00:00.000Z",
    category: "Food & Health",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"
  }
};

const stripHtml = (html: string) => html ? html.replace(/<[^>]*>/g, "").trim() : "";

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (post) {
    return {
      title: `${post.title} - PGSPOT Blog`,
      description: stripHtml(post.excerpt) || "Read this article on the PGSPOT blog.",
    };
  }

  const mock = mockPosts[slug];
  if (mock) {
    return {
      title: `${mock.title} - PGSPOT Blog`,
      description: stripHtml(mock.excerpt) || "Read this article on the PGSPOT blog.",
    };
  }

  return {
    title: "Blog Post - PGSPOT",
  };
}

export default async function BlogPostPage({ params }: PostProps) {
  const { slug } = await params;
  
  // Try to fetch the post from WordPress
  let post = await getPostBySlug(slug);
  let isMock = false;

  // Fallback to local mock data if post does not exist in WordPress database
  if (!post) {
    const mock = mockPosts[slug];
    if (!mock) {
      notFound();
    }
    post = {
      title: mock.title,
      content: mock.content,
      date: mock.date,
      category: mock.category,
      imageUrl: mock.imageUrl
    };
    isMock = true;
  }

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

  const getReadTime = (contentStr: string) => {
    const words = contentStr.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const minutes = Math.max(3, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const categoryName = isMock 
    ? post.category 
    : post.categories?.nodes[0]?.name || "Student Life";

  const imageUrl = isMock 
    ? post.imageUrl 
    : post.featuredImage?.node?.sourceUrl || null;

  return (
    <article className="min-h-screen bg-slate-50/30 py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Link */}
        <Link 
          href="/blogs/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#f0c229] mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#f0c229] bg-amber-50 px-2.5 py-1 rounded-md">
              {categoryName}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-slate-500 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{getReadTime(post.content || "")}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {imageUrl && (
          <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden shadow-sm border border-slate-100 mb-12">
            <img 
              src={imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content Body */}
        <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed space-y-6">
          {parse(post.content || "")}
        </div>
      </div>
    </article>
  );
}
