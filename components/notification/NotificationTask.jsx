import React, { useState } from "react";
import {
  NotificationBirthdayMessage,
  NotificationTaskMessage,
} from "./NotificationMessage";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import TaskView from "@/components/task/view/view-task";
import { updateTask } from "@/action/task/controller";
import { useTransition } from "react";

const NotificationMain = ({
  activeChannel,
  messages,
  setSelectedTask,
  setTaskDetailOpen,
  session,
  notificationRefetch
}) => {
  // State for navigation tabs
  const [activeTab, setActiveTab] = useState("notifications");
  const [activeSubTab, setActiveSubTab] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = React.useState(false);

  console.log("messages", messages);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  const handleArchiveClick = (task) => {
    startTransition(async () => {
      try {
        setLoading(true);
        // Prepare the task data
        const taskData = {
          type: "archive-Unarchive-Task",
          task: {
            _id: task._id,
            boardId: task.boardId,
            projectId: task.projectId,
          },
          data: {
            archive: true,
          },
        };



        // Call the API to create or update task
        const response = await updateTask(taskData, session);

        if (response.status === "success") {
          // Show success message
          toast.success("task updated successfully", {
            duration: 1000,
          });

          notificationRefetch();
          setLoading(false);
        }
        if (response.status === "fail" || response.status === "error") {
          toast.error(response.message, {
            autoClose: 1000,
          });
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Something went wrong", {
          duration: 3000,
        });
      }
    });
  };

// First filter by activeTab (notifications vs archive)
let filteredMessages = [];
if (activeTab === "notifications") {
  filteredMessages = messages?.filter((msg) => {
    const userBoardMap = msg.perUserBoardMap?.[session?.user?.id];
    
    // For tagged users, they might not have perUserBoardMap entry
    if (msg.user === "tagged") {
      // Tagged messages are shown in notifications unless explicitly archived
      return !userBoardMap || userBoardMap.archive === false || userBoardMap.archive === undefined;
    }
    
    if (userBoardMap) {
      return userBoardMap.archive === false || userBoardMap.archive === undefined;
    }
    return false; // Handle case where userBoardMap doesn't exist for non-tagged users
  });
} else if (activeTab === "archive") {
  filteredMessages = messages?.filter((msg) => {
    const userBoardMap = msg.perUserBoardMap?.[session?.user?.id];
    
    // For tagged users, only show if explicitly archived
    if (msg.user === "tagged") {
      return userBoardMap && userBoardMap.archive === true;
    }
    
    if (userBoardMap) {
      return userBoardMap.archive === true;
    }
    return false; // Handle case where userBoardMap doesn't exist
  });
} else {
  // Default case - show all messages
  filteredMessages = messages;
}

// Then filter by activeSubTab (all, assignTo, creator, tagged)
if (activeSubTab !== "all") {
  filteredMessages = filteredMessages.filter((msg) => msg.user === activeSubTab);
}

console.log("filteredMessages", filteredMessages);
  return (
    <div className="flex-1 flex flex-col border-r border-gray-200 px-6 py-4 space-y-1 text-sm text-[#334155] h-full md:h-auto">
      {/* Top Tabs */}
      <nav className="flex space-x-6 border-b border-gray-300 pb-3 text-sm font-semibold text-[#1e293b]">
        <button
          onClick={() => setActiveTab("notifications")}
          className={`pb-1 transition-colors duration-200 ${
            activeTab === "notifications"
              ? "border-b-2 border-black bg-gray-50 px-3 py-1 rounded-t-md"
              : "text-gray-600 font-normal hover:text-[#1e293b] hover:bg-gray-50 px-3 py-1 rounded-md"
          }`}
        >
          Notifications
        </button>
        {/* <button
          onClick={() => setActiveTab("activity")}
          className={`pb-1 transition-colors duration-200 ${
            activeTab === "activity"
              ? "border-b-2 border-black bg-gray-50 px-3 py-1 rounded-t-md"
              : "text-gray-600 font-normal hover:text-[#1e293b] hover:bg-gray-50 px-3 py-1 rounded-md"
          }`}
        >
          All activity
        </button> */}
        <button
          onClick={() => setActiveTab("archive")}
          className={`pb-1 transition-colors duration-200 ${
            activeTab === "archive"
              ? "border-b-2 border-black bg-gray-50 px-3 py-1 rounded-t-md"
              : "text-gray-600 font-normal hover:text-[#1e293b] hover:bg-gray-50 px-3 py-1 rounded-md"
          }`}
        >
          Archive
        </button>
      </nav>

      {/* Sub Tabs */}
      <div className="flex items-center space-x-6 border-b border-gray-300 mt-3 pb-3 text-xs text-gray-600">
        <button
          onClick={() => setActiveSubTab("all")}
          className={`font-normal transition-colors duration-200 ${
            activeSubTab === "all"
              ? "bg-[#e0e7ff] text-[#4338ca] rounded px-3 py-1"
              : "text-[#1e293b] hover:underline hover:bg-gray-100 px-3 py-1 rounded"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveSubTab("assignTo")}
          className={`font-normal transition-colors duration-200 ${
            activeSubTab === "assignTo"
              ? "bg-[#e0e7ff] text-[#4338ca] rounded px-3 py-1"
              : "text-[#1e293b] hover:underline hover:bg-gray-100 px-3 py-1 rounded"
          }`}
        >
          Assigned to me
        </button>
        <button
          onClick={() => setActiveSubTab("creator")}
          className={`font-normal transition-colors duration-200 ${
            activeSubTab === "creator"
              ? "bg-[#e0e7ff] text-[#4338ca] rounded px-3 py-1"
              : "text-[#1e293b] hover:underline hover:bg-gray-100 px-3 py-1 rounded"
          }`}
        >
          Created by me
        </button>
        <button
          onClick={() => setActiveSubTab("tagged")}
          className={`font-normal transition-colors duration-200 ${
            activeSubTab === "tagged"
              ? "bg-[#e0e7ff] text-[#4338ca] rounded px-3 py-1"
              : "text-[#1e293b] hover:underline hover:bg-gray-100 px-3 py-1 rounded"
          }`}
        >
          @Mentioned
        </button>
        <div className="flex-grow"></div>
        
      </div>

      {/* Notification Card */}
      <ScrollArea className="p-2 h-[60vh] md:h-[calc(100vh-150px)]">
        {filteredMessages?.sort((a, b) => {
  return dayjs(b.latestCommentActivity?.time).diff(dayjs(a.latestCommentActivity?.time));
}).map((message, index) => (
          <NotificationTaskMessage
            key={index}
            id={index+1}
            message={message}
            handleTaskClick={handleTaskClick}
            handleArchiveClick={handleArchiveClick}
            session={session}
          />
        ))}
      </ScrollArea>
    </div>
  );
};

export default NotificationMain;
