const fs = require("fs");
const path = require("path");

// CONFIG
const IMAGE_DIR = path.join(__dirname, "public/game-thumbs/");
const JSON_FILE = path.join(__dirname, "game-image-list.json");
const IMAGE_EXTENSION = ".png"; // change if .jpg or .png

// Load JSON
const games = JSON.parse(fs.readFileSync(JSON_FILE, "utf8"));

// Only take first x no of games
const totalImages = 127;

for (let i = 0; i < totalImages; i++) {
  const oldName = `${i + 1}${IMAGE_EXTENSION}`;
  const newName = games[i].imageFile;

  if (!newName) {
    console.warn(`⚠️ Missing imageFile for index ${i}`);
    continue;
  }

  const oldPath = path.join(IMAGE_DIR, oldName);
  const newPath = path.join(IMAGE_DIR, newName);

  if (!fs.existsSync(oldPath)) {
    console.warn(`❌ File not found: ${oldName}`);
    continue;
  }

  if (fs.existsSync(newPath)) {
    console.warn(`⚠️ Already exists, skipping: ${newName}`);
    continue;
  }

  fs.renameSync(oldPath, newPath);
  console.log(`✅ ${oldName} → ${newName}`);
}

console.log("🎉 Renaming completed");
