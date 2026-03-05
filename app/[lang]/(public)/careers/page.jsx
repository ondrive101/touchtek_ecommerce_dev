
import Main from "./main";

// ✅ Add this — Google reads this for every product page
export async function generateMetadata({ params }) {
  const search = await params;
  

  return {
    title: `Careers`,
    description: `Join our team at Touchtek. We're always looking for talented individuals to join our team.`,
    alternates: {
      canonical: `https://touchtek.in/${search.lang}/careers`,
    },
    openGraph: {
      title: `Careers`,
      description: `Join our team at Touchtek.`,
      url: `https://touchtek.in/${search.lang}/careers`,
    },
  };
}


export default async function Index() {

  return (

      <Main/>
 
  );
}
