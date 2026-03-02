"use client";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";
import avatar1 from "@/public/images/avatar/avatar-7.jpg";
import Image from "next/image";
import Link from "next/link";

const ProfileInfo = () => {
  const { data: session } = useSession();
  console.log('session', session)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className=" cursor-pointer">
        <div className=" flex items-center gap-x-3 ">
      
            <Image
              src={session?.user?.image || avatar1}
              alt={session?.user?.name ?? ""}
              width={27}
              height={27}
              className="rounded-full"
            />
            <div className="hidden sm:flex flex-col">
  <span className="text-sm font-semibold text-foreground capitalize">
    {session?.user?.name}
  </span>
  <span className="text-xs text-muted-foreground">
    {session?.user?.department}
  </span>
</div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-0" align="end">
        <DropdownMenuLabel className="flex gap-2 items-center mb-1 p-3">
     
            <Image
              src={session?.user?.image || avatar1}
              alt={session?.user?.name ?? ""}
              width={36}
              height={36}
              className="rounded-full"
            />
    
          <div>
            <div className="text-sm font-medium text-default-800 capitalize ">
              {session?.user?.name ?? "Mcc Callem"}
            </div>
            <Link
              href="#"
              className="text-xs text-default-600 hover:text-primary"
            >
             @{session?.user?.role}
            </Link>
          </div>
        </DropdownMenuLabel>
         <DropdownMenuSeparator className="mb-0 dark:bg-background" />
        <DropdownMenuGroup>
          {[
            {
              name: "profile",
              icon: "heroicons:user",
              href:"/en/user/profile"
            },
             {
              name: "change password",
              icon: "heroicons:user",
              href:"/en/user/password"
            },
            {
              name: "delivery address",
              icon: "heroicons:user",
              href:"/en/user/address"
            },
      
      
        
          ].map((item, index) => (
            <Link
              href={item.href}
              key={`info-menu-${index}`}
              className="cursor-pointer"
            >
              <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 dark:hover:bg-background cursor-pointer">
                <Icon icon={item.icon} className="w-4 h-4" />
                {item.name}
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuGroup>
     
        <DropdownMenuSeparator className="mb-0 dark:bg-background" />
        <DropdownMenuItem
          onSelect={() => signOut()}
          className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize my-1 px-3 dark:hover:bg-background cursor-pointer"
        >
          <Icon icon="heroicons:power" className="w-4 h-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ProfileInfo;
