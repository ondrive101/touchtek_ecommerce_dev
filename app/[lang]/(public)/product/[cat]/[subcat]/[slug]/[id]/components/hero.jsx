'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function PerfectGallery({banners}) {

  console.log('banners', banners)
  const slides = [
    { 
      id: 1, 
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&fit=crop&w=1920&h=1080&q=85", 
      alt: "Product 1"
    },
    { 
      id: 2, 
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&fit=crop&w=1920&h=1080&q=85", 
      alt: "Product 2"
    },
    { 
      id: 3, 
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&fit=crop&w=1920&h=1080&q=85", 
      alt: "Product 3"
    },
    { 
      id: 4, 
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1934&h=1922&q=80", 
      alt: "Product 4"
    },
    { 
      id: 5, 
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1934&h=1922&q=80", 
      alt: "Product 5"
    },
  ];

  return (
    <div style={{ padding: 0, margin: 0, overflow: 'hidden', lineHeight: 0, fontSize: 0 }}>
      {banners?.map((banner, i) => (
        <section
          key={banner?.id}
          className="relative w-[100vw] h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-screen overflow-hidden "
          style={{
            position: 'relative',
            width: '100vw',
            margin: '0',
            padding: '0 !important',
            left: 'calc(-50vw + 50%)',
            top: 0,
            boxSizing: 'border-box',
            lineHeight: 0,
            fontSize: 0
          }}
        >
          <div className="absolute inset-0" style={{ lineHeight: 0 }}>
            <Link href="/product" className="block w-full h-full absolute inset-0">
              <Image
                src={banner?.fileUrl}
                alt={`banner-${i + 1}`}
                fill
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
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
