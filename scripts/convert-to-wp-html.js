const fs = require('fs');
const path = require('path');

function convertToWpHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove all Gutenberg block comments
  content = content.replace(/<!--\s*wp:[^>]+\s*-->/g, '');
  content = content.replace(/<!--\s*\/wp:[^>]+\s*-->/g, '');
  
  // Clean up excessive spacing
  content = content.trim();
  
  // Find top level sections
  const sectionRegex = /(<section[^>]*>([\s\S]*?)<\/section>)/g;
  let match;
  let newContent = "";
  let lastIndex = 0;
  
  while ((match = sectionRegex.exec(content)) !== null) {
    const beforeText = content.substring(lastIndex, match.index).trim();
    if (beforeText) {
      newContent += `<!-- wp:html -->\n${beforeText}\n<!-- /wp:html -->\n\n`;
    }
    
    const sectionHtml = match[1];
    newContent += `<!-- wp:html -->\n${sectionHtml}\n<!-- /wp:html -->\n\n`;
    lastIndex = sectionRegex.lastIndex;
  }
  
  const afterText = content.substring(lastIndex).trim();
  if (afterText) {
    newContent += `<!-- wp:html -->\n${afterText}\n<!-- /wp:html -->\n`;
  }
  
  return newContent.trim();
}

const filesToConvert = [
  {
    src: path.join(__dirname, '../../guternbug-pages /Homepge/homepage.html'),
    destTemplate: path.join(__dirname, '../src/templates/homepage.html')
  },
  {
    src: path.join(__dirname, '../../guternbug-pages /About-us/about-us.html'),
    destTemplate: path.join(__dirname, '../src/templates/about-us.html')
  },
  {
    src: path.join(__dirname, '../../guternbug-pages /Contact-us/contact-us.html'),
    destTemplate: path.join(__dirname, '../src/templates/contact-us.html')
  },
  {
    src: path.join(__dirname, '../../guternbug-pages /Mansi/mansi.html'),
    destTemplate: path.join(__dirname, '../src/templates/mansi.html')
  },
  {
    src: path.join(__dirname, '../../guternbug-pages /Thaltej/thaltej.html'),
    destTemplate: path.join(__dirname, '../src/templates/thaltej.html')
  },
  {
    src: path.join(__dirname, '../../guternbug-pages /Terms-conditions/terms-conditions.html'),
    destTemplate: path.join(__dirname, '../src/templates/terms-conditions.html')
  },
  {
    src: path.join(__dirname, '../../guternbug-pages /Privacy-policy/privacy-policy.html'),
    destTemplate: path.join(__dirname, '../src/templates/privacy-policy.html')
  }
];

filesToConvert.forEach(f => {
  if (fs.existsSync(f.src)) {
    console.log("Converting file:", f.src);
    const converted = convertToWpHtml(f.src);
    // Write back to src (overwrite)
    fs.writeFileSync(f.src, converted);
    // Write to templates folder
    fs.writeFileSync(f.destTemplate, converted);
    console.log("Successfully converted and synced both files.");
  } else {
    console.error("Source file does not exist:", f.src);
  }
});
