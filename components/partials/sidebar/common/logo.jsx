import { SiteLogo, TouchtekLogo } from "@/components/svg";
import { useSidebar } from "@/store";
import logo from './logo.png';
import touchtek from './touchtek.png';
import Image from "next/image";
import Link from "next/link"; // ✅ Import Link
import React from "react";

const SidebarLogo = ({ hovered }) => {
  const { sidebarType, setCollapsed, collapsed } = useSidebar();

  return (
    <div className="px-4 py-4">
      <div className="flex items-start">
        
        {/* ✅ Wrap logo with Link */}
        <Link href="/en" className="h-8 w-auto">
          <div className="h-8 w-auto">
            {(collapsed && !hovered) && (
              <Image src={logo} alt="logo" className="object-contain h-8 w-auto" />
            )}
            {(!collapsed || hovered) && (
              <Image src={touchtek} alt="logo" className="object-contain h-6 w-auto" />
            )}
          </div>
        </Link>

        {sidebarType === "classic" && (!collapsed || hovered) && (
          <div className="flex-none lg:block hidden">
            <div
              onClick={() => setCollapsed(!collapsed)}
              className={`h-4 w-4 border-[1.5px] border-default-900 dark:border-default-200 rounded-full transition-all duration-150
                ${collapsed
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