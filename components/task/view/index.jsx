"use client";
import React, { useTransition, useState } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import ProjectHeader from "./project-header";
import EditProject from "../edit-project";
import PageLink from "./page-link";
import { Icon } from "@iconify/react";
import { Plus, Menu } from "lucide-react"; // ← Add Menu import
import Team from "./team";
import ListView from "./list-view";
import { Crown } from "@/components/svg";
import { toast } from "react-hot-toast";
import Board from "./board";
import Overview from "./overview";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowBigDownDash, ArrowBigUpDash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { updateSprint } from "@/action/task/controller";
import { getDepartmentEmployees } from "@/action/task/controller";
import avatar from "@/public/images/avatar/avatar-4.jpg";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query"; // ← Add this import

const ProjectLayout = ({
  project,
  session,
  refetchSprint,
  filter,
  setFilter,
  openSidebar // ← Already received
}) => {
  const [incomingOutgoing, setIncomingOutgoing] = React.useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = React.useState(false);
  
  // ← Add mobile detection
  const isMobile = useMediaQuery("(max-width: 1280px)");

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

  if (departmentEmployeesLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (departmentEmployeesError) {
    return <div>Error fetching department employees</div>;
  }

  const handleDeselectEmployee = () => {
    setSelectedEmployee(null);
  };

  const handleSubmit = (type) => {
    startTransition(async () => {
      try {
        const data = {
          type: type,
          sprint: project._id,
          data: {
            status: "deleted",
          },
        };
        const response = await updateSprint(data, session);

        if (response.status === "success") {
          toast.success(response.message, {
            duration: 1000,
          });

          setOpen(false);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
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
    <div>
      <DeleteConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={() => handleSubmit("delete")}
        defaultToast={false}
      />

      <Card className="mb-4">
        <CardFooter className="gap-x-4 gap-y-3 lg:gap-x-6 pb-0 pt-0 flex-wrap">
          <div className="flex-1">
            <div className="flex flex-wrap justify-between gap-4">
              <div className="flex items-center justify-between text-xl font-medium text-default-950 gap-2">
                
                {/* ← Mobile Menu Button - Add this before everything else */}
                {isMobile && openSidebar && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 xl:hidden flex-shrink-0"
                    onClick={openSidebar}
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                )}

                {/* Project Avatar */}
                {project?.title !== "daily task" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={project?.employees?.find((emp) => emp.employeeCode === project?.createdByDepartment?.employeeId)?.image} />
                          <AvatarFallback className="capitalize">
                            {project?.createdByDepartment?.name?.charAt(0) ||
                              "U"}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent color="primary">
                        <p>{project?.createdByDepartment?.name}</p>
                        <TooltipArrow className=" fill-primary" />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                {/* Project Title */}
                <h1 className="truncate capitalize">{project?.title}</h1>

                {/* Project Actions */}
                {project?.title !== "daily task" && (
                  <div className="flex items-center gap-2 bg-blue-100/30 border border-blue-100 px-3 py-1 rounded-md">

            


                    {project?.group?.title === "Personal" && (
                    <Button
                      size="icon"
                      variant="ghost"
                      color="destructive"
                      className="h-7 w-7"
                      onClick={() => setOpen(true)}
                    >
                      <Icon icon="heroicons:trash" className="h-4 w-4" />
                    </Button>
                    )}
                    <EditProject
                      project={project}
                      session={session}
                      refetchSprint={refetchSprint}
                    />
                  </div>
                )}

                {/* Selected Employee with Deselect Button */}
                {selectedEmployee && (
                  <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-md">
                    <span className="capitalize text-sm">
                      {selectedEmployee?.name}
                    </span>
                    <button
                      onClick={handleDeselectEmployee}
                      className="text-default-500 hover:text-red-600 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Incoming/Outgoing Buttons */}
              <div className="flex items-center gap-1 rounded border bg-muted mb-1 ">
                <Button
                  variant="ghost"
                  size="xss"
                  className={cn(
                    "px-2 text-xs",
                    incomingOutgoing === "incoming" && "bg-red-500 text-white"
                  )}
                  onClick={() =>
                    setIncomingOutgoing((prev) =>
                      prev === "incoming" ? "" : "incoming"
                    )
                  }
                >
                  <ArrowBigDownDash className="w-4 h-4 mr-1" />
                  Incoming
                </Button>

                <Button
                  variant="ghost"
                  size="xss"
                  className={cn(
                    "px-2 text-xs",
                    incomingOutgoing === "outgoing" && "bg-teal-500 text-white"
                  )}
                  onClick={() =>
                    setIncomingOutgoing((prev) =>
                      prev === "outgoing" ? "" : "outgoing"
                    )
                  }
                >
                  <ArrowBigUpDash className="w-4 h-4 mr-1" />
                  Outgoing
                </Button>
              </div>
            </div>
          </div>
          <PageLink
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            session={session}
          />
        </CardFooter>
      </Card>

      {/* Tab Content */}
      {activeTab === "team" && (
        <Team
          project={project}
          session={session}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          setActiveTab={setActiveTab}
        />
      )}
      {activeTab === "board" && (
        <Board
          project={project}
          session={session}
          refetchSprint={refetchSprint}
          filter={filter}
          setFilter={setFilter}
          incomingOutgoing={incomingOutgoing}
          setIncomingOutgoing={setIncomingOutgoing}
        />
      )}
      {activeTab === "list" && (
        <ListView
          project={project}
          session={session}
          refetchSprint={refetchSprint}
          incomingOutgoing={incomingOutgoing}
          setIncomingOutgoing={setIncomingOutgoing}
          selectedEmployee={selectedEmployee}
          departmentEmployees={departmentEmployees?.data}
          setSelectedEmployee={setSelectedEmployee}
        />
      )}
      {activeTab === "overview" && (
        <Overview project={project} session={session} />
      )}
    </div>
  );
};

export default ProjectLayout;
