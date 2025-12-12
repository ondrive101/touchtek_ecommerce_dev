"use client";

import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const RADIAN = Math.PI / 180;

// Render percentage labels inside pie
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Generate board-wise task data
const getBoardTaskSummary = (project, COLORS) => {
  if (!project?.boards || !project?.tasks) return [];

  return project.boards.map((board, index) => ({
    name: board.name,
    value: project.tasks.filter(task => task.boardId === board.boardId).length,
    color: COLORS[index % COLORS.length],
  }));
};

const ProjectProgress = ({ height = 230, project }) => {
  const { theme: config } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((t) => t.name === config);

  const COLORS = [
    `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].success})`,
    `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].warning})`,
    `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].info})`,
  ];

  const data = getBoardTaskSummary(project, COLORS);
  const totalTask = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader className="border-none p-6 pt-7 mb-0">
        <CardTitle>Board Task Distribution</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart height={height}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={115}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex-col">
        <div className="text-center text-base font-semibold text-default-900">
          Total Task: {totalTask}
        </div>
        <div className="flex items-center justify-center mt-4 gap-6 flex-wrap">
          {data.map((item) => (
            <div key={item.name}>
              <div className="flex items-center gap-1">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-medium text-default-500">{item.name}</span>
              </div>
              <div className="text-xs font-medium text-default-800 mt-1 ml-4">
                {item.value} Task
              </div>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectProgress;
