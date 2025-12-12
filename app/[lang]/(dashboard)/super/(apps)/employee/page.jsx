import Main from "./components/main";
import { getServerSession } from "next-auth";
import { getEmployeeList } from "@/action/superadmin/controller";
import BreadCrumbs from "@/components/bread-crumbs";
import { authOptions } from "@/lib/auth";
import { HomeIcon } from "lucide-react";

export default async function UserPage({ params }) {
  const session = await getServerSession(authOptions);
  const emloyeeList = await getEmployeeList(session);

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
            title: "Employee",
            href: "/super/employee",
            isOnlyIcon: false,
            icon: <HomeIcon className="w-5 h-5" />,
          },
        ]}
      />
      <Main list={emloyeeList.data} session={session} />
    </div>
  );
}
