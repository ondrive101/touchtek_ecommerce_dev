"use client";
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const dummyProducts = [
  {
    id: 1,
    name: "Running Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop",
    price: 4999,
    discount: 20,
  },
  {
    id: 2,
    name: "Denim Jacket",
    image: "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=80&h=80&fit=crop",
    price: 3499,
    discount: 15,
  },
  {
    id: 3,
    name: "Slim Chinos",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=80&h=80&fit=crop",
    price: 1999,
    discount: 10,
  },
  {
    id: 4,
    name: "Leather Handbag",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=80&h=80&fit=crop",
    price: 2799,
    discount: 25,
  },
  {
    id: 5,
    name: "Smart Watch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop",
    price: 8999,
    discount: 30,
  },
  {
    id: 6,
    name: "Sunglasses",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=80&h=80&fit=crop",
    price: 1599,
    discount: 12,
  },
  {
    id: 7,
    name: "Casual Sneakers",
    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=80&h=80&fit=crop",
    price: 3299,
    discount: 18,
  },
  {
    id: 8,
    name: "Wool Sweater",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=80&h=80&fit=crop",
    price: 2499,
    discount: 8,
  },
];

const AddBlock = ({ className }) => {
  const trackRef = useRef(null);
  const animationRef = useRef(null);
  const offsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const velocityRef = useRef(0); // for smooth momentum on mouse scroll
  const AUTO_SPEED = 0.5;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const step = () => {
      const halfHeight = track.scrollHeight / 2;

      if (!isPausedRef.current) {
        // Auto-scroll when not hovered
        offsetRef.current += AUTO_SPEED;
      } else if (Math.abs(velocityRef.current) > 0.01) {
        // Apply momentum decay when hovered + user scrolled
        offsetRef.current += velocityRef.current;
        velocityRef.current *= 0.92; // friction / deceleration
      }

      // Seamless loop clamp
      offsetRef.current = ((offsetRef.current % halfHeight) + halfHeight) % halfHeight;
      track.style.transform = `translateY(-${offsetRef.current}px)`;

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  // Mousewheel — always works whether hovered or not
  useEffect(() => {
    const container = trackRef.current?.parentElement;
    if (!container) return;

    const onWheel = (e) => {
      e.preventDefault();
      // Add to velocity for momentum-based scrolling
      velocityRef.current += e.deltaY * 0.2;
      // Clamp max velocity so it doesn't fly too fast
      velocityRef.current = Math.max(-12, Math.min(12, velocityRef.current));
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  const handleMouseEnter = () => { isPausedRef.current = true; };
  const handleMouseLeave = () => {
    isPausedRef.current = false;
    velocityRef.current = 0; // reset momentum when leaving
  };

  const allProducts = [...dummyProducts, ...dummyProducts];

  return (
    <div
      className={cn(
        "bg-primary dark:bg-default-400 mb-16 mt-24 p-4 relative text-center rounded-2xl text-white hidden xl:block overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="mx-auto mt-2 mb-3">
        <div className="font-bold text-sm leading-tight">🛍️ Top Deals Today</div>
        <div className="text-xs font-light opacity-80 mt-0.5">
          Scroll to explore trending products
        </div>
      </div>

      {/* Scroll Window */}
      <div
        className="relative h-[200px] overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Fade Top */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-primary dark:from-default-400 to-transparent z-10 pointer-events-none" />
        {/* Fade Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-primary dark:from-default-400 to-transparent z-10 pointer-events-none" />

        {/* Scrolling Track */}
        <div ref={trackRef} className="will-change-transform">
          {allProducts.map((product, index) => {
            const discountedPrice = Math.round(
              product.price * (1 - product.discount / 100)
            );
            return (
              <div
                key={index}
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors rounded-xl px-2 py-1.5 text-left cursor-pointer mb-2"
              >
                <div className="relative w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate leading-tight">
                    {product.name}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                    <span className="text-xs font-bold">
                      ₹{discountedPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] line-through opacity-60">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] bg-white/25 rounded px-1 font-medium">
                      -{product.discount}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-3">
        <Link href="/store" className="block w-full">
          <button className="bg-white text-primary hover:bg-background/90 px-3 py-1.5 text-xs font-bold rounded-lg w-full transition-colors">
            🏪 Visit Store
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AddBlock;
