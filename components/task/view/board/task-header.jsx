"use client";

import { Input } from "@/components/ui/input";
import React from "react";
import { Plus, Search, Settings, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { ArrowBigDownDash, ArrowBigUpDash } from "lucide-react";

const TaskHeader = ({
  openCreateBoard,
  filter,
 
  setFilter,
  incomingOutgoing,
  setIncomingOutgoing,
  
}) => {


 

  const handleInputChange = (name, value, type) => {
    if (type === "select-one") {
      const selectedValue = value;

      if (name === "ioFilter") {
        setFilter({
          ...filter,
          ioFilter: selectedValue,
        });
      }
      if (name === "boardFilter") {
        setFilter({
          ...filter,
          boardFilter: selectedValue,
        });
      }
      if (name === "priorityFilter") {
        setFilter({
          ...filter,
          priorityFilter: selectedValue,
        });
      }

    }

  };

  return (
    <div className="flex items-center flex-wrap gap-4">
      <div className="flex-1 flex items-center  gap-4">
        {/* search task */}
        {/* <div className="relative min-w-[240px]">
          <span className="absolute top-1/2 -translate-y-1/2 ltr:left-2 rtl:right-2">
            <Search className="w-4 h-4 text-default-500" />
          </span>
          <Input
            type="text"
            placeholder="search files"
            className="ltr:pl-7 rtl:pr-7"
            size="lg"
          />
        </div> */}
        {/* filter task */}
        {/* <div className="relative">
          <Icon
            icon="heroicons:swatch"
            className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-2.5 text-default-600"
          />
          <Select
            onValueChange={(data) =>
              handleInputChange("ioFilter", data, "select-one")
            }
            id="ioFilter"
            name="ioFilter"
          >
            <SelectTrigger className="pl-9 min-w-[120px] whitespace-nowrap py-0">
              <SelectValue placeholder="All Task" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Task</SelectItem>
              <SelectItem value="incoming">Incoming</SelectItem>
              <SelectItem value="outgoing">Outgoing</SelectItem>
            </SelectContent>
          </Select>
          
        </div> */}

        <div className="relative">
          <Icon
            icon="heroicons:swatch"
            className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-2.5 text-default-600"
          />
          <Select
            onValueChange={(data) =>
              handleInputChange("priorityFilter", data, "select-one")
            }
            id="priorityFilter"
            name="priorityFilter"
          >
            <SelectTrigger className="pl-9 min-w-[120px] whitespace-nowrap py-0">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* right */}
      {/* <div className="flex-none flex items-center gap-4">
        <Button onClick={openCreateBoard}>
          <Plus className="w-4 h-4 ltr:mr-1 rtl:ml-1" /> Create Board
        </Button>
      </div> */}
    </div>
  );
};

export default TaskHeader;
