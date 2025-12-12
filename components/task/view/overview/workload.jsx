"use client";
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
  XAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import avatar1 from "@/public/images/avatar/avatar-1.jpg";
import { MessageSquare } from "lucide-react"; // ✅ Import comment icon

const WorkloadChart = ({ height = 295, project }) => {
  const { theme: config } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);

  // ✅ Calculate total task assignments (each assignedTo counts as 1)
  const totalAssignments = project?.tasks?.reduce(
    (acc, task) => acc + (task?.assignedTo?.length || 0),
    0
  );

  // ✅ Map members to their workload percentage
  const data =
    project?.members
      ?.map((member) => {
        const assignedCount = project.tasks?.filter((task) =>
          task.assignedTo.includes(member.employeeCode)
        ).length;

        const percentage = totalAssignments
          ? Math.round((assignedCount / totalAssignments) * 100)
          : 0;

        return {
          name: member.name,
          avatar: avatar1,
          progress: percentage,
          commentCount: assignedCount, // Could also represent task count
        };
      })
      .filter((item) => item.progress > 0) // ✅ Skip members with 0% workload
      .sort((a, b) => b.progress - a.progress) || []; // ✅ Descending order

  // ✅ Bar label
  const renderCustomizedLabel = (props) => {
    const { x, y, width, value } = props;
    const radius = 10;
    return (
      <g>
        <text
          x={x + width / 2}
          y={y - radius}
          textAnchor="middle"
          fill={`hsl(${
            theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
          })`}
        >
          {value}%
        </text>
      </g>
    );
  };

  return (
    <Card>
      <CardHeader className="border-none p-6 pt-7 pb-0 mb-0">
        <CardTitle>Workload</CardTitle>
      </CardHeader>
      <CardContent className="mb-0 pb-1 px-0">
        <ResponsiveContainer height={height}>
          <BarChart height={height} data={data}>
            <Bar
              dataKey="progress"
              fill={`hsl(${
                theme?.cssVars[mode === "dark" ? "dark" : "light"].primary
              })`}
              radius={[10, 10, 0, 0]}
              barSize={60}
            >
              <LabelList dataKey="progress" content={renderCustomizedLabel} />
            </Bar>
            <XAxis
              height={1}
              tickLine={false}
              stroke={`hsl(${
                theme?.cssVars[
                  mode === "dark" || mode === "system" ? "dark" : "light"
                ].chartGird
              })`}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="items-center mt-0 px-0">
        {data.map((item, i) => (
          <div
            className="flex-1 flex flex-col items-center px-1"
            key={`overflow-map-key-${i}`}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={item.avatar.src} />
              <AvatarFallback>
                {item.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-xs font-medium text-default-600 mt-2 capitalize">
              {item.name}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-default-500 mt-1">
              <MessageSquare className="w-3 h-3 text-default-500 bg-default-200 p-1 rounded-full" /> {item.commentCount} tasks
            </div>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
};

export default WorkloadChart;
