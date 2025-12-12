"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const pages = [
  { text: "overview", value: "overview" },
  { text: "board", value: "board" },
  { text: "timeline", value: "timeline" },
  { text: "team", value: "team" },
  { text: "settings", value: "settings" },
];

const PageTabs = ({ activeTab, setActiveTab }) => {


  const handleTabClick = (value) => {
    setActiveTab(value)
  };

  return (
    <div className="flex border-b border-border text-sm font-medium">
      {pages.map((item) => {
        const isActive = activeTab === item.value;
        return (
          <button
            key={item.value}
            onClick={() => handleTabClick(item.value)}
            className={cn(
              "px-4 py-2.5 border-b-2 -mb-px transition-all capitalize",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {item.text}
          </button>
        );
      })}
    </div>
  );
};

export default PageTabs;
