import { Button } from "@/components/ui/button";
import { Target, ChevronDown, Trash2 } from "lucide-react";
import { Loader2, X } from "lucide-react";
import React, { useTransition, useState } from "react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Icon } from "@iconify/react";
import { updateTask } from "@/action/task/controller";

// Validation schema for target
const createTargetSchema = z.object({
  targetValue: z
    .number({
      required_error: "Please enter a target value.",
      invalid_type_error: "Target value must be a number.",
    })
    .min(0.01, "Target value must be greater than 0")
    .max(999999999, "Target value is too large"),
  targetUnit: z.enum(["QTY", "AMT"], {
    required_error: "Please select a unit for the target.",
  }),
});

const TargetSetting = ({ task, session, refetchSprint, type }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const userBoardMapEntry = task.perUserBoardMap?.[session.user.id];

  // Check if task has existing target
  const hasExistingTarget = task?.target || userBoardMapEntry?.target;

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(createTargetSchema),
    defaultValues: {
      targetValue: null,
      targetUnit: "QTY",
    },
  });

  const watchedValue = watch("targetValue");
  const watchedUnit = watch("targetUnit");

  const onClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    startTransition(async () => {
      try {
        setLoading(true);

        const taskData = {
          type: "set-target",
          task: {
            _id: task._id,
            boardId: task.boardId,
            projectId: task.projectId,
          },
          target: {
            type: type,
            value: data.targetValue,
            unit: data.targetUnit,
          },
        };

        console.log("taskData", taskData);

        const response = await updateTask(taskData, session);

        if (response.status === "success") {
          toast.success("Target set successfully", {
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

  const handleRemoveTarget = () => {
    startTransition(async () => {
      try {
        setLoading(true);

        const taskData = {
          type: "remove-target",
          task: {
            _id: task._id,
            boardId: task.boardId,
            projectId: task.projectId,
          },
        };

        const response = await updateTask(taskData, session);

        if (response.status === "success") {
          toast.success("Target removed successfully", {
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

  const formatTargetValue = (value, unit) => {
    if (!value) return "";
    const formattedValue =
      typeof value === "number" ? value.toLocaleString() : value;
    return `${formattedValue} ${unit}`;
  };

  const getUnitLabel = (unit) => {
    switch (unit) {
      case "QTY":
        return "Quantity";
      case "AMT":
        return "Amount";
      default:
        return unit;
    }
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
          <Target className="h-4 w-4" />
        </Button>

        {/* Target indicator */}
        {hasExistingTarget && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            <Target className="h-3 w-3" />
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent hiddenCloseIcon size="lg">
          <ScrollArea className="max-h-[85vh] overflow-y-auto p-4">
            <div className="mb-4">
              <div className="-mx-6 -mt-6 bg-white border-b px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 mt-2">
                    <div className="bg-green-500/10 p-2.5 rounded-md">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-semibold text-gray-800">
                        {type === "target"
                          ? "Set Task Target"
                          : "Set Task Achievement"}
                      </DialogTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {type === "target"
                          ? "Set a measurable target for this task"
                          : "Set a measurable achievement for this task"}
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

            {/* Target Info */}
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <span className="font-medium">Task:</span> {task.name}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Set a specific, measurable target to track progress
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-2">
              {/* Target Value and Unit */}
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="targetValue"
                    className="text-sm font-medium text-gray-700"
                  >
                    Target Value
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <div className="flex-1">
                      <Controller
                        name="targetValue"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="number"
                            placeholder="Enter target value"
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value ? parseFloat(value) : null);
                            }}
                            min="0"
                            step="0.01"
                            className={cn(
                              errors.targetValue &&
                                "border-red-300 focus:border-red-500"
                            )}
                          />
                        )}
                      />
                      {errors.targetValue && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.targetValue.message}
                        </p>
                      )}
                    </div>

                    {type === "target" && (
                      <div className="w-24">
                        <Controller
                          name="targetUnit"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                              <SelectContent className="z-[1000]">
                                <SelectItem value="QTY">QTY</SelectItem>
                                <SelectItem value="AMT">AMT</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.targetUnit && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.targetUnit.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  {watchedValue && watchedUnit && (
                    <p className="text-sm text-gray-600 mt-2">
                      Target: {formatTargetValue(watchedValue, watchedUnit)}
                    </p>
                  )}
                </div>
              </div>

              {/* Current Target Display */}
              {(task?.target || userBoardMapEntry?.target) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-900">
                      Current Target
                    </h4>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={handleRemoveTarget}
                      disabled={loading || isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1 text-sm text-green-800">
                    <p>
                      <span className="font-medium">Value:</span>{" "}
                      {formatTargetValue(
                        task?.target?.value || userBoardMapEntry?.target?.value,
                        task?.target?.unit || userBoardMapEntry?.target?.unit
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Unit:</span>{" "}
                      {getUnitLabel(
                        task?.target?.unit || userBoardMapEntry?.target?.unit
                      )}
                    </p>
                    {(task?.target?.createdBy ||
                      userBoardMapEntry?.target?.createdBy) && (
                      <p>
                        <span className="font-medium">Created By:</span>{" "}
                        {task?.target?.createdBy?.name ||
                          userBoardMapEntry?.target?.createdBy?.name}
                        {task?.target?.createdBy?.employeeCode &&
                          ` (${task?.target?.createdBy?.employeeCode})`}
                      </p>
                    )}
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
                  <Button type="submit">
                    <Target className="mr-2 h-4 w-4" />
                    Set Target
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

export default TargetSetting;
