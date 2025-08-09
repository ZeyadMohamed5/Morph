import { createContext, useReducer, useEffect } from "react";

// Create context
const CartContext = createContext();

// Initial cart state from localStorage
const initialState = JSON.parse(localStorage.getItem("cart")) || [];

// Reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { id, variantId, size, quantity } = action.payload;

      // Match existing item by id + variantId + size
      const existingItem = state.find(
        (item) =>
          item.id === id && item.variantId === variantId && item.size === size
      );

      if (existingItem) {
        return state.map((item) =>
          item.id === id && item.variantId === variantId && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...state, { ...action.payload }];
      }
    }

    case "REMOVE_FROM_CART":
      return state.filter((item) => {
        return !(
          item.id === action.payload.id &&
          (item.variantId ?? null) === (action.payload.variantId ?? null) &&
          (item.size ?? null) === (action.payload.size ?? null)
        );
      });

    case "UPDATE_QUANTITY":
      return state.map((item) =>
        item.id === action.payload.id &&
        item.variantId === action.payload.variantId &&
        item.size === action.payload.size
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
}

// CartProvider component
export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
