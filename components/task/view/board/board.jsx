"use client";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "./task";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";

import { toast } from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Trash2, UserPlus, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@iconify/react";
import { useDroppable } from "@dnd-kit/core";

// dnd

import {
  deleteBoard,
  revalidateCurrentPath,
} from "@/action/superadmin/controller";

const taskBoard = ({
  board,
  tasks,
  taskHandler,
  isTaskOpen,
  showButton,
  session,
  onUpdateTask,
  project,
  boards,
  refetchSprint,
}) => {
  const [open, setOpen] = useState(false);
  const tasksIds = useMemo(() => {
    return tasks?.map((task) => task.taskId);
  }, [tasks]);



  //called when click on delete board button in dropdown
  async function onAction(id) {
    try {
      const payload = {
        boardId: id,
      };

      const response = await deleteBoard(payload, session);

      if (response.status === "success") {
        toast.success("Board deleted successfully", {
          autoClose: 1000,
        });
        await revalidateCurrentPath(pathname);
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
  }
  const { name, status, id } = board;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: board.boardId,
    data: {
      type: "Column",
      board,
    },
    disabled: isTaskOpen,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <>
      <DeleteConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onAction(board.id)}
      />
      <Card
       ref={setNodeRef}
       style={style}
        className={cn(
          "max-w-[280px] border-t-4 rounded-md  flex-none w-full  shadow-lg bg-default-100 dark:bg-default-50 ",
          {
            "border-primary": status === "primary",
            "border-warning": status === "warning",
            "border-success": status === "success",
            "opacity-100": isDragging,
          }
        )}
      >
        <CardHeader
          className="flex-row items-center mb-0 justify-between border-b border-default-200 rounded-sm py-2.5 space-y-0 px-3"
          {...attributes}
          {...listeners}
        >
          <div className="flex items-center">
            <Button
              type="button"
              size="icon"
              className="w-5 h-5 bg-transparent text-primary/80 border border-default-200 rounded-sm hover:bg-transparent"
            >
              <UserPlus className="w-3 h-3" />
            </Button>
          </div>
          <div className="text-sm font-semibold text-default-800 capitalize">
            {name}
          </div>



        <div className="flex-none flex items-center justify-end">
          {/* {showButton && session?.user?.department !== "" && (
            <Button
              className="flex justify-center items-center gap-1 w-full bg-transparent hover:bg-transparent"
              onClick={() => taskHandler(board.boardId)}
            >
              <Plus className="w-5 h-5 text-primary" />
            </Button>
          )} */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                className="w-8 h-8 rounded-full bg-transparent hover:bg-default-200"
              >
                <MoreHorizontal className="w-4 h-4 cursor-pointer text-default-900" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[196px]" align="end">
              <DropdownMenuItem>
                <Icon
                  icon="heroicons:pencil-square"
                  className="w-3.5 h-3.5 mr-1 text-default-700"
                />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem >
                <Trash2 className="w-3.5 h-3.5 mr-1 text-default-600" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          </div>
        </CardHeader>
        {/* main content  */}
        <CardContent className="px-0 pb-0">
          {/* all tasks */}
          <div className="h-[calc(100vh-300px)]">
            <ScrollArea className="h-full">
              <div className="space-y-3 p-3">
                <SortableContext items={tasksIds}>
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.taskId}
                      project={project}
                      task={task}
                      boards={boards}
                      session={session}
                      refetchSprint={refetchSprint}
                    />
                  ))}
                </SortableContext>
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default taskBoard;
