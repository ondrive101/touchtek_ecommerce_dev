"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import image from "@/public/images/avatar/avatar-6.jpg";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Menu } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

const MessageHeader = ({
  showInfo,
  handleShowInfo,
  profile,
  mblChatHandler,
  showChatId = false, // New prop with default value
  handleDeleteChat, // New prop for delete chat functionality
}) => {
  console.log('profile', profile)
  const session = useSession();
  const [showModal, setShowModal] = useState(false);
  let active = true;
  const isLg = useMediaQuery("(max-width: 1024px)");

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = () => {
    setShowModal(false);
    handleDeleteChat(profile?.chat?._id);
  };

  return (
    <>
       <DeleteConfirmationDialog
              open={showModal}
              onClose={() => handleClose()}
              onConfirm={() => handleSubmit()}
              defaultToast={false}
            />
    
    <div className="flex  items-center">
      <div className="flex flex-1 gap-3 items-center">
        {isLg && (
          <Menu
            className=" h-5 w-5 cursor-pointer text-default-600"
            onClick={mblChatHandler}
          />
        )}
        <div className="relative inline-block">
          <Avatar>
            <AvatarImage src={profile?.user?.image} alt="" />
            <AvatarFallback>{profile?.user?.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <Badge
            className=" h-3 w-3  p-0 ring-1 ring-border ring-offset-[1px]   items-center justify-center absolute left-[calc(100%-12px)] top-[calc(100%-12px)]"
            color={active ? "success" : "secondary"}
          ></Badge>
        </div>
        <div className="hidden lg:block">
          <div className="text-sm font-medium text-default-900 ">
            <span className="relative capitalize">{profile?.user?.name}</span>
            {showChatId && profile?.chat?.chatId && (
              <Badge variant="outline" className="ml-2 text-xs">
                ID: {profile?.chat?.chatId}
              </Badge>
            )}
          </div>
          <span className="text-xs text-default-500">
            {active ? "Active Now" : "Offline"}
          </span>
        </div>
      </div>
      <div className="flex-none space-x-2 rtl:space-x-reverse">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                className="bg-transparent rounded-full hover:bg-default-50"
                onClick={() => handleShowInfo(true, 'toggleChatId')}
              >
                <span className="text-xl text-primary">
                  <Icon icon="mdi:identifier" />
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end">
              <p>Toggle Chat ID</p>
              <TooltipArrow className="fill-primary" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                className="bg-transparent rounded-full hover:bg-default-50"
              >
                <span className="text-xl text-primary">
                  <Icon icon="solar:phone-linear" />
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end">
              <p>Start a voice call</p>
              <TooltipArrow className="fill-primary" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                className="bg-transparent rounded-full hover:bg-default-50"
              >
                <span className="text-xl text-primary">
                  <Icon icon="mdi:video-outline" />
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end">
              <p>Start a video call</p>
              <TooltipArrow className="fill-primary" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                className={cn(
                  "bg-transparent hover:bg-default-50 rounded-full",
                  {
                    "text-primary": !showInfo,
                  }
                )}
                onClick={handleShowInfo}
              >
                <span className="text-xl text-primary ">
                  {showInfo ? (
                    <Icon icon="material-symbols:info" />
                  ) : (
                    <Icon icon="material-symbols:info-outline" />
                  )}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end">
              <p>Conversation information</p>
              <TooltipArrow className="fill-primary" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                className="bg-transparent rounded-full hover:bg-default-50 hover:bg-red-100"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                <span className="text-xl text-red-500">
                  <Icon icon="mdi:delete-outline" />
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end">
              <p>Delete conversation</p>
              <TooltipArrow className="fill-red-500" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
    </>
  );
};

export default MessageHeader;
