import BreadCrumbs from "@/components/bread-crumbs";
import Dummy from "./components/dummy";
import { HomeIcon } from "lucide-react";

const DummyPage = async () => {
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
          title: "Dashboard",
          href: "/super/dashboard",
          isOnlyIcon: false,
          icon: <HomeIcon className="w-5 h-5" />,
        },
      ]}
    />
    
      <Dummy />
    </>
  );
};

export default DummyPage;


