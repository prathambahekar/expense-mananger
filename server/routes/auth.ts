import { RequestHandler } from "express";

export const register: RequestHandler = (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });
  const user = { id: "u" + Math.random().toString(36).slice(2, 8), name, email };
  const token = "demo-token-" + Math.random().toString(36).slice(2, 8);
  res.json({ token, user });
};

export const login: RequestHandler = (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: "Missing credentials" });
  const user = { id: "u-demo", name: email.split("@")[0], email };
  const token = "demo-token-" + Math.random().toString(36).slice(2, 8);
  res.json({ token, user });
};
