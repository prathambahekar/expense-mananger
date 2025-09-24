import { RequestHandler } from "express";

interface Group {
  id: string;
  name: string;
  defaultCurrency: string;
  members: string[];
  createdBy: string;
}
const groups: Group[] = [];

export const listGroups: RequestHandler = (req, res) => {
  const { userId } = req.params as { userId: string };
  const mine = groups.filter((g) => g.members.includes(userId));
  res.json({ groups: mine });
};

export const createGroup: RequestHandler = (req, res) => {
  const { name, defaultCurrency, creatorId, memberEmails } = req.body || {};
  if (!name || !defaultCurrency || !creatorId)
    return res.status(400).json({ message: "Missing fields" });
  const id = "g" + Math.random().toString(36).slice(2, 8);
  const group: Group = {
    id,
    name,
    defaultCurrency,
    members: [creatorId],
    createdBy: creatorId,
  };
  groups.push(group);
  res.json({ group });
};

export const joinGroup: RequestHandler = (req, res) => {
  const { groupId } = req.params as { groupId: string };
  const { userId } = req.body || {};
  const g = groups.find((x) => x.id === groupId);
  if (!g) return res.status(404).json({ message: "Group not found" });
  if (!g.members.includes(userId)) g.members.push(userId);
  res.json({ group: g });
};
