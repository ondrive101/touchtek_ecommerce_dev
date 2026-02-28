import { create } from "zustand";
import { siteConfig } from "@/config/site";
import toast from "react-hot-toast";
import { persist, createJSONStorage } from "zustand/middleware";
export const useThemeStore = create(
  persist(
    (set) => ({
      theme: siteConfig.theme,
      setTheme: (theme) => set({ theme }),
      radius: siteConfig.radius,
      setRadius: (value) => set({ radius: value }),
      layout: siteConfig.layout,
      setLayout: (value) => {
        set({ layout: value });

        // If the new layout is "semibox," also set the sidebarType to "popover"
        if (value === "semibox") {
          useSidebar.setState({ sidebarType: "popover" });
        }
        if (value === "horizontal") {
          useSidebar.setState({ sidebarType: "classic" });
        }
        //
        if (value === "horizontal") {
          // update  setNavbarType
          useThemeStore.setState({ navbarType: "sticky" });
        }
      },
      navbarType: siteConfig.navbarType,
      setNavbarType: (value) => set({ navbarType: value }),
      footerType: siteConfig.footerType,
      setFooterType: (value) => set({ footerType: value }),
      isRtl: false,
      setRtl: (value) => set({ isRtl: value }),
    }),
    {
      name: "theme-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useSidebar = create(
  persist(
    (set) => ({
      collapsed: false,
      setCollapsed: (value) => set({ collapsed: value }),
      sidebarType:
        siteConfig.layout === "semibox" ? "popover" : siteConfig.sidebarType,
      setSidebarType: (value) => {
        set({ sidebarType: value });
      },
      subMenu: false,
      setSubmenu: (value) => set({ subMenu: value }),
      // background image
      sidebarBg: siteConfig.sidebarBg,
      setSidebarBg: (value) => set({ sidebarBg: value }),
      mobileMenu: false,
      setMobileMenu: (value) => set({ mobileMenu: value }),
    }),
    {
      name: "sidebar-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);









// -----------------------------------------------------------------------CART STORE------------------------------------------------------------------



// Server sync functions (DISABLED by default)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
const syncCartToServer = async (cartItems, userId) => {
  // TODO: Enable when backend ready
  console.log('🚀 Cart sync to server:', { cartItems, userId });
  // await fetch(`${API_BASE}/cart`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  //   body: JSON.stringify({ items: cartItems, userId })
  // });
};

const fetchCartFromServer = async (userId) => {
  // TODO: Enable when backend ready
  return [];
  // const res = await fetch(`${API_BASE}/cart?userId=${userId}`);
  // return res.ok ? await res.json() : [];
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0,
      shipping: 0, // Dynamic based on total
      taxRate: 0.18, // 18% default (India GST)
      discountCode: '',
      discountAmount: 0,

      // Add/update item (merge quantities)
      addItem: (newItem) => {
        const { items } = get();
        const existingIndex = items.findIndex((item) => item.id === newItem.id);
        
        if (existingIndex >= 0) {
          // Update quantity
          const updatedItems = items.map((item, idx) =>
            idx === existingIndex
              ? { ...item, quantity: Math.min(item.quantity + newItem.quantity, item.maxQuantity || 999) }
              : item
          );
          set({ items: updatedItems });
          toast.success(`${newItem.name} quantity updated`);
        } else {
          // Add new
          set({ items: [...items, { ...newItem, quantity: newItem.quantity }] });
          toast.success(`${newItem.name} added to cart`);
        }
      },

      // Update quantity (handles stock limits)
      updateQuantity: (id, quantity) => {
        const { items } = get();
        const item = items.find((i) => i.id === id);
        
        if (!item) return;
        
        const newQuantity = Math.max(0, Math.min(quantity, item.maxQuantity || 999));
        if (newQuantity === 0) {
          get().removeItem(id);
          return;
        }

        const updatedItems = items.map((i) =>
          i.id === id ? { ...i, quantity: newQuantity } : i
        );
        set({ items: updatedItems });
        toast.success(`Updated quantity to ${newQuantity}`);
      },

      
      increaseById: (id) => {
        const item = get().getItem(id);
        if (!item) return;
        const nextQty = (item.quantity || 0) + 1;
        get().updateQuantity(id, nextQty);
      },

      
      decreaseById: (id) => {
        const item = get().getItem(id);
        if (!item) return;
        const nextQty = (item.quantity || 0) - 1;
        get().updateQuantity(id, nextQty);
      },

      // Remove item
      removeItem: (id) => {
        const { items } = get();
        const remainingItems = items.filter((item) => item.id !== id);
        set({ items: remainingItems });
        toast.success('Item removed from cart');
      },

      // Clear entire cart
      clearCart: () => {
        set({ items: [], totalItems: 0, totalAmount: 0, discountCode: '', discountAmount: 0 });
        toast.info('Cart cleared');
      },

      // Discount code
      setDiscountCode: (code) => set({ discountCode: code }),
      applyDiscount: () => {
        const { discountCode, getSubtotal } = get();
        // Mock validation - replace with real API call
        const discount = discountCode === 'SAVE10' ? getSubtotal() * 0.1 : 0;
        set({ discountAmount: discount });
        toast.success(`Discount applied: ₹${discount.toFixed(2)}`);
      },
      clearDiscount: () => set({ discountCode: '', discountAmount: 0 }),

      // Getters
      getItem: (id) => get().items.find((item) => item.id === id),
      isInCart: (id) => !!get().items.find((item) => item.id === id),
      getSubtotal: () => 
        get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0),

      // Auto-calculate totals
      calculateTotals: () => {
        const { items, getSubtotal, discountAmount, taxRate, shipping } = get();
        const subtotal = getSubtotal();
        const tax = subtotal * taxRate;
        const total = subtotal + tax + shipping - discountAmount;
        
        set({
          totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
          totalAmount: Math.round(total * 100) / 100, // 2 decimal
        });
      },

      // Server sync (DISABLED - set enabled: true to activate)
      syncToServer: async (userId, enabled = false) => {
        if (!enabled) {
          console.log('👻 Server sync disabled');
          return;
        }
        const { items } = get();
        await syncCartToServer(items, userId);
      },

      loadFromServer: async (userId, enabled = false) => {
        if (!enabled) return;
        const serverItems = await fetchCartFromServer(userId);
        if (serverItems.length > 0) {
          // Merge server cart with local
          set({ items: [...get().items, ...serverItems] });
          get().calculateTotals();
          toast.success('Cart synced from server');
        }
      },
    }),
    {
      name: 'ecommerce-cart', // localStorage key
      storage: typeof window !== 'undefined' 
        ? createJSONStorage(() => localStorage) 
        : undefined,
      partialize: (state) => ({
        // Only persist essentials (not computed fields)
        items: state.items,
        discountCode: state.discountCode,
        discountAmount: state.discountAmount,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        items: persistedState?.items || currentState.items,
      }),
    }
  )
);



