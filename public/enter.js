const { db, isWallet } = require("./_db");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const username = String((req.body && req.body.username) || "").trim();
  const wallet = String((req.body && req.body.wallet) || "").trim().toLowerCase();

  if (username.length < 2 || username.length > 30)
    return res.status(400).json({ error: "Username must be 2-30 characters." });
  if (!isWallet(wallet))
    return res.status(400).json({ error: "That doesn't look like a valid wallet (0x...)." });

  // entries close once the draw has happened
  const w = await db("winners?select=wallet&limit=1");
  if (w.ok && w.data.length) return res.status(403).json({ error: "Entries are closed. The draw is done!" });

  const r = await db("entries", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ username, wallet }),
  });

  if (r.status === 409) return res.status(409).json({ error: "That username or wallet is already in." });
  if (!r.ok) return res.status(500).json({ error: "Something broke. Try again." });
  return res.status(200).json({ ok: true });
};
