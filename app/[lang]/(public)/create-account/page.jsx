
import Main from "./main";

// ✅ Add this — Google reads this for every product page
export async function generateMetadata({ params }) {
  const search = await params;

  return {
    title: "Create Account",
    description: "Create your Touchtek account to start shopping, track orders, and enjoy exclusive deals.",
    robots: {
      index: false,   // ✅ Don't index auth pages
      follow: false,
    },
    alternates: {
      canonical: `https://touchtek.in/${search.lang}/create-account`,
    },
    openGraph: {
      title: "Create Account",
      description: "Create your Touchtek account to start shopping, track orders, and enjoy exclusive deals.",
      url: `https://touchtek.in/${search.lang}/create-account`,
    },
  };
}


export default async function Index() {

  return (

      <Main/>
 
  );
}
