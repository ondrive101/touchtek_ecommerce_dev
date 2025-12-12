"use client";
import * as React from "react";
import { Folder, File, Briefcase, User, Users, Clock, Menu } from "lucide-react";
import { Nav } from "./sidebar";
import { cn } from "@/lib/utils";
import { Loader2, Plus } from "lucide-react";
import AddProject from "./add-project";
import EditProject from "./edit-project";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loading";
import { PropagateLoader } from "react-spinners";

import { TooltipProvider } from "@/components/ui/tooltip";
import SprintView from "./view";

import LayoutLoader from "@/components/layout-loader";
import Blank from "@/components/blank";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  getTaskGroups,
  createTaskProject,
  createTaskGroup,
  getTaskProject,
} from "@/action/task/controller";

const Task = ({ session, navCollapsedSize }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [sprint, setSprint] = useState();
  const [selectedSprintID, setSelectedSprintID] = useState();
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [showCreateProject, setShowCreateProject] = React.useState(false);
  const [groupId, setGroupId] = React.useState("");
  const [groupClicked, setGroupClicked] = React.useState("");
  const [loading, setLoading] = useState(false);
  const isDesktop = useMediaQuery("(max-width: 1280px)");
  const isLargeScreen = useMediaQuery("(min-width: 1700px)"); // 1700 and above
const isMediumLarge = useMediaQuery("(min-width: 1440px) and (max-width: 1919px)"); // 1440-1919px
const isStandardDesktop = useMediaQuery("(min-width: 1281px) and (max-width: 1439px)"); // 1281-1439px
  const [filter, setFilter] = useState({
    ioFilter: "all",
    boardFilter: "all",
    priorityFilter: "all",
  });
  const openSidebar = () => setShowSidebar(true);
  const {
    data: taskGroups,
    isLoading: taskGroupsLoading,
    error: taskGroupsError,
    refetch: taskGroupsRefetch,
  } = useQuery({
    queryKey: ["task-groups-Query", session],
    queryFn: () => getTaskGroups(session),
    enabled: !!session,
  });

  const {
    data: sprintData,
    isLoading: sprintLoading,
    error: sprintError,
    refetch: sprintRefetch,
  } = useQuery({
    queryKey: ["task-sprint-Query", selectedSprintID, filter, session],
    queryFn: () => getTaskProject(selectedSprintID, filter, session),
    enabled: !!selectedSprintID,
  });

  // console.log('grouplist',taskGroups)
  useEffect(() => {
    if (sprintData) {
      setSprint(sprintData);
    }
  }, [sprintData]);

  useEffect(() => {
    if (groupId) {
      // console.log("groupId", groupId);
    }
  }, [groupId, groupClicked]);

  if (taskGroupsLoading) {
    return <LayoutLoader />;
  }

  if (taskGroupsError) {
    return (
      <div className="text-red-500 text-center mt-4">
        Failed to load projects
      </div>
    );
  }

  if (sprintError) {
    return (
      <div className="text-red-500 text-center mt-4">
        Failed to load sprints
      </div>
    );
  }

  // const defaultLayout = [265, 440, 655];
  // const total = defaultLayout.reduce((a, b) => a + b, 0);
  // const layoutInPercentages = defaultLayout.map((val) =>
  //   parseFloat(((val / total) * 100).toFixed(2))
  // );
  // Add more media queries for different screen sizes
// const isDesktop = useMediaQuery("(max-width: 1280px)");

const defaultLayout = [230, 655]; // sidebar + main content
const total = defaultLayout.reduce((a, b) => a + b, 0);
const layoutInPercentages = defaultLayout.map((val) =>
  parseFloat(((val / total) * 100).toFixed(2))
);


// Device-specific panel configuration
const getPanelConfig = () => {
  if (isLargeScreen) {
    // Ultra-wide screens (1920px+)
    return {
      defaultSize: layoutInPercentages[0],
      collapsedSize: navCollapsedSize,
      collapsible: true,
      minSize: 12, // Smaller min size for large screens
      maxSize: 15, // Smaller max size for large screens
    };
  } else if (isMediumLarge) {
    // Large screens (1440-1919px)
    return {
      defaultSize: layoutInPercentages[0],
      collapsedSize: navCollapsedSize,
      collapsible: true,
      minSize: 20,
      maxSize: 20,
    };
  } else if (isStandardDesktop) {
    // Standard desktop (1281-1439px)
    return {
      defaultSize: layoutInPercentages[0],
      collapsedSize: navCollapsedSize,
      collapsible: true,
      minSize: 20,
      maxSize: 20,
    };
  } else {
    // Default for smaller screens
    return {
      defaultSize: layoutInPercentages[0],
      collapsedSize: navCollapsedSize,
      collapsible: true,
      minSize: 15,
      maxSize: 17,
    };
  }
};

const panelConfig = getPanelConfig();

  const groupNavigationData = taskGroups?.data
    ?.flatMap((item) => {
      const groupTitle = item.title;

      const iconMap = {
        Projects: <Briefcase />,
        Shared: <Users />,
        Personal: <User />,
        "Daily Task": <Clock />,
      };

      const fontMap = {
        folder: "font-semibold text-[15px]",
        item: "text-[12px] cursor-pointer text-default-700",
      };

      if (groupTitle === "Daily Task") {
        return item.projects.map((project) => ({
          id: project._id,
          label: project.title,
          badge: project.tasks.length,
          type: "item",
          icon: <File />,
          font: fontMap.folder,
        }));
      }

      return {
        id: item._id,
        label: groupTitle,
        type: "folder",
        badge: item.taskCount,
        icon: iconMap[groupTitle] || <Folder />,
        font: fontMap.folder,
        children: item.projects.map((project) => ({
          id: project._id,
          label: project.title,
          badge: project.tasks.length,
          type: "item",
          icon: <File />,
          font: fontMap.item,
        })),
        order: item.order ?? 0,
      };
    })
    .sort((a, b) => {
      const orderA = a.order ?? 9999;
      const orderB = b.order ?? 9999;
      return orderA - orderB;
    });

  const handleSprintSelect = async (node) => {
    if (node.type === "item") {
      setSelectedSprintID(node.id);
      // Close mobile sidebar after selection
      if (isDesktop) {
        setShowSidebar(false);
      }
    }
  };

  const handleCreateProject = async (data) => {
    try {
      setLoading(true);
      const payload = {
        type: data.type,
        data: data.data,
      };

      const response = await createTaskProject(payload, session);
      if (response.status === "success") {
        toast.success("Project created successfully", {
          autoClose: 1000,
        });
        await taskGroupsRefetch();
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

  const handleGroupClick = async (node) => {
    // console.log(node);
  };

  return (
    <div className="">
      {taskGroups?.data?.length > 0 ? (
        <div className="app-height overflow-hidden relative z-10">
    

          {/* Mobile sidebar backdrop */}
          {isDesktop && showSidebar && (
            <div
              className="bg-background/60 backdrop-filter backdrop-blur-sm absolute w-full flex-1 inset-0 z-[99] rounded-md"
              onClick={() => setShowSidebar(false)}
            />
          )}

          {/* Mobile sidebar */}
          {isDesktop && (
            <div
              className={cn(
                "absolute h-full top-0 md:w-[280px] w-[260px] z-[999] transition-all duration-300 ease-in-out",
                {
                  "left-0": showSidebar,
                  "-left-full": !showSidebar,
                }
              )}
            >
              <Card className="h-full pb-0 overflow-auto no-scrollbar">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Projects</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSidebar(false)}
                      className="h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Nav
                    isCollapsed={false}
                    data={groupNavigationData}
                    onSelect={handleSprintSelect}
                    setGroupId={setGroupId}
                    setShowCreateProject={setShowCreateProject}
                    setGroupClicked={setGroupClicked}
                    handleGroupClick={handleGroupClick}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          <TooltipProvider delayDuration={0}>
            {/* Desktop layout with resizable panels */}
            <ResizablePanelGroup
              direction="horizontal"
              onLayout={(sizes) => {
                document.cookie = `react-resizable-panels:layout=${JSON.stringify(
                  sizes
                )}`;
              }}
              className="relative"
            >
              {/* Desktop sidebar */}
              {!isDesktop && (
                <ResizablePanel
                defaultSize={panelConfig.defaultSize}
                collapsedSize={panelConfig.collapsedSize}
                collapsible={panelConfig.collapsible}
                  minSize={panelConfig.minSize}
                  maxSize={panelConfig.maxSize}
                  onCollapse={(collapsed) => {
                    setIsCollapsed(collapsed);
                    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                      true
                    )}`;
                  }}
                  className={cn(
                    "",
                    isCollapsed &&
                      "min-w-[50px] transition-all duration-300 ease-in-out"
                  )}
                >
                  <Card className="h-full overflow-auto no-scrollbar">
                    <CardContent
                      className={cn("", {
                        "px-2": isCollapsed,
                      })}
                    >
                      <Nav
                        isCollapsed={isCollapsed}
                        data={groupNavigationData}
                        onSelect={handleSprintSelect}
                        setGroupId={setGroupId}
                        setShowCreateProject={setShowCreateProject}
                        setGroupClicked={setGroupClicked}
                        handleGroupClick={handleGroupClick}
                      />
                    </CardContent>
                  </Card>
                </ResizablePanel>
              )}
              
              {!isDesktop && <ResizableHandle withHandle />}
              
              {/* Main content area */}
              <ResizablePanel 
                defaultSize={isDesktop ? 100 : layoutInPercentages[1]} 
                minSize={30}
                className={cn(isDesktop && "ml-0")}
              >
                {sprint?.data ? (
                  <Card className="h-full">
                    <CardContent className="overflow-y-auto no-scrollbar h-full px-0">
                      {sprintLoading && (
                        <div className="h-screen flex items-center justify-center flex-col space-y-2">
                          <span className="inline-flex gap-1">
                            <PropagateLoader
                              color="#2db9c2"
                              size={20}
                              loading={sprintLoading}
                            />
                          </span>
                        </div>
                      )}
                      {!sprintLoading && (
                        <SprintView
                          project={sprint?.data}
                          session={session}
                          refetchSprint={sprintRefetch}
                          filter={filter}
                          setFilter={setFilter}
                          openSidebar={openSidebar}
                        />
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-full">
                    <CardContent className="h-full flex justify-center items-center">
                      <div className="text-center flex flex-col items-center">
                        <Icon
                          icon="uiw:message"
                          className="text-7xl text-default-300"
                        />
                        <div className="mt-4 text-lg font-medium text-default-500">
                          No sprint selected
                        </div>
                        <p className="mt-1 text-sm font-medium text-default-400">
                          Please select a sprint to view its details
                        </p>
                        {/* Mobile: Show button to open sidebar */}
                        {isDesktop && (
                          <Button
                            variant="outline"
                            onClick={() => setShowSidebar(true)}
                            className="mt-4"
                          >
                            <Menu className="w-4 h-4 mr-2" />
                            Browse Projects
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </ResizablePanel>
            </ResizablePanelGroup>
          </TooltipProvider>
        </div>
      ) : (
        <Blank className="max-w-[353px] mx-auto space-y-4">
          <div className="text-xl font-semibold text-default-900">
            No Task Projects Here
          </div>
          <div className="text-default-600 text-sm">
            There is no task project create. If you create a new task project
            then click this button & create new board.
          </div>

          {session?.user?.department === 'admin' && (
  loading ? (
    <Button>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading ...
    </Button>
  ) : (
    <Button onClick={() => handleCreateProject({ type: "main", data: {} })}>
      <Plus className="w-4 h-4 mr-1" /> Create Project
    </Button>
  )
)}
        </Blank>
      )}

      {showCreateProject && (
        <AddProject
          taskGroupsRefetch={taskGroupsRefetch}
          groupClicked={groupClicked}
          groupId={groupId}
          session={session}
          open={showCreateProject}
          setOpen={setShowCreateProject}
        />
      )}
    </div>
  );
};

export default Task;
