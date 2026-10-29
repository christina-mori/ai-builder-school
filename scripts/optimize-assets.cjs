// Delivery copies only. Keep original PNG artwork unchanged.
const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const sources = [
 'dist/assets/adventure-village', 'dist/assets/blue-guide',
 'dist/assets/warm-guide', 'dist/assets/journey-world',
 'dist/bright/assets/daylight-valley'
];
(async () => {
 for (const source of sources) {
  const base = path.join(root, source);
  await sharp(base + '.png').webp({quality:86,alphaQuality:100,effort:6,smartSubsample:true}).toFile(base + '.webp');
  console.log(source, {original:fs.statSync(base + '.png').size,delivery:fs.statSync(base + '.webp').size});
 }
})().catch(error => {console.error(error); process.exit(1);});
