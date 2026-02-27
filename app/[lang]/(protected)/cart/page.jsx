"use server";
import Main from "./components/main";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";


const Page = async ({ params }) => {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Main />
    </>
  );
};

export default Page;
