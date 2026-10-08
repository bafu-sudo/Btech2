import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { handleRealtimeMiddleware } from "./src/server/realtimeHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Real-time analytics, heartbeat, and group chat middleware
app.use((req, res, next) => {
  handleRealtimeMiddleware(req, res, next);
});

const distPath = path.join(__dirname, "dist");

app.use(express.static(distPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
