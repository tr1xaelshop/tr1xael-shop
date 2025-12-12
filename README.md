# TR1XAELSHOP · Next.js Telegram Mini App (webbot-style)

Кастомный магазин одежды под Telegram Mini Apps.  
Стек: **Next.js + React**, деплой через **GitHub → Vercel**.

## Структура

- `pages/index.js` — UI мини приложения (каталог, фильтры, корзина, интеграция с Telegram WebApp).
- `pages/api/create-order.js` — заглушка backend для отправки заказа (можно подключить WebBot API / CRM).
- `styles/globals.css` — весь дизайн.

## Запуск локально

```bash
npm install
npm run dev
```

Откроется на http://localhost:3000.

## Деплой на Vercel

1. Создай репозиторий на GitHub, например `tr1xael-webbot-next`.
2. Залей туда файлы из этой папки.
3. В Vercel: **New Project → Import Git Repository** → выбери репозиторий.
4. Framework = Next.js, Root Directory = `./`.
5. Деплой.

## Интеграция с WebBot / backend

В `pages/api/create-order.js` внутри handler можно:

- отправлять заказ на API WebBot (если у тебя тариф с API),
- либо в свою базу / CRM / Stripe / что угодно.

Телеграм-данные пользователя передаются в теле запроса `tgUser`.
