import { getUsersList_SuperAdmin} from "@/config/main.config";
import {getDepartmentList, getEmployeeList} from "@/action/superadmin/controller";
import Main from "./components/main";
import { getServerSession } from "next-auth";
import BreadCrumbs from "@/components/bread-crumbs";
import { HomeIcon } from "lucide-react";
import { authOptions } from "@/lib/auth";

export default async function UserPage({ params }) {
  const session = await getServerSession(authOptions);
  const DepartmentList = await getDepartmentList(session);
  const emloyeeList = await getEmployeeList(session);
  return (
    <div>
            <BreadCrumbs
                values={[
                  {
                    title: "Home",
                    href: "/super/dashboard",
                    isOnlyIcon: true,
                    icon: <HomeIcon className="w-4 h-4" />,
                  },
                  {
                    title: "Departments",
                    href: "/super/dashboard",
                    isOnlyIcon: false,
                    icon: <HomeIcon className="w-5 h-5" />,
                  },
                ]}
              />
      <Main session={session} departmentList={DepartmentList?.data} employeeList={emloyeeList?.data}/>
    </div>
  );
}
