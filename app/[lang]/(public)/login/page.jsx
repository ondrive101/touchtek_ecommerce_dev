
import Main from "./main";

// ✅ Add this — Google reads this for every product page
export async function generateMetadata({ params }) {
  const search = await params;
  

  return {
    title: `Login`,
    description:  "Sign in to your Touchtek account to manage your orders, products, and more.",
    robots: {
      index: false,   // ✅ Don't index login pages
      follow: false,
    },
    alternates: {
      canonical: `https://touchtek.in/${search.lang}/login`,
    },
    openGraph: {
      title: `Login`,
      description: "Sign in to your Touchtek account to manage your orders, products, and more.",
      url: `https://touchtek.in/${search.lang}/login`,
    },
  };
}


export default async function Index() {

  return (

      <Main/>
 
  );
}
