import { getAllPosts } from "@/lib/api";
import BlogListingClient from "./BlogListingClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - PGSPOT Co-Living Journal",
  description: "Tips, guides, and stories for students and professionals making the most of their PG life in Ahmedabad.",
};

// Next.js ISR configuration: Revalidate this page on-demand or every 60 seconds
export const revalidate = 60;

export default async function BlogsPage() {
  // Fetch real blog posts from WordPress
  const posts = await getAllPosts();

  // Standard mock posts to show as fallback if there are no posts in the WordPress backend yet
  const mockPosts = [
    {
      id: "mock-1",
      title: "10 Things to Check Before Booking a PG in Ahmedabad",
      slug: "things-to-check-before-booking-pg-ahmedabad",
      excerpt: "From security deposits to meal quality, here's your complete checklist to ensure a comfortable stay in your next co-living space.",
      content: "Detailed guide about checking amenities, security deposits, wifi speed, and food hygiene before signing a lease.",
      date: "2026-06-11T12:00:00.000Z",
      categories: {
        nodes: [{ name: "Student Life", slug: "student-life" }]
      },
      featuredImage: {
        node: {
          sourceUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80"
        }
      },
      isFeatured: true
    },
    {
      id: "mock-2",
      title: "How to Create the Perfect Study Corner in Your PG Room",
      slug: "create-perfect-study-corner-pg-room",
      excerpt: "Transform a small desk into a productivity powerhouse with these budget-friendly setup ideas, lighting tips, and organization hacks.",
      content: "Tips on desk organizers, ergonomic seat cushions, desk lamps, and creating a clutter-free study zone.",
      date: "2026-05-10T12:00:00.000Z",
      categories: {
        nodes: [{ name: "Room Setup", slug: "room-setup" }]
      },
      featuredImage: {
        node: {
          sourceUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
        }
      }
    },
    {
      id: "mock-3",
      title: "The Ultimate Guide to Living in Satellite, Ahmedabad",
      slug: "ultimate-guide-living-satellite-ahmedabad",
      excerpt: "Best cafes, gyms, coworking spaces, and hangout spots around Mansi Circle and the Satellite area for young professionals.",
      content: "A comprehensive local neighborhood guide featuring food options, metro connectivity, public parks, and retail hotspots.",
      date: "2026-05-05T12:00:00.000Z",
      categories: {
        nodes: [{ name: "Ahmedabad Guide", slug: "ahmedabad-guide" }]
      },
      featuredImage: {
        node: {
          sourceUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80"
        }
      }
    },
    {
      id: "mock-4",
      title: "Meal Prep for Busy Professionals: PG Edition",
      slug: "meal-prep-busy-professionals-pg-edition",
      excerpt: "Healthy eating hacks when you're relying on PG food and don't have a kitchen of your own. Simple snacks and nutrition balances.",
      content: "Hacks like healthy dynamic snacking, fruit selections, using electric kettles, and ordering smart food custom options.",
      date: "2026-04-28T12:00:00.000Z",
      categories: {
        nodes: [{ name: "Food & Health", slug: "food-health" }]
      },
      featuredImage: {
        node: {
          sourceUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
        }
      }
    }
  ];

  // If WordPress returns publish posts, we merge or replace the list with database data.
  // Otherwise, we present the mock data so the screen looks exactly like the layout mockup.
  const displayPosts = posts && posts.length > 0 ? posts : mockPosts;

  return (
    <main className="min-h-screen bg-slate-50/50 py-16 lg:py-24">
      <BlogListingClient initialPosts={displayPosts} />
    </main>
  );
}
