# tr1xaelshop Next.js WebApp

Next.js + Telegram WebApp + Stripe Checkout магазин одежды.

## Запуск локально

```bash
npm install
npm run dev
```

Нужные переменные окружения:

- STRIPE_SECRET_KEY
- TELEGRAM_BOT_TOKEN (для уведомлений после оплаты)
- STRIPE_WEBHOOK_SECRET (для /api/webhook)
```
