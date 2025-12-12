"use client";
import React, { useTransition } from "react";
import { useState } from "react";
import TaskView from "../view-task";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { ChevronDown, Plus, Trash2, X, } from "lucide-react";
import { CircularProgress, Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import avatar1 from "@/public/images/avatar/avatar-4.jpg";
import Attachments from "./attachments";
import AddReminder from "./add-reminder";
import SetTarget from "./set-target";
import Forward from "./forward";
import Members from "./members";
import Followers from "./followers";
const prioritiesColorMap = {
  high: "bg-red-500 text-white hover:bg-red-600",
  medium: "bg-yellow-500 text-black hover:bg-yellow-600",
  low: "bg-blue-500 text-white hover:bg-blue-600",
  urgent: "bg-rose-600 text-white hover:bg-rose-600",
};
const statusColorMap = {
  completed: "bg-emerald-600 text-white hover:bg-emerald-600",     // ✅ success/complete
  "to-do": "bg-amber-400 text-black hover:bg-amber-500",          // ⏳ upcoming/to-do
  "in-progress": "bg-sky-500 text-white hover:bg-sky-600",      // 🔄 active work
  verified: "bg-purple-600 text-white hover:bg-purple-600",        // ✅ verified/approved
};
const typeColorMap = {
  incoming: "bg-emerald-600 text-white hover:bg-emerald-600",     // ✅ success/complete
  outgoing: "bg-amber-400 text-black hover:bg-amber-500",          // ⏳ upcoming/to-do
};

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  revalidateCurrentPath,
  updateTask,
  addTaskFile,
  getDepartmentEmployees,
} from "@/action/task/controller";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import dayjs from "dayjs";

const TaskTable = ({
  tasks,
  columns,
  handleTaskClick,
  refetchSprint,
  onUpdateTask,
  project,
  session,
  departmentEmployees,
}) => {
  const [editingCell, setEditingCell] = useState(null); // Track which cell is being edited
  const [editValue, setEditValue] = useState(""); // Store the current input value
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = React.useState(false);
  console.log('tasksss', tasks)

  const startEditing = (taskId, columnKey, initialValue) => {
    setEditingCell({ taskId, columnKey });
    setEditValue(initialValue || "");
  };

  const stopEditing = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const handleSave = (taskId, columnKey, value) => {
    stopEditing();
  };

  // Save edited task data
  const handleSaveEditTask = (task, editedTask) => {
    startTransition(async () => {
      try {
        setLoading(true);
        // Prepare the task data
        const taskData = {
          type: "editTask",
          task: {
            _id: task._id,
            boardId: task.boardId,
            projectId: task.projectId,
          },
          data: {
            ...editedTask,
          },
        };

        // console.log("payload", taskData);

        // Call the API to create or update task
        const response = await updateTask(taskData, session);

        if (response.status === "success") {
          // Show success message
          toast.success("task updated successfully", {
            duration: 1000,
          });

          refetchSprint();
          stopEditing();
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

  // const handleSubmit = (type) => {
  //   startTransition(async () => {
  //     try {
  //       // Prepare the task data
  //       const taskData = {
  //         type: type,
  //         task,
  //         data: {},
  //       };

  //       // Call the API to create or update task
  //       const response = await updateTask(taskData, session);

  //       if (response.status === "success") {
  //         // Show success message
  //         toast.success(response.message, {
  //           duration: 1000,
  //         });

  //         setOpen(false);

  //         await refetchSprint();
  //       }
  //       if (response.status === "fail" || response.status === "error") {
  //         toast.error(response.message, {
  //           autoClose: 1000,
  //         });
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       toast.error(error.message || "Something went wrong", {
  //         duration: 3000,
  //       });
  //     }
  //   });
  // };

  return (
    <>
      {/* <DeleteConfirmationDialog
            open={open}
            onClose={() => setOpen(false)}
            loading={loading}
            onConfirm={() => handleSubmit("delete")}
            defaultToast={false}
          /> */}
      {tasks.map((task, index) => (
        <TableRow key={index} className="!p-0 text-sm">
          {columns.map((column) => {
            const key = column?.columnDef?.accessorKey;

            const userForward = task.forwardTo.find(
              (forwardTo) => forwardTo.to.employeeCode === session.user.id
            );
            const userBoardMap = task.perUserBoardMap?.[session.user.id];
            let cellValue;

            // Check if the current cell is being edited
            const isEditing =
              editingCell?.taskId === task._id &&
              editingCell?.columnKey === key;

            // Handle nested access and rendering of editable fields
            switch (key) {
              case "name":
                cellValue = (
                  <div
                    className={cn(
                  " flex items-center gap-2 cursor-pointer p-2",
                  task?.data?.activity.length <= 1 ? "bg-red-200" : ""
                )}
                    onClick={() => handleTaskClick(task)}
                  >
                    <Checkbox  defaultChecked color={task?.data?.activity.length > 1 ? "success" : "destructive"} radius="xl" disabled/>
                    <div
                      className="flex items-center gap-2 sticky left-0 z-10 font-medium capitalize cursor-pointer"
                      onClick={() => handleTaskClick(task)}
                    >
                      {task.name}
                    </div>
                  </div>
                );
                break;
              case "createdBy":
                cellValue = (
                  <div className="flex items-center gap-2 justify-center">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={project?.employees?.find((emp) => emp.employeeCode === task?.createdByDepartment?.employeeId)?.image} />
                      <AvatarFallback className="capitalize">
                        {task.createdByDepartment?.employeeName?.charAt(0) ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium capitalize cursor-pointer">
                      {/* {task.createdByDepartment?.employeeName} */}
                      {userForward
                        ? userForward?.by?.name
                        : task.createdByDepartment?.employeeName}
                    </span>
                  </div>
                );
                break;
              case "department by":
                cellValue = task.createdByDepartment ? (
                  <span className="capitalize cursor-pointer">
                    {task.createdByDepartment.departmentName}
                  </span>
                ) : (
                  "----"
                );
                break;
              case "department to":
                  cellValue = (
                    <span className="capitalize cursor-pointer">
                      Employee
                    </span>
                  );
                  break;
              case "assigned to":
                cellValue = (
                  <Popover>
                    <PopoverTrigger>
                      <div className="flex items-center gap-2 cursor-pointer justify-center">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={project?.employees?.find((emp) => emp.employeeCode === task?.assignedToFull[0]?.employeeCode)?.image} />
                          <AvatarFallback className="capitalize">
                            {task?.assignedToFull[0]?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        {task?.group?.title === "Personal" ? (
                          <span className="font-medium capitalize">
                            {userForward
                              ? userForward?.to?.name
                              : task.createdByDepartment?.employeeName}
                          </span>
                        ) : (
                          <span className="font-medium capitalize">
                            {userForward
                              ? userForward?.to?.name
                              : task.assignedToFull[0]?.name}
                          </span>
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <div className="flex justify-between items-center bg-default-50  border-b border-default-300 px-3 py-2">
                        <div className=" text-sm font-medium text-default-900 ">
                          Assign To
                        </div>
                        <PopoverClose>
                          <Button
                            type="button"
                            size="icon"
                            className="w-6 h-6 bg-default-400 rounded-full"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </PopoverClose>
                      </div>
                      <Command>
                        <div className="p-2">
                          <CommandInput
                            placeholder="Search By Name..."
                            inputWrapper="border border-default-200 rounded-md"
                            className="h-9"
                          ></CommandInput>
                        </div>
                        <CommandList className="max-h-[200px] ">
                        <CommandEmpty>No new members.</CommandEmpty>
                        <CommandGroup>
                          {departmentEmployees?.map((item, index) => (
                            <CommandItem
                              key={`assigned-members-${index}`}
                              value={item.name}
                              onSelect={() =>
                                handleSaveEditTask(task, {
                                  assignedTo: {
                                    employeeCode: item.employeeCode,
                                    name: item.name,
                                  },
                                })
                              }
                              className="gap-2"
                            >
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={project?.employees?.find((emp) => emp.employeeCode === item?.employeeCode)?.image} />
                                <AvatarFallback>SN</AvatarFallback>
                              </Avatar>
                              <span className="font-base capitalize text-default-900">
                                {item.name}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                );
                break;
              case "dueDate":
                cellValue = isEditing ? (
                  <Input
                    type="datetime-local"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() =>
                      handleSaveEditTask(task, { dueDate: editValue })
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter")
                        handleSaveEditTask(task, { dueDate: editValue });
                    }}
                    autoFocus
                    className="w-full"
                  />
                ) : (
                  <div className="flex items-center gap-2 cursor-pointer justify-center">
                  <span
                    onClick={() =>
                      startEditing(
                        task._id,
                        key,
                        task.dueDate
                          ? dayjs(task.dueDate).format("YYYY-MM-DDTHH:mm")
                          : ""
                      )
                    }
                  >
                    <div className="flex items-center gap-2 cursor-pointer">
                      {task.dueDate
                        ? dayjs(task.dueDate).format("DD-MM-YYYY hh:mm A")
                        : "----"}
                    </div>
                  </span>
                  </div>
                );
                break;
              case "reminder":
                cellValue = (
                  <div className="flex items-center gap-2 cursor-pointer justify-center">
                    {userBoardMap?.reminders?.[0]?.dateTime
                      ? dayjs(userBoardMap?.reminders?.[0]?.dateTime).format(
                          "DD-MM-YYYY hh:mm A"
                        )
                      : "----"}
                    <AddReminder
                      task={task}
                      session={session}
                      refetchSprint={refetchSprint}
                    />
                  </div>
                );
                break;
              case "priority":
                cellValue = (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        // variant="soft"
                        className={cn(
                          "flex items-center gap-1 text-sm font-medium  h-6 whitespace-nowrap cursor-pointer",
                          prioritiesColorMap[task.priority.toLowerCase()] ||
                            "bg-gray-300 text-black"
                        )}
                      >
                        {task.priority}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[50px]" align="start">
                      {["high", "medium", "low", "urgent"]?.map((priority) => (
                        <DropdownMenuItem
                          onSelect={() => {
                            handleSaveEditTask(task, { priority });
                          }}
                          className="text-[10px] leading-[14px] font-semibold  text-default-600 py-1"
                          key={`key-dropdown-${priority}`}
                        >
                          {priority}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
                break;
              case "status":
                const userBoardId =
                  task.perUserBoardMap?.[session?.user.id]?.boardId ||
                  task.boardId;
                const currentBoard = project?.boards?.find(
                  (b) => b.boardId === userBoardId
                );
                const taskType = task?.frequency;
                const history = task?.frequencyHistory?.[taskType]?.history;
                const todoBoard = project?.boards?.find((b) => b.name === 'To-do');
                const todayHistory = history?.find((h) => dayjs(h.date).isSame(dayjs(), 'day'));
                const boardName = taskType === "one-time"
                  ? currentBoard.name
                  : todayHistory?.boardName ?? todoBoard?.name;
                cellValue = (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        // variant="soft"
                        className={cn(
                          "flex items-center gap-1 text-sm font-medium  h-6 whitespace-nowrap cursor-pointer",
                          statusColorMap[boardName.toLowerCase()] ||
                            "bg-gray-300 text-black"
                        )}
                        
                      >
                        {taskType === "one-time"
                          ? currentBoard.name
                          : todayHistory?.boardName ?? todoBoard?.name}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[50px]" align="start">
                      {project?.boards?.map((board) => (
                        <DropdownMenuItem
                          onSelect={() => {
                            handleSaveEditTask(task, {
                              boardId: board.boardId,
                            });
                          }}
                          className="text-[10px] leading-[14px] font-semibold  text-default-600 py-1"
                          key={`key-dropdown-${board}`}
                        >
                          {board?.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
                break;
              case "frequency":
                cellValue = (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        className="flex items-center gap-1 text-sm font-medium  h-6 whitespace-nowrap cursor-pointer"
                      >
                        {task.frequency}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[50px]" align="start">
                      {["one-time", "daily", "weekly", "monthly", "yearly"]?.map(
                        (frequency) => (
                          <DropdownMenuItem
                            onSelect={() => {
                              handleSaveEditTask(task, { frequency });
                            }}
                            className="text-[10px] leading-[14px] font-semibold  text-default-600 py-1"
                            key={`key-dropdown-${frequency}`}
                          >
                            {frequency}
                          </DropdownMenuItem>
                        )
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
                break;
              case "forward to":
                cellValue = (
                  <div className="flex items-center gap-3 cursor-pointer justify-center ">
                    <AvatarGroup
                      max={3}
                      total={task.forwardTo.length}
                      countClass="w-8 h-8"
                    >
                      {task.forwardTo.map((user, index) => (
                        <TooltipProvider key={index}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Avatar className="h-8 w-8 ring-1 ring-background ring-offset-[2px]  ring-offset-background">
                                <AvatarImage src={project?.employees?.find((emp) => emp.employeeCode === user.to?.employeeCode)?.image} />
                                <AvatarFallback>AB</AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent color="primary">
                              <p>{user.to?.name}</p>
                              <TooltipArrow className=" fill-primary" />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </AvatarGroup>

                    <Popover>
                      <PopoverTrigger>
                        <Button
                          type="button"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                        >
                          <Icon
                            icon="heroicons:user-plus"
                            className="w-5 h-5 text-white"
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <div className="flex justify-between items-center bg-default-50  border-b border-default-300 px-3 py-2">
                          <div className=" text-sm font-medium text-default-900 ">
                            Forward To
                          </div>
                          <PopoverClose>
                            <Button
                              type="button"
                              size="icon"
                              className="w-6 h-6 bg-default-400 rounded-full"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </PopoverClose>
                        </div>
                        <Command>
                          <div className="p-2">
                            <CommandInput
                              placeholder="Search By Name..."
                              inputWrapper="border border-default-200 rounded-md"
                              className="h-9"
                            ></CommandInput>
                          </div>
                          <CommandList className="max-h-[200px] ">
                          <CommandEmpty>No new members.</CommandEmpty>
                          <CommandGroup>
                            {departmentEmployees?.map((item, index) => (
                              <CommandItem
                                key={`assigned-members-${index}`}
                                value={item.name}
                                onSelect={() =>
                                  handleSaveEditTask(task, {
                                    forwardTo: {
                                      employeeCode: item.employeeCode,
                                      name: item.name,
                                    },
                                  })
                                }
                                className="gap-2"
                              >
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={project?.employees?.find((emp) => emp.employeeCode === item?.employeeCode)?.image} />
                                  <AvatarFallback>SN</AvatarFallback>
                                </Avatar>
                                <span className="font-base capitalize text-default-900">
                                  {item.name}
                                </span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
           
                    <Forward
                      task={task}
                      session={session}
                      refetchSprint={refetchSprint}
                    />
                  </div>
                );
                break;
              case "followers":
                cellValue = (
                  <div className="flex items-center gap-3 cursor-pointer">
                    <AvatarGroup
                      max={3}
                      total={task.tagFull.length}
                      countClass="w-8 h-8"
                    >
                      {task.tagFull.map((user, index) => (
                        <TooltipProvider key={index}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Avatar className="h-8 w-8 ring-1 ring-background ring-offset-[2px]  ring-offset-background">
                                <AvatarImage src={project?.employees?.find((emp) => emp.employeeCode === user?.employeeCode)?.image} />
                                <AvatarFallback>AB</AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent color="primary">
                              <p>{user.name}</p>
                              <TooltipArrow className=" fill-primary" />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </AvatarGroup>
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          type="button"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                        >
                          <Icon
                            icon="heroicons:user-plus"
                            className="w-5 h-5 text-white"
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <div className="flex justify-between items-center bg-default-50  border-b border-default-300 px-3 py-2">
                          <div className=" text-sm font-medium text-default-900 ">
                            Add Followers
                          </div>
                          <PopoverClose>
                            <Button
                              type="button"
                              size="icon"
                              className="w-6 h-6 bg-default-400 rounded-full"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </PopoverClose>
                        </div>
                        <Command>
                          <div className="p-2">
                            <CommandInput
                              placeholder="Search By Name..."
                              inputWrapper="border border-default-200 rounded-md"
                              className="h-9"
                            ></CommandInput>
                          </div>
                          <CommandEmpty>No new members.</CommandEmpty>
                          <CommandGroup>
                            {departmentEmployees?.map((item, index) => (
                              <CommandItem
                                key={`assigned-members-${index}`}
                                value={item.name}
                                onSelect={() =>
                                  handleSaveEditTask(task, {
                                    tag: {
                                      employeeCode: item.employeeCode,
                                      name: item.name,
                                    },
                                  })
                                }
                                className="gap-2"
                              >
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={project?.employees?.find((emp) => emp.employeeCode === item?.employeeCode)?.image} />
                                  <AvatarFallback>SN</AvatarFallback>
                                </Avatar>
                                <span className="font-base capitalize text-default-900">
                                  {item.name}
                                </span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <Followers task={task} session={session} refetchSprint={refetchSprint} />
                  </div>
                );
                break;
              case "members":
                cellValue = (
                  <div className="flex items-center gap-3 cursor-pointer justify-center">
                    <AvatarGroup
                      max={2}
                      total={project?.members.length}
                      countClass="w-8 h-8"
                    >
                      {project?.members.map((user, index) => (
                        <TooltipProvider key={index}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Avatar className="h-8 w-8 ring-1 ring-background ring-offset-[2px]  ring-offset-background">
                                <AvatarImage src={project?.employees?.find((emp) => emp.employeeCode === user?.employeeCode)?.image} />
                                <AvatarFallback>AB</AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent color="primary">
                              <p>{user.name}</p>
                              <TooltipArrow className=" fill-primary" />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </AvatarGroup>
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          type="button"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                        >
                          <Icon
                            icon="heroicons:user-plus"
                            className="w-5 h-5 text-white"
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <div className="flex justify-between items-center bg-default-50  border-b border-default-300 px-3 py-2">
                          <div className=" text-sm font-medium text-default-900 ">
                            Add Member
                          </div>
                          <PopoverClose>
                            <Button
                              type="button"
                              size="icon"
                              className="w-6 h-6 bg-default-400 rounded-full"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </PopoverClose>
                        </div>
                        <Command>
                          <div className="p-2">
                            <CommandInput
                              placeholder="Search By Name..."
                              inputWrapper="border border-default-200 rounded-md"
                              className="h-9"
                            ></CommandInput>
                          </div>
                          <CommandList className="max-h-[200px] ">
                          <CommandEmpty>No new members.</CommandEmpty>
                          <CommandGroup>
                            {departmentEmployees?.map((item, index) => (
                              <CommandItem
                                key={`assigned-members-${index}`}
                                value={item.name}
                                onSelect={() =>
                                  handleSaveEditTask(task, {
                                    members: {
                                      employeeCode: item.employeeCode,
                                      name: item.name,
                                      role: "editor",
                                    },
                                  })
                                }
                                className="gap-2"
                              >
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={project?.employees?.find((emp) => emp.employeeCode === item?.employeeCode)?.image} />
                                  <AvatarFallback>SN</AvatarFallback>
                                </Avatar>
                                <span className="font-base capitalize text-default-900">
                                  {item.name}
                                </span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <Members
                      task={task}
                      session={session}
                      refetchSprint={refetchSprint}
                      project={project}
                    />
                  </div>
                );
                break;
              case "prove":
                cellValue = (
                  <div className="flex items-center gap-3 cursor-pointer justify-center">
                    <Attachments
                      task={task}
                      session={session}
                      refetchSprint={refetchSprint}
                    />
                  </div>
                );
                break;
              case "target":
                cellValue = (
                  <div className="flex items-center gap-3 cursor-pointer justify-center">
                    <div className="flex items-center gap-2">
                      {task?.data?.target?.value} {task?.data?.target?.unit}
                    </div>
                    <SetTarget
                      task={task}
                      session={session}
                      refetchSprint={refetchSprint}
                      type="target"
                    />
                  </div>
                );
                break;
              case "achive":
                cellValue = (
                  <div className="flex items-center gap-3 cursor-pointer justify-center">
                    <div className="flex items-center gap-2">
                      {task?.data?.target?.targetAchive?.value}{" "}
                      {task?.data?.target?.unit}
                    </div>
                    <SetTarget
                      task={task}
                      session={session}
                      refetchSprint={refetchSprint}
                      type="achive"
                    />
                  </div>
                );
                break;
              case "due":
                cellValue = (
                  <div className="flex items-center gap-3 cursor-pointer justify-center">
                    {typeof task?.data?.target?.value === "number" &&
                    typeof task?.data?.target?.targetAchive?.value === "number"
                      ? task.data.target.value -
                        task.data.target.targetAchive.value
                      : "-"}
                    {task?.data?.target?.unit
                      ? ` ${task.data.target.unit}`
                      : ""}
                        {task?.data?.target?.unit
                      ? ` (${(task.data.target.targetAchive.value/task.data.target.value * 100).toFixed(2)} %)`
                      : ""}



                  </div>
                );
                break;
              case "projectTimeline":
                if (project?.startDate && project?.endDate) {
                  // Both dates exist - show range
                  cellValue =
                    dayjs(project.startDate).format("DD-MM-YYYY") +
                    " - " +
                    dayjs(project.endDate).format("DD-MM-YYYY");
                } else if (project?.startDate) {
                  // Only start date exists - show start date only
                  cellValue = dayjs(project.startDate).format("DD-MM-YYYY");
                } else {
                  // No dates available
                  cellValue = "";
                }
                break;
              case "completedAt":
                cellValue = (
                  <div className="flex items-center gap-3 cursor-pointer justify-center">
                    {userBoardMap?.completedAt
                      ? dayjs(userBoardMap?.completedAt).format(
                          "DD-MM-YYYY hh:mm A"
                        )
                      : ""}
                
                     <Switch
                              size="sm"
                              color="primary"
                              checked={userBoardMap?.completedAt}
                              disabled={userBoardMap?.completedAt}
                              onCheckedChange={(value) => handleSaveEditTask(task, {
                                boardId: project?.boards?.find(
                                  (board) => board.name === "Completed"
                                )?.boardId,
                              })}
                            />
                  </div>
                );
                break;
              case "verifiedAt":
                cellValue = (
                  <div className="flex items-center gap-3 cursor-pointer justify-center">
                    {userBoardMap?.verifiedAt
                      ? dayjs(userBoardMap?.verifiedAt).format(
                          "DD-MM-YYYY hh:mm A"
                        )
                      : ""}
            
                          <Switch
                              size="sm"
                              color="primary"
                              checked={userBoardMap?.verifiedAt}
                              disabled={userBoardMap?.verifiedAt}
                              onCheckedChange={(value) => handleSaveEditTask(task, {
                                boardId: project?.boards?.find(
                                  (board) => board.name === "Verified"
                                )?.boardId,
                              })}
                            />
                  </div>
                );
                break;
              case "type":
                cellValue = (
             <Badge
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium h-6 whitespace-nowrap cursor-pointer",
                      typeColorMap[task.type.toLowerCase()] ||
                        "bg-gray-300 text-black"
                    )}
                    onClick={() => startEditing(task._id, key, task.type)}
                  >
                    <span className="capitalize cursor-pointer">
                      {task.type}
                    </span>
                  </Badge>
                );
                break;
              case "actions":
                cellValue = (
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() =>
                        handleSaveEditTask(task, { delete: "deleted" })
                      }
                    >
                      <Icon icon="heroicons:trash" className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() =>
                        handleSaveEditTask(task, { hidden: "true" })
                      }
                    >


                      {userBoardMap?.hidden ? (
                        <Icon icon="heroicons:eye-slash" className="h-4 w-4" />
                      ) : (
                        <Icon icon="heroicons:eye" className="h-4 w-4" />
                      )}
                      
                    </Button>
                  
                  </div>
                );
                break;

              default:
                cellValue = null;
            }

            return (
              <TableCell
                key={column.id}
                className={cn(
                  "border border-default-200 text-center cursor-pointer",
                  column.id === "name" &&
                    "sticky left-0 z-10 bg-white min-w-[200px] bg-background drop-shadow-md"
                )}
                padding="list"
              >
                {cellValue}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );
};

export default TaskTable;
