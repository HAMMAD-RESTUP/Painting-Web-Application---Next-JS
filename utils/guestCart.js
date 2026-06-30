const GUEST_CART_KEY = "art_store_guest_id";

export const getGuestId = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(
    GUEST_CART_KEY
  );
};

export const getOrCreateGuestId = () => {
  if (typeof window === "undefined") {
    return null;
  }

  let guestId = localStorage.getItem(
    GUEST_CART_KEY
  );

  if (!guestId) {
    const randomId =
      typeof crypto !== "undefined" &&
      crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;

    guestId = `guest_${randomId}`;

    localStorage.setItem(
      GUEST_CART_KEY,
      guestId
    );
  }

  return guestId;
};

export const removeGuestId = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    GUEST_CART_KEY
  );
};