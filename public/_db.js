const URL_ = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY;

async function db(path, opts = {}) {
  const r = await fetch(`${URL_}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: KEY,
      ...(KEY && KEY.startsWith("sb_") ? {} : { Authorization: `Bearer ${KEY}` }),
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
  const t = await r.text();
  let data = null;
  try { data = t ? JSON.parse(t) : null; } catch { data = t; }
  return { ok: r.ok, status: r.status, data };
}

const isWallet = (w) => /^0x[a-fA-F0-9]{40}$/.test(w);

module.exports = { db, isWallet };
