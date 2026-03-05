
import Main from "./main";

// ✅ Add this — Google reads this for every product page
export async function generateMetadata({ params }) {
  const search = await params;

  return {
    title: "Forgot Password",
    description: "Reset your Touchtek account password quickly and securely.",
    robots: {
      index: false,   // ✅ Don't index auth pages
      follow: false,
    },
    alternates: {
      canonical: `https://touchtek.in/${search.lang}/forgot-password`,
    },
    openGraph: {
      title: "Forgot Password",
      description: "Reset your Touchtek account password quickly and securely.",
      url: `https://touchtek.in/${search.lang}/forgot-password`,
    },
  };
}


export default async function Index() {

  return (

      <Main/>
 
  );
}
