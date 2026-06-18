
import express from "express";
import { renderPage } from "vike/server";
import path from "path";

const app = express();

// ✅ static files
app.use(express.static(path.resolve("dist/client")));

// 🔥 SSR handler (NO path string)
app.use(async (req, res) => {
  const pageContext = await renderPage({
    urlOriginal: req.originalUrl
  });

  const { httpResponse } = pageContext;

  if (!httpResponse) {
    return res.status(404).send("Not Found");
  }

  const { body, statusCode, headers } = httpResponse;

  headers.forEach(([name, value]) => {
    res.setHeader(name, value);
  });

  res.status(statusCode).send(body);
});

// ✅ start server
app.listen(3000, () => {
  console.log("🚀 SSR running on http://localhost:3000");
});


