"use client";

import ListItem from "./list-item";
import DetailsCard from "./details-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import avatar1 from "@/public/images/avatar/avatar-1.jpg"; // fallback avatar

const TopContributor = ({ project }) => {
  const totalTasks = project?.tasks?.length || 0;

  const contributors = project?.members
    .map((member) => {
      const count = project?.tasks?.filter((task) =>
        task.assignedTo.includes(member.employeeCode)
      ).length;

      const score = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;

      return {
        id: member.employeeCode,
        name: member.name,
        email: `${member.name.toLowerCase()}@company.com`, // fallback
        score,
        image: avatar1, // replace with actual image if available
        count,
      };
    })
    .filter((user) => user.count > 0) // filter out non-contributors
    .sort((a, b) => b.count - a.count) // sort by contribution count
    .slice(0, 6); // top 6 (3 big, 3 list)

  return (
    <Card>
      <CardHeader className="border-none pt-6 pl-6">
        <CardTitle>Top Contributor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-x-8 mt-20">
          {contributors.map((item, index) =>
            index > 2 ? (
              <ListItem key={item.id} item={item} index={index} project={project}/>
            ) : (
              <DetailsCard key={item.id} item={item} index={index} project={project}/>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopContributor;
