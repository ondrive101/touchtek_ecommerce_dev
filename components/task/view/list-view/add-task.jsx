import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);
import { Plus, ChevronDown } from "lucide-react";

import React, { useTransition, useState } from "react";

import { toast } from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useForm, Controller } from "react-hook-form";

import { revalidateCurrentPath, createTask } from "@/action/task/controller";
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
  PopoverClose,
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
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { getEmployeeAndProjectist } from "@/action/task/controller";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { useQuery } from "@tanstack/react-query";

import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";

import { useSession } from "next-auth/react";
// Function to get top 5 users by task count
const getTop5UsersByTaskCount = (tasks) => {
  const userTaskMap = {};

  // Count tasks per user and keep employeeCode
  tasks.forEach(task => {
    task.assignedToFull?.forEach(assignee => {
      const { name, employeeCode } = assignee;
      if (!userTaskMap[name]) {
        userTaskMap[name] = { name, employeeCode, count: 0 };
      }
      userTaskMap[name].count += 1;
    });
  });

  // Convert to array and sort by task count (descending)
  const sortedUsers = Object.values(userTaskMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Get top 5

  return sortedUsers;
};

const schema = z.object({
  name: z.string().min(2, { message: "Task name is required." }),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  project: z.string().optional(),
  priority: z.string().optional(),
  assignedTo: z.array(z.string()).optional(),
  multipleAssignees: z.boolean().optional(),
  boardId: z.string().optional(),
  status: z.string().optional(),
});

const AddTask = ({ project, refetchSprint }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [multipleAssignees, setMultipleAssignees] = useState(false);
  const [employeePopoverOpen, setEmployeePopoverOpen] = useState(false);
  const session = useSession();
  console.log("project", project);
  const currentUserTasks = project?.tasks?.filter(
    (task) => task.createdByDepartment.employeeId === session?.data?.user?.id
  ).map((task) => {
    return {
      taskId: task.taskId,
      assignedToFull: task.assignedToFull,
    }
  });


  console.log('currentusertasks',currentUserTasks)

  const top5assignee = getTop5UsersByTaskCount(currentUserTasks);

  console.log('top5assignee',top5assignee)

  const {
    data: employeeAndProjectsData,
    isLoading: employeeAndProjectsLoading,
    error: employeeAndProjectsError,
    refetch: employeeAndProjectsRefetch,
  } = useQuery({
    queryKey: ["department-employees-Query", session?.data],
    queryFn: () => getEmployeeAndProjectist(session?.data),
    enabled: !!session?.data,
    staleTime: Infinity, // prevent re-fetching
    cacheTime: Infinity,
  });

  // filter out the current user
  // const employeeList = employeeAndProjectsData?.data?.employees?.filter(
  //   (employee) =>{
  //     return employee.employeeCode !== session?.data?.user?.id
  //   }
  // );

  const memberCodes = project?.members?.map((m) => m.employeeCode);

  const employeeList = employeeAndProjectsData?.data?.employees?.filter(
    (employee) => memberCodes?.includes(employee.employeeCode) && employee.employeeCode !== session?.data?.user?.id
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
      priority: "medium",
      assignedTo: [],
      multipleAssignees: false,
      status: "pending",
    },
  });

  // Handle employee selection
  const handleEmployeeSelect = (employeeId) => {
    if (multipleAssignees) {
      setSelectedEmployees(
        selectedEmployees.includes(employeeId)
          ? selectedEmployees.filter((id) => id !== employeeId)
          : [...selectedEmployees, employeeId]
      );
    } else {
      setSelectedEmployees([employeeId]);
      setEmployeePopoverOpen(false);
    }
    setValue(
      "assignedTo",
      multipleAssignees ? selectedEmployees : [employeeId]
    );
  };

  const onClose = () => {
    setOpen(false);
    setSelectedEmployees([]);
    setMultipleAssignees(false);
    reset(); // Reset form when dialog closes
  };

  const onSubmit = (data) => {
    // validate all fields
    if (!data.name) {
      toast.error("Task name is required.");
      return;
    }
    if (!data.priority) {
      toast.error("Priority is required.");
      return;
    }
    if (!data.assignedTo) {
      toast.error("Please assign an employee.");
      return;
    }
    startTransition(async () => {
      try {
        // Prepare the task data
        const taskData = {
          ...data,
          boardId: project?.boards.find((board) => board.order === 1)?.boardId,
          projectId: project?._id,
          assignedTo: multipleAssignees
            ? selectedEmployees
            : selectedEmployees.slice(0, 1),
          dueDate: data.dueDate || null,
        };

        // Call the API to create or update task
        const response = await createTask(taskData, session?.data);

        if (response.status === "success") {
          // Show success message
          toast.success("Task created successfully", {
            duration: 1000,
          });

          // Close modal and reset form
          onClose();
          reset();
          setSelectedEmployees([]);
          setMultipleAssignees(false);
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

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4" />
        Add
        <ChevronDown className="w-3 h-3 ml-1" />
      </Button>

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent hiddenCloseIcon size="xl">
          <ScrollArea className=" max-h-[85vh] overflow-y-auto p-3">
            <div className="mb-4">
              <div className="-mx-6 -mt-6 bg-white border-b px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 mt-2">
                    <div className="bg-primary/10 p-2.5 rounded-md">
                      <PlusSquare className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-semibold text-gray-800">
                        Create New Task
                      </DialogTitle>
                      <p className="text-gray-500 text-sm">
                        Fill in the details to create a new task
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
            <DialogDescription className="py-0 px-1">
              <form
                onSubmit={(e) => {
                  // console.log("Form submitted event", e);
                  return handleSubmit(onSubmit)(e);
                }}
                className="space-y-4"
              >
                {/* Task Name */}
                <div>
                  <Label
                    htmlFor="taskName"
                    className="text-default-600 mb-1.5 font-medium"
                  >
                    Task Name<span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Input
                    type="text"
                    {...register("name")}
                    id="taskName"
                    placeholder="Enter task name"
                    className={cn(
                      "rounded-md border-input/50 focus:border-primary",
                      {
                        "border-destructive focus:border-destructive":
                          errors.name,
                      }
                    )}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-default-600 mb-1.5 font-medium">
                      Priority
                    </Label>
                    <Controller
                      control={control}
                      name="priority"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="border-input/50 rounded-md">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent className="z-[1000]">
                            <SelectItem
                              value="low"
                              className="flex items-center"
                            >
                              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                              Low
                            </SelectItem>
                            <SelectItem
                              value="medium"
                              className="flex items-center"
                            >
                              <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                              Medium
                            </SelectItem>
                            <SelectItem
                              value="high"
                              className="flex items-center"
                            >
                              <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
                              High
                            </SelectItem>
                            <SelectItem
                              value="urgent"
                              className="flex items-center"
                            >
                              <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                              Urgent
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {project?.group?.title !== "Personal" && (
                    <div>
                      <Label className="text-default-600 mb-1.5 font-medium">
                        Due Date
                      </Label>
                      {/* only after date allowed */}
                      <Input
                        type="datetime-local"
                        {...register("dueDate")}
                        id="dueDate"
                        placeholder="Enter due date"
                        className={cn(
                          "rounded-md border-input/50 focus:border-primary",
                          {
                            "border-destructive focus:border-destructive":
                              errors.dueDate,
                          }
                        )}
                      />
                    </div>
                  )}
                </div>

                {/* Project */}
                {/* <div>
                  <Label>Project</Label>
                  <Controller
                    control={control}
                    name="project"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="border-input/50 rounded-md z-[1000]">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent className="z-[1000]">
                          {employeeAndProjectsData?.data?.projects?.map(
                            (proj) => (
                              <SelectItem key={proj._id} value={proj._id}>
                                {proj.title} ({proj.code})
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div> */}
                {/* Assignment Section */}
                <div className="pt-2">
                  {/* Multiple Assignees Toggle */}
                  {/* <div className="flex items-center justify-between p-3 mb-4 bg-muted/30 rounded-lg">
                          <Label
                            htmlFor="multipleAssignees"
                            className="text-default-700 font-medium"
                          >
                            Assign to multiple employees
                          </Label>
                          <Switch
                            id="multipleAssignees"
                            checked={multipleAssignees}
                            onCheckedChange={handleMultipleAssigneesChange}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div> */}

                  {/* Employee Assignment */}

                  {project?.group?.title !== "Personal" && (
                    <div >
                      <div className="flex items-center justify-between mb-1.5 sm:flex-row flex-col">
                      <Label className="text-default-600 font-medium">
                        {multipleAssignees
                          ? "Assign Employees"
                          : "Assign Employee"}
                      </Label>

                      {/* //top 5 user button */}
                      <div className="flex gap-1 flex-wrap overflow-x-auto">
                  
                          
                        {top5assignee?.map((user) => (
                          <Button
                            key={user.name}
                            type='button'
                            variant="soft"
                            size='xss'
                            onClick={() =>
                              handleEmployeeSelect(
                                user?.employeeCode
                              )
                            }
                          >
                            {user.name}
                          </Button>
                        ))}
                      </div>
                      </div>
                      <Popover
                      open={employeePopoverOpen}
                      onOpenChange={setEmployeePopoverOpen}
                      modal={true}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            // aria-expanded={employeePopoverOpen}
                            className="w-full justify-between border-input/50 rounded-md hover:bg-background/80"
                          >
                            {employeeAndProjectsData?.data?.employees?.length >
                            0
                              ? multipleAssignees
                                ? `${selectedEmployees.length} employee${
                                    selectedEmployees.length > 1 ? "s" : ""
                                  } selected`
                                : employeeAndProjectsData?.data?.employees?.find(
                                    (emp) =>
                                      emp.employeeCode === selectedEmployees[0]
                                  )?.name || "Select employee"
                              : "Select employee"}
                            {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 z-[1000]">
                          <div className="flex justify-between items-center bg-default-50  border-b border-default-300 px-3 py-2">
                            <div className=" text-sm font-medium text-default-900 ">
                              Assign To
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
                          <Command className="rounded-lg border-none">
                            <div className="p-2">
                              <CommandInput
                                placeholder="Search By Name..."
                                inputWrapper="border border-default-200 rounded-md"
                                className="h-9"
                              ></CommandInput>
                            </div>
                            <CommandList className="max-h-[200px]">
                              <CommandEmpty>No employee found.</CommandEmpty>
                              <CommandGroup>
                                {employeeList?.map((employee) => (
                                  <CommandItem
                                    key={employee.employeeCode}
                                    value={`${employee.name} ${employee.employeeCode} ${employee.departmentName}`}
                                    onSelect={() =>
                                      handleEmployeeSelect(
                                        employee.employeeCode
                                      )
                                    }
                                    className="flex items-center cursor-pointer hover:bg-muted"
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4 text-primary",
                                        selectedEmployees.includes(
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
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {selectedEmployees.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {selectedEmployees.map((id) => {
                            const emp =
                              employeeAndProjectsData?.data?.employees?.find(
                                (e) => e.employeeCode === id
                              );
                            return (
                              <div
                                key={id}
                                className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm"
                              >
                                {emp?.name}{" "}
                                <span className="text-xs opacity-75">
                                  ({emp?.employeeCode})
                                </span>
                                <X
                                  className="h-3.5 w-3.5 cursor-pointer ml-1 hover:text-primary-foreground"
                                  onClick={() => handleEmployeeSelect(id)}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4 pt-4 mt-2 border-t">
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
                        Saving...
                      </>
                    ) : (
                      "Create Task"
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

export default AddTask;
