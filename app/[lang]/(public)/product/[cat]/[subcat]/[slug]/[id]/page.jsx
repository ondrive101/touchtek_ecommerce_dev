
import { Suspense } from "react";
import ProductViewPage from "./main";




// ✅ Add this — Google reads this for every product page
export async function generateMetadata({ params }) {
  const search = await params;

  // ✅ Format slug for readable title: "b-1" → "B 1"
  const productName = search.slug
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const categoryName = search.cat
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const subCategoryName = search.subcat
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${productName} | ${subCategoryName}`,
    description: `Buy ${productName} ${subCategoryName} at Touchtek. Premium quality ${categoryName} accessories.`,
    alternates: {
      canonical: `https://touchtek.in/${search.lang}/product/${search.cat}/${search.subcat}/${search.slug}/${search.id}`,
    },
    openGraph: {
      title: `${productName}`,
      description: `Buy ${productName} ${subCategoryName} at Touchtek.`,
      url: `https://touchtek.in/${search.lang}/product/${search.cat}/${search.subcat}/${search.slug}/${search.id}`,
    },
  };
}


export default async function Index({ params }) {
  const search = await params;

  console.log('Server - SearchParams:', search);
  
  // Create a key from searchParams to retrigger Suspense
  const key = JSON.stringify(search);
  
  return (
    <Suspense 
      key={key}  // This retriggers Suspense when params change
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      }
    >
      <ProductViewPage searchParams={search} />
    </Suspense>
  );
}
