const API_URL = process.env.WORDPRESS_API_URL || "http://localhost:8081/graphql";
const BASE_URL = process.env.WORDPRESS_BASE_URL || "http://localhost:8081";
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3008";

/**
 * Recursively replaces WordPress backend URLs with Next.js frontend URLs,
 * but preserves media/upload URLs so they are served correctly.
 */
export function replaceUrlsRecursive<T>(data: T): T {
  if (!data) return data;
  if (typeof data === "string") {
    const escapedBase = BASE_URL.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    // Matches the base URL but NOT when followed by /wp-content/
    const regex = new RegExp(`${escapedBase}(?!/wp-content/)`, "g");
    return data.replace(regex, FRONTEND_URL) as unknown as T;
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

  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    next: {
      revalidate: 3600,
      tags: ["wpchange"],
    },
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
    query GetPostBySlug($id: ID!) {
      post(id: $id, idType: SLUG) {
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
    const data = await fetchAPI(query, { id: slug });
    return replaceUrlsRecursive(data?.post || null);
  } catch (error) {
    console.error(`Error fetching post by slug (${slug}):`, error);
    return null;
  }
}

export async function getPageBySlug(slug: string, preview = false, previewId?: string) {
  const uri = slug === "home" ? "/" : `/${slug}/`;
  const query = `
    query GetPageByUri($uri: ID!) {
      page(id: $uri, idType: URI) {
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
    const data = await fetchAPI(query, { uri });
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
      query GetPageSeo($uri: ID!) {
        page(id: $uri, idType: URI) {
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
    `, { uri });
    
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
    query GetPropertyByUri($uri: ID!) {
      property(id: $uri, idType: URI) {
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
    const data = await fetchAPI(query, { uri });
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

