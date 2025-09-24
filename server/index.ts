import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { register, login } from "./routes/auth";
import { getDashboard } from "./routes/dashboard";
import { listGroups, createGroup, joinGroup } from "./routes/groups";

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
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.get("/api/dashboard/:userId", getDashboard);

  // Groups
  app.get("/api/groups/:userId", listGroups);
  app.post("/api/groups", createGroup);
  app.put("/api/groups/:groupId/join", joinGroup);

  return app;
}
