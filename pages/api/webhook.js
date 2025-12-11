// pages/api/webhook.js

import { buffer } from "micro";
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const tgId = session.metadata?.tg_id;
    const tgUsername = session.metadata?.tg_username;

    console.log("Оплата успешно завершена для tg_id:", tgId, tgUsername);

    if (TELEGRAM_BOT_TOKEN && tgId) {
      try {
        const text = `Спасибо за заказ в tr1xaelshop!
Сумма: ${session.amount_total / 100} ${session.currency.toUpperCase()}`;
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: tgId,
            text,
          }),
        });
      } catch (err) {
        console.error("Ошибка при отправке сообщения в Telegram:", err);
      }
    }
  }

  res.status(200).json({ received: true });
}
