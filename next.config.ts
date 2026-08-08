import type { NextConfig } from "next";

const wordpressBaseUrl = process.env.WORDPRESS_BASE_URL || "https://wp.pgspot.co.in";

let wordpressHost = "wp.pgspot.co.in";
let wordpressProtocol: 'http' | 'https' = "https";
let wordpressPort = "";

try {
  const url = new URL(wordpressBaseUrl);
  wordpressHost = url.hostname;
  wordpressProtocol = url.protocol.replace(":", "") as 'http' | 'https';
  wordpressPort = url.port;
} catch (e) {
  console.error("Invalid WORDPRESS_BASE_URL", e);
}

const nextConfig: NextConfig = {
  trailingSlash: true,
  basePath: process.env.BASE_PATH || "",
  
  images: {
    remotePatterns: [
      {
        protocol: wordpressProtocol,
        hostname: wordpressHost,
        port: wordpressPort ? wordpressPort : undefined,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "wp.pgspot.co.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cms.pgspot.co.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  
  experimental: {
    optimizeCss: true,
  },

  async rewrites() {
    return [
      {
        source: "/sitemap-:post_type.xml",
        destination: "/sitemap.xml/:post_type",
      },
      {
        source: "/:path*.md",
        destination: `${wordpressBaseUrl}/:path*.md`,
      },
    ];
  },
};

export default nextConfig;
