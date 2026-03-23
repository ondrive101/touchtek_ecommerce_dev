// components/product/Gallery.jsx
'use client';

import Image from 'next/image';

export default function Gallery({ images = [] }) {
  console.log('images in gallery', images);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-2xl flex items-center justify-center">
        <span className="text-gray-500 text-lg">No images available</span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-8">
      {images.map((item, idx) => (
        <div key={item.id || idx} className="w-full rounded-2xl overflow-hidden shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
          <Image
            src={item.fileUrl}
            alt={`Product image ${idx + 1}`}
            width={1200}
            height={800}
            className="w-full h-[500px] sm:h-[600px] object-contain hover:scale-[1.02] transition-transform duration-500"
            priority={idx === 0} // Only first image gets priority loading
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Optional: Image caption */}
          {item.isDefault && (
            <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium">
              Default Image
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
