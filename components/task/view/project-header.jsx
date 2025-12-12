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
        <CardTitle className="flex-1"> {project.title} </CardTitle>
      </CardHeader>
      <CardContent className="border-b border-default-200">
        <div className="flex flex-col md:flex-row gap-4"> 
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
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default ProjectHeader;
