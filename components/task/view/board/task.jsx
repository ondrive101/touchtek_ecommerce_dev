"use client";
import React, { useTransition, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import avatar1 from "@/public/images/avatar/avatar-4.jpg";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import dayjs from "dayjs";
import {
  revalidateCurrentPath,
  updateTask,
} from "@/action/superadmin/controller";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Icon } from "@iconify/react";
import {
  Calendar,
  ChevronDown,
  Link,
  List,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Paperclip,
  MessageSquare,
  CheckSquare,
  PlayCircle,
  PauseCircle,
  Users,
  CalendarDays,
  Send,
  PlusCircle,
  AlertCircle,
  Edit,
} from "lucide-react";
import Image from "next/image";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import TaskView from "../view-task";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getWords, cn } from "@/lib/utils";

import { Textarea } from "@/components/ui/textarea";
// import AssignMembers from "./common/assign-members";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";

const prioritiesColorMap = {
  high: "success",
  low: "destructive",
  medium: "warning",
};

// dnd
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Task = ({ task, project, boards, session, refetchSprint }) => {
  const [open, setOpen] = React.useState(false);
  const [taskDetailOpen, setTaskDetailOpen] = React.useState(false);

  const [loading, setLoading] = React.useState(true);

  const [isPending, startTransition] = useTransition();
  const timerRef = React.useRef(null);
  const {
    taskId,
    name,
    description,
    priority,
    status,
    assignedTo,
    multipleAssignees,
    boardId,
    assignedEmployees,
    dueDate,
    image,
    createdAt,
    data,
    createdByDepartment,
    assignedToFull,
  } = task;


  // dnd
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: taskId,
    data: {
      type: "Task",
      task,
    },
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleSubmit = (type) => {
    startTransition(async () => {
      try {
        // Prepare the task data
        const taskData = {
          type: type,
          task,
          data: {},
        };

        // Call the API to create or update task
        const response = await updateTask(taskData, session);

        if (response.status === "success") {
          // Show success message
          toast.success(response.message, {
            duration: 1000,
          });

          setOpen(false);

          await refetchSprint();
        }
        if (response.status === "fail" || response.status === "error") {
          toast.error(response.message, {
            autoClose: 1000,
          });
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Something went wrong", {
          duration: 3000,
        });
      }
    });
  };

  // Clean up timer on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  const prioritiesColorMap = {
    high: "bg-red-500 text-white",
    medium: "bg-yellow-500 text-black",
    low: "bg-blue-500 text-white",
    urgent: "bg-rose-600 text-white",
  };

  return (
    <>
      <DeleteConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={() => handleSubmit("delete")}
        defaultToast={false}
      />

      <TaskView
        task={task}
        boards={boards}
        open={taskDetailOpen}
        setOpen={setTaskDetailOpen}
        project={project}
        session={session}
        refetchSprint={refetchSprint}
      />

      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          "shadow  border-default-200  p-3 cursor-pointer group relative",
          {
            "opacity-50": isDragging,
          }
        )}
        onClick={(e) => {
          e.stopPropagation();
          if (task?.type === "incoming") {
            setTaskDetailOpen(true);
          }
          if (task?.type === "outgoing") {
            setTaskDetailOpen(true);
          }
        }}
      >
        <CardHeader className="space-x-0 space-y-0 p-0 flex-row items-center justify-between mb-0 border-none">
          {/* left header */}
          <div className="flex items-center gap-1">
            <div className="text-[10px] leading-[14px] font-semibold uppercase text-default-600 flex items-center gap-1">
              <Badge className="text-[10px] px-1 py-0 rounded leading-4 capitalize">
                {task?.type}
              </Badge>
              {/* <Badge
                color={prioritiesColorMap[priority] || "default"}
                className="text-[10px] px-1 py-0 rounded leading-4 capitalize"
              >
                {priority}
              </Badge> */}
              <Badge
                className={cn(
                  "text-[10px] px-1 py-0 rounded leading-4 capitalize",
                  prioritiesColorMap[priority.toLowerCase()] ||
                    "bg-gray-300 text-black"
                )}
              >
                {priority}
              </Badge>
              <Badge
                color={
                  status === "completed"
                    ? "success"
                    : status === "pending"
                    ? "warning"
                    : "default"
                }
                className="text-[10px] px-1 py-0 rounded leading-4 capitalize"
              >
                {status}
              </Badge>
            </div>
          </div>

          {/* right header */}
          <div className="flex items-center gap-2">
            {session?.user?.id === task.createdByDepartment.employeeId && (
              <Icon
                icon="heroicons:pencil"
                className="h-4 w-4 cursor-pointer "
                onClick={(e) => {
                  e.stopPropagation();
                  if (task?.type === "incoming") {
                    setTaskDetailOpen(true);
                  }
                  if (task?.type === "outgoing") {
                    setTaskDetailOpen(true);
                  }
                }}
              />
            )}

            {session?.user?.id === task.createdByDepartment.employeeId && (
              <Icon
                icon="heroicons:trash"
                className="h-4 w-4 cursor-pointer "
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(true);
                }}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            <div className="text-sm font-semibold text-default-700 my-1 capitalize">
              {name}
            </div>
          </div>
          {/* <div className="text-[13px] text-default-500">{description}</div> */}
          <div className="mt-4 flex items-center gap-4">
            {assignedToFull?.length > 0 && (
              <AvatarGroup
                total={assignedToFull?.length}
                max={3}
                countClass="w-5 h-5"
              >
                {assignedToFull?.map((employee, i) => (
                  <TooltipProvider key={`assign-employee-task-${i}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="w-5 h-5 ring-1 ring-background ring-offset-[2px] ring-offset-background">
                          <AvatarImage src={avatar1?.src} alt="" />
                          <AvatarFallback>
                            {employee.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="py-[2px] px-1">
                        <p className="text-xs font-medium">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {employee.employeeCode}
                        </p>
                        <TooltipArrow className="fill-primary" />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </AvatarGroup>
            )}

            <div
              className="flex items-center gap-1 text-xs text-default-600 capitalize"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon
                icon="heroicons:user-group"
                className="w-3.5 h-3.5 text-default-500"
              />
              {task?.createdByDepartment?.employeeName}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-0 mt-2">
          <div className="w-full flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <div className="flex items-center gap-1 text-xs text-default-600">
                <Icon
                  icon="heroicons:clock"
                  className="w-3.5 h-3.5 text-default-500"
                />
                {new Date(createdAt).toLocaleDateString()}
              </div>

              {dueDate && dueDate !== "Invalid Date" && dueDate !== null && (
                <div className="flex items-center gap-1 text-xs text-default-600">
                  <Icon
                    icon="heroicons:calendar"
                    className="w-3.5 h-3.5 text-default-500"
                  />
                  {new Date(dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default Task;
