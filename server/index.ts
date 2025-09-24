import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Mock auth & dashboard endpoints for frontend development
  app.post("/api/auth/register", (await import("./routes/auth")).register);
  app.post("/api/auth/login", (await import("./routes/auth")).login);
  app.get("/api/dashboard/:userId", (await import("./routes/dashboard")).getDashboard);

  return app;
}
