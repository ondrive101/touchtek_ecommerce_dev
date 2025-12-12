import { getBoards, getDepartmentEmployees } from "@/action/superadmin/controller";
import BreadCrumbs from "@/components/bread-crumbs";
import Main from "@/components/profile";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { HomeIcon } from "lucide-react";

const Profile = async () => {
  const session = await getServerSession(authOptions);
  // const departmentEmployees = await getDepartmentEmployees(session);



  return (
    <>
      <BreadCrumbs
          values={[
            {
              title: "Home",
              href: "/super/dashboard",
              isOnlyIcon: true,
              icon: <HomeIcon className="w-4 h-4" />,
            },
            {
              title: "Profile",
              href: "/super/dashboard",
              isOnlyIcon: false,
              icon: <HomeIcon className="w-5 h-5" />,
            },
          ]}
        />
      <Main
        session={session}
        // departmentEmployees={departmentEmployees?.data}
      />
    </>
  );
};

export default Profile;
