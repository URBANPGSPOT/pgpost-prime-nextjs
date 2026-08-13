const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="pgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5c324" />
      <stop offset="100%" stop-color="#e5b018" />
    </linearGradient>
  </defs>
  <!-- Rounded Squircle Background -->
  <rect width="512" height="512" rx="112" fill="url(#pgGradient)" />
  
  <!-- Living House Icon -->
  <path d="M256 76 L72 244 h56 v144 h104 v-96 h48 v96 h104 v-144 h56 Z" fill="#0f172a" />
  
  <!-- Text PGSPOT -->
  <text x="256" y="450" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="74" letter-spacing="3" fill="#0f172a" text-anchor="middle">pgspot</text>
</svg>`;

async function generateFavicons() {
  const publicDir = path.join(__dirname, '../public');
  const appDir = path.join(__dirname, '../src/app');

  // Save SVG icons
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);
  fs.writeFileSync(path.join(appDir, 'icon.svg'), svgContent);

  const svgBuffer = Buffer.from(svgContent);

  // Generate 512x512 PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));

  // Generate 192x192 PNG
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  // Generate Apple Touch Icon 180x180
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(appDir, 'apple-icon.png'));

  // Generate standard 32x32 & 48x48 PNGs
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
  fs.writeFileSync(path.join(appDir, 'icon.png'), png32);

  // Generate 48x48 PNG
  const png48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), png48);

  // Next.js App Router favicon.ico (a valid 32x32/48x48 PNG/ICO buffer)
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), png48);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), png48);

  console.log('Successfully generated all brand favicons and icons!');
}

generateFavicons().catch(console.error);
