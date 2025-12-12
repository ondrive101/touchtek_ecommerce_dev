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
import AssignMembers from "./common/assign-members";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";

const prioritiesColorMap = {
  high: "success",
  low: "destructive",
  medium: "warning",
};

// dnd
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Task = ({ task, boards, pathname, session,handleRefetchBoards }) => {
  // console.log("task", task);

  const [open, setOpen] = React.useState(false);
  const [taskDetailOpen, setTaskDetailOpen] = React.useState(false);
  const [comments, setComments] = React.useState(task?.data?.comments || []);
  const [newComment, setNewComment] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [isPending, startTransition] = useTransition();
  const [timeSpent, setTimeSpent] = React.useState(0);
  const [attachments, setAttachments] = React.useState([]);
  const [editMode, setEditMode] = React.useState(false);
  const [editedTask, setEditedTask] = React.useState({});
  const [editingComment, setEditingComment] = React.useState(null);
  const [editedCommentText, setEditedCommentText] = React.useState("");
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
    data,
    createdByDepartment,
  } = task;

  const createdAt = data?.timeline?.find(
    (item) => item.action === "created"
  )?.time;

  const handleMoveTask = (task, boardId) => {
    console.log("handleMoveTask");
  };

  const getBoardNameById = (boardId) => {
    const foundBoard = boards?.find((board) => board.id === boardId);
    return foundBoard ? foundBoard.name : "Unknown Board";
  };

  const getBoardColorById = (boardId) => {
    const foundBoard = boards?.find((board) => board.id === boardId);
    return foundBoard?.color || "#6338f0";
  };

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

  // Timer functions
  const startTimer = () => {
    if (timerRunning) return;

    setTimerRunning(true);
    timerRef.current = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    if (!timerRunning) return;

    setTimerRunning(false);
    clearInterval(timerRef.current);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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

         await handleRefetchBoards();

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

  //   Handle comment submission
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      text: newComment,
      author: session?.user.name, // Replace with actual user info
      timestamp: new Date(),
      avatar: "/path/to/avatar.jpg", // Replace with actual avatar path
    };

    startTransition(async () => {
      try {
        // Prepare the task data
        const taskData = {
          type: "comment",
          task,
          data: { comment },
        };

        // Call the API to create or update task
        const response = await updateTask(taskData, session);

        if (response.status === "success") {
          // Show success message
          toast.success(response.message, {
            duration: 1000,
          });

          setComments([...comments, comment]);
          setNewComment("");
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

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }));

    setAttachments([...attachments, ...newAttachments]);
  };

  // Handle attachment deletion
  const handleDeleteAttachment = (attachmentId) => {
    setAttachments(
      attachments.filter((attachment) => attachment.id !== attachmentId)
    );
  };

  // Handle comment deletion
  const handleDeleteComment = (commentId) => {
    startTransition(async () => {
      try {
        // Prepare the task data
        const taskData = {
          type: "deleteComment",
          task,
          data: { commentId: commentId },
        };

        // Call the API to create or update task
        const response = await updateTask(taskData, session);

        if (response.status === "success") {
          // Show success message
          toast.success(response.message, {
            duration: 1000,
          });

          setComments(comments.filter((comment) => comment.id !== commentId));
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

  // Handle comment edit
  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditedCommentText(comment.text);
  };

  // Save edited comment
  const handleSaveComment = (commentId) => {
    startTransition(async () => {
      try {
        // Prepare the task data
        const taskData = {
          type: "editComment",
          task,
          data: { commentId: commentId, text: editedCommentText },
        };

        // Call the API to create or update task
        const response = await updateTask(taskData, session);

        if (response.status === "success") {
          // Show success message
          toast.success(response.message, {
            duration: 1000,
          });

          setEditingComment(null);
          setEditedCommentText("");

          // Revalidate the path to refresh the data
          await revalidateCurrentPath(pathname);
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

  // Cancel comment editing
  const handleCancelEditComment = () => {
    setEditingComment(null);
    setEditedCommentText("");
  };

  // Handle task status update
  const handleTaskStatusUpdate = (newStatus) => {
    setTaskDetailOpen(false); // Close dialog after update
  };

  // Initialize edit mode with current task data
  const handleEditClick = () => {
    setEditedTask({
      name: name,
      description: description,
      priority: priority,
      dueDate: dueDate,
    });
    setEditMode(true);
  };

  // Save edited task data
  const handleSaveEdit = () => {
    startTransition(async () => {
      try {
        // Prepare the task data
        const taskData = {
          type: "editTask",
          task,
          data: {
            name: editedTask?.name,
            description: editedTask?.description,
            priority: editedTask?.priority,
            dueDate: dayjs(editedTask?.dueDate).format("YYYY-MM-DD"),
          },
        };

        // Call the API to create or update task
        const response = await updateTask(taskData, session);

        if (response.status === "success") {
          // Show success message
          toast.success(response.message, {
            duration: 1000,
          });
          setEditMode(false);
          // Revalidate the path to refresh the data
          await revalidateCurrentPath(pathname);
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

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditMode(false);
  };

  // Clean up timer on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <>
      <DeleteConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={() => handleSubmit("delete")}
        defaultToast={false}
      />
      {/* Task Detail Dialog */}
      <Dialog open={taskDetailOpen} onOpenChange={setTaskDetailOpen}>
        <DialogContent
          size="5xl"
          className="p-0 overflow-hidden border-none [&>button]:hidden"
        >
          <ScrollArea className="max-h-[90vh]">
            <div className="relative">
              {/* Gradient header background */}
              <div
                className="absolute top-0 left-0 right-0 h-40 z-0 opacity-90"
                style={{
                  background: `linear-gradient(135deg, ${getBoardColorById(
                    boardId
                  )} 0%, rgba(99, 56, 240, 0.6) 100%)`,
                }}
              />

              <div className="p-6 relative z-10">
                <DialogHeader className="mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-md bg-white/90 shadow-md",
                          status === "completed"
                            ? "ring-2 ring-green-400"
                            : status === "in-progress"
                            ? "ring-2 ring-blue-400"
                            : status === "pending"
                            ? "ring-2 ring-amber-400"
                            : ""
                        )}
                      >
                        {status === "completed" ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        ) : status === "in-progress" ? (
                          <Clock className="h-6 w-6 text-blue-600" />
                        ) : (
                          <AlertCircle className="h-6 w-6 text-amber-600" />
                        )}
                      </div>
                      <div>
                        {!editMode ? (
                          <>
                            <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
                              {name}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-full hover:bg-white/20 text-white"
                                onClick={handleEditClick}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTitle>
                            <p className="text-sm text-white/80">
                              Created{" "}
                              {createdAt
                                ? new Date(createdAt).toLocaleDateString()
                                : "recently"}{" "}
                              • Board: {getBoardNameById(boardId)}
                            </p>
                          </>
                        ) : (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editedTask.name}
                              onChange={(e) =>
                                setEditedTask({
                                  ...editedTask,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 text-lg font-semibold bg-white/90 rounded-md shadow-sm border-none focus:ring-2 focus:ring-primary"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-white text-primary hover:bg-white/90"
                                onClick={handleSaveEdit}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-white/50 hover:bg-white/70 border-white"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <DialogClose className="h-8 w-8 rounded-md bg-white/20 hover:bg-white/40 flex items-center justify-center text-white">
                      <XCircle className="h-5 w-5" />
                    </DialogClose>
                  </div>
                </DialogHeader>

                <div className="grid grid-cols-3 gap-6 mt-8 bg-white rounded-xl p-6 shadow-lg">
                  {/* Main Content - Left 2/3 */}
                  <div className="col-span-2 space-y-6">
                    {/* Description Section */}
                    <div className="space-y-3">
                      <h3 className="text-md font-medium text-gray-700 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        Description
                      </h3>
                      {!editMode ? (
                        <div className="p-4 bg-gray-50 rounded-lg text-gray-700 min-h-[100px] border border-gray-100 shadow-sm">
                          {description || "No description provided."}
                        </div>
                      ) : (
                        <Textarea
                          value={editedTask.description}
                          onChange={(e) =>
                            setEditedTask({
                              ...editedTask,
                              description: e.target.value,
                            })
                          }
                          className="min-h-[100px] rounded-md border-gray-200 focus:border-primary"
                          placeholder="Enter task description"
                        />
                      )}
                    </div>

                    {/* Attachments Section */}
                    <div className="space-y-3">
                      <h3 className="text-md font-medium text-gray-700 flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-gray-500" />
                        Attachments
                      </h3>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        {attachments.length > 0 ? (
                          <div className="space-y-2">
                            {attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className="flex items-center justify-between p-2 border border-gray-200 rounded-md"
                              >
                                <div className="flex items-center gap-2">
                                  <Icon
                                    icon={
                                      attachment.type.includes("image")
                                        ? "heroicons:photo"
                                        : "heroicons:document"
                                    }
                                    className="h-5 w-5 text-gray-500"
                                  />
                                  <span className="text-sm font-medium">
                                    {attachment.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">
                                    {Math.round(attachment.size / 1024)} KB
                                  </span>
                                  <div className="flex items-center">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 rounded-full"
                                    >
                                      <Icon
                                        icon="heroicons:arrow-down-tray"
                                        className="h-4 w-4 text-gray-500"
                                      />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 rounded-full text-red-500 hover:bg-red-50"
                                      onClick={() =>
                                        handleDeleteAttachment(attachment.id)
                                      }
                                    >
                                      <Icon
                                        icon="heroicons:trash"
                                        className="h-4 w-4"
                                      />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6">
                            <p className="text-gray-500 mb-3">
                              No attachments yet
                            </p>
                            <div className="relative">
                              <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileUpload}
                                multiple
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <PlusCircle className="h-4 w-4" />
                                Add Files
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="space-y-3">
                      <h3 className="text-md font-medium text-gray-700 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-500" />
                        Comments
                      </h3>
                      <div className="space-y-4">
                        {comments.length > 0 ? (
                          <div className="space-y-4">
                            {comments.map((comment) => (
                              <div key={comment.id} className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={comment.avatar} />
                                  <AvatarFallback>
                                    {comment.author[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="bg-gray-50 p-3 rounded-lg relative group">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-medium text-sm">
                                        {comment.author}
                                      </span>
                                      <div className="flex items-center gap-1">
                                        {comment.edited && (
                                          <span className="text-xs text-gray-400 italic mr-1">
                                            (edited)
                                          </span>
                                        )}
                                        <span className="text-xs text-gray-500">
                                          {new Date(
                                            comment.timestamp
                                          ).toLocaleString()}
                                        </span>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5 rounded-full hover:bg-gray-200"
                                            onClick={() =>
                                              handleEditComment(comment)
                                            }
                                          >
                                            <Edit className="h-3 w-3 text-gray-500" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5 rounded-full hover:bg-red-100"
                                            onClick={() =>
                                              handleDeleteComment(comment.id)
                                            }
                                          >
                                            <Icon
                                              icon="heroicons:trash"
                                              className="h-3 w-3 text-red-500"
                                            />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                    {editingComment === comment.id ? (
                                      <div className="mt-1">
                                        <Textarea
                                          value={editedCommentText}
                                          onChange={(e) =>
                                            setEditedCommentText(e.target.value)
                                          }
                                          className="min-h-[60px] text-sm"
                                        />
                                        <div className="flex justify-end gap-2 mt-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 text-xs px-2"
                                            onClick={handleCancelEditComment}
                                          >
                                            Cancel
                                          </Button>
                                          <Button
                                            size="sm"
                                            className="h-7 text-xs px-2 bg-primary"
                                            onClick={() =>
                                              handleSaveComment(comment.id)
                                            }
                                          >
                                            Save
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-700">
                                        {comment.text}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-gray-500 py-4">
                            No comments yet
                          </p>
                        )}

                        <div className="flex gap-3 mt-4">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 relative">
                            <Textarea
                              placeholder="Add a comment..."
                              className="min-h-[80px] pr-10"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                            />
                            <Button
                              size="icon"
                              className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-primary hover:bg-primary/90"
                              onClick={handleAddComment}
                            >
                              <Send className="h-3 w-3 text-white" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar - Right 1/3 */}
                  <div className="space-y-6">
                    {/* Status Section */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700">
                        Status
                      </h3>
                      <Select
                        defaultValue={status}
                        onValueChange={(value) => {
                          if (value !== status) {
                            handleTaskStatusUpdate(value);
                          }
                        }}
                        disabled={!editMode}
                      >
                        <SelectTrigger className="w-full bg-white border border-gray-200 shadow-sm">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="pending"
                            className="flex items-center gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <span className="h-3 w-3 rounded-full bg-amber-500"></span>
                              <span>Pending</span>
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="in-progress"
                            className="flex items-center gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                              <span>In Progress</span>
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="completed"
                            className="flex items-center gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <span className="h-3 w-3 rounded-full bg-green-500"></span>
                              <span>Completed</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Priority Section */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700">
                        Priority
                      </h3>
                      {!editMode ? (
                        <Select defaultValue={priority} disabled>
                          <SelectTrigger className="w-full bg-white border border-gray-200 shadow-sm">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent className="z-[1000]">
                            <SelectItem
                              value="low"
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                                <span>Low</span>
                              </div>
                            </SelectItem>
                            <SelectItem
                              value="medium"
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                                <span>Medium</span>
                              </div>
                            </SelectItem>
                            <SelectItem
                              value="high"
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-orange-500"></span>
                                <span>High</span>
                              </div>
                            </SelectItem>
                            <SelectItem
                              value="urgent"
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                                <span>Urgent</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Select
                          value={editedTask.priority}
                          onValueChange={(value) =>
                            setEditedTask({ ...editedTask, priority: value })
                          }
                        >
                          <SelectTrigger className="w-full bg-white border border-gray-200 shadow-sm">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent className="z-[1000]">
                            <SelectItem
                              value="low"
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                                <span>Low</span>
                              </div>
                            </SelectItem>
                            <SelectItem
                              value="medium"
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                                <span>Medium</span>
                              </div>
                            </SelectItem>
                            <SelectItem
                              value="high"
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-orange-500"></span>
                                <span>High</span>
                              </div>
                            </SelectItem>
                            <SelectItem
                              value="urgent"
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                                <span>Urgent</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* Due Date Section */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700">
                        Due Date
                      </h3>
                      {!editMode ? (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border border-gray-100 shadow-sm">
                          <CalendarDays className="h-4 w-4 text-primary" />
                          <span className="text-sm">
                            {dueDate
                              ? new Date(dueDate).toLocaleDateString()
                              : "No due date"}
                          </span>
                        </div>
                      ) : (
                        <input
                          type="date"
                          value={editedTask.dueDate || ""}
                          onChange={(e) =>
                            setEditedTask({
                              ...editedTask,
                              dueDate: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-white rounded-md border border-gray-200 shadow-sm focus:border-primary"
                        />
                      )}
                    </div>

                    {/* Assignees Section */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700">
                        Assignees
                      </h3>
                      <div className="p-3 bg-gray-50 rounded-md">
                        {assignedEmployees?.length > 0 ? (
                          <div className="space-y-2">
                            {assignedEmployees.map((employee) => (
                              <div
                                key={employee.connectionID}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>
                                      {employee.name?.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {employee.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {employee.employeeCode}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center py-2">
                            <p className="text-sm text-gray-500">
                              No assignees
                            </p>
                          </div>
                        )}
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

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
            <div className="text-[10px] leading-[14px] font-semibold uppercase text-default-600 border border-default-200 px-1.5  rounded-sm">
              {getWords(name)}
            </div>

            <div className="text-[10px] leading-[14px] font-semibold uppercase text-default-600">
              <Badge className="text-[10px] px-1 py-0 rounded leading-4 capitalize">
                {task?.type}
              </Badge>
            </div>
          </div>


          {/* right header */}
          <div className="flex items-center gap-1">
            {session?.user?.id === task.createdByDepartment.employeeId && (
              <Button
                size="icon"
                variant="ghost"
                className="group"
                color="default"
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
                <Icon icon="heroicons:pencil" className="h-5 w-5 " />
              </Button>
            )}

            {session?.user?.id === task.createdByDepartment.employeeId && (
              <Button
                size="icon"
                variant="ghost"
                className="group"
                color="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(true);
                }}
              >
                <Icon icon="heroicons:trash" className="h-5 w-5 " />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            <div className="text-sm font-semibold text-default-700 my-1 capitalize">
              {name}
            </div>
          </div>
          <div className="text-[13px] text-default-500">{description}</div>
          {image && (
            <div className="h-[190px] w-full mt-3 rounded">
              <Image
                alt={name}
                src={image}
                className="h-full w-full object-cover rounded"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1 mt-2">
            <Badge
              color={prioritiesColorMap[priority] || "default"}
              className="text-[10px] px-1 py-0 rounded leading-4 capitalize"
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
          <div className="mt-4 flex items-center gap-4">
            <div onClick={(e) => e.stopPropagation()}>
              <AssignMembers />
            </div>
            {assignedEmployees?.length > 0 && (
              <AvatarGroup
                total={assignedEmployees?.length}
                max={3}
                countClass="w-5 h-5"
              >
                {assignedEmployees?.map((employee, i) => (
                  <TooltipProvider key={`assign-employee-task-${i}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="w-5 h-5 ring-1 ring-background ring-offset-[2px] ring-offset-background">
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
              className="flex items-center gap-1 text-xs text-default-600"
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
              {boardId && (
                <div className="flex items-center gap-1 text-xs text-default-600">
                  <List className="w-3.5 h-3.5 text-default-500" />
                  {getBoardNameById(boardId)}
                </div>
              )}

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
