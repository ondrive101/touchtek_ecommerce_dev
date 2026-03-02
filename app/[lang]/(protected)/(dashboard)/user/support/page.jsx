"use server";
import BreadCrumbs from "@/components/bread-crumbs";
import Main from "./components/main";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { HomeIcon } from "lucide-react";

const Page = async () => {

  return (
    <>
      <Main />
    </>
  );
};

export default Page;
