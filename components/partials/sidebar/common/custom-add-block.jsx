"use client";
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getHotSellingProducts } from "@/action/common";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

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

  const { data: hotSellingProducts, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["products-hot-selling"],
    queryFn: () => getHotSellingProducts(),
    staleTime: 30 * 1000,
  });

  const handleMouseEnter = () => { isPausedRef.current = true; };
  const handleMouseLeave = () => {
    isPausedRef.current = false;
    velocityRef.current = 0; // reset momentum when leaving
  };

  const productList =
    hotSellingProducts?.data?.list && hotSellingProducts.data.list.length > 0
      ? hotSellingProducts.data.list
      : [];
  const allProducts = [...productList, ...productList];

  return (
    <div
      className={cn(
        "bg-primary dark:bg-default-400 mb-4 p-3 relative text-center rounded-2xl text-white block overflow-hidden shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="mx-auto mt-0.5 mb-2">
        <div className="font-bold text-xs leading-tight">🛍️ Top Deals Today</div>
        <div className="text-[11px] font-light opacity-80 mt-0.5">
          Scroll to explore trending products
        </div>
      </div>

      {/* Scroll Window */}
      <div
        className="relative h-[180px] overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Fade Top */}
        <div className="absolute top-0 left-0 right-0 h-5 bg-gradient-to-b from-primary dark:from-default-400 to-transparent z-10 pointer-events-none" />
        {/* Fade Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-primary dark:from-default-400 to-transparent z-10 pointer-events-none" />

        {/* Scrolling Track */}
        <div ref={trackRef} className="will-change-transform">
          {allProducts.map((product, index) => {
            const originalPrice =
              product.originalPrice ||
              Math.round(product.price * (1 + (product.discount || 15) / 100));
            return (
              <div
                key={index}
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors rounded-xl px-2 py-1 text-left cursor-pointer mb-1.5"
              >
                <div className="relative w-9 h-9 flex-shrink-0 rounded-lg overflow-hidden bg-white/20">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="36px"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate leading-tight">
                    {product.name}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                    <span className="text-xs font-bold">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] line-through opacity-60">
                      ₹{originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[9px] bg-white/25 rounded px-1 font-medium">
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
      <div className="mt-2.5">
        <Link href="/en/products" className="block w-full">
          <button
            type="button"
            className="bg-white text-primary hover:bg-white/90 px-3 py-1.5 text-xs font-bold rounded-lg w-full transition-colors shadow-sm"
          >
            🏪 Visit Store
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AddBlock;
