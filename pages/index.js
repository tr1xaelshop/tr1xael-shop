import Head from "next/head";
import Script from "next/script";

export default function Home() {
  return (
    <>
      <Head>
        <title>tr1xaelshop — Магазин одежды</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://telegram.org/img/t_logo.png" />
      </Head>

      <div className="app">
        <header>
          <div className="logo">
            <div className="logo-mark">T</div>
            <div>
              <div className="logo-text-main">TR1XAELSHOP</div>
              <div className="logo-text-sub">одежда | streetwear | webapp</div>
            </div>
          </div>
          <div className="tg-user" id="tgUserInfo">
            Открыто как обычный сайт<br />
            <span style={{ opacity: 0.7 }}>Открой через Telegram для полного опыта</span>
          </div>
        </header>

        <div className="layout">
          {/* LEFT: Products */}
          <div className="panel">
            <div className="filters">
              <div>
                <div className="filter-label">Категории</div>
                <div className="filters-row" id="categoryChips"></div>
              </div>

              <div>
                <div className="filter-label">Пол и размер</div>
                <div className="filters-row" id="genderChips"></div>
                <div className="filters-row" id="sizeChips"></div>
              </div>

              <div>
                <div className="filter-label">Цена, €</div>
                <div className="price-inputs">
                  <input type="number" id="minPriceInput" placeholder="от" min="0" />
                  <input type="number" id="maxPriceInput" placeholder="до" min="0" />
                </div>
              </div>

              <div>
                <div className="filter-label">Поиск</div>
                <input
                  type="text"
                  id="searchInput"
                  className="search-input"
                  placeholder="худи, карго, футболка..."
                />
              </div>
            </div>

            <div className="products-grid" id="productsGrid"></div>
          </div>

          {/* RIGHT: Cart */}
          <aside className="panel">
            <div className="cart-header">
              <h2>Корзина</h2>
              <div className="cart-count" id="cartCount">
                0 товаров
              </div>
            </div>
            <div id="cartBody">
              <div className="cart-empty">Вы ещё ничего не добавили. Выберите вещи слева.</div>
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <div>Итого</div>
                <div className="cart-total-amount" id="cartTotal">
                  0 €
                </div>
              </div>

              <button className="btn btn-primary desktop-pay-btn" id="desktopPayBtn">
                Оплатить в Stripe
              </button>

              <div className="cart-status" id="cartStatus"></div>
            </div>
          </aside>
        </div>
      </div>

      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      />

      <Script id="app-script" strategy="afterInteractive">{`
        // --- PRODUCTS CONFIG (ID должен совпадать с backend) ---
        const PRODUCTS = [
          {
            id: "hoodie-black-oversize",
            name: "Худи чёрное oversize",
            category: "Худи",
            gender: "unisex",
            sizes: ["S", "M", "L", "XL"],
            price: 59,
            tag: "streetwear"
          },
          {
            id: "hoodie-grey-basic",
            name: "Худи серое basic",
            category: "Худи",
            gender: "unisex",
            sizes: ["XS", "S", "M", "L"],
            price: 49,
            tag: "база"
          },
          {
            id: "tee-white-logo",
            name: "Футболка белая с логотипом",
            category: "Футболки",
            gender: "unisex",
            sizes: ["S", "M", "L", "XL"],
            price: 29,
            tag: "логотип"
          },
          {
            id: "tee-black-minimal",
            name: "Футболка чёрная minimal",
            category: "Футболки",
            gender: "unisex",
            sizes: ["S", "M", "L"],
            price: 27,
            tag: "minimal"
          },
          {
            id: "pants-cargo-black",
            name: "Брюки карго чёрные",
            category: "Брюки",
            gender: "unisex",
            sizes: ["S", "M", "L", "XL"],
            price: 55,
            tag: "cargo"
          },
          {
            id: "pants-joggers-grey",
            name: "Джоггеры серые",
            category: "Брюки",
            gender: "unisex",
            sizes: ["S", "M", "L"],
            price: 45,
            tag: "комфорт"
          },
          {
            id: "accessory-cap-black",
            name: "Кепка чёрная",
            category: "Аксессуары",
            gender: "unisex",
            sizes: ["ONE SIZE"],
            price: 19,
            tag: "cap"
          },
          {
            id: "accessory-beanie",
            name: "Шапка beanie",
            category: "Аксессуары",
            gender: "unisex",
            sizes: ["ONE SIZE"],
            price: 21,
            tag: "winter"
          }
        ];

        const filtersState = {
          category: "all",
          gender: "all",
          size: "all",
          minPrice: null,
          maxPrice: null,
          search: ""
        };

        let cart = [];
        let tg = null;
        let tgUser = null;

        function formatPrice(value) {
          return value.toFixed(0);
        }

        function initTelegram() {
          if (window.Telegram && window.Telegram.WebApp) {
            tg = window.Telegram.WebApp;
            tg.ready();
            tg.expand();

            tgUser = tg.initDataUnsafe && tg.initDataUnsafe.user ? tg.initDataUnsafe.user : null;
            const tgUserInfo = document.getElementById("tgUserInfo");
            if (tgUser) {
              tgUserInfo.innerHTML = \`@\${tgUser.username || tgUser.first_name || "user"}<br><span style="opacity:0.7">Telegram WebApp подключен</span>\`;
            } else if (tgUserInfo) {
              tgUserInfo.textContent = "Telegram WebApp подключен, но данные пользователя не получены";
            }

            tg.MainButton.setText("Оплатить в Stripe");
            tg.MainButton.hide();
            tg.MainButton.onClick(onPay);
          }
        }

        function updateTelegramMainButton() {
          if (!tg) return;
          if (cart.length === 0) {
            tg.MainButton.hide();
          } else {
            tg.MainButton.show();
          }
        }

        function renderCategoryChips() {
          const el = document.getElementById("categoryChips");
          if (!el) return;
          const categories = ["all", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];
          el.innerHTML = "";
          categories.forEach(cat => {
            const chip = document.createElement("button");
            chip.className = "chip" + (filtersState.category === cat ? " active" : "");
            chip.textContent = cat === "all" ? "Все" : cat;
            chip.onclick = () => {
              filtersState.category = cat;
              renderCategoryChips();
              renderProducts();
            };
            el.appendChild(chip);
          });
        }

        function renderGenderChips() {
          const el = document.getElementById("genderChips");
          if (!el) return;
          const genders = [
            { id: "all", label: "Любой" },
            { id: "male", label: "Мужской" },
            { id: "female", label: "Женский" },
            { id: "unisex", label: "Унисекс" }
          ];
          el.innerHTML = "";
          genders.forEach(g => {
            const chip = document.createElement("button");
            chip.className = "chip" + (filtersState.gender === g.id ? " active" : "");
            chip.textContent = g.label;
            chip.onclick = () => {
              filtersState.gender = g.id;
              renderGenderChips();
              renderProducts();
            };
            el.appendChild(chip);
          });
        }

        function renderSizeChips() {
          const el = document.getElementById("sizeChips");
          if (!el) return;
          const sizes = ["all", "XS", "S", "M", "L", "XL", "ONE SIZE"];
          el.innerHTML = "";
          sizes.forEach(s => {
            const chip = document.createElement("button");
            chip.className = "chip" + (filtersState.size === s ? " active" : "");
            chip.textContent = s === "all" ? "Любой размер" : s;
            chip.onclick = () => {
              filtersState.size = s;
              renderSizeChips();
              renderProducts();
            };
            el.appendChild(chip);
          });
        }

        function applyFilters() {
          return PRODUCTS.filter(p => {
            if (filtersState.category !== "all" && p.category !== filtersState.category) return false;
            if (filtersState.gender !== "all" && p.gender !== filtersState.gender) return false;
            if (filtersState.size !== "all" && !p.sizes.includes(filtersState.size)) return false;
            if (filtersState.minPrice !== null && p.price < filtersState.minPrice) return false;
            if (filtersState.maxPrice !== null && p.price > filtersState.maxPrice) return false;
            if (filtersState.search) {
              const q = filtersState.search.toLowerCase();
              if (!p.name.toLowerCase().includes(q) && !p.tag.toLowerCase().includes(q)) return false;
            }
            return true;
          });
        }

        function renderProducts() {
          const grid = document.getElementById("productsGrid");
          if (!grid) return;
          const products = applyFilters();
          if (!products.length) {
            grid.innerHTML = "<div style='font-size:13px;color:var(--text-muted)'>Ничего не найдено под эти фильтры.</div>";
            return;
          }

          grid.innerHTML = "";
          products.forEach(p => {
            const card = document.createElement("div");
            card.className = "product-card";

            const tag = document.createElement("div");
            tag.className = "product-tag";
            tag.textContent = p.category.toUpperCase() + " • " + p.tag;
            card.appendChild(tag);

            const name = document.createElement("div");
            name.className = "product-name";
            name.textContent = p.name;
            card.appendChild(name);

            const meta = document.createElement("div");
            meta.className = "product-meta";
            meta.innerHTML = \`<span>\${p.gender === "unisex" ? "Унисекс" : (p.gender === "male" ? "Мужское" : "Женское")}</span><span>Размеры: \${p.sizes.join(", ")}</span>\`;
            card.appendChild(meta);

            const price = document.createElement("div");
            price.className = "product-price";
            price.textContent = formatPrice(p.price) + " €";
            card.appendChild(price);

            const sizeSelect = document.createElement("select");
            sizeSelect.className = "product-size-select";
            p.sizes.forEach(s => {
              const opt = document.createElement("option");
              opt.value = s;
              opt.textContent = s;
              sizeSelect.appendChild(opt);
            });
            card.appendChild(sizeSelect);

            const btn = document.createElement("button");
            btn.className = "btn btn-primary";
            btn.textContent = "В корзину";
            btn.onclick = () => {
              addToCart(p.id, sizeSelect.value);
            };
            card.appendChild(btn);

            grid.appendChild(card);
          });
        }

        function addToCart(productId, size) {
          const existing = cart.find(item => item.productId === productId && item.size === size);
          if (existing) {
            existing.quantity += 1;
          } else {
            cart.push({ productId, size, quantity: 1 });
          }
          renderCart();
        }

        function removeFromCart(productId, size) {
          cart = cart.filter(item => !(item.productId === productId && item.size === size));
          renderCart();
        }

        function changeQuantity(productId, size, delta) {
          const item = cart.find(i => i.productId === productId && i.size === size);
          if (!item) return;
          item.quantity += delta;
          if (item.quantity <= 0) {
            removeFromCart(productId, size);
          } else {
            renderCart();
          }
        }

        function getCartTotal() {
          return cart.reduce((sum, item) => {
            const product = PRODUCTS.find(p => p.id === item.productId);
            if (!product) return sum;
            return sum + product.price * item.quantity;
          }, 0);
        }

        function pluralizeItems(n) {
          const mod10 = n % 10;
          const mod100 = n % 100;
          if (mod10 === 1 && mod100 !== 11) return "товар";
          if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "товара";
          return "товаров";
        }

        function renderCart() {
          const cartBody = document.getElementById("cartBody");
          const cartCount = document.getElementById("cartCount");
          const cartTotal = document.getElementById("cartTotal");

          if (!cartBody || !cartCount || !cartTotal) return;

          if (!cart.length) {
            cartBody.innerHTML = "<div class='cart-empty'>Корзина пуста. Добавьте вещи.</div>";
          } else {
            const container = document.createElement("div");
            container.className = "cart-items";

            cart.forEach(item => {
              const product = PRODUCTS.find(p => p.id === item.productId);
              if (!product) return;

              const row = document.createElement("div");
              row.className = "cart-item";

              const main = document.createElement("div");
              main.className = "cart-item-main";

              const name = document.createElement("div");
              name.className = "cart-item-name";
              name.textContent = product.name;

              const meta = document.createElement("div");
              meta.className = "cart-item-meta";
              meta.textContent = \`Размер \${item.size} • \${formatPrice(product.price)} € x \${item.quantity}\`;

              main.appendChild(name);
              main.appendChild(meta);

              const actions = document.createElement("div");
              actions.className = "cart-item-actions";

              const price = document.createElement("div");
              price.className = "badge";
              price.textContent = formatPrice(product.price * item.quantity) + " €";

              const btns = document.createElement("div");
              btns.style.display = "flex";
              btns.style.gap = "4px";

              const minus = document.createElement("button");
              minus.className = "btn btn-ghost";
              minus.style.padding = "2px 8px";
              minus.textContent = "-";
              minus.onclick = () => changeQuantity(item.productId, item.size, -1);

              const plus = document.createElement("button");
              plus.className = "btn btn-ghost";
              plus.style.padding = "2px 8px";
              plus.textContent = "+";
              plus.onclick = () => changeQuantity(item.productId, item.size, 1);

              const removeBtn = document.createElement("button");
              removeBtn.className = "btn btn-ghost";
              removeBtn.style.padding = "2px 8px";
              removeBtn.textContent = "x";
              removeBtn.onclick = () => removeFromCart(item.productId, item.size);

              btns.appendChild(minus);
              btns.appendChild(plus);
              btns.appendChild(removeBtn);

              actions.appendChild(price);
              actions.appendChild(btns);

              row.appendChild(main);
              row.appendChild(actions);

              container.appendChild(row);
            });

            cartBody.innerHTML = "";
            cartBody.appendChild(container);
          }

          const count = cart.reduce((sum, i) => sum + i.quantity, 0);
          cartCount.textContent = count + " " + pluralizeItems(count);
          cartTotal.textContent = formatPrice(getCartTotal()) + " €";

          updateTelegramMainButton();
        }

        async function onPay() {
          if (!cart.length) return;
          const statusEl = document.getElementById("cartStatus");
          if (!statusEl) return;

          statusEl.textContent = "Создаём сессию Stripe...";
          statusEl.className = "cart-status";

          try {
            const body = {
              items: cart.map(item => ({
                productId: item.productId,
                size: item.size,
                quantity: item.quantity
              })),
              tgUser: tgUser
            };

            const res = await fetch("/api/create-checkout-session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body)
            });

            if (!res.ok) {
              throw new Error("Ошибка Stripe: " + res.status);
            }

            const data = await res.json();
            if (!data.url) {
              throw new Error("Ответ Stripe без URL");
            }

            statusEl.textContent = "Переходим на Stripe...";
            statusEl.className = "cart-status success";

            window.location.href = data.url;
          } catch (err) {
            console.error(err);
            statusEl.textContent = "Не удалось создать оплату. Попробуйте ещё раз.";
            statusEl.className = "cart-status error";
          }
        }

        function initApp() {
          initTelegram();
          renderCategoryChips();
          renderGenderChips();
          renderSizeChips();
          renderProducts();
          renderCart();

          const minPriceInput = document.getElementById("minPriceInput");
          const maxPriceInput = document.getElementById("maxPriceInput");
          const searchInput = document.getElementById("searchInput");
          const desktopPayBtn = document.getElementById("desktopPayBtn");

          if (minPriceInput) {
            minPriceInput.addEventListener("input", (e) => {
              const val = e.target.value ? Number(e.target.value) : null;
              filtersState.minPrice = val;
              renderProducts();
            });
          }

          if (maxPriceInput) {
            maxPriceInput.addEventListener("input", (e) => {
              const val = e.target.value ? Number(e.target.value) : null;
              filtersState.maxPrice = val;
              renderProducts();
            });
          }

          if (searchInput) {
            searchInput.addEventListener("input", (e) => {
              filtersState.search = e.target.value;
              renderProducts();
            });
          }

          if (desktopPayBtn) {
            desktopPayBtn.addEventListener("click", onPay);
          }
        }

        if (document.readyState === "complete" || document.readyState === "interactive") {
          initApp();
        } else {
          document.addEventListener("DOMContentLoaded", initApp);
        }
      `}</Script>

      <style jsx global>{`
        :root {
          --bg: #05060a;
          --bg-card: #0e1016;
          --accent: #4f46e5;
          --accent-soft: rgba(79, 70, 229, 0.2);
          --text: #f9fafb;
          --text-muted: #9ca3af;
          --border: #1f2933;
          --danger: #ef4444;
          --success: #22c55e;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
          background: radial-gradient(circle at top, #111827 0, #020617 50%, #000000 100%);
          color: var(--text);
        }

        .app {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-mark {
          width: 36px;
          height: 36px;
          border-radius: 999px;
          background: linear-gradient(135deg, #4f46e5, #ec4899);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          box-shadow: 0 0 25px rgba(79, 70, 229, 0.6);
        }

        .logo-text-main {
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 16px;
        }

        .logo-text-sub {
          font-size: 12px;
          color: var(--text-muted);
        }

        .tg-user {
          font-size: 12px;
          color: var(--text-muted);
          text-align: right;
        }

        .layout {
          display: grid;
          grid-template-columns: minmax(0, 2.2fr) minmax(260px, 0.9fr);
          gap: 16px;
        }

        @media (max-width: 900px) {
          .layout {
            grid-template-columns: 1fr;
          }
        }

        .panel {
          background: rgba(15, 23, 42, 0.95);
          border-radius: 18px;
          border: 1px solid rgba(148, 163, 184, 0.25);
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.8);
          padding: 14px;
          backdrop-filter: blur(18px);
        }

        .filters {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 10px;
        }

        .filters-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .filter-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .chip {
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 12px;
          border: 1px solid var(--border);
          background: #020617;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .chip:hover {
          border-color: var(--accent);
        }

        .chip.active {
          background: var(--accent-soft);
          border-color: var(--accent);
          box-shadow: 0 0 0 1px rgba(79, 70, 229, 0.4);
        }

        .price-inputs {
          display: flex;
          gap: 8px;
        }

        .price-inputs input {
          width: 100%;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: #020617;
          padding: 6px 10px;
          font-size: 12px;
          color: var(--text);
          outline: none;
        }

        .price-inputs input:focus {
          border-color: var(--accent);
        }

        .search-input {
          width: 100%;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: #020617;
          padding: 6px 10px;
          font-size: 12px;
          color: var(--text);
          outline: none;
        }

        .search-input:focus {
          border-color: var(--accent);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 12px;
        }

        .product-card {
          border-radius: 16px;
          background: radial-gradient(circle at top left, rgba(79, 70, 229, 0.12), #020617 45%);
          border: 1px solid rgba(31, 41, 55, 0.9);
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .product-tag {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }

        .product-name {
          font-size: 14px;
          font-weight: 600;
        }

        .product-meta {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--text-muted);
        }

        .product-price {
          font-weight: 600;
          font-size: 14px;
        }

        .product-size-select {
          width: 100%;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: #020617;
          padding: 5px 8px;
          font-size: 11px;
          color: var(--text);
          outline: none;
          margin-top: 2px;
        }

        .btn {
          border-radius: 999px;
          border: none;
          padding: 8px 10px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          color: white;
          width: 100%;
          margin-top: 4px;
        }

        .btn-primary:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
          box-shadow: 0 10px 25px rgba(79, 70, 229, 0.5);
        }

        .btn-ghost {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-muted);
        }

        .btn-ghost:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .cart-header h2 {
          margin: 0;
          font-size: 16px;
        }

        .cart-count {
          font-size: 12px;
          color: var(--text-muted);
        }

        .cart-empty {
          margin-top: 12px;
          font-size: 13px;
          color: var(--text-muted);
        }

        .cart-items {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 260px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .cart-item {
          display: grid;
          grid-template-columns: minmax(0, 1.6fr) auto;
          gap: 6px;
          font-size: 12px;
          padding: 8px;
          border-radius: 14px;
          background: #020617;
          border: 1px solid var(--border);
        }

        .cart-item-main {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .cart-item-name {
          font-weight: 600;
        }

        .cart-item-meta {
          color: var(--text-muted);
          font-size: 11px;
        }

        .cart-item-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .badge {
          border-radius: 999px;
          padding: 2px 8px;
          font-size: 10px;
          border: 1px solid var(--border);
          color: var(--text-muted);
        }

        .cart-total {
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }

        .cart-total-amount {
          font-weight: 700;
          font-size: 16px;
        }

        .cart-footer {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cart-status {
          font-size: 11px;
          color: var(--text-muted);
        }

        .cart-status.success {
          color: var(--success);
        }

        .cart-status.error {
          color: var(--danger);
        }

        .desktop-pay-btn {
          display: none;
        }

        @media (min-width: 901px) {
          .desktop-pay-btn {
            display: block;
          }
        }
      `}</style>
    </>
  );
}
