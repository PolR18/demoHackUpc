import express from "express";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3001;

const BASE_PATH = "/Users/polr/UPC/HackUPC/onboarding-map/demoHackUpc/docs/";

app.use(cors());
app.use(express.json());

function safeAbsolutePath(relativePath) {
  const absolutePath = path.resolve(BASE_PATH, relativePath);

  if (!absolutePath.startsWith(BASE_PATH)) {
    throw new Error("Invalid path");
  }

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  return absolutePath;
}

app.post("/open-many", (req, res) => {
  const paths = req.body.paths;

  if (!Array.isArray(paths) || paths.length === 0) {
    return res.status(400).json({ error: "Missing paths" });
  }

  try {
    const absolutePaths = paths.map(safeAbsolutePath);

    const command = `open ${absolutePaths
      .map((p) => `"${p.replaceAll('"', '\\"')}"`)
      .join(" ")}`;

    exec(command, (error) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json({
        ok: true,
        opened: absolutePaths,
      });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Local file server running on http://localhost:${PORT}`);
});