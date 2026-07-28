import { SiteLogo, TouchtekLogo } from "@/components/svg";
import { useSidebar } from "@/store";
import logo from './logo-icon-black.png'
import touchtekLogo from './touchtek.png'
import Image from "next/image";
import React from "react";

const SidebarLogo = ({ hovered }) => {
  const { sidebarType, setCollapsed, collapsed } = useSidebar();
  return (
    <div className="h-14 flex items-center px-3">
      <div className="flex items-center justify-between w-full">
        <div className="h-11 flex items-center">
          {(collapsed && !hovered) && (
            <Image src={logo} alt="logo" className="object-contain h-11 w-auto" />
          )}

          {(!collapsed || hovered) && (
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
        </div>

        {sidebarType === "classic" && (!collapsed || hovered) && (
          <div className="flex-none lg:block hidden">
            <div
              onClick={() => setCollapsed(!collapsed)}
              className={`h-4 w-4 border-[1.5px] border-default-900 dark:border-default-200 rounded-full transition-all duration-150 cursor-pointer ${collapsed
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
