import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);
import { Plus, ChevronDown } from "lucide-react";
import { Loader2, Heart } from "lucide-react";
import React, { useTransition, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  X,
  CalendarIcon,
  Check,
  ChevronsUpDown,
  PenSquare,
  PlusSquare,
  FileText,
  CalendarDays,
  Users,
  Upload,
  Download,
  Trash2,
  Eye,
  File,
  Image,
  FileVideo,
  FileAudio,
  Archive,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { getEmployeeAndProjectist } from "@/action/task/controller";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Icon } from "@iconify/react";
import { addTaskFile, updateTask } from "@/action/task/controller";

const Attachments = ({ task, session, refetchSprint }) => {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState(task?.files || []);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = React.useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  const onClose = () => {
    setOpen(false);
    setPendingFile(null);
    setShowPreview(false);
  };
  useEffect(() => {
    setFiles(task?.files || []);
  }, [task?.files]);

  const handleFileUpload = (uploadedFile) => {
    if (!uploadedFile) return;

    const readableFileName = uploadedFile.name.split(".")[0]; //remove extention

    const formDataObj = new FormData();
    formDataObj.append("file", uploadedFile);
    formDataObj.append("source", task?._id);
    formDataObj.append("type", "task-attachment");
    formDataObj.append("folder", "task/attachments");
    formDataObj.append("file_name", readableFileName);

    startTransition(async () => {
      try {
        setLoading(true);

        const response = await addTaskFile(formDataObj, session);

        if (response.status === "success") {
          toast.success("Attachment added successfully", {
            duration: 1000,
          });
          setPendingFile(null);
          setShowPreview(false);
          setFiles(response.data.files);
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

  const handleFileSelection = (selectedFiles) => {
    const file = selectedFiles[0];
    if (file) {
      const fileWithPreview = {
        file,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
        id: Math.random().toString(36).substr(2, 9),
      };

      setPendingFile(fileWithPreview);
      // console.log(fileWithPreview);
      setShowPreview(true);
    }
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileSelection(selectedFiles);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      handleFileSelection(droppedFiles);
    }
  };

  const confirmUpload = () => {
    if (pendingFile) {
      handleFileUpload(pendingFile.file);
    }
  };

  const cancelUpload = () => {
    if (pendingFile && pendingFile.preview) {
      URL.revokeObjectURL(pendingFile.preview);
    }
    setPendingFile(null);
    setShowPreview(false);
  };

  // Helper function to extract filename from Cloudinary URL
  const getFileNameFromUrl = (url) => {
    try {
      const urlParts = url.split("/");
      const fileNameWithExtension = urlParts[urlParts.length - 1];
      // Remove Cloudinary transformations if any
      const cleanFileName = fileNameWithExtension.split("?")[0];
      return cleanFileName;
    } catch (error) {
      return "Unknown file";
    }
  };

  // Helper function to get file extension from URL
  const getFileExtensionFromUrl = (url) => {
    try {
      const fileName = getFileNameFromUrl(url);
      return fileName.split(".").pop()?.toLowerCase() || "";
    } catch (error) {
      return "";
    }
  };

  // Helper function to determine if file is an image based on Cloudinary URL
  const isImageFile = (url) => {
    // Check if it's from Cloudinary image upload (not raw)
    return (
      url.includes("/image/upload/") ||
      ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(
        getFileExtensionFromUrl(url)
      )
    );
  };

  // Helper function to determine if file is a video
  const isVideoFile = (url) => {
    return (
      url.includes("/video/upload/") ||
      ["mp4", "avi", "mov", "wmv", "flv", "webm"].includes(
        getFileExtensionFromUrl(url)
      )
    );
  };

  const getFileIcon = (url) => {
    const extension = getFileExtensionFromUrl(url);

    if (isImageFile(url)) {
      return <Image className="w-5 h-5 text-green-500" />;
    }

    if (isVideoFile(url)) {
      return <FileVideo className="w-5 h-5 text-red-500" />;
    }

    switch (extension) {
      case "mp3":
      case "wav":
      case "flac":
      case "aac":
        return <FileAudio className="w-5 h-5 text-purple-500" />;
      case "zip":
      case "rar":
      case "7z":
      case "tar":
        return <Archive className="w-5 h-5 text-orange-500" />;
      case "pdf":
        return <FileText className="w-5 h-5 text-red-600" />;
      case "doc":
      case "docx":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "xls":
      case "xlsx":
        return <FileText className="w-5 h-5 text-green-600" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleRemoveFile = (id) => {
   
    startTransition(async () => {
      try {
        setLoading(true);
        // Prepare the task data

        let taskData = {};
        if (id) {
          taskData = {
            type: "remove-attachment",
            task: {
              _id: task._id,
              boardId: task.boardId,
              projectId: task.projectId,
            },
            attachmentId: id,
          };
        }

        // Call the API to create or update task
        const response = await updateTask(taskData, session);

        if (response.status === "success") {
          // console.log("task response", response);
          // Show success message
          toast.success(response.message, {
            duration: 1000,
          });
          setFiles(response.data.files);
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


  const handlePreviewFile = (fileUrl) => {
    // Open file in new tab for preview
    window.open(fileUrl, "_blank");
  };

  return (
    <>
      <div className="relative">
        {/* <Icon
          icon="heroicons:paper-clip"
          className="size-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
          onClick={() => setOpen(true)}
        /> */}
          <Button
                  type="button"
                  size="icon"
                  // className="h-8 w-8 bg-default-100 rounded-full hover:bg-default-200"
                   className="h-8 w-8 rounded-full"
                  onClick={() => setOpen(true)}
                >
                  <Icon icon="heroicons:paper-clip" className="w-5 h-5 text-white" />
                </Button>
        {files.length > 0 && (
          <div className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {files.length}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent hiddenCloseIcon size="xl">
          <ScrollArea className="max-h-[85vh] overflow-y-auto p-3">
            <div className="mb-4">
              <div className="-mx-6 -mt-6 bg-white border-b px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 mt-2">
                    <div className="bg-primary/10 p-2.5 rounded-md">
                      <PlusSquare className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-semibold text-gray-800">
                        Task Attachments
                      </DialogTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {files.length} file(s) attached
                      </p>
                    </div>
                  </div>
                  <DialogClose asChild>
                    <div
                      type="button"
                      size="icon"
                      className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </div>
                  </DialogClose>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* File Preview Section */}
              {showPreview && pendingFile && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800">
                      Preview File
                    </h3>
                    <span className="text-sm text-gray-500">
                      Ready to upload
                    </span>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {pendingFile?.preview ? (
                          <img
                            src={pendingFile?.preview}
                            alt={pendingFile?.file?.name}
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            {getFileIcon(pendingFile?.file?.name)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-gray-800 truncate">
                          {pendingFile?.file?.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatFileSize(pendingFile?.file?.size)} •{" "}
                          {pendingFile?.file?.type || "Unknown type"}
                        </p>
                        {pendingFile.preview && (
                          <p className="text-sm text-blue-600 mt-2 flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            Image preview available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={cancelUpload}
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>

                    {loading || isPending ? (
                      <Button>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading ...
                      </Button>
                    ) : (
                      <Button
                        onClick={confirmUpload}
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload File
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Upload Area */}
              {!showPreview && (
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 hover:border-gray-400"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drop a file here or click to browse
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Support for images, documents, videos, and more
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Choose File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileInputChange}
                    />
                  </div>
                </div>
              )}

              {/* Files List */}
              {!showPreview && files.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800">
                      Attached Files
                    </h3>
                    <span className="text-sm text-gray-500">
                      {files.length} file(s)
                    </span>
                  </div>

                  <div className="grid gap-3">
                    {files.filter((file) => file.status !== "deleted").map((file, index) => {
                      const fileName = getFileNameFromUrl(file.file);
                      const isImage = isImageFile(file.file);

                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {isImage ? (
                              <div className="w-10 h-10 rounded-lg overflow-hidden border">
                                <img
                                  src={file.file}
                                  alt={fileName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                {getFileIcon(file.file)}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {file.file_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {isImage
                                  ? "Image"
                                  : isVideoFile(file.file)
                                  ? "Video"
                                  : "File"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handlePreviewFile(file.file)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                         
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              onClick={() => handleRemoveFile(file.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!showPreview && files.length === 0 && (
                <div className="text-center py-8">
                  <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    No files attached yet. Upload a file to get started.
                  </p>
                </div>
              )}
            </div>

            <DialogDescription className="py-0 px-1"></DialogDescription>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Attachments;
