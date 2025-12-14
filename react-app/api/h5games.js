export default async function handler(req, res) {
  try {
    const response = await fetch("https://h5games.online/freegames.json");
    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to load H5 games" });
  }
}
