"use client"
import React from "react";
import { Card, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import ProjectHeader from "./project-header";
import PageLink from "./page-link";
import Team from "./team";


const ProjectLayout = ({ project }) => {
  const [activeTab, setActiveTab] = useState("overview");
  console.log('project', project)
  return (
    <div>
      <Card className="mb-6">
        <ProjectHeader project={project} />
        <CardFooter className="gap-x-4 gap-y-3  lg:gap-x-6 pb-0 pt-6 flex-wrap">
          <PageLink activeTab={activeTab} setActiveTab={setActiveTab} />
        </CardFooter>
      </Card>
      {activeTab === "team" && <Team project={project} />}
    </div>
  );
};

export default ProjectLayout;
