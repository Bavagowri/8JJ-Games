const fs = require("fs");
const https = require("https");

const URL = "https://h5games.online/freegames.json";

https.get(URL, res => {
  let data = "";

  res.on("data", chunk => {
    data += chunk;
  });

  res.on("end", () => {
    try {
      const games = JSON.parse(data);

      const extracted = games.map(game => ({
        title: game.title,
        imageFile: game.thumb ? game.thumb.split("/").pop() : null
      }));

      fs.writeFileSync(
        "game-image-list.json",
        JSON.stringify(extracted, null, 2),
        "utf8"
      );

      console.log(`✅ Extracted ${extracted.length} games`);
      console.log("📁 Saved as game-image-list.json");
    } catch (err) {
      console.error("❌ JSON parse failed:", err.message);
    }
  });
}).on("error", err => {
  console.error("❌ Request error:", err.message);
});
