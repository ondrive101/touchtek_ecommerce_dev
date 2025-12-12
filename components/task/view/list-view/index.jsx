"use client";
import React, { useTransition, useState } from "react";
import { ChevronDown, Plus, Search, X, Columns } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import { toast } from "react-hot-toast";
import TaskTable from "./task-table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
// import AddTask from "./add-task";
import AddTask from "./add-task";

import TaskView from "../view-task";
import { updateSprint } from "@/action/task/controller";
// Updated Wrapper with better scrollbar styling
const Wrapper = styled.div`
  // .custom-scrollbar {
  //   overflow-x: auto;

  //   &::-webkit-scrollbar {
  //     height: 8px;
  //   }

  //   &::-webkit-scrollbar-track {
  //     background: #f3f4f6;
  //     border-radius: 4px;
  //   }

  //   &::-webkit-scrollbar-thumb {
  //     background-color: #3b82f6; /* default blue */
  //     border-radius: 4px;
  //     border: 1px solid #e5e7eb;
  //   }

  //   /* Fix: Use hover on container to affect thumb */
  //   .custom-scrollbar:hover::-webkit-scrollbar-thumb {
  //     background-color: #2563eb; /* darker blue on hover */
  //   }

  //   &::-webkit-scrollbar-corner {
  //     background: #f3f4f6;
  //   }
      
  // }
     /* Add these styles for sticky headers */
  // .table-container {
  //   max-height: 70vh; /* Adjust this value as needed */
  //   overflow-y: auto;
  //   overflow-x: auto;
  // }

  // .sticky-header {
  //   position: sticky;
  //   top: 0;
  //   background: white;
  //   z-index: 30;
  //   box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
  // }

  // .group-header-row {
  //   position: sticky;
  //   top: 40px; /* Adjust based on your header height */
  //   background: white;
  //   z-index: 25;
  //   box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  // }
`;


import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowBigDownDash, ArrowBigUpDash } from "lucide-react";

const TaskList = ({
  project,
  session,
  refetchSprint,
  incomingOutgoing,
  setIncomingOutgoing,
  selectedEmployee,
  setSelectedEmployee,
  departmentEmployees,
}) => {
  // console.log("projectintable", project);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [isPending, startTransition] = useTransition();
  const [rowSelection, setRowSelection] = React.useState({});
  const [isHideCompleted, setIsHideCompleted] = React.useState();

  const [sorting, setSorting] = React.useState([]);
  const [taskDetailOpen, setTaskDetailOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState(null);

  console.log('projectinlistview',project)

  React.useEffect(() => {
    const userId = session?.user?.id;

    const userColumnsEntry = project?.data?.userColumns?.find(
      (entry) => entry.user === userId
    );

    const userGroupByEntry = project?.data?.userGroupBy?.find(
      (entry) => entry.user === userId
    );

    const userHiddenTasksEntry = project?.data?.hiddenTasks?.find(
      (entry) => entry.user === userId
    );

    setGroupBy(userGroupByEntry?.groupBy || "dueDate");
    setIsHideCompleted(userHiddenTasksEntry?.hiddenTasks);
    // console.log("userHiddenTasksEntry", userHiddenTasksEntry);

    const visible = userColumnsEntry?.visibleColumns || [];

    const visibility = Object.fromEntries(
      columns.map((col) => [col.accessorKey, visible.includes(col.accessorKey)])
    );

    setColumnVisibility(visibility);
  }, [project?.data?.userColumns, project?.data?.hiddenTasks, project?.data?.userGroupBy,session?.user?.id]);

  // filter out the current user
  const employeeList = departmentEmployees?.filter((employee) => {
    return employee.employeeCode !== session?.user?.id;
  });

  const handleTaskClick = (task) => {
    // console.log('task in list', task)
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  // Change single show state to an object that tracks each group's state
  const [collapsedGroups, setCollapsedGroups] = React.useState({});
  const [searchQuery, setSearchQuery] = React.useState("");
  const [groupBy, setGroupBy] = React.useState("dueDate");

  const filteredTasks = React.useMemo(() => {
    let tasks = project?.tasks || [];
    tasks = tasks.filter((task) => {
      const userBoardMap = task.perUserBoardMap?.[session.user.id];
    
      if (isHideCompleted) {
        // Hide task if it is completed (i.e., completedAt is NOT null)
        return userBoardMap?.hidden === false;
      }
    
      // Show all if not hiding completed
      return true;
    });

    if (incomingOutgoing === "incoming") {
      tasks = tasks.filter((task) => task.type === "incoming");
    } else if (incomingOutgoing === "outgoing") {
      tasks = tasks.filter((task) => task.type === "outgoing");
    }

    if (selectedEmployee) {
      tasks = tasks.filter((task) =>
        task.assignedTo.some((emp) => emp === selectedEmployee.employeeCode)
      );
    }

    if (!searchQuery) return tasks;

    const query = searchQuery.toLowerCase();

    return tasks.filter((task) => {
      const flatValues = [];

      const flatten = (obj) => {
        for (const key in obj) {
          const value = obj[key];
          if (typeof value === "object" && value !== null) {
            flatten(value);
          } else {
            flatValues.push(String(value).toLowerCase());
          }
        }
      };

      flatten(task);
      return flatValues.some((val) => val.includes(query));
    });
  }, [project?.tasks, searchQuery,isHideCompleted, incomingOutgoing, selectedEmployee]);

  // Helper function to toggle specific group
  const toggleGroup = (groupName) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  // Helper function to group tasks by due date
  const groupTasks = (tasks, groupByKey) => {
    const groups = {};

    switch (groupByKey) {
      case "dueDate":
        groups["Previous"] = [];
        groups["Today"] = [];
        groups["Upcoming"] = [];
        groups["No dates set"] = [];
        break;
      case "createdAt":
        groups["Previous"] = [];
        groups["Today"] = [];
        groups["Upcoming"] = [];
        groups["No dates set"] = [];
        break;
      case "board":
        project.boards?.forEach((b) => {
          groups[b.name] = [];
        });
        groups["No Board"] = [];
        break;
      case "createdBy":
        const creators = [
          ...new Set(
            tasks
              .map((task) => task.createdByDepartment?.employeeName)
              .filter(Boolean)
          ),
        ];
        creators.forEach((name) => {
          groups[name] = [];
        });
        groups["No Creator Info"] = [];
        break;
      case "priority":
        ["low", "medium", "high", "urgent", "No Priority"].forEach((p) => {
          groups[p] = [];
        });
        break;
      case "type":
        ["incoming", "outgoing", "No Type"].forEach((t) => {
          groups[t] = [];
        });
        break;
      default:
        groups["Others"] = [];
    }

    tasks?.forEach((task) => {
      let groupKey = "Others";
      switch (groupByKey) {
        case "dueDate":
          if (!task.dueDate) groupKey = "No dates set";
          else {
            const today = new Date().toISOString().slice(0, 10);
            if (task.dueDate < today) groupKey = "Previous";
            else if (task.dueDate === today) groupKey = "Today";
            else groupKey = "Upcoming";
          }
          break;
        case "createdAt":
          if (!task.createdAt) groupKey = "No dates set";
          else {
            const today = new Date().toISOString().slice(0, 10);
            if (task.createdAt < today) groupKey = "Previous";
            else if (task.createdAt === today) groupKey = "Today";
            else groupKey = "Upcoming";
          }
          break;

        case "board":
          const currentUser = session?.user?.id;
          const userBoardId =
            task.perUserBoardMap?.[currentUser]?.boardId || task.boardId;
          // console.log('userBoardId', userBoardId, task.perUserBoardMap)
          const board = project.boards.find((b) => b.boardId === userBoardId);
          groupKey = board?.name || "No Board";
          break;
        case "createdBy":
          groupKey =
            task.createdByDepartment?.employeeName || "No Creator Info";
          break;
        case "priority":
          groupKey = task.priority || "No Priority";
          break;
        case "type":
          groupKey = task.type || "No Type";
          break;
        default:
          groupKey = "Others";
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(task);
    });

    return groups;
  };

  const groupedTasks = React.useMemo(() => {
    return groupTasks(filteredTasks, groupBy);
  }, [filteredTasks, groupBy]);

  const columns = [
    {
      accessorKey: "name",
      header: () => (
        <div className="flex items-center gap-2 min-w-[180px] text-center ">
          <Icon
            icon="heroicons:user"
            className="w-3 h-3 text-muted-foreground"
          />
          Task name
        </div>
      ),
      cell: (info) => info.getValue(),

      enableHiding: true,
    },
    {
      accessorKey: "createdBy",
      header: () => (
        <div className="flex items-center gap-2 min-w-[130px] justify-center">
          <Icon
            icon="heroicons:users"
            className="w-3 h-3 text-muted-foreground"
          />
          Created By
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },
    {
      accessorKey: "department by",
      header: () => (
        <div className="flex items-center gap-2 min-w-[60px] justify-center">
          <Icon
            icon="heroicons:arrow-path"
            className="w-3 h-3 text-muted-foreground"
          />
          Department
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },
    {
      accessorKey: "department to",
      header: () => (
        <div className="flex items-center gap-2 min-w-[60px] justify-center">
          <Icon
            icon="heroicons:arrow-path"
            className="w-3 h-3 text-muted-foreground"
          />
          Department
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },
    {
      accessorKey: "assigned to",
      header: () => (
        <div className="flex items-center gap-2 min-w-[130px] justify-center">
          <Icon
            icon="heroicons:users"
            className="w-3 h-3 text-muted-foreground"
          />
          Assigned To
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },
    {
      accessorKey: "dueDate",
      header: () => (
        <div className="flex items-center gap-2 min-w-[150px] justify-center">
          <Icon
            icon="heroicons:calendar"
            className="w-3 h-3 text-muted-foreground"
          />
          Due Date
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },
    {
      accessorKey: "reminder",
      header: () => (
        <div className="flex items-center text-center gap-2 min-w-[150px] justify-center">
          <Icon
            icon="heroicons:bell"
            className="w-3 h-3 text-muted-foreground"
          />
          Reminder
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },
    {
      accessorKey: "priority",
      header: () => (
        <div className="flex items-center gap-2 min-w-[60px] justify-center">
          <Icon
            icon="heroicons:arrow-path"
            className="w-3 h-3 text-muted-foreground"
          />
          Priority
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="flex items-center gap-2 min-w-[80px] justify-center">
          <Icon
            icon="heroicons:users"
            className="w-3 h-3 text-muted-foreground"
          />
          Status
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },
    {
      accessorKey: "frequency",
      header: () => (
        <div className="flex items-center gap-2 min-w-[70px] justify-center">
          <Icon
            icon="heroicons:users"
            className="w-3 h-3 text-muted-foreground"
          />
          Frequency
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },
    {
      accessorKey: "forward to",
      header: () => (
        <div className="flex items-center gap-2 min-w-[140px] justify-center">
          <Icon
            icon="heroicons:arrow-path"
            className="w-3 h-3 text-muted-foreground"
          />
          Forward
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },
    {
      accessorKey: "followers",
      header: () => (
        <div className="flex items-center gap-2 min-w-[140px] justify-center">
          <Icon
            icon="heroicons:arrow-path"
            className="w-3 h-3 text-muted-foreground"
          />
          Followers
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },
    {
      accessorKey: "members",
      header: () => (
        <div className="flex items-center gap-2 min-w-[140px] justify-center">
          <Icon
            icon="heroicons:arrow-path"
            className="w-3 h-3 text-muted-foreground"
          />
          Members
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },
    {
      accessorKey: "prove",
      header: () => (
        <div className="flex items-center gap-2 min-w-[50px] justify-center">
          <Icon
            icon="heroicons:calendar"
            className="w-3 h-3 text-muted-foreground"
          />
          Prove
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },
    {
      accessorKey: "target",
      header: () => (
        <div className="flex items-center gap-2 min-w-[140px] justify-center">
          <Icon
            icon="heroicons:calendar"
            className="w-3 h-3 text-muted-foreground"
          />
          Target
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },
    {
      accessorKey: "achive",
      header: () => (
        <div className="flex items-center gap-2 min-w-[140px] justify-center">
          <Icon
            icon="heroicons:calendar"
            className="w-3 h-3 text-muted-foreground"
          />
          Achive
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },
    {
      accessorKey: "due",
      header: () => (
        <div className="flex items-center gap-2 min-w-[140px] justify-center">
          <Icon
            icon="heroicons:calendar"
            className="w-3 h-3 text-muted-foreground"
          />
          Due
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },
    {
      accessorKey: "projectTimeline",
      header: () => (
        <div className="flex items-center gap-2 min-w-[160px] justify-center">
          <Icon
            icon="heroicons:calendar"
            className="w-3 h-3 text-muted-foreground"
          />
          Timeline
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },

    {
      accessorKey: "completedAt",
      header: () => (
        <div className="flex items-center gap-2 min-w-[160px] justify-center ">
          <Icon
            icon="heroicons:calendar"
            className="w-3 h-3 text-muted-foreground"
          />
          Completed
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },
    {
      accessorKey: "verifiedAt",
      header: () => (
        <div className="flex items-center gap-2 min-w-[160px] justify-center">
          <Icon
            icon="heroicons:calendar"
            className="w-3 h-3 text-muted-foreground"
          />
          Verified
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },

    {
      accessorKey: "type",
      header: () => (
        <div className="flex items-center gap-2 min-w-[70px] justify-center">
          <Icon
            icon="heroicons:users"
            className="w-3 h-3 text-muted-foreground"
          />
          Type
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },

    {
      accessorKey: "actions",
      header: () => (
        <div className="flex items-center gap-2 min-w-[65px] justify-center">
          <Icon
            icon="heroicons:ellipsis-horizontal-16-solid"
            className="w-3 h-3 text-muted-foreground"
          />
          Actions
        </div>
      ),
      cell: (info) => info.getValue(),
      enableHiding: true,
    },
  ];

  // Utility to extract visible column keys
  const handleColumnVisibilityChange = (updaterOrValue) => {
    const nextVisibility =
      typeof updaterOrValue === "function"
        ? updaterOrValue(columnVisibility)
        : updaterOrValue;

    setColumnVisibility(nextVisibility);

    // Extract visible column ids (as array)
    const visibleColumns = Object.entries(nextVisibility)
      .filter(([_, visible]) => visible)
      .map(([columnId]) => columnId);

    // Call the API to persist it
    saveUserColumnPreferences(visibleColumns);
  };

  // Simulated API call (you'll replace with actual fetch call)
  const saveUserColumnPreferences = async (visibleColumnArray) => {
    try {
      console.log(visibleColumnArray);
    } catch (error) {
      console.error("Error saving column preferences", error);
    }
  };

  const handleSaveColumnSettings = async (type, requiredData) => {
    const visibleColumns = Object.entries(columnVisibility)
      .filter(([_, isVisible]) => isVisible)
      .map(([columnId]) => columnId);

    console.log(visibleColumns);
    startTransition(async () => {
      try {
        let data;
        if (type === "updateColumn") {
          data = {
            type: "updateColumn",
            sprint: project._id,
            data: {
              visibleColumns,
            },
          };
        }
        if (type === "groupBy") {
          data = {
            type: "groupBy",
            sprint: project._id,
            data: {
              groupBy: requiredData.key,
            },
          };
        }
        if (type === "hiddenTasks") {
          data = {
            type: "hiddenTasks",
            sprint: project._id,
            data: {
              hiddenTasks: requiredData.hiddenTasks,
            },
          };
        }
        // Call the API to create or update task
        const response = await updateSprint(data, session);

        if (response.status === "success") {
          // Show success message
          toast.success(response.message, {
            duration: 1000,
          });

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

  const table = useReactTable({
    data: project?.tasks,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Wrapper>
      {/* Top Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-1 pl-4 ">
        {/* Add Button */}
        <AddTask project={project} refetchSprint={refetchSprint} />

        {/* //view task */}
        <TaskView
          task={selectedTask}
          boards={project?.boards}
          open={taskDetailOpen}
          setOpen={setTaskDetailOpen}
          project={project}
          session={session}
          refetchSprint={refetchSprint}
        />

        {/* Search Input */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 S"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        </div>
        {/* Group By Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center gap-1 bg-secondary/20 text-muted-foreground text-xs rounded px-2 py-1 hover:bg-secondary">
              <Icon icon="heroicons:squares-2x2" className="w-3 h-3" />
              Group by: {groupBy}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-[200px]">
            {[
              "dueDate",
              "createdAt",
              "board",
              "createdBy",
              "priority",
              "type",
            ].map((key, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => {
                  setGroupBy(key);
                  handleSaveColumnSettings("groupBy", {key});
                }}
                className="capitalize"
              >
                {key}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Column Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center gap-1 bg-secondary/20 text-muted-foreground text-xs rounded px-2 py-1 hover:bg-secondary">
              <Icon icon="heroicons:squares-2x2" className="w-3 h-3" />
              Columns
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[325px] sm:w-[325px] md:w-[500px] mx-4 sm:mx-6 md:mx-8" align="end">
            {/* Search input */}
            <Input
              type="text"
              placeholder="Search and create column"
              id="searchColumn"
              className="mb-2"
            />

            {/* 2-column grid */}
            {/* <ScrollArea className="h-[400px] sm:h-[400px] md:h-[200px] "> */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-2 py-1 hover:bg-muted/40 rounded-sm cursor-pointer "
                  >
                    <p className="text-sm leading-5 capitalize text-foreground">
                      {column.id}
                    </p>

                    <Switch
                      size="sm"
                      color="primary"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    />
                  </div>
                ))}
            </div>
            {/* </ScrollArea> */}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Save Button */}

        {isPending ? (
          <Button variant="outline" size="sm" disabled className="text-xs">
            Saving...
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSaveColumnSettings('updateColumn')}
            className="text-xs"
          >
            Save
          </Button>
        )}


        <div className="flex items-center gap-2 sm:gap-0 md:gap-2">
        <p className="text-xs text-muted-foreground ">
          {isHideCompleted ? "Hide" : "Show"} Completed
        </p>

        <Switch
          size="sm"
          color="primary"
          checked={isHideCompleted}
          onCheckedChange={() => {
            setIsHideCompleted(!isHideCompleted);
            handleSaveColumnSettings("hiddenTasks", {hiddenTasks: !isHideCompleted});
          }}
        />
        </div>
      </div>

      {/* Main Table with Header */}
      <Card className="custom-scrollbar">
        <CardContent className="p-0">
          <div className="table-container">
            <Table wrapperClass="h-[70vh] overflow-auto custom-scrollbar">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup, index) => (
                  <TableRow key={index}>
                    {headerGroup.headers.map((header, index) => (
                      <TableHead
                        key={index}
                        className={cn(
                          "text-xs border-r border-border/50 bg-white sticky top-0 z-15 drop-shadow-md",
                          header.column.id === "name" &&
                            "sticky left-0 z-20 bg-white min-w-[200px] bg-background drop-shadow-md sticky top-0 "
                        )}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              {/* Task Groups */}



              

              <TableBody>
                {Object.entries(groupedTasks).map(([groupName, tasks]) => (
                  <React.Fragment key={groupName}>
                    {/* Group Header */}
                    <TableRow>
                      <TableCell
                        className="sticky left-0 z-10 bg-white min-w-[200px]  bg-background drop-shadow-md "
                        colSpan={1}
                      >
                        <div
                          className="font-semibold text-foreground cursor-pointer select-none flex items-center capitalize"
                          onClick={() => toggleGroup(groupName)}
                        >
                          <ChevronDown
                            className={`w-4 h-4 mr-1 transition-transform ${
                              collapsedGroups[groupName] ? "-rotate-90" : ""
                            }`}
                          />
                          {groupName}
                          {(collapsedGroups[groupName] ||
                            tasks.length === 0) && (
                            <Badge
                              variant="secondary"
                              className="ml-2 w-4 h-4 p-0 text-xs font-medium items-center justify-center"
                            >
                              {tasks.length}
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell
                        colSpan={columns.length - 1}
                        className="border-b bg-white"
                      />
                    </TableRow>

                    {/* Tasks */}
                    {!collapsedGroups[groupName] && tasks.length > 0 && (
                      <TaskTable
                        tasks={tasks}
                        refetchSprint={refetchSprint}
                        session={session}
                        project={project}
                        departmentEmployees={employeeList}
                        columns={table.getVisibleFlatColumns()}
                        handleTaskClick={handleTaskClick}
                      />
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Wrapper>
  );
};

export default TaskList;
