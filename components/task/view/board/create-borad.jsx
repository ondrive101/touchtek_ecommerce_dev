import React, { useTransition } from "react";

import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";

import { createBoard, editBoard, revalidateCurrentPath } from "@/action/superadmin/controller";
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

const schema = z.object({
  name: z.string().min(2, { message: "Your email is invalid." }),
  status: z.string().optional(),
  color: z.string().optional(),
});
const CreateBoard = ({ open, onClose,board,project, refetchSprint, session }) => {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  
  const onSubmit = (data) => {
    if (board) {
      startTransition(async () => {
        try {
          const payload = {
            id: boardId,
            projectId: project._id,
            name: data.name,
            status: data.status,
            color: data.color,
          };

        

          const response = await editBoard(payload, session);

          if (response.status === "success") {
            toast.success("Board updated successfully", {
              autoClose: 1000,
            });
        
          }
          if (response.status === "fail" || response.status === "error") {
            toast.error(response.message, {
              autoClose: 1000,
            });
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message, {
            autoClose: 1000,
          });
        }
      });
    } else {
    
      startTransition(async () => {
        try {
          const payload = {
            name: data.name,
            projectId: project._id,
            status: data.status,
            color: data.color,
          };

          const response = await createBoard(payload, session);

          if (response.status === "success") {
            toast.success("Board created successfully", {
              autoClose: 1000,
            });
            refetchSprint?.();
          }
          if (response.status === "fail" || response.status === "error") {
            toast.error(response.message, {
              autoClose: 1000,
            });
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message, {
            autoClose: 1000,
          });
        }
      });

    }

    onClose();
    reset();
  };
  React.useEffect(() => {
    setValue("name", board?.name || "");
    setValue("status", board?.status || "active");
    setValue("color", board?.color || "#6338f0");
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent hiddenCloseIcon>
        <DialogHeader className="flex-row justify-between items-center py-0 ">
          <DialogTitle className="text-default-900">Create Board</DialogTitle>
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
          <form onSubmit={handleSubmit(onSubmit)} className=" space-y-5">
            <div>
              <Label htmlFor="boradName" className="text-default-600 mb-1.5">
                Board Name
              </Label>
              <Input
                type="text"
                {...register("name")}
                id="boardName"
                className={cn("", {
                  "border-destructive focus:border-destructive": errors.name,
                })}
              />
            </div>
            <div>
              <Label htmlFor="color" className="text-default-600 mb-1.5">
                Assign Color
              </Label>
              <Input
                type="color"
                name="color"
                {...register("color")}
                className="p-0 border-none rounded-md"
                defaultValue="#6338f0"
              />
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
              <Button className="min-w-[136px]">Create Board</Button>
            </div>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoard;
