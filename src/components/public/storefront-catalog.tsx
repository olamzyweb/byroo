"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Search, Plus, Minus, X, Trash2 } from "lucide-react";
import type { CatalogItem, Profile, Theme } from "@/lib/types";
import { Badge } from "@/components/ui";
import { buildItemWhatsAppMessage, toWhatsAppLink } from "@/lib/whatsapp";

interface StorefrontCatalogProps {
  catalogItems: CatalogItem[];
  profile: Profile;
  themeTokens: Theme["tokens"];
}

interface CartItem {
  item: CatalogItem;
  quantity: number;
}

export function StorefrontCatalog({ catalogItems, profile, themeTokens: t }: StorefrontCatalogProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [itemsToShow, setItemsToShow] = useState<number>(10);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(`byroo_cart_${profile.id}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
  }, [profile.id]);

  // Save cart to localStorage when updated
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem(`byroo_cart_${profile.id}`, JSON.stringify(newCart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  };

  // Cart actions
  const addToCart = (item: CatalogItem) => {
    const existing = cart.find((i) => i.item.id === item.id);
    if (existing) {
      const newCart = cart.map((i) =>
        i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
      saveCart(newCart);
    } else {
      saveCart([...cart, { item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    const newCart = cart.filter((i) => i.item.id !== itemId);
    saveCart(newCart);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    const newCart = cart
      .map((i) => {
        if (i.item.id === itemId) {
          const newQty = i.quantity + delta;
          return { ...i, quantity: newQty };
        }
        return i;
      })
      .filter((i) => i.quantity > 0);
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  // Parsing prices for calculation
  const parseNumericPrice = (priceStr: string | null): number => {
    if (!priceStr) return 0;
    const clean = priceStr.replace(/[^\d]/g, "");
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  const getCurrencySymbol = (priceStr: string | null): string => {
    if (!priceStr) return "₦";
    if (priceStr.includes("$")) return "$";
    if (priceStr.includes("₦")) return "₦";
    if (priceStr.includes("GH₵") || priceStr.includes("₵")) return "GH₵";
    if (priceStr.includes("KSh")) return "KSh";
    return "₦";
  };

  // Calculate totals
  const totalQuantity = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  
  let currencySymbol = "₦";
  const totalPrice = cart.reduce((acc, curr) => {
    const priceVal = parseNumericPrice(curr.item.price);
    if (curr.item.price) {
      currencySymbol = getCurrencySymbol(curr.item.price);
    }
    return acc + priceVal * curr.quantity;
  }, 0);

  // Extract unique categories
  const categories = Array.from(
    new Set(catalogItems.map((item) => item.category?.trim()).filter(Boolean))
  ) as string[];

  // Filter items
  const filteredItems = catalogItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category?.trim() === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.short_description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const visibleItems = filteredItems.slice(0, itemsToShow);

  // Build checkout message
  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    let message = `Hello! I would like to place an order from your storefront:\n\n`;
    
    cart.forEach(({ item, quantity }) => {
      const priceText = item.price ? ` (${item.price} each)` : "";
      message += `🛍️ *${quantity}x ${item.name}*${priceText}\n`;
    });

    if (totalPrice > 0) {
      message += `\n💵 *Total: ${currencySymbol}${totalPrice.toLocaleString()}*\n`;
    }

    message += `\nStorefront Link: ${window.location.origin}/${profile.username}`;

    const link = toWhatsAppLink(profile.whatsapp_number || "", message);
    window.open(link, "_blank", "noreferrer");
  };

  return (
    <section className="space-y-4">
      {/* Catalog Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: t.muted }}>
          Catalog
        </h2>
        {totalQuantity > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold hover:opacity-80 transition"
            style={{ color: t.accent }}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Bag ({totalQuantity})</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 h-4 w-4 pointer-events-none" style={{ color: t.muted }} />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setItemsToShow(10); // reset page
          }}
          className="h-10 w-full rounded-xl border pl-10 pr-10 text-sm outline-none transition focus:ring-1"
          style={{
            backgroundColor: t.card,
            color: t.text,
            borderColor: `${t.accent}22`,
            // @ts-ignore
            "--tw-ring-color": t.accent,
          }}
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setItemsToShow(10);
            }}
            className="absolute right-3.5 p-0.5 rounded-full hover:bg-black/5"
          >
            <X className="h-3.5 w-3.5" style={{ color: t.muted }} />
          </button>
        )}
      </div>

      {/* Category Scrolling Pills */}
      {categories.length > 0 && (
        <div className="no-scrollbar -mx-4 flex overflow-x-auto px-4 pb-1 gap-2">
          <button
            onClick={() => {
              setSelectedCategory("all");
              setItemsToShow(10);
            }}
            className="shrink-0 rounded-full px-4 py-1.5 text-xs font-medium border transition"
            style={{
              backgroundColor: selectedCategory === "all" ? t.accent : t.card,
              color: selectedCategory === "all" ? "#ffffff" : t.muted,
              borderColor: selectedCategory === "all" ? t.accent : `${t.accent}22`,
            }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setItemsToShow(10);
              }}
              className="shrink-0 rounded-full px-4 py-1.5 text-xs font-medium border transition"
              style={{
                backgroundColor: selectedCategory === cat ? t.accent : t.card,
                color: selectedCategory === cat ? "#ffffff" : t.muted,
                borderColor: selectedCategory === cat ? t.accent : `${t.accent}22`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Catalog Grid */}
      {visibleItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {visibleItems.map((item) => {
            const cartItem = cart.find((i) => i.item.id === item.id);
            const directMsg = buildItemWhatsAppMessage(item.name, item.whatsapp_prefill || profile.whatsapp_prefill);
            const directHref = profile.whatsapp_number ? toWhatsAppLink(profile.whatsapp_number, directMsg) : "#";

            return (
              <div
                key={item.id}
                className="flex flex-col rounded-xl border p-3"
                style={{ borderColor: `${t.accent}2f`, backgroundColor: t.card }}
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="aspect-[4/3] w-full rounded-lg object-cover object-center"
                  />
                ) : null}
                
                <div className="mt-2 flex items-start justify-between gap-1">
                  <h3 className="text-sm font-semibold line-clamp-2" style={{ color: t.text }}>
                    {item.name}
                  </h3>
                  <Badge
                    tone={item.availability_status === "available" ? "success" : "warning"}
                    className="shrink-0 scale-90 origin-top-right"
                  >
                    {item.availability_status}
                  </Badge>
                </div>

                {item.price ? <p className="mt-1 text-sm font-medium" style={{ color: t.text }}>{item.price}</p> : null}
                {item.short_description ? (
                  <p className="mt-1 text-xs line-clamp-2" style={{ color: t.muted }}>
                    {item.short_description}
                  </p>
                ) : null}

                {/* Actions container */}
                <div className="mt-auto pt-3 flex flex-col gap-2">
                  {cartItem ? (
                    <div
                      className="flex items-center justify-between rounded-lg border h-8 px-2 py-1 text-xs"
                      style={{ borderColor: `${t.accent}3d` }}
                    >
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:opacity-75">
                        <Minus className="h-3 w-3" style={{ color: t.accent }} />
                      </button>
                      <span className="font-semibold text-center w-6" style={{ color: t.text }}>
                        {cartItem.quantity}
                      </span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:opacity-75">
                        <Plus className="h-3 w-3" style={{ color: t.accent }} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      disabled={item.availability_status === "unavailable"}
                      className="w-full rounded-lg border h-8 text-xs font-semibold transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        borderColor: `${t.accent}44`,
                        color: t.accent,
                        background: `${t.accent}0a`,
                      }}
                    >
                      + Add to Bag
                    </button>
                  )}

                  {profile.whatsapp_number && (
                    <a
                      href={directHref}
                      target="_blank"
                      rel="noreferrer"
                      className="text-center text-[10px] font-semibold uppercase tracking-wider opacity-60 hover:opacity-100 transition py-0.5"
                      style={{ color: t.muted }}
                    >
                      Buy Instantly
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-sm" style={{ color: t.muted }}>
          No products match your filters.
        </div>
      )}

      {/* Load More Pagination */}
      {filteredItems.length > itemsToShow && (
        <div className="pt-2 text-center">
          <button
            onClick={() => setItemsToShow((prev) => prev + 10)}
            className="rounded-xl border px-4 py-2 text-xs font-semibold hover:opacity-90 transition"
            style={{
              borderColor: `${t.accent}33`,
              color: t.accent,
              backgroundColor: t.card,
            }}
          >
            Load More Products
          </button>
        </div>
      )}

      {/* Floating Cart Indicator */}
      {totalQuantity > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: t.accent }}
        >
          <div className="relative">
            <ShoppingBag className="h-6 w-6 text-white" />
            <span className="absolute -right-2.5 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
              {totalQuantity}
            </span>
          </div>
        </button>
      )}

      {/* Cart Slide-out Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer Body */}
          <div
            className="relative flex h-full w-full max-w-md flex-col p-6 shadow-2xl transition-transform animate-slide-in"
            style={{ backgroundColor: t.card }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-4" style={{ borderColor: `${t.accent}1a` }}>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" style={{ color: t.accent }} />
                <h2 className="text-base font-bold" style={{ color: t.text }}>
                  Your Shopping Bag
                </h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-full hover:bg-black/5">
                <X className="h-5 w-5" style={{ color: t.text }} />
              </button>
            </div>

            {/* Cart Items List */}
            {cart.length > 0 ? (
              <>
                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {cart.map(({ item, quantity }) => (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-xl border p-3"
                      style={{ borderColor: `${t.accent}1a`, backgroundColor: t.card }}
                    >
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-16 w-16 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <div
                          className="h-16 w-16 shrink-0 rounded-lg flex items-center justify-center border"
                          style={{ borderColor: `${t.accent}11`, backgroundColor: `${t.accent}05` }}
                        >
                          <ShoppingBag className="h-6 w-6 opacity-30" style={{ color: t.accent }} />
                        </div>
                      )}
                      
                      <div className="flex-1 space-y-1">
                        <h4 className="text-sm font-semibold line-clamp-1" style={{ color: t.text }}>
                          {item.name}
                        </h4>
                        {item.price ? (
                          <p className="text-xs font-semibold" style={{ color: t.accent }}>
                            {item.price}
                          </p>
                        ) : null}

                        {/* Adjust quantities */}
                        <div className="flex items-center justify-between pt-1">
                          <div
                            className="flex items-center rounded-lg border px-1.5 py-0.5 gap-2 text-xs"
                            style={{ borderColor: `${t.accent}22` }}
                          >
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-0.5 hover:opacity-75">
                              <Minus className="h-3 w-3" style={{ color: t.accent }} />
                            </button>
                            <span className="font-semibold text-center w-5" style={{ color: t.text }}>
                              {quantity}
                            </span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-0.5 hover:opacity-75">
                              <Plus className="h-3 w-3" style={{ color: t.accent }} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-red-500 hover:text-red-600 transition"
                            title="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer / Summary */}
                <div className="border-t pt-4 mt-4 space-y-4" style={{ borderColor: `${t.accent}1a` }}>
                  {totalPrice > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold" style={{ color: t.muted }}>
                        Total Amount
                      </span>
                      <span className="text-lg font-bold" style={{ color: t.text }}>
                        {currencySymbol}
                        {totalPrice.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={clearCart}
                      className="rounded-xl border px-3 py-3 text-xs font-semibold transition hover:bg-red-50 hover:text-red-600"
                      style={{ borderColor: "#ef4444", color: "#ef4444" }}
                    >
                      Clear
                    </button>
                    
                    <button
                      onClick={handleCheckout}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-md hover:opacity-95 transition"
                      style={{ backgroundColor: t.accent }}
                    >
                      <span>Order on WhatsApp</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 py-12 text-center">
                <ShoppingBag className="h-12 w-12 opacity-20 mb-3" style={{ color: t.accent }} />
                <p className="text-sm font-medium" style={{ color: t.muted }}>
                  Your shopping bag is empty.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-3 text-xs font-semibold hover:opacity-80 transition"
                  style={{ color: t.accent }}
                >
                  Go browse products
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
