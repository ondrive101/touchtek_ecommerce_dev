
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsChart from "./stats-chart";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const CustomerStatistics = ({project}) => {
  // console.log('prooject',project)

    const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };
    
    const taskCountByMember = project.members.map(member => {
      const taskCount = project.tasks.filter(task =>
        task.assignedTo.includes(member.employeeCode)
      ).length;
    
      return {
        name: member.name,
        count: taskCount,
        color: getRandomColor()
      };
    }).filter(member => member.count > 0); // ✅ skip members with 0 task count;
  return (
    <Card className="py-2.5">
      <CardHeader className="flex-row items-center justify-between gap-4 border-none pb-0 ">
        <CardTitle>Member Statistics</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-8">
        <StatsChart data={taskCountByMember}/>
      </CardContent>
    </Card>
  );
};

export default CustomerStatistics;