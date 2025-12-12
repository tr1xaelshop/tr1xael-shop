// pages/api/create-order.js
// Этот handler сейчас просто логирует заказ.
// Здесь можно прокинуть запрос в WebBot API или в свою CRM / backend.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const { items, tgUser, source } = req.body || {};

    console.log("New order from mini app:", {
      items,
      tgUser,
      source,
      at: new Date().toISOString(),
    });

    // TODO: здесь можно сделать запрос к внешнему API:
    // const webbotRes = await fetch(process.env.WEBBOT_API_URL + "/orders", { ... });

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("create-order error", e);
    return res.status(500).json({ ok: false, error: "Internal Server Error" });
  }
}
