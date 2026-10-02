const { db, isWallet } = require("./_db");

module.exports = async (req, res) => {
  const wallet = String(req.query.wallet || "").trim().toLowerCase();
  if (!isWallet(wallet)) return res.status(400).json({ error: "That doesn't look like a valid wallet (0x...)." });

  const any = await db("winners?select=wallet&limit=1");
  if (!any.ok) return res.status(500).json({ error: "Something broke. Try again." });
  if (!any.data.length) return res.status(200).json({ status: "pending" });

  const hit = await db(`winners?select=wallet&wallet=eq.${wallet}&limit=1`);
  if (!hit.ok) return res.status(500).json({ error: "Something broke. Try again." });
  return res.status(200).json({ status: hit.data.length ? "eligible" : "not_eligible" });
};
