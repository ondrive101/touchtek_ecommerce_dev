"use client";
import Mail from "@/components/email/index";
import { usePathname } from "next/navigation";

const Main = ({session, mails, defaultLayout, defaultCollapsed, navCollapsedSize,mailSetup}) => {
  const pathname = usePathname();


  return (
    <>
      <Mail
        pathname={pathname}
        session={session}
        mails={mails}
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
        navCollapsedSize={navCollapsedSize}
        mailSetup={mailSetup}
      />
    </>
  );
};

export default Main;
