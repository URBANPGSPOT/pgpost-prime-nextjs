const fs = require('fs');
const path = require('path');

const API_URL = process.env.WORDPRESS_API_URL || "https://cms.pgspot.co.in/graphql";

async function fetchWpContent() {
  const query = `
    query GetWpContent {
      pages(first: 100) {
        nodes {
          content
        }
      }
      posts(first: 100) {
        nodes {
          content
        }
      }
    }
  `;

  console.log("Fetching WordPress content from:", API_URL);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    const json = await res.json();
    if (json.errors) {
      console.error("GraphQL errors fetching classes:", json.errors);
      return;
    }

    const pages = json.data?.pages?.nodes || [];
    const posts = json.data?.posts?.nodes || [];

    let combinedHtml = "";
    pages.forEach(p => {
      if (p.content) combinedHtml += p.content + "\n";
    });
    posts.forEach(p => {
      if (p.content) combinedHtml += p.content + "\n";
    });

    const targetDir = path.join(__dirname, '../src/templates');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(path.join(targetDir, 'wordpress-classes.html'), combinedHtml);
    console.log("Successfully fetched WordPress content and generated wordpress-classes.html for Tailwind scanning.");
  } catch (error) {
    console.error("Error fetching WordPress content for Tailwind scanner (make sure WP is running at port 8081):", error.message);
  }
}

fetchWpContent();
