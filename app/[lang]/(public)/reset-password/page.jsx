import Main from "./main";

export async function generateMetadata({ params }) {
  const search = await params;

  return {
    title: "Reset Password",
    description: "Reset your Touchtek account password quickly and securely.",
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `https://touchtek.in/${search.lang}/reset-password`,
    },
    openGraph: {
      title: "Reset Password",
      description: "Reset your Touchtek account password quickly and securely.",
      url: `https://touchtek.in/${search.lang}/reset-password`,
    },
  };
}

export default async function Index() {
  return <Main />;
}
