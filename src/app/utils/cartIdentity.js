import { api } from "../lib/api";

const GUEST_STORAGE_KEY = "art_store_guest_id";
const AUTH_STORAGE_KEY = "art_store_authenticated";

export const getOrCreateGuestId = () => {
  if (typeof window === "undefined") return null;
  let id = localStorage.getItem(GUEST_STORAGE_KEY);
  if (!id) {
    id = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(GUEST_STORAGE_KEY, id);
  }
  return id;
};

export const getCartIdentityHeaders = () => {
  if (typeof window === "undefined") return {};
  if (localStorage.getItem(AUTH_STORAGE_KEY) === "true") return {};
  const guestId = getOrCreateGuestId();
  return guestId ? { "x-guest-id": guestId } : {};
};

export const syncAuthMarker = async () => {
  if (typeof window === "undefined") return false;
  try {
    await api.get("/auth/me");
    localStorage.setItem(AUTH_STORAGE_KEY, "true");
    return true;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return false;
  }
};
