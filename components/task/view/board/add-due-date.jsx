import React, { useTransition } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { updateTask } from "@/action/superadmin/controller";

// Zod validation schema for due date
const schema = z.object({
  dueDate: z.string().min(1, { message: "Due date is required." }),
});

const CreateDueDateModal = ({
  open,
  onClose,
  onConfirm,
  task,
  session,
  setDueDate,
}) => {
  const [isPending, startTransition] = useTransition();
  // console.log("task in due date", task);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    setDueDate(data.dueDate);

    startTransition(async () => {
      try {
        // Prepare the task data
        const taskData = {
          type: "dueDate",
          task,
          data: { dueDate: data.dueDate },
        };

        // console.log("taskData", taskData);

        // Call the API to create or update task
        const response = await updateTask(taskData, session);

        if (response.status === "success") {
          // Show success message
          toast.success(response.message, {
            duration: 1000,
          });

          // Reset form and close modal first
          reset();
          onClose();

          // 🔁 Continue the drag-move process after setting due date
          // Use setTimeout to ensure modal is closed before continuing
          setTimeout(() => {
            onConfirm?.();
          }, 100);
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent hiddenCloseIcon>
        <DialogHeader className="flex-row justify-between items-center py-0">
          <DialogTitle className="text-default-900">Set Due Date</DialogTitle>
          <DialogClose asChild>
            <div
              type="button"
              size="icon"
              className="w-7 h-7 bg-transparent hover:bg-transparent cursor-pointer"
            >
              <X className="w-5 h-5 text-default-900" />
            </div>
          </DialogClose>
        </DialogHeader>

        <DialogDescription className="py-0 pl-1 -mt-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="dueDate" className="text-default-600 mb-1.5">
                Due Date
              </Label>
              <Input
                type="date"
                id="dueDate"
                {...register("dueDate")}
                className={cn("", {
                  "border-destructive focus:border-destructive": errors.dueDate,
                })}
              />
              {errors.dueDate && (
                <p className="text-sm text-destructive mt-1">
                  {errors.dueDate.message}
                </p>
              )}
            </div>

            <div className="flex justify-center gap-4">
              <DialogClose asChild>
                <Button
                  color="destructive"
                  variant="soft"
                  className="min-w-[136px]"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button className="min-w-[136px]" disabled={isPending}>
                Confirm
              </Button>
            </div>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDueDateModal;
