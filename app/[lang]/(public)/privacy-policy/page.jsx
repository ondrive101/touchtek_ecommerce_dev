
import Main from "./main";

// ✅ Add this — Google reads this for every product page
export async function generateMetadata({ params }) {
  const search = await params;
  

  return {
    title: `Privacy Policy`,
    description: `Learn more about Touchtek and our mission to provide the best products and services.`,
    alternates: {
      canonical: `https://touchtek.in/${search.lang}/privacy-policy`,
    },
    openGraph: {
      title: `Privacy Policy`,
      description: `Learn more about Touchtek and our mission to provide the best products and services.`,
      url: `https://touchtek.in/${search.lang}/privacy-policy`,
    },
  };
}


export default async function Index() {

  return (

      <Main/>
 
  );
}
