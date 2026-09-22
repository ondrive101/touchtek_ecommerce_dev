import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "@/store";
import logo from "@/public/images/touchtek/logo/logo-icon-black.png";
import touchtekLogo from "@/public/images/touchtek/logo/touchtek.png";

const SidebarLogo = ({ hovered, collapsed: collapsedProp }) => {
  const { sidebarType, setCollapsed, collapsed: storeCollapsed } = useSidebar();
  const isCollapsed = collapsedProp !== undefined ? collapsedProp : storeCollapsed;

  return (
    <div className="h-14 flex items-center px-3 border-b">
      <div className="flex items-center justify-between w-full">
        <Link href="/en/user/orders" className="h-11 flex items-center">
          {isCollapsed && !hovered && (
            <Image
              src={logo}
              alt="Touchtek Icon"
              className="object-contain h-11 w-auto"
              priority
            />
          )}

          {(!isCollapsed || hovered) && (
            <div className="flex-shrink-0">
              <Image
                src={touchtekLogo}
                alt="Touchtek"
                width={220}
                height={48}
                className="h-11 sm:h-14 object-contain"
                priority
              />
            </div>
          )}
        </Link>

        {sidebarType === "classic" && (!isCollapsed || hovered) && (
          <div className="flex-none lg:block hidden">
            <div
              onClick={() => setCollapsed(!storeCollapsed)}
              className={`h-4 w-4 border-[1.5px] border-default-900 dark:border-default-200 rounded-full transition-all duration-150 cursor-pointer ${
                storeCollapsed
                  ? ""
                  : "ring-2 ring-inset ring-offset-4 ring-default-900 bg-default-900 dark:ring-offset-default-300"
              }`}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarLogo;
