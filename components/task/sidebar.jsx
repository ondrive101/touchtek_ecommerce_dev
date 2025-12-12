"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import Notification from "@/components/notification";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { Tree } from "@/components/ui/tree";
import { Input } from "@/components/ui/input";

export function Nav({
  isCollapsed = false,
  onSelect,
  data,
  setGroupId,
  setShowCreateProject,
  setGroupClicked,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  if (isCollapsed) {
    return (
      <div
        data-collapsed={isCollapsed}
        className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
      >
        {filteredData.map((link, index) => (
          <Tooltip key={index} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href={link.href || "#"} // Use link.href if available, fallback to "#"
                className={cn(
                  "p-2 rounded-md hover:bg-default-100",
                  link.href ? "text-default-600" : "text-default-400"
                )}
              >
                {link.icon} {/* Directly render the Lucide icon */}
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="flex items-center gap-4 capitalize"
            >
              {link.label}
              {link.badge && (
                <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {link.badge}
                </span>
              )}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  }
  return (
    <div className="w-56 bg-background flex flex-col p-0">
      {/* Header */}
      {/* <div className="p-1 px-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 mt-2">
  <h2 className="text-md font-semibold text-white">Activity</h2>
</div> */}
      <Button className=" mt-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
        Activity
      </Button>

      {/* Tree Navigation */}
      <div className="flex-1 overflow-auto pb-4 pt-2">
        <Tree
          data={filteredData}
          onSelect={onSelect}
          defaultExpandedKeys={["projects"]}
          setGroupId={setGroupId}
          setShowCreateProject={setShowCreateProject}
          setGroupClicked={setGroupClicked}
          className="data-[open=true]:bg-primary data-[open=true]:text-primary-foreground"
        />
        {searchQuery && filteredData.length === 0 && (
          <div className="text-center py-8 text-default-500 text-sm">
            No items found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}
