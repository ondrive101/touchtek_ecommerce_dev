// app/products/page.tsx (Server Component)
import { Suspense } from "react";
import ProductsPage from "./main";

export default async function Index({ searchParams }) {
  const search = await searchParams;

  // console.log('Server - SearchParams:', search);
  
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
      <ProductsPage searchParams={search} />
    </Suspense>
  );
}
