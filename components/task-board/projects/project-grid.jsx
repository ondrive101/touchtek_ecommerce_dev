"use client";
import React from "react";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import avatar2 from "@/public/images/avatar/avatar-2.jpg";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarGroup,
} from "@/components/ui/avatar";

import { useTheme } from "next-themes";
const ProjectGrid = ({ project}) => {

  const { theme: mode } = useTheme();

  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center gap-3 border-none mb-0">
          <div className="flex-1">
            <Badge
              color={
                project?.status === "review"
                  ? "warning"
                  : project?.status === "completed"
                    ? "success"
                    : project?.status === "in progress"
                      ? "default"
                      : "info"
              }
              variant={mode === "dark" ? "soft" : "soft"}
              className=" capitalize"
            >
              {project?.status}
            </Badge>
          </div>
      
        </CardHeader>
        <CardContent className="p-4 pt-0 pb-5">
          {/* logo, title,desc */}
          <Link
            href={{
              pathname: `kanban/${project?._id}`,
            }}
          >
            <div className="flex gap-2">
              <div>
                <Avatar className="rounded h-12 w-12">
                  <AvatarImage src={avatar2?.src} alt="" />
                  <AvatarFallback className="rounded uppercase bg-success/30 text-success">
                    {project?.title?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <div className="text-base font-semibold text-default-900 capitalize mb-1">
                  {project?.title}
                </div>
                {project?.description && (
                  <div className="text-xs font-medium text-default-600 max-h-[34px]  overflow-hidden">
                    {project?.description}
                  </div>
                )}
              </div>
            </div>
          </Link>
          {/* team, priority */}
          <div className="flex  mt-6 gap-10">
            <div className="flex-1">
              <div className="text-sm font-medium text-default-900 mb-3">
                Team:
              </div>
              {project?.members?.length > 0 && (
                <div>
                  <AvatarGroup
                    max={10}
                    total={project.members.length}
                    countClass="h-7 w-7"
                  >
                    {project.members?.map((user, index) => (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Avatar
                              className="ring-1 ring-background ring-offset-[2px]  ring-offset-background h-7 w-7 "
                              key={`assign-member-${index}`}
                            >
                              <AvatarImage src={user?.image?.src} />
                              <AvatarFallback>
                                {user?.name?.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          {/* make it content more beautifull */}
                          <TooltipContent>
                            <div className="flex flex-col gap-2">

                              {user?.name}


                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </AvatarGroup>
                </div>
              )}
            </div>
          </div>
          <div className="mt-5">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-default-900 capitalize">
                Project Progress:
              </span>
              <span className="text-xs font-medium text-default-600">
                {project?.percentage ? project?.percentage : 0}%
              </span>
            </div>
            <Progress value={project?.percentage ? project?.percentage : 0} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t  p-4">
          <div>
            <div className="text-xs  text-default-600 mb-[2px]">
              Created Date:
            </div>
            <span className="text-xs font-medium text-default-900">
              {dayjs(project?.createdAt).format("DD-MM-YYYY HH:mm")}
            </span>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default ProjectGrid;
