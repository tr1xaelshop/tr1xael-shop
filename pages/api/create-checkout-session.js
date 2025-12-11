// pages/api/create-checkout-session.js

const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * PRODUCTS_MAP связывает productId с priceId Stripe.
 * price_xxx ты создаёшь в Stripe Dashboard (Products → Prices).
 */
const PRODUCTS_MAP = {
  "hoodie-black-oversize": {
    priceId: "price_33_hoodie_black", // TODO: замени на реальный price_id
    name: "Худи чёрное oversize"
  },
  "hoodie-grey-basic": {
    priceId: "price_22_hoodie_grey",
    name: "Худи серое basic"
  },
  "tee-white-logo": {
    priceId: "price_11_tee_white_logo",
    name: "Футболка белая с логотипом"
  },
  "tee-black-minimal": {
    priceId: "price_33_tee_black_minimal",
    name: "Футболка чёрная minimal"
  },
  "pants-cargo-black": {
    priceId: "price_43_pants_cargo_black",
    name: "Брюки карго чёрные"
  },
  "pants-joggers-grey": {
    priceId: "price_44_joggers_grey",
    name: "Джоггеры серые"
  },
  "accessory-cap-black": {
    priceId: "price_23_cap_black",
    name: "Кепка чёрная"
  },
  "accessory-beanie": {
    priceId: "price_44_beanie",
    name: "Шапка beanie"
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items, tgUser } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const lineItems = [];

    for (const item of items) {
      const product = PRODUCTS_MAP[item.productId];
      if (!product) {
        return res.status(400).json({ error: `Unknown productId ${item.productId}` });
      }

      const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1;

      lineItems.push({
        price: product.priceId,
        quantity,
      });
    }

    const origin = req.headers.origin || `https://${req.headers.host}`;
    const successUrl = `${origin}/?status=success`;
    const cancelUrl = `${origin}/?status=cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        tg_id: tgUser?.id?.toString() || "",
        tg_username: tgUser?.username || "",
        tg_first_name: tgUser?.first_name || "",
        tg_last_name: tgUser?.last_name || ""
      }
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
