"use client";

import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  useState,
} from "react";
import { UNIT_LABELS } from "@/types/product";
import type { UnitType } from "@/types/product";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export enum ACTION_TYPES {
  ADD_PRODUCT = "ADD_PRODUCT",
  REMOVE_PRODUCT = "REMOVE_PRODUCT",
  UPDATE_CART = "UPDATE_CART",
  UPDATE_QUANTITY = "UPDATE_QUANTITY",
  UPDATE_UNIT_OF_MEASURE = "UPDATE_UNIT_OF_MEASURE",
  CLEAR_CART = "CLEAR_CART",
  INITIALIZE_CART = "INITIALIZE_CART",
  ADD_TO_DETAIL = "ADD_TO_DETAIL",
}

export interface ProductItemCart {
  /** Product UUID — used as the local cart key by all consumers */
  id: string;
  name: string;
  slug: string;
  image: string;
  quantity: number;
  price: number;
  /** Display label for unit, e.g. "cuộn", "thùng", "cái" */
  unitLabel?: string | null;
  /** Box info string, e.g. "50 cuộn/thùng" */
  boxInfo?: string | null;
  /** Raw unit type value sent to backend (cuon/thung/cai) */
  buyingUnitType?: string | null;
  /** Whether this product can switch between unit and box */
  hasBoxPricing?: boolean;
  /** Product's base unit type (e.g. 'cuon') — used to render unit toggle */
  productUnitType?: string | null;
}

type CartState = ProductItemCart[];

type CartAction =
  | { type: ACTION_TYPES.ADD_PRODUCT; payload: ProductItemCart }
  | { type: ACTION_TYPES.REMOVE_PRODUCT; payload: string }
  | { type: ACTION_TYPES.UPDATE_CART; payload: CartState }
  | { type: ACTION_TYPES.UPDATE_QUANTITY; payload: { id: string; quantity: number } }
  | { type: ACTION_TYPES.UPDATE_UNIT_OF_MEASURE; payload: { id: string; buyingUnitType: string } }
  | { type: ACTION_TYPES.CLEAR_CART }
  | { type: ACTION_TYPES.INITIALIZE_CART; payload: CartState }
  | { type: ACTION_TYPES.ADD_TO_DETAIL; payload: ProductItemCart };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function buildUnitLabel(unitType: UnitType | null | undefined): string | null {
  return unitType ? UNIT_LABELS[unitType] ?? null : null;
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case ACTION_TYPES.ADD_PRODUCT: {
      const existing = state.find((i) => i.id === action.payload.id);
      if (existing) {
        return state.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }

    case ACTION_TYPES.ADD_TO_DETAIL: {
      const existing = state.find((i) => i.id === action.payload.id);
      if (existing) {
        return state.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity, price: action.payload.price, unitLabel: action.payload.unitLabel, boxInfo: action.payload.boxInfo }
            : i
        );
      }
      return [...state, { ...action.payload }];
    }

    case ACTION_TYPES.UPDATE_CART:
      return action.payload;

    case ACTION_TYPES.REMOVE_PRODUCT:
      return state.filter((i) => i.id !== action.payload);

    case ACTION_TYPES.UPDATE_QUANTITY:
      return state.map((i) =>
        i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
      );

    case ACTION_TYPES.UPDATE_UNIT_OF_MEASURE:
      return state.map((i) =>
        i.id === action.payload.id
          ? {
              ...i,
              buyingUnitType: action.payload.buyingUnitType,
              unitLabel: buildUnitLabel(action.payload.buyingUnitType as UnitType),
            }
          : i
      );

    case ACTION_TYPES.CLEAR_CART:
      return [];

    case ACTION_TYPES.INITIALIZE_CART:
      return action.payload;

    default:
      throw new Error("Unhandled action type");
  }
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CartContext = createContext<{
  carts: CartState;
  dispatch: (action: CartAction) => void;
  isSliderCartOpen: boolean;
  handleOpenCartSlider: (isOpen: boolean) => void;
} | null>(null);

const CART_STORAGE_KEY = "packing_cart";

// ---------------------------------------------------------------------------
// Provider — localStorage only
// ---------------------------------------------------------------------------

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [carts, internalDispatch] = useReducer(cartReducer, []);
  const [isSliderCartOpen, setIsSliderCartOpen] = useState(false);
  const isInitializedRef = useRef(false);

  // ---- Persist to localStorage whenever carts changes ----
  useEffect(() => {
    if (!isInitializedRef.current) return;
    try {
      if (carts.length === 0) {
        localStorage.removeItem(CART_STORAGE_KEY);
      } else {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carts));
      }
    } catch {
      // localStorage unavailable — ignore
    }
  }, [carts]);

  // ---- Body scroll lock when drawer is open ----
  useEffect(() => {
    document.body.style.overflow = isSliderCartOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSliderCartOpen]);

  // ---- Init: load from localStorage ----
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ProductItemCart[];
        internalDispatch({ type: ACTION_TYPES.INITIALIZE_CART, payload: parsed });
      }
    } catch {
      // Corrupted localStorage — ignore
    }
    isInitializedRef.current = true;
  }, []);

  // ---- Dispatch: just update reducer (persisted via useEffect above) ----
  const dispatch = useCallback((action: CartAction): void => {
    internalDispatch(action);
  }, []);

  const handleOpenCartSlider = (isOpen: boolean) => setIsSliderCartOpen(isOpen);

  return (
    <CartContext.Provider value={{ carts, dispatch, isSliderCartOpen, handleOpenCartSlider }}>
      {children}
    </CartContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
