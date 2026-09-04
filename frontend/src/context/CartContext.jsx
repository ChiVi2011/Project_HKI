import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CART_STORAGE_KEY = "vidairy_cart_v1";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Tự động lưu giỏ hàng vào localStorage khi có thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error("Lỗi khi lưu giỏ hàng:", e);
    }
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Thêm sản phẩm vào giỏ
  const addToCart = (product, quantity = 1, selectedVolume = null) => {
    const volumeToUse =
      selectedVolume ||
      (product.volumes && product.volumes.length > 0
        ? product.volumes[0].label
        : product.unit || "Mặc định");

    // Xác định giá theo dung tích nếu có
    let itemPrice = product.price;
    if (product.volumes) {
      const foundVol = product.volumes.find((v) => v.label === volumeToUse);
      if (foundVol) {
        itemPrice = foundVol.price;
      }
    }

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.volume === volumeToUse,
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        const newItem = {
          id: product.id,
          name: product.name,
          price: itemPrice,
          originalPrice: product.originalPrice || itemPrice,
          image: product.image,
          categoryName: product.categoryName || "",
          volume: volumeToUse,
          quantity: quantity,
        };
        return [...prevItems, newItem];
      }
    });

    // Mở khung giỏ hàng ở góc phải để người dùng thấy
    openCart();
  };

  // Cập nhật số lượng (+ / -)
  const updateQuantity = (id, volume, delta) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === id && item.volume === volume) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  // Xóa sản phẩm khỏi giỏ
  const removeFromCart = (id, volume) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.volume === volume)),
    );
  };

  // Xóa sạch giỏ hàng
  const clearCart = () => {
    setCartItems([]);
  };

  // Tổng số lượng món hàng
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Tổng tiền hàng
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
