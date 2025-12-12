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
} from "lucide-react";
import React, { useTransition, useState } from "react";
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
import { X, PlusSquare, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { updateTask } from "@/action/task/controller";

const ForwardedPersons = ({ task, session, refetchSprint }) => {
  const [open, setOpen] = useState(false);
  const [forwardedPersons, setForwardedPersons] = useState(
    task?.forwardTo || []
  );
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const userBoardMap = task.perUserBoardMap?.[session.user.id];

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setForwardedPersons(task?.forwardTo || []);
  }, [task?.forwardTo]);

  const getStatusBadge = (status, completedAt, verifiedAt) => {
    if (verifiedAt) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      );
    }
    if (completedAt) {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <UserCheck className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    }
    if (status === "in-progress") {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          In Progress
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-100 text-gray-800 border-gray-200">
        <Clock className="w-3 h-3 mr-1" />
        Pending
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

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRemoveForwardedPerson = (employeeCode) => {
    startTransition(async () => {
      try {
        setLoading(true);

        const taskData = {
          type: "remove-forwarded-person",
          task: {
            _id: task._id,
            boardId: task.boardId,
            projectId: task.projectId,
          },
          employeeCode: employeeCode,
        };

        const response = await updateTask(taskData, session);

        if (response.status === "success") {
          toast.success("Person removed from forwarded list", {
            duration: 2000,
          });
          setForwardedPersons(response.data.forwardTo || []);
          refetchSprint();
        } else {
          toast.error(response.message || "Failed to remove person", {
            duration: 2000,
          });
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Something went wrong", {
          duration: 3000,
        });
        setLoading(false);
      }
    });
  };

  return (
    <>
      <div className="relative">
        <Button
          type="button"
          size="icon"
          // className="h-8 w-8 bg-default-100 rounded-full hover:bg-default-200"
           className="h-8 w-8 rounded-full"
          onClick={() => setOpen(true)}
        >
          <Icon icon="heroicons:eye" className="w-5 h-5 text-white" />
        </Button>

        {forwardedPersons.length > 0 && (
          <div className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {forwardedPersons.length}
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
                        Forwarded Persons
                      </DialogTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {forwardedPersons.length} person(s) assigned to this
                        task
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
              {/* Forwarded Persons List */}
              {forwardedPersons.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800">
                      Assigned Team Members
                    </h3>
                    <span className="text-sm text-gray-500">
                      {forwardedPersons.length} member(s)
                    </span>
                  </div>

                  <div className="grid gap-4">
                    {forwardedPersons.map((person, index) => (
                      <div
                        key={index}
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
                              {person.to.name.charAt(0).toUpperCase()}
                            </div>

                            {/* Person Details */}
                            <div className="flex-1 space-y-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-lg font-semibold text-gray-800">
                                    {person.to.name}
                                  </h4>
                                  <Badge variant="outline" className="text-xs">
                                    {person.to.employeeCode}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Forwarded by{" "}
                                  <span className="font-medium">
                                    {person.by.name}
                                  </span>
                                  <span className="text-gray-400">
                                    {" "}
                                    ({person.by.employeeCode})
                                  </span>
                                </p>
                              </div>

                              {/* Status and Dates */}
                              <div className="flex flex-wrap gap-2 items-center">
                                {/* {getStatusBadge(person.status, person.completedAt, person.verifiedAt)} */}
                                {/* <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {userBoardMap?.boardName}
                                </Badge> */}

                                {task.perUserBoardMap?.[person.to.employeeCode].completedAt === null ? (
                                  <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {task.perUserBoardMap?.[person.to.employeeCode].boardName}
                                  </Badge>
                                ) : (
                                  <Badge className="bg-green-100 text-green-800 border-green-200">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {task.perUserBoardMap?.[person.to.employeeCode].boardName}
                                  </Badge>
                                )}

                                {task.perUserBoardMap?.[person.to.employeeCode].verifiedAt === null && (
                                  <Badge className="bg-red-100 text-red-800 border-red-200">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Unverified
                                  </Badge>
                                )}
                              </div>

                              {/* Department Info */}
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Icon
                                    icon="heroicons:building-office"
                                    className="w-3 h-3"
                                  />
                                  {person.by.departmentName}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Icon
                                    icon="heroicons:identification"
                                    className="w-3 h-3"
                                  />
                                  {person.by.departmentId}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() =>
                                handleRemoveForwardedPerson(
                                  person.to.employeeCode
                                )
                              }
                              disabled={loading || isPending}
                            >
                              {loading || isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-12">
                  <div className="bg-gray-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    No Forwarded Persons
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    This task hasn't been forwarded to any team members yet.
                  </p>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Person
                  </Button>
                </div>
              )}

              {/* Summary Stats */}
              {forwardedPersons.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h4 className="font-medium text-gray-800 mb-3">
                    Task Progress Summary
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-blue-600">
                        {forwardedPersons.length}
                      </div>
                      <div className="text-xs text-gray-600">
                        Total Assigned
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-yellow-600">
                        {
                          forwardedPersons.filter(
                            (p) => !p.completedAt && !p.verifiedAt
                          ).length
                        }
                      </div>
                      <div className="text-xs text-gray-600">Pending</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-blue-600">
                        {
                          forwardedPersons.filter(
                            (p) => p.completedAt && !p.verifiedAt
                          ).length
                        }
                      </div>
                      <div className="text-xs text-gray-600">Completed</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-green-600">
                        {forwardedPersons.filter((p) => p.verifiedAt).length}
                      </div>
                      <div className="text-xs text-gray-600">Verified</div>
                    </div>
                  </div>
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

export default ForwardedPersons;
