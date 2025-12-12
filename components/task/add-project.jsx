import { Button } from "@/components/ui/button";
import { Plus, ChevronDown } from "lucide-react";
import React, { useTransition, useState } from "react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
// import { revalidateCurrentPath, createProject } from "@/action/project/controller";
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
  Check,
  ChevronsUpDown,
  FolderPlus,
  Users,
  Calendar,
  Eye,
} from "lucide-react";
import { Label } from "@/components/ui/label";
// import { getEmployeeList } from "@/action/employee/controller";
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
import {
  getEmployeeAndProjectist,
  createTaskProject,
  getDepartmentEmployees,
} from "@/action/task/controller";

const schema = z.object({
  name: z.string().min(2, { message: "Project name is required." }),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  members: z.array(z.string()).optional(),
  defaultView: z.enum(["list", "board"]).default("board"),
});

const AddProject = ({
  open,
  setOpen,
  groupId,
  session,
  groupClicked,
}) => {
  const [isPending, startTransition] = useTransition();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [memberPopoverOpen, setMemberPopoverOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // Filter out the current user from employee list
  const employeeList = departmentEmployees?.data?.filter(
    (employee) => employee.employeeCode !== session?.user?.id
  );

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
      members: [],
      defaultView: "board",
    },
  });

  const watchedStartDate = watch("startDate");
  const watchedEndDate = watch("endDate");

  const onClose = () => {
    setOpen(false);
    reset();
    setSelectedMembers([]);
  };

  // Handle member selection (multiple selection enabled by default)
  const handleMemberSelect = (employeeId) => {
    const updatedMembers = selectedMembers.includes(employeeId)
      ? selectedMembers.filter((id) => id !== employeeId)
      : [...selectedMembers, employeeId];

    setSelectedMembers(updatedMembers);
    setValue("members", updatedMembers);
    setMemberPopoverOpen(false);
  };

  // Remove member from selection
  const removeMember = (employeeId) => {
    const updatedMembers = selectedMembers.filter((id) => id !== employeeId);
    setSelectedMembers(updatedMembers);
    setValue("members", updatedMembers);
  };

  const onSubmit = (data) => {
    // Validate date range
    if (new Date(data.startDate) >= new Date(data.endDate)) {
      toast.error("End date must be after start date.");
      return;
    }

    startTransition(async () => {
      try {
        // validate startDate and endDate in case of groupClicked Not Personal
        if (groupClicked.label !== "Personal") {
          if (!data.startDate || !data.endDate) {
            toast.error("Start date and end date are required.");
            return;
          }

          if (!data.members.length) {
            toast.error("At least one member is required.");
            return;
          }
        }

        //validate name, members, defaultView
        if (!data.name) {
          toast.error("Project name is required.");
          return;
        }

        if (!data.defaultView) {
          toast.error("Default view is required.");
          return;
        }

        setLoading(true);
        // Prepare the project data
        const projectData = {
          type: "main-after",
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          members: selectedMembers.map((id) => ({ employeeCode: id })),
          defaultView: data.defaultView,
          groupId: groupId,
        };

        // Call the API to create project
        const response = await createTaskProject(projectData, session);

        if (response.status === "success") {
          toast.success("Project created successfully", {
            duration: 2000,
          });
          setLoading(false);
          onClose();
          // page reload
          window.location.reload();
          // Add any additional actions like refetch here
        } else {
          toast.error(response?.message || "Failed to create project", {
            duration: 3000,
          });
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.message || "Something went wrong", {
          duration: 3000,
        });
        setLoading(false); // Add this
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent hiddenCloseIcon size="xl">
        <ScrollArea className="max-h-[85vh] overflow-y-auto p-3">
          <div className="mb-4">
            <div className="-mx-6 -mt-6 bg-white border-b px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 mt-2">
                  <div className="bg-primary/10 p-2.5 rounded-md">
                    <FolderPlus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                      Create New Project
                    </DialogTitle>
                    <p className="text-gray-500 text-sm">
                      Fill in the details to create a new project
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
                  Project Name<span className="text-destructive ml-0.5">*</span>
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
              </div>

              {/* Date Range */}

              {groupClicked.label !== "Personal" && (
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
                      defaultValue={field.value}
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

              {/* Team Members */}
              {groupClicked.label !== "Personal" && (
                <div>
                  <Label className="text-default-600 mb-1.5 font-medium">
                    Team Members
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Popover
                    open={memberPopoverOpen}
                    onOpenChange={setMemberPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={memberPopoverOpen}
                        className="w-full justify-between border-input/50 rounded-md hover:bg-background/80"
                      >
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          {selectedMembers.length > 0
                            ? `${selectedMembers.length} member${
                                selectedMembers.length > 1 ? "s" : ""
                              } selected`
                            : "Select team members"}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 z-[1000]">
                      <Command className="rounded-lg border-none">
                        <CommandInput
                          placeholder="Search members..."
                          className="border-b"
                        />
                        <CommandEmpty>No employee found.</CommandEmpty>
                        <CommandGroup className="max-h-[200px] overflow-auto">
                          {employeeList?.map((employee) => (
                            <CommandItem
                              key={employee.employeeCode}
                              value={employee.name}
                              onSelect={() =>
                                handleMemberSelect(employee.employeeCode)
                              }
                              className="flex items-center cursor-pointer hover:bg-muted"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4 text-primary",
                                  selectedMembers.includes(
                                    employee.employeeCode
                                  )
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {employee.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {employee.departmentName} •{" "}
                                  {employee.employeeCode}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Selected Members Display */}
                  {selectedMembers.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {selectedMembers.map((memberId) => {
                          const member = employeeList?.find(
                            (e) => e.employeeCode === memberId
                          );
                          return (
                            <div
                              key={memberId}
                              className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm"
                            >
                              <span className="font-medium">
                                {member?.name}
                              </span>
                              <span className="text-xs opacity-75">
                                ({member?.employeeCode})
                              </span>
                              <X
                                className="h-3.5 w-3.5 cursor-pointer ml-1 hover:text-destructive"
                                onClick={() => removeMember(memberId)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

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
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Creating...
                    </>
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </div>
            </form>
          </DialogDescription>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddProject;
