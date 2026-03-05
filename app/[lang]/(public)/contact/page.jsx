
import Main from "./main";

// ✅ Add this — Google reads this for every product page
export async function generateMetadata({ params }) {
  const search = await params;
  

  return {
    title: `Contact Us`,
    description: `Learn more about Touchtek and our mission to provide the best products and services.`,
    alternates: {
      canonical: `https://touchtek.in/${search.lang}/contact`,
    },
    openGraph: {
      title: `Contact Us`,
      description: `Learn more about Touchtek and our mission to provide the best products and services.`,
      url: `https://touchtek.in/${search.lang}/contact`,
    },
  };
}


export default async function Index() {

  return (

      <Main/>
 
  );
}
