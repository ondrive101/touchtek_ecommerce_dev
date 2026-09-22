"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  ChevronDown,
  ShoppingBag,
  MapPin,
  Lock,
  Store,
  LogOut,
} from "lucide-react";
import Link from "next/link";

const menuItems = [
  {
    name: "My Profile",
    icon: User,
    href: "/en/user/profile",
  },
  {
    name: "My Orders",
    icon: ShoppingBag,
    href: "/en/user/orders",
  },
  {
    name: "Delivery Address",
    icon: MapPin,
    href: "/en/user/address",
  },
  {
    name: "Change Password",
    icon: Lock,
    href: "/en/user/password",
  },
  {
    name: "Visit Store",
    icon: Store,
    href: "/en/products",
  },
];

const ProfileInfo = () => {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Account";
  const userSubtitle = session?.user?.department || session?.user?.role || "Customer";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full hover:bg-default-100 dark:hover:bg-default-800 transition-all border border-border/60 hover:border-border cursor-pointer select-none group outline-none"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 shadow-sm">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:flex flex-col text-left leading-none">
            <span className="text-xs font-semibold text-foreground capitalize max-w-[110px] truncate">
              {userName}
            </span>
            <span className="text-[10px] text-muted-foreground capitalize mt-0.5">
              {userSubtitle}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 hidden sm:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60 p-1.5 shadow-xl border border-border rounded-xl" align="end">
        {/* User Card Header */}
        <DropdownMenuLabel className="flex items-center gap-3 p-2.5 bg-default-50 dark:bg-default-900/50 rounded-lg mb-1">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-foreground truncate capitalize">
              {userName}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {session?.user?.email || `@${session?.user?.role || "customer"}`}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuGroup>
          {menuItems.map((item, index) => {
            const ItemIcon = item.icon;
            return (
              <Link href={item.href} key={`profile-menu-${index}`} className="block">
                <DropdownMenuItem className="flex items-center gap-2.5 text-xs font-medium text-default-700 dark:text-default-300 hover:text-foreground hover:bg-default-100 dark:hover:bg-default-800 px-2.5 py-2 rounded-lg cursor-pointer transition-colors">
                  <ItemIcon className="w-4 h-4 text-muted-foreground" />
                  <span>{item.name}</span>
                </DropdownMenuItem>
              </Link>
            );
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onSelect={() => signOut()}
          className="flex items-center gap-2.5 text-xs font-medium text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 px-2.5 py-2 rounded-lg cursor-pointer transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileInfo;
