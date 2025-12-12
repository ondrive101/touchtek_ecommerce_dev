"use client";
import React from "react";
import { useEffect, useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, Heart } from "lucide-react";
import TaskHeader from "./task-header";
import Board from "./board";
import Task from "./task";
import CreateBoard from "./create-borad";
import ProjectsView from "./projects/projects-view";
import AddTask from "./add-task-new";
import Blank from "@/components/blank";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import LayoutLoader from "@/components/layout-loader";
import TaskSheet from "./task-sheet";
import TaskTable from "./task-list/task-table";
import TaskList from "./task-list";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import {
  revalidateCurrentPath,
  swapBoard,
  getBoards,
  swapTask,
  getDepartmentEmployees,
} from "@/action/superadmin/controller";
import { getProjects, getTaskProjects, createTaskProject } from "@/action/task/controller";

const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

const TaskBoard = ({
  tasks,
  subTasks,
  comments,
  pathname,
  session,
  departmentEmployees,
  projects,
}) => {
  const [isPending, startTransition] = React.useTransition();
  const [boards, setBoards] = useState([]);
  const [taskView, setTaskView] = useState("kanban");
  const [incomingOutgoingView, setIncomingOutgoingView] = useState("all");
  const [filter, setFilter] = useState({
    ioFilter: "all",
    boardFilter: "all",
  });
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [taskProjects, setTaskProjects] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = React.useState(null);
  const [selectedBoard, setSelectedBoard] = React.useState(null);
  const [selectedTaskId, setSelectedTaskId] = React.useState(null);
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [selectedBoardForTask, setSelectedBoardForTask] = React.useState(null);
  const [loading, setLoading] = useState(false);

  const {
    data: boardsData,
    isLoading: boardsLoading,
    error: boardsError,
    refetch: boardsRefetch,
  } = useQuery({
    queryKey: ["boards-Query", session],
    queryFn: () => getBoards(filter, session),
    enabled: !!session,
  });

  
  const {
    data: taskProjectsData,
    isLoading: taskProjectsLoading,
    error: taskProjectsError,
    refetch: taskProjectsRefetch,
  } = useQuery({
    queryKey: ["task-projects-Query", session],
    queryFn: () => getTaskProjects(session),
    enabled: !!session,
  });

  console.log('taskProjects', taskProjectsData)

  useEffect(() => {
    if (Array.isArray(boardsData?.data)) {
      setBoards(boardsData.data);
    } else {
      setBoards([]);
    }
    if (Array.isArray(taskProjectsData?.data)) {
      setTaskProjects(taskProjectsData.data);
    } else {
      setTaskProjects([]);
    }
  }, [boardsData, taskProjectsData]);
  const handleCreateProject = async (data) => {
    try {
      setLoading(true);
      const payload = {
        type: data.type,
        data: data.data,
      }
     
      const response = await createTaskProject(payload, session);
      if (response.status === "success") {
        toast.success("Project created successfully", {
          autoClose: 1000,
        });
        await taskProjectsRefetch();
        setLoading(false);
      }
      if (response.status === "fail" || response.status === "error") {
        toast.error(response.message, {
          autoClose: 1000,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.message, {
        autoClose: 1000,
      });
    }
  };


  useEffect(() => {
    boardsRefetch();
  }, [filter]);

  const boardsId = useMemo(() => boards.map((board) => board.id), [boards]);

  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const [activeBoard, setActiveBoard] = React.useState(null);
  const [activeTask, setActiveTask] = React.useState(null);

  const handleDragStart = (event) => {
   
    if (event.active.data.current?.type === "Column") {
      setActiveBoard(event.active.data.current.board);
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const handleDragEnd = (event) => {
    if (event.active.data.current?.type === "Column") {
      const { active, over } = event;
      if (!over) return;

      const activeBoardId = active.id;
      const overBoardId = over.id;

      if (activeBoardId === overBoardId) return;

      const oldIndex = boardsId.indexOf(activeBoardId);
      const newIndex = boardsId.indexOf(overBoardId);

      if (oldIndex !== newIndex) {
        startTransition(async () => {
          try {
            const payload = { activeBoardId, overBoardId };
            const response = await swapBoard(payload, session);

            if (response.status === "success") {
              toast.success("Board updated successfully", { autoClose: 1000 });
              await boardsRefetch();
            }
            if (response.status === "fail" || response.status === "error") {
              toast.error(response.message, { autoClose: 1000 });
            }
          } catch (error) {
            console.log(error);
            toast.error(error.message, { autoClose: 1000 });
          }
        });
      }
    }
    if (event.active.data.current?.type === "Task") {
      const { active, over } = event;
      if (!over) return;

      const task = event.active.data.current.task;
      const activeTaskId = active.id;
      const activeBoardId = task.boardId;
      const overBoardId = over.id;


      //get boards
      const activeBoard = boards.find((board) => board.id === activeBoardId);
      const overBoard = boards.find((board) => board.id === overBoardId);



      // if moving from To-do to In-Progress board apply this condition
      if (activeBoard?.name === "To-do" && overBoard?.name === "In-Progress" || activeBoard?.name === "To-do" && overBoard?.name === "Completed") {
        if (task?.dueDate === null) {
          toast.error("Task cannot be moved! Please add due date", {
            autoClose: 1000,
          });
          return;
        }
      }



      if (activeBoardId === overBoardId) return;

      const oldIndex = boardsId.indexOf(activeBoardId);
      const newIndex = boardsId.indexOf(overBoardId);


      if (oldIndex !== newIndex) {
        startTransition(async () => {
          try {
            const payload = { activeTaskId, activeBoardId, overBoardId, overBoardName: overBoard?.name };
            const response = await swapTask(payload, session);

            if (response.status === "success") {
              toast.success("Task updated successfully", { autoClose: 1000 });
              await boardsRefetch();
            }
            if (response.status === "fail" || response.status === "error") {
              toast.error(response.message, { autoClose: 1000 });
            }
          } catch (error) {
            console.log(error);
            toast.error(error.message, { autoClose: 1000 });
          }
        });
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  const onDragOver = (event) => {
    console.log("drag over");
  };

  const taskViewHandler = (value) => {
    setTaskView(value);
  };

  const openCreateBoard = () => {
    setSelectedBoardId(null);
    setSelectedBoard(null);
    setOpen(true);
  };

  const openEdit = (board) => {
    setSelectedBoardId(board.id);
    setSelectedBoard(board);
    setOpen(true);
  };

  const closeCreateBoard = () => {
    setSelectedBoardId(null);
    setSelectedBoard(null);
    setOpen(false);
    wait().then(() => (document.body.style.pointerEvents = "auto"));
  };

  const handleTaskOpener = (boardId) => {
    setSelectedTaskId(null);
    setSelectedTask(null);
    setSelectedBoardForTask(boardId);
    setSelectedBoard(boards.find((board) => board.id === boardId));
    setOpen2(true);
  };

  const closeTaskHandler = () => {
    setSelectedTaskId(null);
    setSelectedTask(null);
    setSelectedBoardForTask(null);
    setSelectedBoard(null);
    setOpen2(false);
  };

  const updateTaskHandler = (task) => {
    setSelectedTaskId(task.id);
    setSelectedTask(task);
    setOpen3(true);
  };

  const closeUpdateTaskHandler = () => {
    setSelectedTaskId(null);
    setSelectedTask(null);
    setOpen3(false);
  };

  const handleRefetchBoards = async()=> {
    await boardsRefetch();
  }

  // Render loading or error states after all hooks
  if (boardsLoading) {
    return <LayoutLoader />;
  }

  if (boardsError instanceof Error) {
    toast.error(`Failed to load boards: ${boardsError.message}`);
    return (
      <Blank className="max-w-[353px] mx-auto space-y-4">
        <div className="text-xl font-semibold text-default-900">
          Error Loading Boards
        </div>
        <div className="text-default-600 text-sm">
          An error occurred while loading boards. Please try again.
        </div>
      </Blank>
    );
  }

  return (
    <>
      {taskProjects?.length > 0 ? (
        <ProjectsView projects={taskProjects} />
        // <Card className="overflow-y-auto">
        //   <CardHeader className="border-none pt-6 mb-6">
        //     <TaskHeader
        //       taskViewHandler={taskViewHandler}
        //       openCreateBoard={openCreateBoard}
        //       session={session}
        //       projects={projects}
        //       pathname={pathname}
        //       filter={filter}
        //       setFilter={setFilter}
        //     />
        //   </CardHeader>
        //   <CardContent>
        //     <DndContext
        //       sensors={sensors}
        //       onDragStart={handleDragStart}
        //       onDragEnd={handleDragEnd}
        //       collisionDetection={closestCorners}
        //       onDragOver={onDragOver}
        //     >
        //       <div className="overflow-x-auto">
        //         <div className="flex flex-nowrap gap-6">
        //           <SortableContext items={boardsId}>
        //             {boards?.map((board) => (
        //               <Board
        //                 key={board?.id}
        //                 board={board}
        //                 tasks={board?.tasks}
        //                 onEdit={openEdit}
        //                 taskHandler={handleTaskOpener}
        //                 isTaskOpen={open2}
        //                 showButton={board.name === "To-do"}
        //                 pathname={pathname}
        //                 session={session}
        //                 onUpdateTask={updateTaskHandler}
        //                 boards={boards}
        //                 handleRefetchBoards={handleRefetchBoards}
                        
        //               />
        //             ))}
        //           </SortableContext>
        //         </div>
        //       </div>
        //       {createPortal(
        //         <DragOverlay>
        //           {activeBoard && (
        //             <Board
        //               board={activeBoard}
        //               tasks={activeBoard?.tasks}
        //               onEdit={openEdit}
        //               taskHandler={handleTaskOpener}
        //               isTaskOpen={open2}
        //               showButton={activeBoard?.name === "To-do"}
        //               pathname={pathname}
        //               session={session}
        //               onUpdateTask={updateTaskHandler}
        //               boards={boards}
        //               handleRefetchBoards={handleRefetchBoards}
        //             />
        //           )}
        //           {activeTask && (
        //             <Task
        //               task={activeTask}
        //               onUpdateTask={updateTaskHandler}
        //               boards={boards}
        //               pathname={pathname}
        //               session={session}
        //               handleRefetchBoards={handleRefetchBoards}
        //             />
        //           )}
        //         </DragOverlay>,
        //         document.body
        //       )}
        //     </DndContext>
        //   </CardContent>
        // </Card>
      ) : (
        <Blank className="max-w-[353px] mx-auto space-y-4">
          <div className=" text-xl font-semibold text-default-900">
            No Task Projects Here
          </div>
          <div className=" text-default-600 text-sm">
            There is no task project create. If you create a new task project then click this
            button & create new board.
          </div>

          {loading ? (
               <Button>
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               Loading ...
             </Button>
          ) : (
            <Button onClick={()=>handleCreateProject({type: 'main', data: {}})}>
              <Plus className="w-4 h-4 mr-1" /> Create Project
            </Button>
          )}
        </Blank>
      )}

      <AddTask
        open={open2}
        onClose={closeTaskHandler}
        boardId={selectedBoardForTask}
        board={selectedBoard}
        pathname={pathname}
        session={session}
        departmentEmployees={departmentEmployees}
        boardsRefetch={boardsRefetch}
      />

      <CreateBoard
        open={open}
        onClose={closeCreateBoard}
        board={selectedBoard}
        boardId={selectedBoardId}
        pathname={pathname}
        session={session}
      />

      <TaskSheet
        open={open3}
        onClose={closeUpdateTaskHandler}
        task={selectedTask}
        taskId={selectedTaskId}
        subTasks={subTasks}
        comments={comments}
      />
    </>
  );
};

export default TaskBoard;
