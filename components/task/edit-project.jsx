import { Button } from "@/components/ui/button";
import { ChevronDown, Settings } from "lucide-react";
import React, { useTransition, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
// import { updateProject } from "@/action/project/controller";
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
import { X, Eye } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { updateSprint } from "@/action/task/controller";

const schema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  defaultView: z.enum(["list", "board"]).default("board"),
});

const EditProject = ({ project, session, refetchSprint }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      defaultView: "board",
    },
  });

  const watchedStartDate = watch("startDate");
  const watchedEndDate = watch("endDate");

  // Populate form with project data when dialog opens
  useEffect(() => {
    if (project && open) {
      reset({
        name: project.name || "",
        description: project.description || "",
        startDate: project.startDate
          ? new Date(project.startDate).toISOString().split("T")[0]
          : "",
        endDate: project.endDate
          ? new Date(project.endDate).toISOString().split("T")[0]
          : "",
        defaultView: project.defaultView || "board",
      });
    }
  }, [project, open, reset]);

  const onClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    // Validate date range atleast one item present
    if (
      !data.name &&
      !data.description &&
      !data.startDate &&
      !data.endDate &&
      !data.defaultView
    ) {
      toast.error("At least one field is required.");
      return;
    }

    startTransition(async () => {
      try {
        setLoading(true);

        const payload = {
          type: "edit-sprint",
          sprint: project._id,
          data: {
            name: data.name || project.name,
            description: data.description || project.description,
            startDate: data.startDate || project.startDate,
            endDate: data.endDate || project.endDate,
            defaultView: data.defaultView || project.data.defaultView,
          },
        };

        // Call the API to create or update task
        const response = await updateSprint(payload, session);

        if (response.status === "success") {
          toast.success("Project updated successfully", {
            duration: 2000,
          });
          setLoading(false);
          onClose();
          // Page reload or refetch data
          refetchSprint();
          // window.location.reload();
        } else {
          toast.error(response?.message || "Failed to update project", {
            duration: 3000,
          });
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.message || "Something went wrong", {
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
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => setOpen(true)}
        >
          <Icon icon="heroicons:pencil" className="h-4 w-4" />
        </Button>
      </div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent hiddenCloseIcon size="xl">
          <ScrollArea className="max-h-[85vh] overflow-y-auto p-3">
            <div className="mb-4">
              <div className="-mx-6 -mt-6 bg-white border-b px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 mt-2">
                    <div className="bg-primary/10 p-2.5 rounded-md">
                      <Settings className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-semibold text-gray-800">
                        Edit Project
                      </DialogTitle>
                      <p className="text-gray-500 text-sm">
                        Update project details and settings
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

            <DialogDescription className="py-0 px-1">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Project Name */}
                <div>
                  <Label
                    htmlFor="projectName"
                    className="text-default-600 mb-1.5 font-medium"
                  >
                    Project Name
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Input
                    type="text"
                    {...register("name")}
                    id="projectName"
                    placeholder="Enter project name"
                    className={cn(
                      "rounded-md border-input/50 focus:border-primary",
                      {
                        "border-destructive focus:border-destructive":
                          errors.name,
                      }
                    )}
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Date Range */}
                {project?.group?.title !== "Personal" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="startDate"
                      className="text-default-600 mb-1.5 font-medium"
                    >
                      Start Date
                      <span className="text-destructive ml-0.5">*</span>
                    </Label>
                    <Input
                      type="date"
                      {...register("startDate")}
                      id="startDate"
                      className={cn(
                        "rounded-md border-input/50 focus:border-primary",
                        {
                          "border-destructive focus:border-destructive":
                            errors.startDate,
                        }
                      )}
                    />
                    {errors.startDate && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.startDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="endDate"
                      className="text-default-600 mb-1.5 font-medium"
                    >
                      End Date<span className="text-destructive ml-0.5">*</span>
                    </Label>
                    <Input
                      type="date"
                      {...register("endDate")}
                      id="endDate"
                      min={watchedStartDate}
                      className={cn(
                        "rounded-md border-input/50 focus:border-primary",
                        {
                          "border-destructive focus:border-destructive":
                            errors.endDate,
                        }
                      )}
                    />
                    {errors.endDate && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.endDate.message}
                      </p>
                    )}
                  </div>
                </div>
                )}

                {/* Default View */}
                <div>
                  <Label className="text-default-600 mb-1.5 font-medium">
                    Default View
                  </Label>
                  <Controller
                    control={control}
                    name="defaultView"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="border-input/50 rounded-md">
                          <SelectValue placeholder="Select default view" />
                        </SelectTrigger>
                        <SelectContent className="z-[1000]">
                          <SelectItem value="list">
                            <div className="flex items-center">
                              <div className="w-4 h-4 mr-2 flex flex-col gap-1">
                                <div className="h-0.5 bg-current"></div>
                                <div className="h-0.5 bg-current"></div>
                                <div className="h-0.5 bg-current"></div>
                              </div>
                              List View
                            </div>
                          </SelectItem>
                          <SelectItem value="board">
                            <div className="flex items-center">
                              <div className="w-4 h-4 mr-2 grid grid-cols-3 gap-0.5">
                                <div className="bg-current rounded-sm"></div>
                                <div className="bg-current rounded-sm"></div>
                                <div className="bg-current rounded-sm"></div>
                              </div>
                              Board View
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-4 mt-6 border-t">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="min-w-[120px] rounded-full"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="min-w-[140px] rounded-full bg-primary hover:bg-primary/90"
                    disabled={isPending || loading}
                  >
                    {isPending || loading ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Updating...
                      </>
                    ) : (
                      "Update Project"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditProject;
