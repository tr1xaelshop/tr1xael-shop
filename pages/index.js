import { useEffect, useMemo, useState } from "react";
import Head from "next/head";

const PRODUCTS = [
  {
    id: "hoodie-night-street",
    name: "Худи Night Street",
    category: "Худи",
    gender: "unisex",
    sizes: ["S", "M", "L", "XL"],
    price: 64,
    tag: "new",
    vibe: "Drop 01",
    image:
      "https://images.pexels.com/photos/6311576/pexels-photo-6311576.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "hoodie-grey-basic",
    name: "Худи серое basic",
    category: "Худи",
    gender: "unisex",
    sizes: ["XS", "S", "M", "L"],
    price: 49,
    tag: "basic",
    vibe: "Everyday",
    image:
      "https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "hoodie-oversize-sand",
    name: "Худи oversize Sand",
    category: "Худи",
    gender: "unisex",
    sizes: ["S", "M", "L", "XL"],
    price: 59,
    tag: "oversize",
    vibe: "Soft touch",
    image:
      "https://images.pexels.com/photos/7671167/pexels-photo-7671167.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "tee-white-logo",
    name: "Футболка белая с логотипом",
    category: "Футболки",
    gender: "unisex",
    sizes: ["S", "M", "L", "XL"],
    price: 29,
    tag: "logo",
    vibe: "Signature",
    image:
      "https://images.pexels.com/photos/6311665/pexels-photo-6311665.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "tee-black-minimal",
    name: "Футболка чёрная minimal",
    category: "Футболки",
    gender: "unisex",
    sizes: ["S", "M", "L"],
    price: 27,
    tag: "minimal",
    vibe: "Essential",
    image:
      "https://images.pexels.com/photos/7671165/pexels-photo-7671165.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "tee-washed-graphite",
    name: "Футболка washed graphite",
    category: "Футболки",
    gender: "unisex",
    sizes: ["S", "M", "L", "XL"],
    price: 33,
    tag: "premium",
    vibe: "Vintage",
    image:
      "https://images.pexels.com/photos/7691381/pexels-photo-7691381.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "pants-cargo-black",
    name: "Брюки карго чёрные",
    category: "Брюки",
    gender: "unisex",
    sizes: ["S", "M", "L", "XL"],
    price: 55,
    tag: "cargo",
    vibe: "Utility",
    image:
      "https://images.pexels.com/photos/6311669/pexels-photo-6311669.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "pants-joggers-grey",
    name: "Джоггеры серые",
    category: "Брюки",
    gender: "unisex",
    sizes: ["S", "M", "L"],
    price: 45,
    tag: "comfort",
    vibe: "Chill",
    image:
      "https://images.pexels.com/photos/7671164/pexels-photo-7671164.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "pants-tech-cargo",
    name: "Tech карго штаны",
    category: "Брюки",
    gender: "unisex",
    sizes: ["S", "M", "L", "XL"],
    price: 69,
    tag: "tech",
    vibe: "Street util",
    image:
      "https://images.pexels.com/photos/6311587/pexels-photo-6311587.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "accessory-cap-black",
    name: "Кепка чёрная логотип",
    category: "Аксессуары",
    gender: "unisex",
    sizes: ["ONE SIZE"],
    price: 19,
    tag: "cap",
    vibe: "Drop",
    image:
      "https://images.pexels.com/photos/6311662/pexels-photo-6311662.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "accessory-beanie",
    name: "Шапка beanie графит",
    category: "Аксессуары",
    gender: "unisex",
    sizes: ["ONE SIZE"],
    price: 21,
    tag: "winter",
    vibe: "Warm",
    image:
      "https://images.pexels.com/photos/6311579/pexels-photo-6311579.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "outerwear-puffer-midnight",
    name: "Пуховик Midnight",
    category: "Верхняя одежда",
    gender: "unisex",
    sizes: ["S", "M", "L", "XL"],
    price: 129,
    tag: "cold season",
    vibe: "Heat",
    image:
      "https://images.pexels.com/photos/7671169/pexels-photo-7671169.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

const CATEGORIES = ["all", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];
const SIZES = ["all", "XS", "S", "M", "L", "XL", "ONE SIZE"];
const GENDERS = [
  { id: "all", label: "Любой" },
  { id: "male", label: "Мужское" },
  { id: "female", label: "Женское" },
  { id: "unisex", label: "Унисекс" },
];

function formatPrice(v) {
  return `${v.toFixed(0)} €`;
}

function pluralizeItems(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "товар";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "товара";
  return "товаров";
}

export default function Home() {
  const [filters, setFilters] = useState({
    category: "all",
    size: "all",
    gender: "all",
    minPrice: "",
    maxPrice: "",
    search: "",
  });
  const [cart, setCart] = useState([]);
  const [cartStatus, setCartStatus] = useState({ type: "idle", message: "" });
  const [tg, setTg] = useState(null);
  const [tgUser, setTgUser] = useState(null);

  // Telegram WebApp init
  useEffect(() => {
    if (typeof window === "undefined") return;

    const webApp = window.Telegram?.WebApp;
    if (!webApp) return;

    webApp.ready();
    webApp.expand();
    setTg(webApp);

    const user = webApp.initDataUnsafe?.user || null;
    setTgUser(user);

    webApp.MainButton.setText("Оформить заказ");
    webApp.MainButton.hide();
    webApp.MainButton.onClick(() => {
      handleCheckout();
    });

    return () => {
      try {
        webApp.MainButton.offClick(handleCheckout);
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update TG MainButton visibility
  useEffect(() => {
    if (!tg) return;
    if (cart.length === 0) tg.MainButton.hide();
    else tg.MainButton.show();
  }, [cart, tg]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (filters.category !== "all" && p.category !== filters.category) return false;
      if (filters.gender !== "all" && p.gender !== filters.gender) return false;
      if (filters.size !== "all" && !p.sizes.includes(filters.size)) return false;

      if (filters.minPrice !== "" && p.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice !== "" && p.price > Number(filters.maxPrice)) return false;

      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.tag.toLowerCase().includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const product = PRODUCTS.find((p) => p.id === item.productId);
        if (!product) return sum;
        return sum + product.price * item.quantity;
      }, 0),
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const handleChangeFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddToCart = (productId, size) => {
    setCartStatus({ type: "idle", message: "" });
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId && i.size === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { productId, size, quantity: 1 }];
    });
  };

  const handleChangeQty = (productId, size, delta) => {
    setCart((prev) => {
      return prev
        .map((i) =>
          i.productId === productId && i.size === size
            ? { ...i, quantity: i.quantity + delta }
            : i
        )
        .filter((i) => i.quantity > 0);
    });
  };

  const handleRemove = (productId, size) => {
    setCart((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size))
    );
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCartStatus({ type: "loading", message: "Отправляем заказ..." });

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          tgUser,
          source: "miniapp",
        }),
      });

      if (!res.ok) {
        throw new Error("Ошибка ответа от сервера");
      }

      const data = await res.json();
      if (data.ok) {
        setCart([]);
        setCartStatus({
          type: "success",
          message: "Заказ отправлен. Менеджер скоро свяжется с вами.",
        });
        if (tg) {
          tg.close();
        }
      } else {
        throw new Error(data.error || "Неизвестная ошибка сервера");
      }
    } catch (err) {
      console.error(err);
      setCartStatus({
        type: "error",
        message: "Не удалось отправить заказ. Попробуйте ещё раз.",
      });
    }
  };

  return (
    <>
      <Head>
        <title>TR1XAELSHOP · webbot-style mini app</title>
        <meta
          name="description"
          content="Кастомный Telegram Mini App магазин одежды на Next.js"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://telegram.org/js/telegram-web-app.js" async />
      </Head>

      <main className="app-root">
        <header className="app-header">
          <div className="app-logo">
            <div className="app-logo-mark">TX</div>
            <div>
              <div className="app-logo-text-main">TR1XAELSHOP</div>
              <div className="app-logo-text-sub">
                custom mini app · next.js · webbot-ready
              </div>
            </div>
          </div>
          <div className="app-user-info">
            {tgUser ? (
              <>
                {tgUser.username ? `@${tgUser.username}` : tgUser.first_name}
                <br />
                <span>Telegram WebApp подключен</span>
              </>
            ) : (
              <>
                Открыто как сайт
                <br />
                <span>Запусти через Telegram для полного функционала</span>
              </>
            )}
          </div>
        </header>

        <section className="app-layout">
          {/* LEFT: catalog */}
          <section className="surface">
            <div className="filters-root">
              <div className="field-group">
                <span className="filters-section-label">Категории</span>
                <div className="filters-row">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      className={
                        "chip " +
                        (filters.category === cat ? "chip--active" : "")
                      }
                      onClick={() => handleChangeFilter("category", cat)}
                    >
                      {cat === "all" ? "Все" : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field-group">
                <span className="filters-section-label">Пол</span>
                <div className="filters-row">
                  {GENDERS.map((g) => (
                    <button
                      key={g.id}
                      className={
                        "chip " + (filters.gender === g.id ? "chip--active" : "")
                      }
                      onClick={() => handleChangeFilter("gender", g.id)}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field-group">
                <span className="filters-section-label">Размер</span>
                <div className="filters-row">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      className={
                        "chip " + (filters.size === s ? "chip--active" : "")
                      }
                      onClick={() => handleChangeFilter("size", s)}
                    >
                      {s === "all" ? "Любой" : s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field-group">
                <span className="filters-section-label">Цена · €</span>
                <div className="field-input-row">
                  <input
                    type="number"
                    className="field-input-number"
                    placeholder="от"
                    min={0}
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleChangeFilter("minPrice", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    className="field-input-number"
                    placeholder="до"
                    min={0}
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleChangeFilter("maxPrice", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="field-group">
                <span className="filters-section-label">Поиск</span>
                <input
                  type="text"
                  className="field-input"
                  placeholder="худи, карго, футболка..."
                  value={filters.search}
                  onChange={(e) =>
                    handleChangeFilter("search", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="products-grid">
              {filteredProducts.length === 0 ? (
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  Ничего не найдено под эти фильтры. Попробуйте изменить
                  параметры.
                </div>
              ) : (
                filteredProducts.map((p) => (
                  <article key={p.id} className="product-card">
                    <div className="product-media">
                      <img src={p.image} alt={p.name} loading="lazy" />
                      <div className="product-media-label">
                        {p.category.toUpperCase()}
                      </div>
                      <div className="product-media-badge">{p.vibe}</div>
                    </div>
                    <div className="product-title">{p.name}</div>
                    <div className="product-meta">
                      <span>
                        {p.gender === "unisex"
                          ? "Унисекс"
                          : p.gender === "male"
                          ? "Мужское"
                          : "Женское"}
                      </span>
                      <span>Размеры: {p.sizes.join(", ")}</span>
                    </div>
                    <div className="product-price-row">
                      <span className="product-price">
                        {formatPrice(p.price)}
                      </span>
                      <span className="product-pill">{p.tag}</span>
                    </div>
                    <select
                      className="product-size-select"
                      defaultValue={p.sizes[0]}
                    >
                      {p.sizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn btn-primary"
                      onClick={(e) => {
                        const size =
                          e.currentTarget.previousSibling.value || p.sizes[0];
                        handleAddToCart(p.id, size);
                      }}
                    >
                      В корзину
                    </button>
                  </article>
                ))
              )}
            </div>
          </section>

          {/* RIGHT: cart */}
          <aside className="surface">
            <header className="cart-header">
              <div>
                <h2 className="cart-header-title">Корзина</h2>
                <div className="cart-header-caption">
                  {cartCount} {pluralizeItems(cartCount)}
                </div>
              </div>
            </header>

            {cart.length === 0 ? (
              <div className="cart-body-empty">
                Корзина пуста. Добавьте вещи из каталога слева.
              </div>
            ) : (
              <div className="cart-items">
                {cart.map((item) => {
                  const product = PRODUCTS.find(
                    (p) => p.id === item.productId
                  );
                  if (!product) return null;

                  const lineTotal = product.price * item.quantity;

                  return (
                    <div key={`${item.productId}-${item.size}`} className="cart-item">
                      <div className="cart-item-main">
                        <div className="cart-item-title">{product.name}</div>
                        <div className="cart-item-meta">
                          Размер {item.size} · {formatPrice(product.price)} ×{" "}
                          {item.quantity}
                        </div>
                      </div>
                      <div className="cart-item-actions">
                        <div className="badge">{formatPrice(lineTotal)}</div>
                        <div className="cart-qty-buttons">
                          <button
                            className="btn btn-ghost"
                            style={{ padding: "2px 8px" }}
                            onClick={() =>
                              handleChangeQty(item.productId, item.size, -1)
                            }
                          >
                            −
                          </button>
                          <button
                            className="btn btn-ghost"
                            style={{ padding: "2px 8px" }}
                            onClick={() =>
                              handleChangeQty(item.productId, item.size, 1)
                            }
                          >
                            +
                          </button>
                          <button
                            className="btn btn-ghost"
                            style={{ padding: "2px 8px" }}
                            onClick={() =>
                              handleRemove(item.productId, item.size)
                            }
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <footer className="cart-footer">
              <div className="cart-total-row">
                <span>Итого</span>
                <span className="cart-total-amount">
                  {formatPrice(cartTotal)}
                </span>
              </div>

              <button
                className="btn btn-primary desktop-main-button"
                onClick={handleCheckout}
                disabled={cart.length === 0}
              >
                Оформить заказ
              </button>

              {cartStatus.message && (
                <div
                  className={
                    "cart-status " +
                    (cartStatus.type === "success"
                      ? "cart-status--success"
                      : cartStatus.type === "error"
                      ? "cart-status--error"
                      : "")
                  }
                >
                  {cartStatus.message}
                </div>
              )}

              <div className="helper-footer">
                Интеграция с WebBot или своим backend настраивается в
                обработчике <code>/api/create-order</code>.
              </div>
            </footer>
          </aside>
        </section>
      </main>
    </>
  );
}
