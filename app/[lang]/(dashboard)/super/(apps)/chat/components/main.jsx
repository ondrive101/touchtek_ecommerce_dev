"use client";
import Chat from "@/components/chat/index";
import { usePathname } from "next/navigation";

const Main = ({session}) => {
  const pathname = usePathname();


  return (
    <>
      <Chat
        pathname={pathname}
        session={session}
      />
    </>
  );
};

export default Main;
