import { api } from "../lib/api";
import { getCartIdentityHeaders, syncAuthMarker } from "../utils/cartIdentity";

export const addItemToCart = async ({ itemType, itemId, quantity = 1 }) => {
  if (itemType !== "painting") throw new Error("Only paintings can be added to cart. Courses use direct checkout.");
  if (!itemId) throw new Error("Painting ID is required.");
  await syncAuthMarker();
  const response = await api.post("/cart/add", { itemType: "painting", itemId, quantity: Number(quantity || 1) }, { headers: getCartIdentityHeaders() });
  return response.data;
};
