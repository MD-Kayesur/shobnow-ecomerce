import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppRootState } from "@/redux/store";

export interface CartItem {
  id: string | number;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand?: string;
  category?: string;
  selectedSize?: string;
  variantId?: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  appliedDiscountCode?: string;
  discountAmount: number;
}

// Helper to load persisted cart from localStorage safely
const loadCartFromStorage = (): CartItem[] => {
  try {
    const raw = localStorage.getItem("choicelegacy_cart");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("Failed to load cart from storage", err);
  }
  return [];
};

const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem("choicelegacy_cart", JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save cart to storage", err);
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
  isOpen: false,
  appliedDiscountCode: undefined,
  discountAmount: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        id: string | number;
        slug: string;
        name: string;
        price: number;
        originalPrice?: number;
        image: string;
        brand?: string;
        category?: string;
        selectedSize?: string;
        variantId?: string;
        quantity?: number;
        openDrawer?: boolean;
      }>
    ) => {
      const {
        id,
        slug,
        name,
        price,
        originalPrice,
        image,
        brand,
        category,
        selectedSize,
        variantId,
        quantity = 1,
        openDrawer = true,
      } = action.payload;

      // Unique match by id and size
      const existingIndex = state.items.findIndex(
        (item) => item.id === id && (item.selectedSize || "") === (selectedSize || "")
      );

      if (existingIndex > -1) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({
          id,
          slug,
          name,
          price,
          originalPrice,
          image,
          brand,
          category,
          selectedSize,
          variantId,
          quantity,
        });
      }

      saveCartToStorage(state.items);

      if (openDrawer) {
        state.isOpen = true;
      }
    },

    removeFromCart: (
      state,
      action: PayloadAction<{ id: string | number; selectedSize?: string }>
    ) => {
      const { id, selectedSize } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(item.id === id && (item.selectedSize || "") === (selectedSize || ""))
      );
      saveCartToStorage(state.items);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{
        id: string | number;
        selectedSize?: string;
        variantId?: string;
        quantity: number;
      }>
    ) => {
      const { id, selectedSize, quantity } = action.payload;
      const item = state.items.find(
        (i) => i.id === id && (i.selectedSize || "") === (selectedSize || "")
      );

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (i) =>
              !(i.id === id && (i.selectedSize || "") === (selectedSize || ""))
          );
        } else {
          item.quantity = quantity;
        }
      }

      saveCartToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.appliedDiscountCode = undefined;
      state.discountAmount = 0;
      saveCartToStorage(state.items);
    },

    openCartDrawer: (state) => {
      state.isOpen = true;
    },

    closeCartDrawer: (state) => {
      state.isOpen = false;
    },

    toggleCartDrawer: (state) => {
      state.isOpen = !state.isOpen;
    },

    applyDiscount: (
      state,
      action: PayloadAction<{ code: string; percent: number }>
    ) => {
      const { code, percent } = action.payload;
      state.appliedDiscountCode = code.toUpperCase();
      const subtotal = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      state.discountAmount = Math.round((subtotal * percent) / 100);
    },

    applyDiscountAmount: (state, action: PayloadAction<{ code: string; amount: number }>) => {
      const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      state.appliedDiscountCode = action.payload.code.trim().toUpperCase();
      state.discountAmount = Math.min(subtotal, Math.max(0, Math.round(action.payload.amount * 100) / 100));
    },

    removeDiscount: (state) => {
      state.appliedDiscountCode = undefined;
      state.discountAmount = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
  applyDiscount,
  applyDiscountAmount,
  removeDiscount,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: AppRootState) => state.cart?.items || [];
export const selectIsCartOpen = (state: AppRootState) => state.cart?.isOpen || false;
export const selectCartTotalCount = (state: AppRootState) =>
  (state.cart?.items || []).reduce((sum, item) => sum + item.quantity, 0);
export const selectCartSubtotal = (state: AppRootState) =>
  (state.cart?.items || []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
export const selectCartDiscount = (state: AppRootState) =>
  state.cart?.discountAmount || 0;
export const selectCartAppliedCode = (state: AppRootState) =>
  state.cart?.appliedDiscountCode;
export const selectCartGrandTotal = (state: AppRootState) => {
  const subtotal = selectCartSubtotal(state);
  const discount = selectCartDiscount(state);
  return Math.max(0, subtotal - discount);
};

export default cartSlice.reducer;
