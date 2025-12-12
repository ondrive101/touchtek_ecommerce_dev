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
import AddTask from "./add-task";
import AddDueDate from "./add-due-date";
import Blank from "@/components/blank";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import LayoutLoader from "@/components/layout-loader";

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
project,
session,
refetchSprint,
filter,
setFilter,
incomingOutgoing,
setIncomingOutgoing
}) => {
  const [isPending, startTransition] = React.useTransition();
  const [boards, setBoards] = useState([]);
  const [taskView, setTaskView] = useState("kanban");
  const [incomingOutgoingView, setIncomingOutgoingView] = useState("all");

  // console.log('project', project)

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false); //open when move to the boards pending to in progress or completed
  const [open5, setOpen5] = useState(false); //open when create board
  const [taskProjects, setTaskProjects] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = React.useState(null);
  const [selectedBoard, setSelectedBoard] = React.useState(null);
  const [selectedTaskId, setSelectedTaskId] = React.useState(null);
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [selectedBoardForTask, setSelectedBoardForTask] = React.useState(null);
  const [loading, setLoading] = useState(false);

  const boardsId = useMemo(() => project?.boards.map((board) => board.boardId), [project?.boards]);


  // console.log(boardsId)
  const tasksIds = useMemo(() => project?.tasks.map((task) => task.id), [project?.tasks]);
  const [activeBoard, setActiveBoard] = React.useState(null);
  const [dueDate, setDueDate] = React.useState(null);
  const [activeTask, setActiveTask] = React.useState(null);
  const [pendingDragEvent, setPendingDragEvent] = useState(null); // store pending drag if needed


  const handleDragStart = (event) => {

    // console.log("eventstart", event);
   
    if (event.active.data.current?.type === "Column") {
      setActiveBoard(event.active.data.current.board);
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const processTaskMove = async ({ activeTaskId, activeBoardId, overBoardId, projectId }) => {

    // console.log('calling moving to the board')
    startTransition(async () => {
      try {
        const payload = { activeTaskId, activeBoardId, overBoardId, projectId };
        const response = await swapTask(payload, session);
  
        if (response.status === "success") {
          toast.success("Task updated successfully", { autoClose: 1000 });
          await refetchSprint?.(); // or boardsRefetch() if used
        } else {
          toast.error(response.message || "Failed to update task", { autoClose: 1000 });
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Error moving task", { autoClose: 1000 });
      } finally {
        setActiveTask(null);
        setPendingDragEvent(null);
      }
    });
  };


  const handleDragEnd = (event) => {
    // console.log('handleDragEnd called',event)
    // console.log(boardsId)
    const { active, over } = event;
    
    if (!over) {
      // console.log('no over')
      setActiveBoard(null);
      // setActiveTask(null);
      return;
    }

    if (event.active.data.current?.type === "Column") {
      const activeBoardId = active.id;
      const overBoardId = over.id;

      if (activeBoardId === overBoardId) {
        setActiveBoard(null);
        return;
      }

      const oldIndex = project?.boards.findIndex(board => board.boardId === activeBoardId);
      const newIndex = project?.boards.findIndex(board => board.boardId === overBoardId);

      if (oldIndex !== -1 && newIndex !== -1) {
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
      setActiveBoard(null);
    }

    if (event.active.data.current?.type === "Task") {
      const task = event.active.data.current.task;
      const activeTaskId = active.id;
      const activeBoardId = task.boardId;


      // find is place over task or in empty area
      const taskWithOverId = project?.tasks.find(task => task.taskId === over.id);

    

      const overBoardId = taskWithOverId ? taskWithOverId.boardId : over.id;
  
      const activeBoard = project?.boards.find(b => b.boardId === activeBoardId);
      const overBoard = project?.boards.find(b => b.boardId === overBoardId);

      if (!activeBoard || !overBoard) {
        setActiveTask(null);
        return;
      }

  
      const isMovingForward = (activeBoard?.name === "To-do") &&
        (overBoard?.name === "In-Progress" || overBoard?.name === "Completed");
  
      // ❗ If due date is required but missing, show modal and pause
      if (isMovingForward && !task?.dueDate) {
        setActiveTask(task);
        setPendingDragEvent({ active, over });
        setOpen4(true); // open AddDueDate modal
        return;
      }
  
      // ✅ Proceed with task movement
      processTaskMove({
        activeTaskId,
        activeBoardId,
        overBoardId,
        projectId: task?.projectId,
        overBoardName: overBoard?.name,
      });
    }
 
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  const onDragOver = (event) => {
    // console.log("drag over");
    // console.log(event);
  };

  const openCreateBoard = () => {
    setOpen5(true);
  };
  const closeCreateBoard = () => {
    setOpen5(false);
    wait().then(() => (document.body.style.pointerEvents = "auto"));
  };

  const handleDueDateSubmit = async () => {
    if (!pendingDragEvent) return;
  
    const { active, over } = pendingDragEvent;
  
    const task = active.data.current.task;
    const activeTaskId = active.id;
    const activeBoardId = task.boardId;
    const overBoardId = over.id;

  
    closeAddDueDate(); // Close modal
  
    await processTaskMove({
      activeTaskId,
      activeBoardId,
      overBoardId,
      projectId: task?.projectId,
    
    });
  };

  const openEdit = (board) => {
    setSelectedBoardId(board.id);
    setSelectedBoard(board);
    setOpen(true);
  };


  const closeAddDueDate = () => {
    setOpen4(false);
    wait().then(() => (document.body.style.pointerEvents = "auto"));
  };

  const handleTaskOpener = (boardId) => {
    setSelectedTaskId(null);
    setSelectedTask(null);
    setSelectedBoardForTask(boardId);
    setSelectedBoard(project?.boards.find((board) => board.boardId === boardId));
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

 

  return (
    <>
      {project?.boards?.length > 0 ? (
       
        <Card className="overflow-y-auto">
          <CardHeader className="border-none pt-1 mb-0">
            <TaskHeader
              openCreateBoard={openCreateBoard}
              filter={filter}
              setFilter={setFilter}
              refetchSprint={refetchSprint}
              incomingOutgoing={incomingOutgoing}
              setIncomingOutgoing={setIncomingOutgoing}
            />
          </CardHeader>
          <CardContent>
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              collisionDetection={closestCorners}
              onDragOver={onDragOver}
            >
              <div className="overflow-x-auto">
                <div className="flex flex-nowrap gap-6">
                  <SortableContext items={boardsId}>
                    {project?.boards?.map((board) => (
                      <Board
                        key={board?.boardId}
                        board={board}
                        // tasks={project?.tasks?.filter((task) => task.boardId === board.boardId)}
                        tasks={project?.tasks?.filter((task) => {
                          const employeeCode = session?.user?.id;

                          let taskType = true;
                          if (incomingOutgoing === "incoming") {
                            taskType = task.type === "incoming";
                          } else if (incomingOutgoing === "outgoing") {
                            taskType = task.type === "outgoing";
                          }
                        
                        
                          const perUserMap = task.perUserBoardMap || {};
                       
                          const userMapEntry = perUserMap[employeeCode];
                   
                          
                          const userBoardId = userMapEntry?.boardId || task.boardId;
                        
                          return userBoardId === board.boardId && taskType;
                        })}
                        onEdit={openEdit}
                        taskHandler={handleTaskOpener}
                        isTaskOpen={open2}
                        showButton={board.name === "To-do"}
                        pathname={""}
                        session={session}
                        project={project}
                        onUpdateTask={updateTaskHandler}
                        boards={project?.boards}
                        refetchSprint={refetchSprint}
                        
                        
                      />
                    ))}
                  </SortableContext>
                </div>
              </div>
              {createPortal(
                <DragOverlay>
                  {activeBoard && (
                    <Board
                      board={activeBoard}
                      // tasks={project?.tasks?.filter((task) => task.boardId === activeBoard.boardId)}
                      tasks={project?.tasks?.filter((task) => {
                        const employeeCode = session?.user?.id;
                      
                      
                        const perUserMap = task.perUserBoardMap || {};
                     
                        const userMapEntry = perUserMap[employeeCode];
                 
                        
                        const userBoardId = userMapEntry?.boardId || task.boardId;
                      
                        return userBoardId === board.boardId;
                      })}
                      onEdit={openEdit}
                      taskHandler={handleTaskOpener}
                      isTaskOpen={open2}
                      showButton={activeBoard?.name === "To-do"}
                      session={session}
                      onUpdateTask={updateTaskHandler}
                      boards={project?.board}
                      refetchSprint={refetchSprint}
                    />
                  )}
                  {activeTask && (
                    <Task
                      task={activeTask}
                      project={project}
                      boards={project?.boards}
                      session={session}
                      refetchSprint={refetchSprint}
                    />
                  )}
                </DragOverlay>,
                document.body
              )}
            </DndContext>
          </CardContent>
        </Card>
      ) : (
        <Blank className="max-w-[353px] mx-auto space-y-4">
          <div className=" text-xl font-semibold text-default-900">
            No Task Projects Here
          </div>
          <div className=" text-default-600 text-sm">
            There is no task project create. If you create a new task project then click this
            button & create new board.
          </div>
        </Blank>
      )}

      <AddTask
        open={open2}
        onClose={closeTaskHandler}
        project={project}
        boardId={selectedBoardForTask}
        board={selectedBoard}
        pathname={""}
        session={session}
        departmentEmployees={project?.members}
        refetchSprint={refetchSprint}
      
      />

      <CreateBoard
        open={open5}
        onClose={closeCreateBoard}
        board={selectedBoard}
        project={project}
        refetchSprint={refetchSprint}
        session={session}
      />

      
<AddDueDate
  open={open4}
  task={activeTask}
  setDueDate={setDueDate}
  onClose={closeAddDueDate}
  onConfirm={handleDueDateSubmit} // ✅ add this
  board={selectedBoard}
  boardId={selectedBoardId}
  session={session}
/>

    </>
  );
};

export default TaskBoard;
