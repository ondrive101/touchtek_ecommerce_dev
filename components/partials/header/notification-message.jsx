import { Bell } from "@/components/svg";
import avatar2 from "@/public/images/avatar/avatar-2.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import Notification from "@/components/notification";
dayjs.extend(isSameOrBefore);
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import shortImage from "@/public/images/all-img/short-image-2.png";
import { getEmployeeList } from "@/action/reqQ/controller";
import { useSession } from "next-auth/react";
import { notifications } from "./notification-data";



const NotificationMessage = () => {
  const [employeesBirthday, setEmployeesBirthday] = useState([]);
  const session = useSession();

  const {
    data: employeeData,
    isLoading: employeeLoading,
    error: employeeError,
  } = useQuery({
    queryKey: ["employee-Query", session?.data],
    queryFn: () => getEmployeeList(session?.data),
    enabled: !!session?.data,
  });

  const getBirthdayEmployee = (daysAhead = 5) => {
    const today = dayjs().startOf("day");
    const endDate = today.add(daysAhead, "day");

    return employeesBirthday?.data?.filter((employee) => {

      const dob = dayjs(employee.dateOfBirth);
      let birthdayThisYear = dayjs(`${today.year()}-${dob.format("MM-DD")}`);
      if (dob.format("MM-DD") === "02-29" && !dayjs().isLeapYear()) {
        birthdayThisYear = dayjs(`${today.year()}-03-01`);
      }

      return (
        birthdayThisYear.isSame(today, "day") ||
        (birthdayThisYear.isAfter(today, "day") &&
          birthdayThisYear.isSameOrBefore(endDate, "day"))
      );
    }) || [];
  };

  useEffect(() => {
    if (Array.isArray(employeeData?.data)) {
      setEmployeesBirthday(employeeData);
    } else {
      setEmployeesBirthday([]);
    }
  }, [employeeData]);

  const birthdayEmployees = useMemo(() => getBirthdayEmployee(18), [employeesBirthday]);
  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="relative md:h-9 md:w-9 h-8 w-8 hover:bg-default-100 dark:hover:bg-default-200 
        data-[state=open]:bg-default-100  dark:data-[state=open]:bg-default-200 
         hover:text-primary text-default-500 dark:text-default-800  rounded-full  "
      >
        <Bell className="h-5 w-5 " />
        <Badge className=" w-4 h-4 p-0 text-xs  font-medium  items-center justify-center absolute left-[calc(100%-18px)] bottom-[calc(100%-16px)] ring-2 ring-primary-foreground">
          5
        </Badge>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      className=" z-[999] mx-4 lg:w-[412px] p-0"
    >
      <DropdownMenuLabel
        style={{ backgroundImage: `url(${shortImage.src})` }}
        className="w-full h-full bg-cover bg-no-repeat p-4 flex items-center"
      >
        <span className="text-base font-semibold text-white flex-1">
          Notification
        </span>
        <span className="text-xs font-medium text-white flex-0 cursor-pointer hover:underline hover:decoration-default-100 dark:decoration-default-900">
          Mark all as read{" "}
        </span>
      </DropdownMenuLabel>
      <div className="h-[300px] xl:h-[350px]">
        <ScrollArea className="h-full">
          {birthdayEmployees?.map((employee, index) => (
            <DropdownMenuItem
              key={`inbox-${index}`}
              className="flex gap-9 py-2 px-4 cursor-pointer dark:hover:bg-background"
            >
              <div className="flex-1 flex items-center gap-2">
                <Avatar className="h-10 w-10 rounded">
                  <AvatarImage src={avatar2.src} />
                  <AvatarFallback>SN</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-default-900 mb-[2px] whitespace-nowrap">
                    {employee.name}
                  </div>
                  <div className="text-xs text-default-900 truncate max-w-[100px] lg:max-w-[185px]">
                    Employee Birthday 🎂
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  "text-xs font-medium text-default-900 whitespace-nowrap"
                )}
              >
                {dayjs(employee.dateOfBirth).format("MMM-DD")}
              </div>
              <div
                className={cn("w-2 h-2 rounded-full mr-2")}
              ></div>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </div>
      <DropdownMenuSeparator />
      <div className="m-4 mt-5">
        <Button asChild type="text" className="w-full">
          <Link href="/dashboard">View All</Link>
        </Button>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
  );
};

export default NotificationMessage;