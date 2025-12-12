import { Button } from "@/components/ui/button";
import { Plus, ChevronDown } from "lucide-react";
import {
  Loader2,
  Users,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  User,
  Crown,
  Edit3,
  Eye,
  Settings,
} from "lucide-react";
import React, { useTransition, useState } from "react";
import {
  revalidateCurrentPath,
  updateTask,
  addTaskFile,
  getDepartmentEmployees,
} from "@/action/task/controller";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, PlusSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProjectMembers = ({ task, session, refetchSprint, project }) => {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState(task?.tagFull || []);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setMembers(task?.tagFull || []);
  }, [task?.tagFull]);

  const getRoleBadge = (role) => {
    if (role === "editor") {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <Edit3 className="w-3 h-3 mr-1" />
          Editor
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-100 text-gray-800 border-gray-200">
        <Eye className="w-3 h-3 mr-1" />
        Viewer
      </Badge>
    );
  };

  const getCreatorBadge = () => {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
        <Crown className="w-3 h-3 mr-1" />
        Creator
      </Badge>
    );
  };

  const getPriorityColor = (index) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    return colors[index % colors.length];
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
          toast.success("Member updated successfully", {
            duration: 1000,
          });

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

  return (
    <>
      <div className="relative">
        <Button
          type="button"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => setOpen(true)}
        >
          <Icon icon="heroicons:eye" className="w-5 h-5 text-white" />
        </Button>

        {members.length > 0 && (
          <div className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {members.length}
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
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-semibold text-gray-800">
                        Followers
                      </DialogTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {members.length} member(s) in this project
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
              {/* Project Members List */}
              {members.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800">
                      Team Members
                    </h3>
                    <span className="text-sm text-gray-500">
                      {members.length} member(s)
                    </span>
                  </div>

                  <div className="grid gap-4">
                    {members.map((member, index) => (
                      <div
                        key={member.employeeCode}
                        className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            {/* Avatar */}
                            <div
                              className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg",
                                getPriorityColor(index)
                              )}
                            >
                              {member.name.charAt(0).toUpperCase()}
                            </div>

                            {/* Member Details */}
                            <div className="flex-1 space-y-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-lg font-semibold text-gray-800">
                                    {member.name}
                                  </h4>
                                  <Badge variant="outline" className="text-xs">
                                    {member.employeeCode}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {member.role === "editor"
                                    ? "Can edit and view project"
                                    : "Can only view project"}
                                </p>
                              </div>

                              {/* Role Badge */}
                              <div className="flex flex-wrap gap-2 items-center">
                                <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                                  <Eye className="w-3 h-3 mr-1" />
                                  Commentator
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <>
                              {/* Role Change Dropdown */}
                              {/* <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                      disabled={loading || isPending}
                                    >
                                      <Settings className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    className="w-[100px] z-[1000]"
                                    align="end"
                                  >
                                    {["editor", "viewer"]?.map((role) => (
                                      <DropdownMenuItem
                                        onSelect={() => {
                                          handleSaveEditTask(task, { member, role });
                                        }}
                                        className="text-[10px] leading-[14px] font-semibold  text-default-600 py-1"
                                        key={`key-dropdown-${role}`}
                                      >
                                        {role}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu> */}

                              {/* Remove Member Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() =>
                                  handleSaveEditTask(task, {
                                    member,
                                    deleteFollower: true,
                                  })
                                }
                                disabled={loading || isPending}
                              >
                                {loading || isPending ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Empty State for Members */
                <div className="text-center py-8">
                  <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    No Team Members
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Only the project creator has access to this project.
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

export default ProjectMembers;
