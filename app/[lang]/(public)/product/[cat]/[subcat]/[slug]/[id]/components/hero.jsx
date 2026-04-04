'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect } from 'react';

function LazyVideo({ src, isFirst }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isFirst) {
      video.play().catch(() => {});
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [isFirst]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay={isFirst}
      muted
      loop
      playsInline
      preload={isFirst ? 'auto' : 'none'}
      controls={false}
      className="object-cover w-full h-full absolute inset-0"
      style={{ display: 'block' }}
    />
  );
}

export default function PerfectGallery({ banners, videos }) {
  const sectionStyle = {
    position: 'relative',
    width: '100vw',
    margin: '0',
    padding: '0 !important',
    left: 'calc(-50vw + 50%)',
    top: 0,
    boxSizing: 'border-box',
    lineHeight: 0,
    fontSize: 0,
  };

  return (
    <div style={{ padding: 0, margin: 0, overflow: 'hidden', lineHeight: 0, fontSize: 0 }}>

      
      {videos?.map((video, i) => (
        <section
          key={video?.id}
          className="relative w-[100vw] h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-screen overflow-hidden"
          style={sectionStyle}
        >
          <div className="absolute inset-0" style={{ lineHeight: 0 }}>
            <LazyVideo src={video?.fileUrl} isFirst={i === 0} />
          </div>
        </section>
      ))}
      {banners?.map((banner, i) => (
        <section
          key={banner?.id}
          className="relative w-[100vw] h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-screen overflow-hidden"
          style={sectionStyle}
        >
          <div className="absolute inset-0" style={{ lineHeight: 0 }}>
            <Link href="/product" className="block w-full h-full absolute inset-0">
              <Image
                src={banner?.fileUrl}
                alt={`banner-${i + 1}`}
                fill
                priority={i === 0}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="object-cover w-full h-full"
                sizes="100vw"
                style={{ display: 'block' }}
              />
            </Link>
          </div>
        </section>
      ))}

    </div>
  );
}