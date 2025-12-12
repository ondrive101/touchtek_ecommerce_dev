import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

import NotificationSidebar from "./NotificationSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import NotificationTask from "./NotificationTask";
import { useMediaQuery } from "@/hooks/use-media-query";
import NotificationPracticeBox from "./NotificationPracticeBox";
import { cn } from "@/lib/utils";
import TaskView from "@/components/task/view/view-task";
import { getNotificationMessages } from "@/action/reqQ/controller";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { Bell } from "@/components/svg";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { useQuery } from "@tanstack/react-query";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

const Notification = () => {
  const [open, setOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState("tasks");
  const [activeChannelMessages, setActiveChannelMessages] = useState([]);
  const [taskDetailOpen, setTaskDetailOpen] = React.useState(false);
  const [showContactSidebar, setShowContactSidebar] = useState(false);
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [taskCount, setTaskCount] = React.useState(0);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  console.log('selectedTask', selectedTask)
  const channels = [
    { id: "tasks", name: "#Tasks", icon: "fas fa-hashtag" },
    { id: "birthdays", name: "#Birthdays", icon: "fas fa-hashtag" },
    { id: "announcements", name: "Announcements", icon: "fas fa-hashtag" },
  ];
  const session = useSession();
  const isLg = useMediaQuery("(max-width: 1024px)");
  const onClose = () => {
    setOpen(false);
  };

  // console.log('session in notification', session)

  const {
    data: notificationData,
    isLoading: notificationLoading,
    error: notificationError,
    refetch: notificationRefetch,
  } = useQuery({
    queryKey: ["notification-Query", activeChannel, session?.data?.user?.email],
    queryFn: () => getNotificationMessages(activeChannel, session?.data),
    enabled: !!session?.data,
  });

  useEffect(() => {
    if (notificationData) {
      setActiveChannelMessages(notificationData?.data);
      // console.log('messages received', notificationData?.data)

      const filteredMessages = notificationData?.data?.filter((msg) => {
        const userBoardMap = msg.perUserBoardMap?.[session?.data?.user?.id];

        // For tagged users, they might not have perUserBoardMap entry
        if (msg.user === "tagged") {
          // Tagged messages are shown in notifications unless explicitly archived
          return (
            !userBoardMap ||
            userBoardMap.archive === false ||
            userBoardMap.archive === undefined
          );
        }

        if (userBoardMap) {
          return (
            userBoardMap.archive === false || userBoardMap.archive === undefined
          );
        }
        return false; // Handle case where userBoardMap doesn't exist for non-tagged users
      });

      setTaskCount(filteredMessages?.length);
    }
  }, [notificationData]);

  const handleChannelChange = (channelId) => {
    setActiveChannel(channelId);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative md:h-9 md:w-9 h-8 w-8 hover:bg-default-100 dark:hover:bg-default-200 
                data-[state=open]:bg-default-100  dark:data-[state=open]:bg-default-200 
                 hover:text-primary text-default-500 dark:text-default-800  rounded-full  "
              onClick={() => {
                setOpen(true);
                notificationRefetch();
              }}
            >
              <Bell className="h-4 w-4 " />
              <Badge className=" w-3 h-3 p-0 text-xs  font-medium  items-center justify-center absolute left-[calc(100%-18px)] bottom-[calc(100%-16px)] ring-2 ring-primary-foreground">
                {taskCount}
              </Badge>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <TooltipArrow className="fill-primary" />
            <p>Notification</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent size="full">
          <div className="flex gap-5">
            {isLg && showContactSidebar && (
        <div
          className=" bg-background/60 backdrop-filter
         backdrop-blur-sm absolute w-full flex-1 inset-0 z-[99] rounded-md"
        ></div>
      )}
            <div
              className={cn("transition-all duration-150 flex-none  ", {
                "absolute h-full top-0 md:w-[260px] w-[200px] z-[999]": isLg,
                "flex-none min-w-[260px]": !isLg,
                "left-0": isLg && showContactSidebar,
                "-left-full": isLg && !showContactSidebar,
              })}
            >
              <Card className="h-[95%] pb-0">
                {/* <CardHeader className="border-none pb-0 mb-0">
            <MyProfileHeader contacts={contacts} />
          </CardHeader> */}
                <CardContent className="pt-0 px-0   lg:h-[calc(100%-170px)] h-[calc(100%-70px)]">
                  <ScrollArea className="h-full p-2">
                    <div className="flex items-center mb-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative md:h-9 md:w-9 h-8 w-8 hover:bg-default-100 dark:hover:bg-default-200 
                          data-[state=open]:bg-default-100  dark:data-[state=open]:bg-default-200 
                           hover:text-primary text-default-500 dark:text-default-800  rounded-full  "
                      >
                        <Bell className="h-5 w-5 " />
                      </Button>
                      <h2 className="ml-3 text-sm font-semibold text-gray-900">
                        Notifications
                      </h2>
                    </div>

                    <nav className="flex flex-col text-xs font-semibold text-[#94a3b8] space-y-2 mb-8 select-none">
                      <div className="uppercase tracking-widest text-[9px] font-semibold text-[#94a3b8] mb-2">
                        Informations
                      </div>
                      {channels.map((channel) => (
                        <button
                          key={channel.id}
                          onClick={() => handleChannelChange(channel.id)}
                          className={`flex items-center space-x-2 px-2 py-1 rounded-md ${
                            activeChannel === channel.id
                              ? "bg-[#e0e7ff] text-[#2563eb]"
                              : "hover:bg-gray-100"
                          }`}
                          type="button"
                        >
                          <i className={channel.icon + " text-xs"}></i>
                          <span>{channel.name}</span>
                        </button>
                      ))}
                    </nav>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {activeChannel === "tasks" && (
              <div className="flex-1 h-[calc(95%)]">
                <div className=" flex space-x-5 h-full">
                  <div className="flex-1">
                    <Card className="h-full flex flex-col ">
                      <CardContent className="!p-6 relative flex-1">
                        <NotificationTask
                          activeChannel={activeChannel}
                          messages={activeChannelMessages}
                          setSelectedTask={setSelectedTask}
                          setTaskDetailOpen={setTaskDetailOpen}
                          session={session?.data}
                          notificationRefetch={notificationRefetch}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* <div className="w-full h-full bg-white rounded-2xl flex flex-col md:flex-row shadow-lg overflow-hidden">
            <NotificationSidebar
              activeChannel={activeChannel}
              onChannelChange={handleChannelChange}
            />

            {activeChannel === "tasks" && (
              <NotificationTask
                activeChannel={activeChannel}
                messages={activeChannelMessages}
                setSelectedTask={setSelectedTask}
                setTaskDetailOpen={setTaskDetailOpen}
                session={session?.data}
                notificationRefetch={notificationRefetch}
              />
            )}
          </div> */}
        </DialogContent>

        <TaskView
          task={selectedTask}
          open={taskDetailOpen}
          setOpen={setTaskDetailOpen}
          project={selectedTask?.project}
          session={session?.data}
          refetchSprint={notificationRefetch}
        />
      </Dialog>
    </>
  );
};

export default Notification;
