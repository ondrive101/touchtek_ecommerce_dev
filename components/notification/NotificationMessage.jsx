import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Eye } from "lucide-react";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  User,
  Users,
  Calendar,
  Flag,
  Clock,
  ArrowBigDown,
  Plus,
  MoveDown,
  MoveUp,
  Forward,
  Rss,
  Timer
} from "lucide-react";

import dayjs from "dayjs";

import { ScrollArea } from "@/components/ui/scroll-area";
function insertDateDividers(messagesRaw = []) {
  // Step 1: Normalize and parse all message timestamps
  const messages = messagesRaw?.map((msg) => {
    if (msg.isDateDivider) return msg; // already a divider
    const parsedTime = dayjs(msg.time, [
      "YYYY-MM-DD HH:mm:ss",
      "Today at HH:mm",
      "Yesterday at HH:mm",
      "HH:mm a",
    ]);
    return { ...msg, parsedTime };
  });

  // Step 2: Sort messages by date (latest first)
  messages?.sort((a, b) => {
    if (a.isDateDivider || b.isDateDivider) return 0;
    return b.parsedTime.valueOf() - a.parsedTime.valueOf();
  });

  // Step 3: Insert date dividers
  const finalMessages = [];
  let lastDateKey = null;

  for (const msg of messages) {
    if (msg.isDateDivider) continue;

    const time = msg.parsedTime;
    let dateLabel = "";

    if (time.isToday()) {
      dateLabel = "Today";
    } else if (time.isYesterday()) {
      dateLabel = "Yesterday";
    } else {
      dateLabel = time.format("MMMM D, YYYY");
    }

    if (dateLabel !== lastDateKey) {
      finalMessages.push({
        isDateDivider: true,
        content: dateLabel,
      });
      lastDateKey = dateLabel;
    }

    finalMessages.push({ ...msg });
  }

  return finalMessages;
}

export const NotificationBirthdayMessage = ({
  avatar,
  username,
  level,
  time,
  message,
  isModerator,
}) => {
  return (
    <article className="flex space-x-3">
      <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
        {typeof avatar === "string" ? (
          <img
            alt={`Profile avatar of ${username}`}
            className="w-full h-full object-cover"
            src={avatar}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#e0e7ff] text-[#2563eb] font-semibold text-sm">
            {username[0]}
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-[#334155]">{username}</h3>
          <span className="text-[10px] font-semibold text-[#94a3b8] bg-[#f1f5f9] rounded-md px-1.5 py-[1px]">
            LVL {level}
          </span>
          <time className="ml-auto text-[10px] text-gray-400 font-normal">
            {time}
          </time>
        </div>
        <p className="mt-1 leading-relaxed">{message}</p>
      </div>
    </article>
  );
};

export const NotificationTaskMessage = ({
  id,
  message,
  handleTaskClick,
  session,
  handleArchiveClick,
}) => {
  console.log("message", message);
  // console.log("key", id);
  // console.log("messageData", message?.data?.activity);
  // Normalize and merge activity + comment
  const unifiedMessages = [
    ...(message?.data?.activity || [])
      .filter((item) => item.source === "comment") // Only include activities with source === "comment"
      .map((item) => ({
        ...item,
        type: "activity",
      })),
    // ...(message?.data?.activity || [])
    // .filter((item) => item.source === "task") // Only include activities with source === "comment"
    // .map((item) => ({
    //   ...item,
    //   type: "task",
    // })),
  ];

  // console.log("unifiedMessages", unifiedMessages);

  // Sort and insert date dividers
  const timelineItems = insertDateDividers(unifiedMessages);

  const userBoardMap = message?.perUserBoardMap?.[session?.user?.id];
  const todoBoard = message?.project?.boards?.find((b) => b.name === "To-do");

  const taskType = message?.frequency;
  const history = message?.frequencyHistory?.[taskType]?.history;

  const todayHistory = history?.find((h) =>
    dayjs(h.date).isSame(dayjs(), "day")
  );

  // console.log("userBoardMap", userBoardMap);
  const handlePreviewFile = (fileUrl) => {
    // Open file in new tab for preview
    window.open(fileUrl, "_blank");
  };

  return (
    <div
      className="mt-2 bg-[#f8fafc] rounded-md border border-gray-200 p-2"
      // onClick={() => handleTaskClick(message)}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2 text-gray-500 text-xs">
          {message?.group?.title !== "Daily Task" && (
            <Badge className="bg-teal-500">
              <span className="capitalize cursor-pointer">
                {message?.group?.title}
              </span>
            </Badge>
          )}

          <Badge>
            <span className="capitalize cursor-pointer">
              {message?.project?.title}
            </span>
          </Badge>
          {message?.type === "incoming" ? (
            <MoveDown className="w-4 h-4 text-blue-500 flex-shrink-0" />
          ) : (
            <MoveUp className="w-4 h-4 text-blue-500 flex-shrink-0" />
          )}
          {/* <Plus className="w-5 h-5" /> */}
        </div>

        <div className="flex justify-between items-center gap-2">
        <Badge color="dark" variant="soft">Latest Update: {message?.latestCommentActivity?.action}: {message?.latestCommentActivity?.subType}</Badge>
          {id <= 5 && <Badge className="bg-teal-500 text-white">New</Badge>}

          <button
            className="flex items-center space-x-1 border border-gray-300 rounded-md px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            type="button"
          >
            <i className="far fa-folder-open"></i>
            <span onClick={() => handleArchiveClick(message)}>
              {userBoardMap?.archive ? "Unarchive" : "Archive"}
            </span>
          </button>
        </div>
      </div>
      <h3
        className="mt-2 font-bold text-xs text-[#1e293b] leading-tight uppercase"
        onClick={() => handleTaskClick(message)}
      >
        {message?.name}
      </h3>

      <div className="mt-4 space-y-4" onClick={() => handleTaskClick(message)}>
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 sm:gap-x-6 sm:gap-y-2 ">
            <div className="flex items-center gap-2 text-sm min-w-0">
              <User className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="font-semibold text-gray-900 truncate">
                {message?.creatorName}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm min-w-0">
              <Users className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="font-semibold text-gray-900 truncate">
                {message?.assignToFull?.name}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm min-w-0">
              <Calendar className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span className="font-semibold text-gray-900">
                {message?.dueDate ? (
                  dayjs(message.dueDate).format("MMM D, YYYY")
                ) : (
                  <span className="text-gray-500 italic">No due date</span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Flag
                className={`w-4 h-4 flex-shrink-0 ${
                  message?.priority === "high"
                    ? "text-red-500"
                    : message?.priority === "medium"
                    ? "text-yellow-500"
                    : "text-gray-400"
                }`}
              />
              <span className="font-medium capitalize">
                {message?.priority || "normal"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Timer
                className={`w-4 h-4 flex-shrink-0 ${
                  message?.priority === "high"
                    ? "text-red-500"
                    : message?.priority === "medium"
                    ? "text-yellow-500"
                    : "text-gray-400"
                }`}
              />
              <span className="font-medium capitalize">
                {message?.frequency === "one-time"
                  ? userBoardMap?.boardName
                  : todayHistory?.boardName ?? todoBoard?.name}
              </span>
            </div>

            {message?.forwardTo.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Forward
                  className={`w-4 h-4 flex-shrink-0 ${
                    message?.priority === "high"
                      ? "text-red-500"
                      : message?.priority === "medium"
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }`}
                />
                <AvatarGroup
                  max={3}
                  total={message?.forwardTo.length}
                  countClass="w-8 h-8"
                >
                  {message?.forwardTo.map((user, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="h-8 w-8 ring-1 ring-background ring-offset-[2px]  ring-offset-background">
                            <AvatarImage
                              src={
                                message?.employeeList?.find(
                                  (emp) =>
                                    emp.employeeCode === user.to?.employeeCode
                                )?.image
                              }
                            />
                            <AvatarFallback>AB</AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent color="primary">
                          <p>{user?.to?.name}</p>
                          <TooltipArrow className=" fill-primary" />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </AvatarGroup>
              </div>
            )}
            {message?.tag.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Rss className={`w-4 h-4 flex-shrink-0`} />
                <AvatarGroup
                  max={3}
                  total={message?.tag.length}
                  countClass="w-8 h-8"
                >
                  {message?.tag.map((empCode, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="h-8 w-8 ring-1 ring-background ring-offset-[2px]  ring-offset-background">
                            <AvatarImage
                              src={
                                message?.employeeList?.find(
                                  (emp) => emp.employeeCode === empCode
                                )?.image
                              }
                            />
                            <AvatarFallback>AB</AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent color="primary">
                          <p>
                            {
                              message?.employeeList?.find(
                                (emp) => emp.employeeCode === empCode
                              )?.name
                            }
                          </p>
                          <TooltipArrow className=" fill-primary" />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </AvatarGroup>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm min-w-0">
              <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="font-semibold text-gray-900 truncate">
                {message?.createdAt
                  ? dayjs(message.createdAt).fromNow()
                  : "Recently created"}
              </span>
            </div>
          </div>
        </div>

        {timelineItems.map((item, index) =>
          item.isDateDivider ? (
            <div
              key={`divider-${index}`}
              className="flex items-center gap-2 select-none text-[10px] text-gray-400 uppercase font-semibold my-3"
            >
              <div className="flex-1 border-t border-gray-300"></div>
              <span>{item.content}</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
          ) : item.type === "activity" ? (
            <div className="flex items-start space-x-3">
              <Avatar className="h-[32px] w-[32px]">
                <AvatarImage src={session?.user?.image} />
                <AvatarFallback>{session?.user?.name || "User"}</AvatarFallback>
              </Avatar>

              <div className="text-[10px] text-gray-600 flex-1">
                <p>
                  <strong className="text-[12px] text-[#1e293b]">
                    {item?.by?.name}
                  </strong>
                  <span className="ml-2 text-[11px] text-[#94a3b8]">
                    {dayjs(item?.time).format("dddd, MMMM D, YYYY h:mm A")}
                  </span>
                </p>
                <p className="text-[12px] font-semibold text-[#1e293b] mt-1 leading-tight">
                  {item?.action === "comment-audio" ||
                  item?.action === "delete-comment-audio" ? (
                    <audio
                      controls
                      src={item?.content?.audio?.file}
                      className="h-6 rounded-md w-full/2 mt-2"
                    />
                  ) : item?.action === "comment-image" ||
                    item?.action === "delete-comment-image" ? (
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mt-1">
                        {item?.content?.image?.file && (
                          <img
                            src={item?.content?.image?.file}
                            alt={item?.content?.image?.file}
                            className="w-28 h-28 object-cover rounded-lg border"
                          />
                        )}
                      </div>
                      <Eye
                        className="size-5 text-yellow-500 hover:text-yellow-600 cursor-pointer ml-2"
                        onClick={() =>
                          handlePreviewFile(item?.content?.image?.file)
                        }
                      />
                    </div>
                  ) : item?.action === "comment-text" ||
                    item?.action === "delete-comment-text" ? (
                    item?.content?.text
                  ) : (
                    ""
                  )}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* <p
                key={index}
                className="text-[10px] text-gray-600 leading-tight"
              >
                <strong>{item?.by?.name}</strong>
                {item?.action === "create-task"
                  ? " created task"
                  : item?.action === "edit-task"
                  ? " edited task"
                  : ""}
                <span className="ml-1 text-[9px] text-[#94a3b8]">
                  {dayjs(item?.time).format("dddd, MMMM D, YYYY h:mm A")}
                </span>
              </p> */}
            </>
          )
        )}
      </div>
    </div>
  );
};
