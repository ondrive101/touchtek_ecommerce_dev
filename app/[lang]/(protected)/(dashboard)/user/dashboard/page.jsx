import { redirect } from "next/navigation";

const Page = async ({ params }) => {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";
  redirect(`/${lang}/user/orders`);
};

export default Page;
