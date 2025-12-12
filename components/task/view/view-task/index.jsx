"use client";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "@/components/ui/sheet";
import React, { useTransition } from "react";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

import Attachments from "./attachments";

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRef } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { Label } from "@/components/ui/label";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import avatar1 from "@/public/images/avatar/avatar-4.jpg";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import dayjs from "dayjs";
import {
  Loader2,
  Save,
  Check,
  ChevronDown,
  Eye,
  ThumbsUp,
  Reply,
  Newspaper,
} from "lucide-react";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";

import { useState } from "react";
import { cn } from "@/lib/utils";

import {
  X,
  Microphone,
  Link,
  CaseSensitiveIcon,
  Link2,
  Mic,
  Send,
  AtSign,
  Smile,
  Pause,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  revalidateCurrentPath,
  updateTask,
  addTaskFile,
  getDepartmentEmployees,
} from "@/action/task/controller";
import { Edit, Trash } from "lucide-react";
const getBrowserAudioConfig = () => {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (isSafari && MediaRecorder.isTypeSupported("audio/mp4")) {
    return {
      mimeType: "audio/mp4",
      blobType: "audio/mp4",
    };
  } else if (MediaRecorder.isTypeSupported("audio/webm")) {
    return {
      mimeType: "audio/webm",
      blobType: "audio/webm",
    };
  }

  // Fallback
  return {
    mimeType: undefined,
    blobType: "audio/wav",
  };
};

const handleAudioRecording = () => {
  // console.log("handleAudioRecording called.");

  let mediaRecorder = null;
  let audioChunks = [];
  let stream = null;
  let audioContext = null;
  let gainNode = null;

  const startRecording = async () => {
    // console.log("About to request mic access...");
    try {
      // Check MediaRecorder support first
      if (!window.MediaRecorder) {
        const message =
          "MediaRecorder not supported in this browser. Please update your browser or use Chrome/Firefox.";
        toast.error(message);
        return { status: "error", message };
      }
      // Check if there's at least one audio input device available
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasMic = devices.some((device) => device.kind === "audioinput");
      console.log("device", devices);
      console.log("hasMic", hasMic);

      if (!hasMic) {
        const message =
          "No microphone found. Please connect a mic to record audio.";
        toast.error(message);
        // console.error("Mic check failed:", message);
        return {
          status: "error",
          message,
        };
      }

      console.log("has mic");
      // Request mic access
      const constraints = {
        audio: {
          echoCancellation: true,
          autoGainControl: true,
          noiseSuppression: true,
          sampleRate: 44100,
          channelCount: 1,
        },
      };
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log("stream", stream);
      } catch (err) {
        console.error("getUserMedia error:", err.name, err.message);
      }

      // ✅ Add Web Audio API volume boost
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);

      gainNode = audioContext.createGain();

      // Apply volume boost
      gainNode.gain.value = 2.0;
      console.log("gainNode", gainNode);

      const destination = audioContext.createMediaStreamDestination();
      console.log("destination", destination);
      source.connect(gainNode);
      gainNode.connect(destination);

      // ✅ ADD getBrowserAudioConfig HERE
      const audioConfig = getBrowserAudioConfig();
      const options = {
        ...(audioConfig.mimeType && { mimeType: audioConfig.mimeType }),
        audioBitsPerSecond: 128000, // Higher bitrate for better quality
      };

      mediaRecorder = new MediaRecorder(destination.stream, options);

      audioChunks = [];

      // console.log("Mic access granted.");

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.start();
      // console.log("Recording started.");
      return { status: "recording" };
    } catch (error) {
      console.log(error);
      let message =
        "Failed to access microphone. Please ensure permissions are granted.";

      if (error.name === "NotFoundError") {
        message =
          "No microphone detected. Please connect a mic or enable permissions.";
      } else if (error.name === "NotAllowedError") {
        message = "Microphone permission denied. Please allow mic access.";
      }

      toast.error(message);
      // console.error("Mic access error:", error);

      return {
        status: "error",
        message,
      };
    }
  };

  const stopRecording = () => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorder || mediaRecorder.state !== "recording") {
        return reject({
          status: "error",
          message: "No active recording",
        });
      }

      mediaRecorder.onstop = () => {
        // ✅ ADD getBrowserAudioConfig HERE
        const audioConfig = getBrowserAudioConfig();
        const audioBlob = new Blob(audioChunks, { type: audioConfig.blobType }); // ✅ Use dynamic type

        // ✅ Clean up Web Audio API resources
        if (audioContext) {
          audioContext.close();
          audioContext = null;
          gainNode = null;
        }

        stream?.getTracks().forEach((track) => track.stop());
        resolve({ status: "stopped", blob: audioBlob });
      };

      mediaRecorder.stop();
    });
  };

  return {
    start: startRecording,
    stop: stopRecording,
  };
};

const TaskSheet = ({
  open,
  setOpen,
  task,
  boards,
  session,
  refetchSprint,
  project,
}) => {

  console.log('proslgllsg',project)
  // const currentBoard = project?.boards?.find(
  //   (board) => board?.boardId === task?.boardId
  // );

  // console.log('open sheet view')

  // const [open, setOpen] = React.useState(false);
  const [comments, setComments] = React.useState(task?.data?.comments || []);
  const [files, setFiles] = React.useState(task?.files || []);
  const [openTag, setOpenTag] = React.useState(false);
  const [activity, setActivity] = React.useState(task?.data?.activity || []);
  const [newComment, setNewComment] = React.useState("");
  const [newTagComment, setNewTagComment] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [isPending, startTransition] = useTransition();
  const [timeSpent, setTimeSpent] = React.useState(0);
  const [attachments, setAttachments] = React.useState([]);
  const [editMode, setEditMode] = React.useState(false);
  const [editTaskMode, setEditTaskMode] = React.useState(false);
  const [editedTask, setEditedTask] = React.useState({});
  const [editingComment, setEditingComment] = React.useState(null);
  const [replyComment, setReplyComment] = React.useState(null);
  const [editedCommentText, setEditedCommentText] = React.useState("");
  const [replyCommentText, setReplyCommentText] = React.useState("");
  // console.log("task in taskview", task);

  useEffect(() => {
    setComments(task?.data?.comments || []);
    setActivity(task?.data?.activity || []);
    setEditedTask({}); // Reset edited task when task prop changes
  }, [task]);

  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const recorderRef = React.useRef(null);
  const [openBoard, setOpenBoard] = React.useState(false);
  const handlePreviewFile = (fileUrl) => {
    // Open file in new tab for preview
    window.open(fileUrl, "_blank");
  };

  const scrollAreaRef = useRef(null); // Add ref for ScrollArea
  // New useEffect to scroll to the bottom when comments change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [comments]);

  comments?.forEach((comment) => {
    // console.log(comment?.content);
  });

  // reset edit mode on close
  useEffect(() => {
    if (!open) {
      setEditTaskMode(false);
      setEditedTask({});
    }
  }, [open]);

  useEffect(() => {
    // console.log("useEffect initializing recorder...");
    recorderRef.current = handleAudioRecording();
  }, []);

  // console.log("task in taskveiw", task);
  React.useEffect(() => {
    if (task?.data?.comments) {
      // sort comments by timestamp in descending order
      const sortedComments = [...task.data.comments].sort((a, b) => {
        return new Date(b?.timestamp) - new Date(a?.timestamp);
      });
      // console.log("sortedComments", sortedComments);
      setComments(sortedComments);
    }
  }, [task?.data?.comments]);

  const {
    data: departmentEmployees,
    isLoading: departmentEmployeesLoading,
    error: departmentEmployeesError,
    refetch: departmentEmployeesRefetch,
  } = useQuery({
    queryKey: ["department-employee", session],
    queryFn: () => getDepartmentEmployees(session),
    enabled: !!session,
  });

  if (departmentEmployeesLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (departmentEmployeesError) {
    return <div>Error fetching department employees</div>;
  }

  const handleStart = async (volumeBoost = 2.0) => {
    // console.log("handleStart");
    if (!recorderRef.current) {
      setError("Recorder not initialized");
      return;
    }
    const result = await recorderRef.current.start(volumeBoost);
    if (result.status === "recording") {
      setIsRecording(true);
      setError(null);
    } else {
      setError(result.message);
    }
  };

  const handleStop = async () => {
    if (!recorderRef.current) {
      setError("Recorder not initialized");
      return;
    }

    try {
      const result = await recorderRef.current.stop();
      if (result.status === "stopped") {
        setIsRecording(false);
        setError(null);
        setRecordedAudio(result.blob); // ✅ Store audio blob
      }
    } catch (err) {
      setError(err.message || "Failed to stop recording");
    }
  };

  // Save edited task data
  const handleSaveEditTask = () => {
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

        // Call the API to create or update task
        const response = await updateTask(taskData, session);

        if (response.status === "success") {
          // Show success message
          toast.success("task updated successfully", {
            duration: 1000,
          });
          setEditMode(false);
          setEditedTask({});
          setEditTaskMode(false);
          setLoading(false);
          setOpen(false);
          refetchSprint();
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

  // Handle comment deletion
  const handleDeleteComment = (commentId) => {
    startTransition(async () => {
      try {
        setLoading(true);
        // Prepare the task data
        const taskData = {
          type: "deleteComment",
          task: {
            _id: task._id,
            boardId: task.boardId,
            projectId: task.projectId,
          },
          data: { commentId: commentId },
        };

        // Call the API to create or update task
        const response = await updateTask(taskData, session);

        if (response.status === "success") {
          // Show success message
          toast.success(response.message, {
            duration: 1000,
          });

          setLoading(false);
          setComments(comments.filter((comment) => comment.id !== commentId));
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

  // Save edited comment
  const handleSaveComment = (commentId) => {
    startTransition(async () => {
      try {
        setLoading(true);
        // Prepare the task data

        let taskData = {};
        if (editMode && editedCommentText !== "") {
          taskData = {
            type: "comment-edit",
            task: {
              _id: task._id,
              boardId: task.boardId,
              projectId: task.projectId,
            },
            commentId: commentId,
            content: { newText: editedCommentText },
          };
        }
        if (editMode && replyCommentText !== "") {
          taskData = {
            type: "comment-reply",
            task: {
              _id: task._id,
              boardId: task.boardId,
              projectId: task.projectId,
            },
            commentId: commentId,
            comment: {
              id: Date.now(),
              type: "comment-text",
              content: {
                taskId: task._id,
                replyText: replyCommentText,
                commentId: commentId,
              },
              tag: newTagComment,
              text: newComment,
              author: session?.user.name, // Replace with actual user info
              timestamp: new Date(),
              avatar: "", // Replace with actual avatar path
            },
            // content: { replyText: replyCommentText },
          };
        }

        if (newComment !== "") {
          console.log('new commentagagagggggg',task.boardId)
          taskData = {
            type: "comment-text",
            task: {
              _id: task._id,
              boardId: task.boardId,
              projectId: task.projectId,
            },
            comment: {
              id: Date.now(),
              type: "comment-text",
              content: {
                taskId: task._id,
                previousEdits: [],
              },
              tag: newTagComment,
              text: newComment,
              author: session?.user.name, // Replace with actual user info
              timestamp: new Date(),
              avatar: "", // Replace with actual avatar path
            },
          };
        }

        // Call the API to create or update task
        const response = await updateTask(taskData, session);

        if (response.status === "success") {
          // console.log("task response", response);
          // Show success message
          await refetchSprint();
          toast.success(response.message, {
            duration: 1000,
          });

          setEditingComment(null);
          setEditedCommentText("");
          setReplyCommentText("");
          setReplyComment(null);
          setNewComment("");
          setNewTagComment([]);
          setComments(response.data?.data?.comments);
          setActivity(response.data?.data?.activity);
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

  const handleSelectEmployee = (employee) => {
    // add that employee with current comment like @employee.name in comment as well as newTagArray
    setNewTagComment([...newTagComment, employee]);
    setNewComment(newComment + `${employee.name} `);
    setOpenTag(false);
  };

  const handleUpdateComment = (type, data) => {
    console.log('called from notifiction')
    startTransition(async () => {
      try {
        // Prepare the task data
        const taskData = {
          type: type,
          task: {
            _id: task._id,
            boardId: task.boardId,
            projectId: task.projectId,
          },
          data: data,
        };

        // Call the API to create or update task
        const response = await updateTask(taskData, session);

        if (response.status === "success") {
          // Show success message
          toast.success(response.message, {
            duration: 1000,
          });
          setActivity(response.data?.data?.activity);
          refetchSprint();
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

  const handleAddAudioComment = () => {
    if (!recordedAudio) return;

    const formDataObj = new FormData();
    formDataObj.append("file", recordedAudio);
    formDataObj.append("source", task?._id);
    formDataObj.append("type", "comment-audio");
    formDataObj.append("folder", "task/comments/audio");
    formDataObj.append("resource_type", "video");

    startTransition(async () => {
      try {
        setLoading(true);

        // Call the API to create or update task
        const response = await addTaskFile(formDataObj, session);

        if (response.status === "success") {
          toast.success("Audio added successfully", {
            duration: 1000,
          });
          setRecordedAudio(null);
          setIsRecording(false);

          const sortedComments = [...comments, response.data].sort((a, b) => {
            return new Date(b?.timestamp) - new Date(a?.timestamp);
          });
          // console.log("sortedComments", sortedComments);
          setComments(sortedComments);
          refetchSprint();
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

  const handleClose = () => {
    setOpen(false);
    setNewComment("");
    setEditingComment(null);
    setEditedCommentText("");
    setReplyCommentText("");
    setReplyComment(null);
    setNewTagComment([]);
    setRecordedAudio(null);
    setIsRecording(false);
    setError(null);
    setOpenBoard(false);
  };

  // const toggleFullScreen = () => {
  //   const doc = window.document;
  //   const docEl = doc.documentElement;

  //   const requestFullScreen =
  //     docEl.requestFullscreen ||
  //     docEl.mozRequestFullScreen ||
  //     docEl.webkitRequestFullScreen ||
  //     docEl.msRequestFullscreen;
  //   const cancelFullScreen =
  //     doc.exitFullscreen ||
  //     doc.mozCancelFullScreen ||
  //     doc.webkitExitFullscreen ||
  //     doc.msExitFullscreen;

  //   if (
  //     !doc.fullscreenElement &&
  //     !doc.mozFullScreenElement &&
  //     !doc.webkitFullscreenElement &&
  //     !doc.msFullscreenElement
  //   ) {
  //     requestFullScreen.call(docEl);
  //   } else {
  //     cancelFullScreen.call(doc);
  //   }
  // };

  return (
    <Sheet open={open}>
      <SheetContent
        side="right"
        onClose={() => handleClose()}
        closeIcon={<X className="h-4 w-4 relative top-1 right-2" />}
        className={cn("w-[85%] md:max-w-[600px] px-2 z-[1000] flex-grow")}
      >
        <SheetHeader className="sm:flex-row justify-between gap-3 space-y-0 border-b border-default-200  px-2 xl:px-2 py-1">
          <div className="flex-1">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                {editTaskMode ? (
                  <div className="flex gap-2">
                    {/* <Icon
                      icon="heroicons:check-circle"
                      onClick={() => {
                        handleSaveEditTask();
                      }}
                      className="size-5 text-gray-500 cursor-pointer"
                    /> */}
                    <Button
                      onClick={() => handleSaveEditTask()}
                      size="sm"
                      variant="outline"
                    >
                      Save
                    </Button>

                    {/* <Icon
                      icon="heroicons:x-mark"
                      onClick={() => {
                        setEditTaskMode(false);
                      }}
                      className="size-5 text-gray-500 cursor-pointer"
                    /> */}
                    <Button
                      onClick={() => setEditTaskMode(false)}
                      size="sm"
                      color="destructive"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  // <Icon
                  //   icon="heroicons:pencil"
                  //   onClick={() => setEditTaskMode(true)}
                  //   className="size-5 text-gray-500 cursor-pointer"
                  // />
                  <Button onClick={() => setEditTaskMode(true)} size="sm">
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="app-height-task p-2" ref={scrollAreaRef}>
          {/* Main content */}
          <div className="flex flex-col flex-grow overflow-hidden ">
            {/* Left content */}
            <div className="flex-grow px-6 py-2 overflow-y-auto">
              {editTaskMode ? (
                <Input
                  value={editedTask?.name}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, name: e.target.value })
                  }
                  className="mb-4 w-[80%]"
                  placeholder="Task Name"
                />
              ) : (
                <h2 className="font-bold text-lg mb-4">{task?.name}</h2>
              )}

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <Icon icon="heroicons:user-group" className="h-4 w-4  " />
                  <span className="w-28">Created By</span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={project?.employees?.find((emp) => emp.employeeCode === task?.createdByDepartment?.employeeId)?.image} />
                    <AvatarFallback className="capitalize">
                      {task?.createdByDepartment?.employeeName?.charAt(0) ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="capitalize">
                    {task?.createdByDepartment?.employeeName}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon icon="heroicons:calendar" className="h-4 w-4 " />
                  <span className="w-28">Created At</span>
                  <span>
                    {dayjs(task?.createdAt).format("DD-MMM-YYYY HH:mm")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon icon="heroicons:calendar" className="h-4 w-4 " />
                  <span className="w-28">Due Date</span>
                  <span>
                    {task?.dueDate
                      ? dayjs(task?.dueDate).format("DD-MMM-YYYY HH:mm")
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon icon="heroicons:folder-open" className="h-4 w-4 " />
                  <span className="w-28">Project</span>
                  <span className=" cursor-pointer hover:underline">
                    Daily Task
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon icon="heroicons:clock" className="h-4 w-4" />
                  <span className="w-28">Estimated Time</span>
                  <span>0h</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon icon="heroicons:clock" className="h-4 w-4 " />
                  <span className="w-28">Actual Time</span>
                  <span>0h</span>
                  <button className="ml-2 flex items-center gap-1 bg-gray-100 text-gray-600 text-xs rounded-md px-2 py-1">
                    <Icon
                      icon="heroicons:play"
                      className="size-3 mr-1 text-gray-600 "
                    />
                    Start Timer
                  </button>
                </div>
              </div>
              <div className="mt-6 text-xs text-gray-600 font-semibold mb-2">
                Description
              </div>

              <Textarea
                placeholder="Type Here.."
                variant="ghost"
                rows="3"
                value={
                  editedTask?.description !== undefined &&
                  editedTask.description !== ""
                    ? editedTask.description
                    : task?.description || ""
                }
                onChange={(e) =>
                  setEditedTask({ ...editedTask, description: e.target.value })
                }
                readOnly={!editTaskMode}
              />
            </div>
          </div>

          {/* Bottom section */}
          <Tabs
            defaultValue="comment"
            className="w-full p-2 border-b border-gray-200"
          >
            <TabsList className="border-b border-gray-200">
              <TabsTrigger
                value="activity"
                className="relative dark:bg-transparent before:absolute before:top-full before:left-0 before:h-px before:w-full data-[state=active]:before:bg-primary"
              >
                All activity
              </TabsTrigger>
              <TabsTrigger
                value="comment"
                className="relative dark:bg-transparent before:absolute before:top-full before:left-0 before:h-px before:w-full data-[state=active]:before:bg-primary"
              >
                Comments
              </TabsTrigger>
            </TabsList>
            <TabsContent value="activity">
              {/* <ScrollArea className="h-[200px]"> */}
              {activity?.length > 0 ? (
                activity
                  ?.sort((a, b) => new Date(a.time) - new Date(b.time))
                  .map((activity, index) => (
                    <div
                      className="p-4 overflow-y-auto max-h-48"
                      key={activity?.id}
                    >
                      <div className="flex gap-3">
                        {activity.action === "create-task" ? (
                          <>
                            {activity?.by?.name} created this task on{" "}
                            {dayjs(activity?.time).format("DD-MMM-YYYY HH:mm")}
                          </>
                        ) : activity.action === "edit-task" ? (
                          <>
                            {activity?.by?.name} edited this task on{" "}
                            {dayjs(activity?.time).format("DD-MMM-YYYY HH:mm")}
                          </>
                        ) : (
                          <>
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={project?.employees?.find((emp) => emp.employeeCode === activity?.by?.employeeCode)?.image} />
                              <AvatarFallback className="capitalize">
                                {activity?.by?.name?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <div className="font-bold text-gray-900 leading-none capitalize">
                                {activity?.by?.name}
                                <span className="font-normal text-gray-500 ml-2">
                                  {activity?.action === "delete-comment-text"
                                    ? "deleted comment text on"
                                    : activity?.action ===
                                      "delete-comment-audio"
                                    ? "deleted comment audio on"
                                    : activity?.action === "comment-text"
                                    ? "commented a text on"
                                    : activity?.action === "comment-audio"
                                    ? "commented audio on"
                                    :activity?.action === "comment-image"
                                    ? "commented image on"
                                    : activity?.action === "comment-edit"
                                    ? "edited comment on"
                                    : activity?.action === "comment-reply"
                                    ? "replied to comment on"
                                    : activity?.action === "comment-like"
                                    ? "liked comment on"
                                    : activity?.action === "deleteComment"
                                    ? "deleted comment on"
                                    : ""}{" "}
                                  {dayjs(activity?.time).format(
                                    "D-MMM-YYYY HH:mm"
                                  )}
                                </span>
                              </div>
                              <div>
                                {activity?.action === "comment-audio" ||
                                activity?.action === "delete-comment-audio" ? (
                                  <audio
                                    controls
                                    src={activity?.content?.audio?.file}
                                    className="h-6 rounded-md w-full/2 mt-2"
                                  />
                                ) :activity?.action === "comment-image" ||
                                activity?.action === "delete-comment-image" ? (
                                  <img
                                    src={activity?.content?.image?.file}
                                    alt={activity?.content?.image?.file}
                                    className="w-28 h-28 object-cover rounded-lg border"
                                  />
                                ) : activity?.action === "comment-text" ||
                                  activity?.action === "delete-comment-text" ? (
                                  activity?.content?.text
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-4 overflow-y-auto max-h-48">
                  <div className="flex gap-3">
                    <div className="text-sm">
                      <div className="font-medium text-gray-500 leading-none capitalize text-center">
                        No comments
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="comment">
              {/* <ScrollArea className="h-[200px]" ref={scrollAreaRef}> */}
              {comments?.length > 0 ? (
                comments
                  ?.sort(
                    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                  )
                  .map((comment, index) => (
                    <div
                      className="p-4 overflow-y-auto max-h-48 hover:bg-gray-100"
                      key={comment?.id}
                    >
                      <div className="flex gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={project?.employees?.find((emp) => emp.employeeCode === comment?.by?.employeeCode)?.image} />
                          <AvatarFallback className="capitalize">
                            {task?.createdByDepartment?.employeeName?.charAt(
                              0
                            ) || "U"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="text-sm relative group w-full">
                          <div className="font-bold text-gray-900 leading-none capitalize flex items-center">
                            {comment?.author}
                            <span className="font-normal text-gray-500 ml-2">
                              {dayjs(comment?.timestamp).format(
                                "DD-MMM-YYYY HH:mm"
                              )}
                            </span>
                            {comment?.content?.isLiked === true && (
                              <ThumbsUp className="w-4 h-4 text-yellow-500 hover:text-yellow-600 cursor-pointer ml-2" />
                            )}
                          </div>

                          <div className="pr-8">
                            {" "}
                            {/* Give padding-right so icons don't overlap */}
                            {comment?.type === "comment-audio" ? (
                              <audio
                                controls
                                src={comment?.content?.audio?.file}
                                className="h-6 rounded-md w-full/2 mt-2"
                              />
                            ) : comment?.type === "comment-image" ? (
                              <div className="flex items-center">
                                <div className="flex-shrink-0 mt-1">
                                  {comment?.content?.image?.file && (
                                    <img
                                      src={comment?.content?.image?.file}
                                      alt={comment?.content?.image?.file}
                                      className="w-28 h-28 object-cover rounded-lg border"
                                    />
                                  )}
                                </div>
                                <Eye
                                  className="size-5 text-yellow-500 hover:text-yellow-600 cursor-pointer ml-2"
                                  onClick={() =>
                                    handlePreviewFile(
                                      comment?.content?.image?.file
                                    )
                                  }
                                />
                              </div>
                            ) : (
                              <div>
                                {editMode && editingComment === comment.id ? (
                                  <Textarea
                                    defaultValue={""}
                                    className="w-full mt-1"
                                    onChange={(e) =>
                                      setEditedCommentText(e.target.value)
                                    }
                                  />
                                ) : editMode && replyComment === comment.id ? (
                                  <Textarea
                                    defaultValue={""}
                                    className="w-full mt-1"
                                    onChange={(e) =>
                                      setReplyCommentText(e.target.value)
                                    }
                                  />
                                ) : (
                                  <div>
                                    {/* Display main comment text */}
                                    <div className="mt-1">{comment?.text}</div>
                                    {/* Display old text if it exists (indicating an edit) */}
                                    {comment?.content?.oldText && (
                                      <div className="mt-2 text-gray-500 italic bg-gray-100 p-2 rounded-md">
                                        <span className="font-semibold">
                                          Previous version:{" "}
                                        </span>
                                        {comment?.content?.oldText}
                                      </div>
                                    )}
                                    {/* Display reply text if it exists (indicating a reply) */}
                                    {comment?.content?.replyText && (
                                      <div className="mt-2 text-gray-700 bg-blue-50 p-2 rounded-md border-l-4 border-blue-500">
                                        <span className="font-semibold">
                                          Reply:{" "}
                                        </span>
                                        {comment?.content?.replyText}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Edit & Delete icons (visible on hover) */}
                          <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ">
                            {editMode &&
                            (editingComment === comment.id ||
                              replyComment === comment.id) ? (
                              <Check
                                className="w-4 h-4 text-blue-500 hover:text-blue-600 cursor-pointer"
                                disabled={loading}
                                onClick={() => {
                                  handleSaveComment(comment.id);
                                }}
                              />
                            ) : (
                              <>
                                <ThumbsUp
                                  className="w-4 h-4 text-yellow-500 hover:text-yellow-600 cursor-pointer"
                                  onClick={() =>
                                    handleUpdateComment("comment-like", {
                                      commentId: comment.id,
                                    })
                                  }
                                />
                                <Reply
                                  className="w-4 h-4 text-red-500 hover:text-red-600 cursor-pointer"
                                  onClick={() => {
                                    setEditMode(true);
                                    setReplyComment(comment.id);
                                  }}
                                />
                                <Edit
                                  className="w-4 h-4 text-blue-500 hover:text-blue-600 cursor-pointer"
                                  onClick={() => {
                                    setEditMode(true);
                                    setEditingComment(comment.id);
                                  }}
                                />
                              </>
                            )}
                            {editMode &&
                            (editingComment === comment.id ||
                              replyComment === comment.id) ? (
                              <X
                                className="w-4 h-4 text-red-500 hover:text-red-600 cursor-pointer"
                                onClick={() => {
                                  setEditMode(false);
                                  setEditingComment(null);
                                  setEditedCommentText("");
                                  setReplyComment(null);
                                  setReplyCommentText("");
                                }}
                              />
                            ) : (
                              <>
                                <Trash
                                  className="w-4 h-4 text-red-500 hover:text-red-600 cursor-pointer"
                                  onClick={() =>
                                    handleDeleteComment(comment.id)
                                  }
                                />
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-4 overflow-y-auto max-h-48">
                  <div className="flex gap-3">
                    <div className="text-sm">
                      <div className="font-medium text-gray-500 leading-none capitalize text-center">
                        No comments
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>
        <SheetFooter className="mx-2 sm:mx-3">
          {/* Comment input */}
          <div className=" border border-gray-200 my-4 rounded-md w-full">
            {isRecording && (
              <span className="text-red-500 text-xs ml-2">Recording...</span>
            )}
            {recordedAudio ? (
              <div className="flex items-center px-2 mt-2">
                <audio
                  controls
                  src={URL.createObjectURL(recordedAudio)}
                  className="h-6 rounded-md w-full/2 mt-2"
                />
                <X
                  className="ml-2 h-4 w-4 text-gray-400 hover:text-red-500 cursor-pointer"
                  onClick={() => {
                    setRecordedAudio(null);
                    setIsRecording(false);
                  }}
                />
              </div>
            ) : (
              <input
                type="text"
                className="w-full text-sm text-gray-400  rounded-md px-3 py-2 focus:outline-none"
                placeholder="Comment..."
                disabled={isRecording}
                value={newComment}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewComment(value);

                  // Detect '@' added
                  const lastChar = value.slice(-1);
                  if (lastChar === "@") {
                    setOpenTag(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSaveComment();
                  }
                }}
              />
            )}
            <div
              className="flex items-center justify-between px-3 py-2 text-gray-400 text-xs"
              aria-label="comment actions"
            >
              <div className="flex space-x-4">
                <Icon icon="heroicons:plus" className="h-4 w-4" />
                <CaseSensitiveIcon className="h-4 w-4" />
                <Attachments
                  task={task}
                  session={session}
                  refetchSprint={refetchSprint}
                  setComments={setComments}
                  comments={comments}
                />
                <Link2 className="h-4 w-4" />

                {isRecording ? (
                  <Pause
                    className="h-4 w-4 cursor-pointer text-red-500 hover:text-red-600"
                    onClick={handleStop}
                  />
                ) : (
                  <Mic
                    className="h-4 w-4 cursor-pointer text-blue-500 hover:text-blue-600"
                    onClick={handleStart}
                  />
                )}

                <AtSign className="h-4 w-4" />
                <Smile className="h-4 w-4" />

                {openTag && (
                  <Popover open={openTag} onOpenChange={setOpenTag}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="soft"
                        className="flex items-center gap-1 text-sm font-medium  h-6 whitespace-nowrap"
                      >
                        UI/UX Design <ChevronDown className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 z-[9999]">
                      <div className="flex justify-between items-center bg-default-50  border-b border-default-300 px-3 py-2 ">
                        <div className=" text-sm font-medium text-default-900 ">
                          Employees
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
                            placeholder="Search list..."
                            inputWrapper="border border-default-200 rounded-md"
                            className="h-9"
                          ></CommandInput>
                        </div>
                        <CommandEmpty>No Item found</CommandEmpty>
                        <CommandGroup>
                          {departmentEmployees?.data?.map((item, index) => (
                            <CommandItem
                              key={`assigned-list-item-${index}`}
                              className="capitalize"
                              onSelect={() => handleSelectEmployee(item)}
                            >
                              {item.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              <div
                className="flex items-center space-x-1 cursor-pointer"
                onClick={() => {
                  if (recordedAudio) {
                    handleAddAudioComment();
                  } else {
                    handleSaveComment();
                  }
                }}
              >
                {loading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Button
                    type="button"
                    variant="soft"
                    className="flex items-center gap-1 text-sm font-medium  h-6 whitespace-nowrap"
                  >
                    Send
                    <Send className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default TaskSheet;
