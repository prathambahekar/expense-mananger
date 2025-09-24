import { RequestHandler } from "express";

export const getDashboard: RequestHandler = (req, res) => {
  const { userId } = req.params;
  const data = {
    net: -42.35,
    history: [
      { id: "1", date: new Date().toISOString(), desc: "Dinner", amount: 24.5, currency: "USD", payer: "Alex", share: 8.17 },
      { id: "2", date: new Date(Date.now()-864e5).toISOString(), desc: "Taxi", amount: 18.0, currency: "USD", payer: "Sam", share: 9 },
    ],
    split: { Food: 120, Travel: 60, Utilities: 40, Other: 25 },
    settlements: [ { to: "Sam", amount: 18 }, { to: "Jordan", amount: 24.35 } ],
    alerts: [ { id: "a1", title: "Potential duplicate", detail: `Matches entry for ${userId}` } ],
    groups: [ { id: "g1", name: "Roommates", members: 3 } ],
  };
  res.json(data);
};
