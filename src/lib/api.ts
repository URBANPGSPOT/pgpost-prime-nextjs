const API_URL = process.env.WORDPRESS_API_URL || "https://wp.pgspot.co.in/graphql";
const BASE_URL = (process.env.WORDPRESS_BASE_URL || "https://wp.pgspot.co.in").replace(/\/+$/, "");
const FRONTEND_URL = (process.env.NEXT_PUBLIC_FRONTEND_URL || "https://pgspot.co.in").replace(/\/+$/, "");
const WP_MEDIA_URL = process.env.WORDPRESS_MEDIA_URL || "https://wp.pgspot.co.in";

/**
 * Recursively replaces WordPress backend URLs with Next.js frontend URLs,
 * and ensures all media/upload URLs point directly to the WordPress media server (https://wp.pgspot.co.in).
 */
export function replaceUrlsRecursive<T>(data: T): T {
  if (!data) return data;
  if (typeof data === "string") {
    // 1. Convert any leftover localhost:8081, localhost:8000, or 127.0.0.1 URLs to live WordPress media URL
    let str = data.replace(
      /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/wp-content\//g,
      `${WP_MEDIA_URL}/wp-content/`
    );

    // 2. Convert relative /wp-content/ to absolute WordPress URL
    str = str.replace(
      /(["'\s(])\/wp-content\//g,
      `$1${WP_MEDIA_URL}/wp-content/`
    );

    // 3. Replace WordPress backend URLs with frontend domain, but never touch wp-content, wp-includes, or wp-json
    const escapedBase = BASE_URL.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`${escapedBase}(?!/wp-content/)`, "g");
    str = str.replace(regex, FRONTEND_URL);

    // Redirect all uploaded images to the actual WordPress media domain
    str = str.replace(/https?:\/\/(www\.)?pgspot\.co\.in\/wp-content\/uploads\//g, `${WP_MEDIA_URL}/wp-content/uploads/`);
    str = str.replace(/http:\/\/localhost:8081\/wp-content\/uploads\//g, `${WP_MEDIA_URL}/wp-content/uploads/`);
    str = str.replace(/http:\/\/wp\.pgspot\.co\.in\/wp-content\/uploads\//g, `${WP_MEDIA_URL}/wp-content/uploads/`);
    str = str.replace(/(src|srcset)=["']\/wp-content\/uploads\//g, `$1="${WP_MEDIA_URL}/wp-content/uploads/`);

    // Contact & Social sanitization
    str = str.replace(/9876543210/g, "9099291915");
    str = str.replace(/98765 43210/g, "90992 91915");
    str = str.replace(/hello@pgspot\.in/g, "urbanpgspot@gmail.com");
    str = str.replace(/@pgspot\.in/g, "@pg.spot");
    str = str.replace(/https?:\/\/(?:www\.)?instagram\.com\/?(?=["'\s]|$)/g, "https://www.instagram.com/pg.spot");
    str = str.replace(/https?:\/\/maps\.google\.com\/\?q=PGSPOT\+Ahmedabad/g, "https://g.page/r/CZznPYYSYB9oEBM/review");

    // Hide "Can't Visit in Person?" virtual tour section (Dubey Task 7)
    str = str.replace(/<section\b[^>]*>(?:(?!<\/section>)[\s\S])*?Visit in Person[\s\S]*?<\/section>/gi, "");

    // Add (Boys) and (Girls) labels (Dubey Task 6)
    str = str.replace(/PGSPOT Mansi(?!\s*\((?:Boys|Girls)\))/g, "PGSPOT Mansi (Boys)");
    str = str.replace(/Mansi Residency(?!\s*\((?:Boys|Girls)\))/g, "Mansi Residency (Boys)");
    str = str.replace(/PGSPOT Thaltej(?!\s*\((?:Boys|Girls)\))/g, "PGSPOT Thaltej (Girls)");
    str = str.replace(/Thaltej Smart Living(?!\s*\((?:Boys|Girls)\))/g, "Thaltej Smart Living (Girls)");

    // Update Pricing with (Starting From) (Dubey Task 5)
    str = str.replace(
      /(?:₹|&#8377;|INR\s*)12,500(?:\s*<span[^>]*>\/(?:mo|month)<\/span>)?/g,
      '₹11,000<span class="text-xs font-semibold text-muted-foreground">/mo</span><span class="text-[11px] font-bold text-amber-600 block tracking-tight -mt-0.5">(Starting From)</span>'
    );
    str = str.replace(
      /(?:₹|&#8377;|INR\s*)14,000(?:\s*<span[^>]*>\/(?:mo|month)<\/span>)?/g,
      '₹9,000<span class="text-xs font-semibold text-muted-foreground">/mo</span><span class="text-[11px] font-bold text-amber-600 block tracking-tight -mt-0.5">(Starting From)</span>'
    );

    // Make property links canonical
    str = str.replace(/href=["']\/mansi\/?["']/g, 'href="/properties/mansi-residency/"');
    str = str.replace(/href=["']\/thaltej\/?["']/g, 'href="/properties/thaltej-smart-living/"');

    // Remove aspect-[4/3] lg:aspect-[4/5] object-cover from banner images
    str = str.replace(/aspect-\[4\/3\]\s*lg:aspect-\[4\/5\]\s*object-cover/g, "h-auto rounded-3xl");
    str = str.replace(/aspect-\[4\/3\]\s*lg:aspect-\[4\/5\]/g, "h-auto");

    return str as unknown as T;
  }
  if (Array.isArray(data)) {
    return data.map((item) => replaceUrlsRecursive(item)) as unknown as T;
  }
  if (typeof data === "object") {
    const result: Record<string, any> = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = replaceUrlsRecursive(data[key]);
      }
    }
    return result as T;
  }
  return data;
}

/**
 * Standard fetch wrapper for the WPGraphQL endpoint.
 */
export async function fetchAPI(query: string, variables: Record<string, any> = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const isDev = process.env.NODE_ENV === "development";

  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    ...(isDev
      ? { cache: "no-store" as RequestCache }
      : {
          next: {
            revalidate: 60,
            tags: ["wpchange"],
          },
        }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error("WPGraphQL Errors:", json.errors);
    throw new Error(`Failed to fetch API: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

export async function getgeneralSettings() {
  const data = await fetchAPI(`
    query GetGeneralSettings {
      generalSettings {
        title
        description
        url
      }
    }
  `);
  return replaceUrlsRecursive(data?.generalSettings);
}

export async function getMenu() {
  try {
    const data = await fetchAPI(`
      query GetPrimaryMenu {
        menus(where: {location: PRIMARY}) {
          nodes {
            menuItems {
              nodes {
                id
                label
                url
                path
                parentId
              }
            }
          }
        }
      }
    `);
    return replaceUrlsRecursive(data?.menus?.nodes[0]?.menuItems?.nodes || []);
  } catch (error) {
    console.error("Error fetching primary menu:", error);
    return [];
  }
}

export async function getFooterMenu() {
  try {
    const data = await fetchAPI(`
      query GetFooterMenu {
        menus(where: {location: FOOTERMENU}) {
          nodes {
            menuItems {
              nodes {
                id
                label
                url
                path
                parentId
              }
            }
          }
        }
      }
    `);
    return replaceUrlsRecursive(data?.menus?.nodes[0]?.menuItems?.nodes || []);
  } catch (error) {
    console.error("Error fetching footer menu:", error);
    return [];
  }
}

export async function getAllPages() {
  try {
    const data = await fetchAPI(`
      query GetAllPages {
        pages(first: 100, where: {status: PUBLISH}) {
          nodes {
            id
            slug
            uri
            title
          }
        }
      }
    `);
    return replaceUrlsRecursive(data?.pages?.nodes || []);
  } catch (error) {
    console.error("Error fetching all pages:", error);
    return [];
  }
}

export async function getAllPosts() {
  try {
    const data = await fetchAPI(`
      query GetAllPosts {
        posts(first: 100, where: {status: PUBLISH}) {
          nodes {
            id
            title
            excerpt
            slug
            date
            content
            categories {
              nodes {
                name
                slug
              }
            }
            featuredImage {
              node {
                sourceUrl
              }
            }
          }
        }
      }
    `);
    return replaceUrlsRecursive(data?.posts?.nodes || []);
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  const query = `
    query {
      post(id: "${slug}", idType: SLUG) {
        id
        title
        content
        date
        slug
        categories {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  `;
  try {
    const data = await fetchAPI(query);
    return replaceUrlsRecursive(data?.post || null);
  } catch (error) {
    console.error(`Error fetching post by slug (${slug}):`, error);
    return null;
  }
}

export async function getPageBySlug(slug: string, preview = false, previewId?: string) {
  const uri = slug === "home" ? "/" : `/${slug}/`;
  const query = `
    query {
      page(id: "${uri}", idType: URI) {
        id
        title
        content
        slug
        uri
        status
      }
    }
  `;
  try {
    const data = await fetchAPI(query);
    return replaceUrlsRecursive(data?.page || null);
  } catch (error) {
    console.error(`Error fetching page by slug (${slug}):`, error);
    return null;
  }
}

export async function getPAGESEO(slug: string) {
  const uri = slug === "home" ? "/" : `/${slug}/`;
  try {
    const data = await fetchAPI(`
      query {
        page(id: "${uri}", idType: URI) {
          seo {
            title
            description
            canonicalUrl
            openGraph {
              title
              description
              image {
                url
              }
            }
          }
        }
      }
    `);
    
    const seo = data?.page?.seo;
    if (!seo) return null;
    
    return replaceUrlsRecursive({
      title: seo.title || "",
      metaDesc: seo.description || "",
      canonical: seo.canonicalUrl || "",
      opengraphTitle: seo.openGraph?.title || "",
      opengraphDescription: seo.openGraph?.description || "",
      opengraphImage: seo.openGraph?.image ? { sourceUrl: seo.openGraph.image.url } : null
    });
  } catch (error) {
    console.error(`Error fetching SEO for slug (${slug}):`, error);
    return null;
  }
}

export async function getPropertyBySlug(slug: string) {
  const uri = `/properties/${slug}/`;
  const query = `
    query {
      property(id: "${uri}", idType: URI) {
        id
        title
        content
        slug
        uri
        excerpt
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  `;
  try {
    const data = await fetchAPI(query);
    return replaceUrlsRecursive(data?.property || null);
  } catch (error) {
    console.error(`Error fetching property by slug (${slug}):`, error);
    return null;
  }
}

export async function getAllProperties() {
  try {
    const data = await fetchAPI(`
      query GetAllProperties {
        properties(first: 100, where: {status: PUBLISH}) {
          nodes {
            id
            slug
            uri
            title
          }
        }
      }
    `);
    return replaceUrlsRecursive(data?.properties?.nodes || []);
  } catch (error) {
    console.error("Error fetching all properties:", error);
    return [];
  }
}

