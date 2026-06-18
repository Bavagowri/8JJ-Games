// // server/src/controllers/proxy.controller.js

// import fetch from "node-fetch";

// export async function proxyRequest(req, res) {
//   try {
//     const { url } = req.query;
//     if (!url) {
//       return res.status(400).json({ message: "Missing url parameter" });
//     }

//     const decodedUrl = decodeURIComponent(url);

//     const response = await fetch(decodedUrl, {
//       redirect: "follow",
//       headers: {
//         // 🔑 THESE HEADERS FIX HOTLINK BLOCKING
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
//         "Accept":
//           "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
//         "Accept-Language": "en-US,en;q=0.9",
//         "Referer": "https://h5games.online/",
//         "Origin": "https://h5games.online",
//       },
//     });

//     // Forward upstream status
//     res.status(response.status);

//     // Forward content type
//     const contentType = response.headers.get("content-type");
//     if (contentType) {
//       res.setHeader("Content-Type", contentType);
//     }

//     // 🔥 Always send binary
//     const buffer = Buffer.from(await response.arrayBuffer());
//     return res.send(buffer);

//   } catch (err) {
//     console.error("PROXY ERROR:", err);
//     res.status(502).send("Bad Gateway");
//   }
// }


// server/src/controllers/proxy.controller.js
import fetch from "node-fetch";

export async function proxyRequest(req, res) {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ message: "Missing url parameter" });
    }

    const decodedUrl = decodeURIComponent(url);

    const response = await fetch(decodedUrl, {
      headers: {
        // 🔑 REQUIRED to bypass 403
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://h5games.online/",
        "Origin": "https://h5games.online",
      },
    });

    if (!response.ok) {
      console.error("PROXY FETCH FAILED:", response.status, decodedUrl);
      return res.status(response.status).send("Proxy target failed");
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    res.setHeader("Content-Type", contentType);

    // stream images instead of buffering
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("PROXY ERROR:", err);
    res.status(502).json({ message: "Proxy failed" });
  }
}
