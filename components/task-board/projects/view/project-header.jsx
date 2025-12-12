"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import projectImage from "@/public/images/projects/project-1.png";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import avatar1 from "@/public/images/avatar/avatar-1.jpg";
const ProjectHeader = ({ project }) => {
 
  return (
    <>
      <CardHeader className="flex-row items-center">
        <CardTitle className="flex-1"> #{project.code} </CardTitle>
      </CardHeader>
      <CardContent className="border-b border-default-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-none">
            <div className="h-[148px] w-[148px] rounded">
              <Image
                src={projectImage}
                alt="dashtail"
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap justify-between gap-4">
              <div className="text-xl font-medium text-default-950 truncate capitalize">
                {" "}
                {project.title}
              </div>
              <div className="space-x-3 rtl:space-x-reverse ">
                <Badge color="success" variant="soft" className="capitalize">
                  {" "}
                  {project.status}
                </Badge>
              </div>
            </div>
            <div className="text-sm text-default-600 w-full  mt-1">
              {project.description}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 lg:gap-6">
              <div
                className="border border-dashed border-default-300 rounded py-2.5 px-3 min-w-fit lg:min-w-[148px]"
              >
                <div className="text-sm font-medium text-default-500 capitalize">
                  Created Date
                </div>
                <div className="text-sm font-medium text-default-900">
                  {dayjs(project.createdAt).format("DD-MM-YYYY HH:mm")}
                </div>
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
                              <AvatarImage src={avatar1?.src} />
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
        </div>
      </CardContent>
    </>
  );
};

export default ProjectHeader;
