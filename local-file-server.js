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
  const fileName = path.basename(relativePath);
  const absolutePath = path.resolve(BASE_PATH, fileName);

  if (!absolutePath.startsWith(BASE_PATH)) {
    throw new Error("Invalid path");
  }

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  return absolutePath;
}

function quotePath(p) {
  return `"${p.replaceAll('"', '\\"')}"`;
}

function runCommand(command) {
  console.log("Running command:", command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Command error:", error.message);
    }

    if (stderr) {
      console.error("Command stderr:", stderr);
    }

    if (stdout) {
      console.log("Command stdout:", stdout);
    }
  });
}

app.post("/open-many", (req, res) => {
  const paths = req.body.paths;

  if (!Array.isArray(paths) || paths.length === 0) {
    return res.status(400).json({ error: "Missing paths" });
  }

  try {
    const absolutePaths = paths.map(safeAbsolutePath);

    const csvFiles = absolutePaths.filter((p) =>
      p.toLowerCase().endsWith(".csv")
    );

    const otherFiles = absolutePaths.filter(
      (p) => !p.toLowerCase().endsWith(".csv")
    );

    console.log("Opening:", absolutePaths);

    if (otherFiles.length > 0) {
      runCommand(
        `open -a "Visual Studio Code" ${otherFiles.map(quotePath).join(" ")}`
      );
    }

    if (csvFiles.length > 0) {
      runCommand(
        `open -a "Numbers" ${csvFiles.map(quotePath).join(" ")}`
      );
    }

    res.json({
      ok: true,
      opened: absolutePaths,
    });
  } catch (error) {
    console.error("Open error:", error.message);
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Local file server running on http://localhost:${PORT}`);
});