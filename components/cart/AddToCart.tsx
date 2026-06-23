"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartItem } from "./CartProvider";
import { track } from "@/lib/analytics";

export function AddToCart({ item }: { item: Omit<CartItem, "qty"> }) {
  const { add } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function onAdd() {
    add(item, 1);
    track("add_to_cart", {
      item_id: item.id,
      item_name: item.name,
      value: item.price ?? 0,
      currency: item.currency,
    });
    setAdded(true);
  }

  if (added) {
    return (
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <button
          onClick={() => router.push("/shop/cart")}
          className="us-btn us-btn--lg us-btn--primary us-btn--full"
        >
          View cart →
        </button>
        <button onClick={() => setAdded(false)} className="us-btn us-btn--lg us-btn--secondary">
          Keep shopping
        </button>
      </div>
    );
  }

  return (
    <button onClick={onAdd} className="us-btn us-btn--lg us-btn--primary us-btn--full">
      Add to cart
    </button>
  );
}
