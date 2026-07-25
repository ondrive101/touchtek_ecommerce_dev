// components/ContentLayoutPlaceholder.jsx
'use client';

const slots = [
  {
    id: 'hero',
    label: 'Hero Banner / Video',
    size: '1080 × 540 px',
    ratio: '2:1',
    type: 'full',
    color: 'from-violet-600 to-indigo-700',
  },
  {
    id: 'feature-1',
    label: 'Feature Tile 1',
    size: '528 × 528 px',
    ratio: '1:1',
    type: 'half',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'feature-2',
    label: 'Feature Tile 2',
    size: '528 × 528 px',
    ratio: '1:1',
    type: 'half',
    color: 'from-sky-500 to-blue-700',
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle Banner / Video',
    size: '1080 × 540 px',
    ratio: '2:1',
    type: 'full',
    color: 'from-rose-500 to-pink-700',
  },
  {
    id: 'feature-wide',
    label: 'Product Feature Banner',
    size: '1080 × 540 px',
    ratio: '2:1',
    type: 'full',
    color: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'feature-3',
    label: 'Feature Tile 3',
    size: '528 × 528 px',
    ratio: '1:1',
    type: 'half',
    color: 'from-cyan-500 to-blue-700',
  },
  {
    id: 'feature-4',
    label: 'Feature Tile 4',
    size: '528 × 528 px',
    ratio: '1:1',
    type: 'half',
    color: 'from-fuchsia-500 to-purple-700',
  },
];

function AssetPlaceholder({ slot }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[clamp(10px,1.5vw,18px)] bg-gradient-to-br ${slot.color} shadow-lg`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,.10)_25%,transparent_25%,transparent_75%,rgba(255,255,255,.10)_75%,rgba(255,255,255,.10)),linear-gradient(45deg,rgba(255,255,255,.10)_25%,transparent_25%,transparent_75%,rgba(255,255,255,.10)_75%,rgba(255,255,255,.10))] bg-[size:28px_28px] bg-[position:0_0,14px_14px]" />

      <div className="relative flex h-full min-h-[inherit] flex-col items-center justify-center p-4 text-center text-white">
        <span className="mb-2 rounded-full border border-white/30 bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] backdrop-blur-sm sm:text-xs">
          {slot.type === 'full' ? 'Full Width Asset' : 'Two-Column Asset'}
        </span>

        <h3 className="text-sm font-bold sm:text-xl">{slot.label}</h3>

        <p className="mt-1 text-lg font-black sm:text-3xl">
          {slot.size}
        </p>

        <p className="mt-1 text-xs text-white/80 sm:text-sm">
          Aspect ratio: {slot.ratio}
        </p>

        <p className="mt-3 max-w-[28ch] text-[10px] leading-relaxed text-white/75 sm:text-xs">
          Keep text and product away from the outer edges. This area may crop
          slightly on different screen sizes.
        </p>
      </div>
    </div>
  );
}

export default function ContentLayoutPlaceholder() {
  return (
    <section className="w-full bg-[#f2f2f2] p-1 sm:p-3">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-4 rounded-xl bg-white p-4 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500">
            Product media design guide
          </p>
          <h2 className="mt-1 text-xl font-black text-gray-900 sm:text-3xl">
            Design on a 1080 × 1920 mobile canvas
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Export individual image/video files in the exact sizes shown below.
            Do not use one full-screen image for every section.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
          {/* Hero */}
          <div className="col-span-2 aspect-[2/1]">
            <AssetPlaceholder slot={slots[0]} />
          </div>

          {/* Pair 1 */}
          <div className="aspect-square">
            <AssetPlaceholder slot={slots[1]} />
          </div>
          <div className="aspect-square">
            <AssetPlaceholder slot={slots[2]} />
          </div>

          {/* Wide images */}
          <div className="col-span-2 aspect-[2/1]">
            <AssetPlaceholder slot={slots[3]} />
          </div>
          <div className="col-span-2 aspect-[2/1]">
            <AssetPlaceholder slot={slots[4]} />
          </div>

          {/* Pair 2 */}
          <div className="aspect-square">
            <AssetPlaceholder slot={slots[5]} />
          </div>
          <div className="aspect-square">
            <AssetPlaceholder slot={slots[6]} />
          </div>
        </div>
      </div>
    </section>
  );
}