export const CART_STORAGE_KEY = "rakhshindasart_painting_cart_v2";
export const CART_EVENT = "rakhshindasart:cart-updated";

const LEGACY_KEYS = [
  "rakhshindasart_painting_cart_v1",
  "art_store_cart",
];

const isBrowser = () => typeof window !== "undefined";

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const firstString = (...values) => {
  const value = values.find(
    (candidate) => typeof candidate === "string" && candidate.trim(),
  );
  return value ? value.trim() : "";
};

export const getPaintingId = (item) =>
  firstString(
    item?.paintingId,
    item?.painting?._id,
    item?.painting?.id,
    item?.product?._id,
    item?.product?.id,
    item?._id,
    item?.id,
    item?.slug,
  );

const getImage = (item) =>
  firstString(
    item?.image?.url,
    item?.thumbnail?.url,
    item?.coverImage?.url,
    item?.painting?.image?.url,
    item?.painting?.thumbnail?.url,
    item?.painting?.images?.[0]?.url,
    item?.product?.image?.url,
    item?.product?.thumbnail?.url,
    typeof item?.image === "string" ? item.image : "",
    typeof item?.thumbnail === "string" ? item.thumbnail : "",
    typeof item?.images?.[0] === "string" ? item.images[0] : "",
    item?.images?.[0]?.url,
    item?.imageUrl,
  );

export const normalizeCartItem = (item, quantityOverride) => {
  const paintingId = getPaintingId(item);
  if (!paintingId) return null;

  const stockSource =
    item?.stock ?? item?.painting?.stock ?? item?.product?.stock;
  const hasKnownStock =
    stockSource !== undefined && stockSource !== null && stockSource !== "";
  const stock = hasKnownStock
    ? Math.max(0, Math.floor(toNumber(stockSource, 0)))
    : null;

  const rawQuantity = Math.floor(
    toNumber(quantityOverride ?? item?.quantity, 1),
  );
  const requestedQuantity = Math.max(1, rawQuantity);
  const quantity =
    stock !== null && stock > 0
      ? Math.min(requestedQuantity, stock)
      : requestedQuantity;

  return {
    id: paintingId,
    paintingId,
    itemType: "painting",
    slug: firstString(item?.slug, item?.painting?.slug, item?.product?.slug),
    title: firstString(
      item?.title,
      item?.name,
      item?.painting?.title,
      item?.painting?.name,
      item?.product?.title,
      item?.product?.name,
    ) || "Original Artwork",
    image: getImage(item),
    unitPrice: Math.max(
      0,
      toNumber(
        item?.unitPrice ??
          item?.price ??
          item?.painting?.price ??
          item?.product?.price,
        0,
      ),
    ),
    quantity,
    stock,
    currency: firstString(
      item?.currency,
      item?.painting?.currency,
      item?.product?.currency,
      "AED",
    ).toUpperCase(),
    category: firstString(
      item?.category?.title,
      item?.category?.name,
      item?.categoryName,
      item?.painting?.category?.title,
    ),
  };
};

const notify = ({ openCart = false } = {}) => {
  if (!isBrowser()) return;
  window.dispatchEvent(
    new CustomEvent(CART_EVENT, {
      detail: { openCart },
    }),
  );
};

const readRawCart = () => {
  if (!isBrowser()) return [];

  const keys = [CART_STORAGE_KEY, ...LEGACY_KEYS];
  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray(parsed?.items)) return parsed.items;
      if (Array.isArray(parsed?.cart?.items)) return parsed.cart.items;
    } catch {
      // Ignore malformed legacy values and continue looking.
    }
  }

  return [];
};

export const readCart = () => {
  const cart = readRawCart().map((item) => normalizeCartItem(item)).filter(Boolean);

  if (isBrowser()) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
  }

  return cart;
};

export const writeCart = (items, options = {}) => {
  if (!isBrowser()) return [];

  const normalized = (Array.isArray(items) ? items : [])
    .map((item) => normalizeCartItem(item))
    .filter(Boolean);

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalized));
  notify(options);
  return normalized;
};

export const addCartItem = (painting, quantity = 1, options = {}) => {
  const incoming = normalizeCartItem(painting, quantity);
  if (!incoming) throw new Error("A valid painting is required.");

  const cart = readCart();
  const index = cart.findIndex((item) => item.paintingId === incoming.paintingId);

  if (index === -1) {
    return writeCart([...cart, incoming], options);
  }

  const current = cart[index];
  const next = normalizeCartItem(
    { ...current, ...incoming },
    current.quantity + incoming.quantity,
  );

  const updated = [...cart];
  updated[index] = next;
  return writeCart(updated, options);
};

export const setCartItem = (painting, quantity = 1, options = {}) => {
  const incoming = normalizeCartItem(painting, quantity);
  if (!incoming) throw new Error("A valid painting is required.");

  const cart = readCart();
  const index = cart.findIndex((item) => item.paintingId === incoming.paintingId);

  if (index === -1) return writeCart([...cart, incoming], options);

  const updated = [...cart];
  updated[index] = incoming;
  return writeCart(updated, options);
};

export const updateCartItemQuantity = (paintingId, quantity, options = {}) => {
  const id = String(paintingId || "").trim();
  if (!id) return readCart();

  const nextQuantity = Math.floor(toNumber(quantity, 1));
  if (nextQuantity <= 0) return removeCartItem(id, options);

  return writeCart(
    readCart().map((item) =>
      item.paintingId === id ? normalizeCartItem(item, nextQuantity) : item,
    ),
    options,
  );
};

export const removeCartItem = (paintingId, options = {}) => {
  const id = String(paintingId || "").trim();
  return writeCart(
    readCart().filter((item) => item.paintingId !== id),
    options,
  );
};

export const clearCart = (options = {}) => writeCart([], options);

export const getCartSummary = (items = readCart()) => {
  const safeItems = Array.isArray(items) ? items : [];
  const itemCount = safeItems.reduce(
    (total, item) => total + Math.max(1, toNumber(item?.quantity, 1)),
    0,
  );
  const subtotal = safeItems.reduce(
    (total, item) =>
      total +
      Math.max(0, toNumber(item?.unitPrice, 0)) *
        Math.max(1, toNumber(item?.quantity, 1)),
    0,
  );

  return {
    items: safeItems,
    itemCount,
    subtotal,
    totalAmount: subtotal,
    currency: safeItems[0]?.currency || "AED",
  };
};

export const toOrderItems = (items = readCart()) =>
  (Array.isArray(items) ? items : []).map((item) => ({
    itemType: "painting",
    paintingId: item.paintingId,
    itemId: item.paintingId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    title: item.title,
  }));
