import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);
import { Bell, ChevronDown, Trash2 } from "lucide-react";
import { Loader2, X, CalendarIcon, Clock } from "lucide-react";
import React, { useTransition, useState, useRef } from "react";
// Initialization for ES Users



import { toast } from "react-hot-toast";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
// import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import CustomCalendar from "@/components/calender";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Icon } from "@iconify/react";
import { updateTask } from "@/action/task/controller";

// Validation schema for reminder with due date validation
const createReminderSchema = (dueDate) => {
  return z.object({
    reminderDateTime: z
      .date({
        required_error: "Please select a date and time for the reminder.",
      })
      .refine(
        (date) => {
          if (!dueDate) return false; // No due date means no reminder allowed
          const now = new Date();
          const dueDateObj = new Date(dueDate);
          return date >= now && date <= dueDateObj;
        },
        {
          message: "Reminder must be set between now and the task's due date.",
        }
      ),
    reminderFor: z.enum(["only_me", "assignee", "all"], {
      required_error: "Please select who should receive the reminder.",
    }),
    reminderOn: z.enum(["if_incomplete", "any"], {
      required_error: "Please select when the reminder should be sent.",
    }),
  });
};

const Reminder = ({ task, session, refetchSprint }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const userBoardMapEntry = task.perUserBoardMap?.[session.user.id];

  // Check if task has due date
  const hasDueDate = task?.dueDate;
  const dueDate = hasDueDate ? new Date(task.dueDate) : null;
  const canSetReminder = hasDueDate && dueDate > new Date();
  const hasExistingReminder = task?.reminder || userBoardMapEntry?.reminders;

  // Form setup with dynamic schema
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(createReminderSchema(task?.dueDate)),
    defaultValues: {
      reminderDateTime: null,
      reminderFor: "only_me",
      reminderOn: "if_incomplete",
    },
  });

  const watchedDateTime = watch("reminderDateTime");

  const onClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    if (!canSetReminder) {
      toast.error("Cannot set reminder without a due date");
      return;
    }

    startTransition(async () => {
      try {
        setLoading(true);

        const taskData = {
          type: "set-reminder",
          task: {
            _id: task._id,
            boardId: task.boardId,
            projectId: task.projectId,
          },
          reminder: {
            dateTime: data.reminderDateTime.toISOString(),
            for: data.reminderFor,
            on: data.reminderOn,
          },
        };

        console.log("taskData", taskData);

        const response = await updateTask(taskData, session);

        if (response.status === "success") {
          toast.success("Reminder set successfully", {
            duration: 1000,
          });
          refetchSprint();
          onClose();
        }

        if (response.status === "fail" || response.status === "error") {
          toast.error(response.message, {
            duration: 1000,
          });
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Something went wrong", {
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    });
  };

  const handleRemoveReminder = () => {
    startTransition(async () => {
      try {
        setLoading(true);

        const taskData = {
          type: "remove-reminder",
          task: {
            _id: task._id,
            boardId: task.boardId,
            projectId: task.projectId,
          },
        };

        const response = await updateTask(taskData, session);

        if (response.status === "success") {
          toast.success("Reminder removed successfully", {
            duration: 1000,
          });
          refetchSprint();
          onClose();
        }

        if (response.status === "fail" || response.status === "error") {
          toast.error(response.message, {
            duration: 1000,
          });
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Something went wrong", {
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    });
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "";
    return dayjs(dateTime).format("MMM DD, YYYY at HH:mm");
  };

  const getReminderForLabel = (value) => {
    switch (value) {
      case "only_me":
        return "Only Me";
      case "assignee":
        return "Assignee";
      case "all":
        return "All Members";
      default:
        return value;
    }
  };

  const getReminderOnLabel = (value) => {
    switch (value) {
      case "if_incomplete":
        return "If Task Incomplete";
      case "any":
        return "Any Status";
      default:
        return value;
    }
  };

  // Calculate min and max dates for datetime input
  const minDateTime = dayjs().format("YYYY-MM-DDTHH:mm");
  const maxDateTime = hasDueDate
    ? dayjs(dueDate).format("YYYY-MM-DDTHH:mm")
    : null;

  return (
    <>
      <div className="relative">
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "h-7 w-7",
            !canSetReminder && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => {
            if (!canSetReminder) {
              toast.error("Cannot set reminder without a due date");
              return;
            }
            setOpen(true);
          }}
          disabled={!canSetReminder && !hasExistingReminder}
        >
          <Bell className="h-4 w-4" />
        </Button>

      </div>

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent hiddenCloseIcon size="lg">
          <ScrollArea className="max-h-[85vh] overflow-y-auto p-4">
            <div className="mb-4">
              <div className="-mx-6 -mt-6 bg-white border-b px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 mt-2">
                    <div className="bg-primary/10 p-2.5 rounded-md">
                      <Bell className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-semibold text-gray-800">
                        Set Task Reminder
                      </DialogTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Set a reminder for this task
                      </p>
                    </div>
                  </div>
                  <DialogClose asChild>
                    <div className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors">
                      <X className="w-5 h-5 text-gray-500" />
                    </div>
                  </DialogClose>
                </div>
              </div>
            </div>

            {/* Due Date Info */}
            {hasDueDate && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Task Due Date:</span>{" "}
                  {formatDateTime(dueDate)}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Reminder can be set from now until the due date
                </p>
              </div>
            )}

            {/* No Due Date Warning */}
            {!hasDueDate && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="material-symbols:warning"
                    className="w-5 h-5 text-yellow-600"
                  />
                  <h4 className="font-medium text-yellow-800">
                    No Due Date Set
                  </h4>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  This task doesn't have a due date. Please set a due date first
                  to enable reminders.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-2">
              {/* Date and Time Selection */}
              <div className="space-y-4">
                <div>
                  <Controller
                    name="reminderDateTime"
                    control={control}
                    render={({ field }) => (

                      <div className="w-full">
                      <CustomCalendar
                        value={field.value}
                        onChange={field.onChange}
                        showTime={true}
                        showDate={true}
                        disabled={!canSetReminder}
                        minDate={new Date()} // Use your minDateTime
                        maxDate={dueDate}
                        className="w-full"
                      />
                      </div>
                    )}
                  />
                  {errors.reminderDateTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.reminderDateTime.message}
                    </p>
                  )}
                  {watchedDateTime && (
                    <p className="text-sm text-gray-600 mt-2">
                      Reminder set for: {formatDateTime(watchedDateTime)}
                    </p>
                  )}
                </div>

                {/* Reminder For Selection */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Reminder For
                  </Label>
                  <Controller
                    name="reminderFor"
                    control={control}
                    render={({ field }) => (
                      <div className="mt-2 flex gap-2">
                        <Button
                          type="button"
                          variant={
                            field.value === "only_me" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => field.onChange("only_me")}
                          className="flex-1"
                          disabled={!canSetReminder}
                        >
                          Only Me
                        </Button>
                        <Button
                          type="button"
                          variant={
                            field.value === "assignee" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => field.onChange("assignee")}
                          className="flex-1"
                          disabled={!canSetReminder}
                        >
                          Assignee
                        </Button>
                        <Button
                          type="button"
                          variant={
                            field.value === "all" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => field.onChange("all")}
                          className="flex-1"
                          disabled={!canSetReminder}
                        >
                          All Members
                        </Button>
                      </div>
                    )}
                  />
                  {errors.reminderFor && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.reminderFor.message}
                    </p>
                  )}
                </div>

                {/* Reminder On Selection */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Reminder Condition
                  </Label>
                  <Controller
                    name="reminderOn"
                    control={control}
                    render={({ field }) => (
                      <div className="mt-2 flex gap-2">
                        <Button
                          type="button"
                          variant={
                            field.value === "if_incomplete"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => field.onChange("if_incomplete")}
                          className="flex-1"
                          disabled={!canSetReminder}
                        >
                          If Task Incomplete
                        </Button>
                        <Button
                          type="button"
                          variant={
                            field.value === "any" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => field.onChange("any")}
                          className="flex-1"
                          disabled={!canSetReminder}
                        >
                          Any Status
                        </Button>
                      </div>
                    )}
                  />
                  {errors.reminderOn && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.reminderOn.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Choose whether to send reminder regardless of task status or
                    only if incomplete
                  </p>
                </div>
              </div>

              {/* Current Reminder Display */}
              {userBoardMapEntry?.reminders?.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-900">
                      Current Reminder
                    </h4>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={handleRemoveReminder}
                      disabled={loading || isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p>
                      <span className="font-medium">Date & Time:</span>{" "}
                      {formatDateTime(userBoardMapEntry.reminders[0]?.dateTime)}
                    </p>
                    <p>
                      <span className="font-medium">For:</span>{" "}
                      {getReminderForLabel(userBoardMapEntry.reminders[0]?.for)}
                    </p>
                    <p>
                      <span className="font-medium">Condition:</span>{" "}
                      {getReminderOnLabel(userBoardMapEntry.reminders[0]?.on)}
                    </p>
                    <p>
                      <span className="font-medium">Created By:</span>{" "}
                      {userBoardMapEntry.reminders[0]?.by.name}(
                      {userBoardMapEntry.reminders[0]?.by.employeeCode})
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading || isPending}
                >
                  Cancel
                </Button>
                {loading || isPending ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!canSetReminder}
                    className={cn(
                      !canSetReminder && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Set Reminder
                  </Button>
                )}
              </div>
            </form>

            <DialogDescription className="py-0 px-1"></DialogDescription>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Reminder;
