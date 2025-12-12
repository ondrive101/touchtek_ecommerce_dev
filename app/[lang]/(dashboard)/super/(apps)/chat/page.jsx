import Main from "./components/main"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import BreadCrumbs from "@/components/bread-crumbs";
import { HomeIcon } from "lucide-react";

export default async function UserPage({ params }) {
  const session = await getServerSession(authOptions);
  return (
    <div>
         <BreadCrumbs
                      values={[
                        {
                          title: "Home",
                          href: "/super/kanban",
                          isOnlyIcon: true,
                          icon: <HomeIcon className="w-4 h-4" />,
                        },
                        {
                          title: "Chat",
                          href: "/super/chat",
                          isOnlyIcon: false,
                          icon: <HomeIcon className="w-5 h-5" />,
                        },
                      ]}
                    />
      <Main session={session}/>
    </div>
  );
}
