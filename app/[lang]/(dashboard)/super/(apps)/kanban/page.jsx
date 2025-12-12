import { getBoards, getDepartmentEmployees } from "@/action/superadmin/controller";
import BreadCrumbs from "@/components/bread-crumbs";
import Main from "./components/main";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { HomeIcon } from "lucide-react";

const Kanban = async () => {
  const session = await getServerSession(authOptions);
  const departmentEmployees = await getDepartmentEmployees(session);



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
              title: "Kanban",
              href: "/super/kanban",
              isOnlyIcon: false,
              icon: <HomeIcon className="w-5 h-5" />,
            },
          ]}
        />
    
    
      <Main
        session={session}
        departmentEmployees={departmentEmployees?.data}
      />
    </>
  );
};

export default Kanban;
