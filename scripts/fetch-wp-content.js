const fs = require('fs');
const path = require('path');

// Simple parser for local .env files without extra dependencies
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      const lines = fs.readFileSync(filePath, 'utf8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...values] = trimmed.split('=');
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = values.join('=').trim();
          }
        }
      }
    }
  }
}
loadEnv();

const API_URL = process.env.WORDPRESS_API_URL || "https://wp.pgspot.co.in/graphql";

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
      properties(first: 100) {
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
    const properties = json.data?.properties?.nodes || [];

    let combinedHtml = "";
    pages.forEach(p => {
      if (p.content) combinedHtml += p.content + "\n";
    });
    posts.forEach(p => {
      if (p.content) combinedHtml += p.content + "\n";
    });
    properties.forEach(p => {
      if (p.content) combinedHtml += p.content + "\n";
    });

    const targetDir = path.join(__dirname, '../src/templates');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Also include all local template files
    const localTemplates = fs.readdirSync(targetDir);
    for (const file of localTemplates) {
      if (file.endsWith('.html') && file !== 'wordpress-classes.html') {
        combinedHtml += fs.readFileSync(path.join(targetDir, file), 'utf8') + "\n";
      }
    }

    fs.writeFileSync(path.join(targetDir, 'wordpress-classes.html'), combinedHtml);
    console.log("Successfully generated wordpress-classes.html for Tailwind scanning.");
  } catch (error) {
    console.error("Error fetching WordPress content for Tailwind scanner:", error.message);
  }
}

fetchWpContent();
