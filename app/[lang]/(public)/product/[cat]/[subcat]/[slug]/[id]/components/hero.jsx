// app/products/[id]/components/hero.jsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

/*
  ==========================================================
  MEDIA DATABASE ITEM FORMAT
  ==========================================================

  Banner:
  {
    id: "banner-id",
    fileUrl: "https://...",
    layout: "wide", // "wide" | "square" | "skip"
    link: "/en/products",
    alt: "Product feature image"
  }

  Video:
  {
    id: "video-id",
    fileUrl: "https://...",
    layout: "wide", // "wide" | "square" | "skip"
    alt: "Product feature video"
  }

  layout: "skip"
  - The item is not rendered.
  - Use this for disabled, old, or temporary media.

  layout: "wide"
  - Design/export image or video at 1080 x 540 px.
  - Aspect ratio: 2:1.
  - Use for hero, lifestyle, product feature banner.

  layout: "square"
  - Design/export image or video at 528 x 528 px.
  - Aspect ratio: 1:1.
  - Use for two-column product feature cards.

  IMPORTANT:
  - Keep text/product 5-8% away from all edges.
  - The UI uses object-cover, so wrong ratios can crop.
  ==========================================================
*/

function LazyVideo({ src, isFirst = false }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const tryPlay = () => {
      video.play().catch(() => {});
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tryPlay();
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [src]);

  if (!src) return null;

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay={isFirst}
      muted
      loop
      playsInline
      preload={isFirst ? 'auto' : 'metadata'}
      controls={false}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

function MediaCard({
  item,
  index,
  mediaType,
  isFirstMedia,
  fallbackHref = '#',
}) {
  const src = item?.fileUrl;
  const layout = item?.layout === 'square' ? 'square' : 'wide';

  if (!src) return null;

  /*
    WIDE:   1080 x 540 px  | ratio 2:1 | full width
    SQUARE:  528 x 528 px  | ratio 1:1 | half width
  */
  const wrapperClassName = `relative overflow-hidden rounded-[10px] bg-black sm:rounded-2xl ${
    layout === 'square' ? 'aspect-square' : 'col-span-2 aspect-[2/1]'
  }`;

  if (mediaType === 'video') {
    return (
      <div className={wrapperClassName}>
        <LazyVideo src={src} isFirst={isFirstMedia} />
      </div>
    );
  }

  const href = item?.link || fallbackHref;

  const image = (
    <Image
      src={src}
      alt={item?.alt || `Product banner ${index + 1}`}
      fill
      priority={isFirstMedia}
      loading={isFirstMedia ? 'eager' : 'lazy'}
      sizes={
        layout === 'square'
          ? '(max-width: 640px) 50vw, 528px'
          : '(max-width: 1080px) 100vw, 1080px'
      }
      className="object-cover"
    />
  );

  if (!href || href === '#') {
    return <div className={wrapperClassName}>{image}</div>;
  }

  return (
    <Link href={href} className={`${wrapperClassName} block`}>
      {image}
    </Link>
  );
}

function MediaGrid({
  title,
  items = [],
  mediaType,
  bannerHref = '#',
}) {
  const visibleItems = Array.isArray(items)
    ? items.filter((item) => item?.fileUrl && item?.layout !== 'skip')
    : [];

  if (!visibleItems.length) return null;

  return (
    <section className="w-full bg-[#f3f3f3] p-1.5 sm:p-3">
      <div className="mx-auto w-full">
        {title && (
          <h2 className="mb-3 px-1 text-lg font-bold text-gray-900 sm:mb-4 sm:text-2xl">
            {title}
          </h2>
        )}

        <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
          {visibleItems.map((item, index) => (
            <MediaCard
              key={item?.id || `${mediaType}-${index}`}
              item={item}
              index={index}
              mediaType={mediaType}
              isFirstMedia={index === 0}
              fallbackHref={bannerHref}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Hero({
  banners = [],
  videos = [],
  bannerHref = '#',
  showVideoTitle = false,
  showBannerTitle = false,
}) {
  return (
    <div className="w-full space-y-0">
      {/* VIDEO SECTION: only renders items from videos[] */}
      <MediaGrid
        title={showVideoTitle ? 'Product Videos' : ''}
        items={videos}
        mediaType="video"
      />

      {/* BANNER SECTION: only renders items from banners[] */}
      <MediaGrid
        title={showBannerTitle ? 'Product Highlights' : ''}
        items={banners}
        mediaType="image"
        bannerHref={bannerHref}
      />
    </div>
  );
}