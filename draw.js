const { db } = require("./_db");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  if (!process.env.ADMIN_KEY || req.headers["x-admin-key"] !== process.env.ADMIN_KEY)
    return res.status(401).json({ error: "Wrong admin key." });

  const r = await db("rpc/draw_winners", { method: "POST", body: JSON.stringify({ n: 100 }) });
  if (!r.ok) {
    const msg = JSON.stringify(r.data || "");
    if (msg.includes("already drawn")) return res.status(409).json({ error: "Already drawn. Results are locked." });
    return res.status(500).json({ error: "Draw failed.", detail: r.data });
  }
  return res.status(200).json({ ok: true, picked: r.data });
};
