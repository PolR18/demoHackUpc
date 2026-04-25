import express from "express";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3001;

const BASE_PATH = "/Users/polr/Documents/Github/spring-petclinic-microservices-main";

app.use(cors());

app.get("/open", (req, res) => {
  const relativePath = req.query.path;

  if (!relativePath) {
    return res.status(400).json({ error: "Missing path" });
  }

  const absolutePath = path.join(BASE_PATH, relativePath);

  if (!absolutePath.startsWith(BASE_PATH)) {
    return res.status(403).json({ error: "Invalid path" });
  }

  if (!fs.existsSync(absolutePath)) {
    return res.status(404).json({
      error: "File not found",
      path: absolutePath,
    });
  }

  exec(`open "${absolutePath}"`, (error) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      ok: true,
      opened: absolutePath,
    });
  });
});

app.listen(PORT, () => {
  console.log(`Local file server running on http://localhost:${PORT}`);
});