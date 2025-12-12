import React from "react";
import { getMails,getMailSetup } from "@/action/email/controller";
import Main from "./components/main"
import { cookies } from "next/headers";
import BreadCrumbs from "@/components/bread-crumbs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AuthFail from "./components/authFail";
import { HomeIcon } from "lucide-react";
const EmailPage = async () => {
  const layout = cookies().get("react-resizable-panels:layout");
  const collapsed = cookies().get("react-resizable-panels:collapsed");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;
  const session = await getServerSession(authOptions);
  const mails = await getMails(session);
  const isMailSetup = await getMailSetup(session);

  if(isMailSetup?.data?.isMailSetup && mails?.status === 'fail') {
    return <AuthFail session={session}/>
  } else {

    return (
      <>
         <BreadCrumbs
                values={[
                  {
                    title: "Home",
                    href: "/super/kanban",
                    isOnlyIcon: true,
                    icon: <HomeIcon className="w-4 h-4" />,
                  },
                  {
                    title: "Email",
                    href: "/super/email",
                    isOnlyIcon: false,
                    icon: <HomeIcon className="w-5 h-5" />,
                  },
                ]}
              />
      <Main
        session={session}
        mails={mails?.data || []}
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
        navCollapsedSize={4}
        mailSetup={isMailSetup?.data}
    />
      </>
    );
  }
  
};

export default EmailPage;
