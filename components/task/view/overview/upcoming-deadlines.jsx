"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import avatar1 from "@/public/images/avatar/avatar-1.jpg";

const columns = [
  { key: "employee", label: "Employee" },
  { key: "task name", label: "Task Name" },
  { key: "deadline", label: "Deadline" },
  { key: "remaining", label: "Remaining Days" },
];

const UpcomingDeadline = ({ project }) => {
  const today = new Date();

  const upcomingTasks =
    project?.tasks
      ?.filter((task) => {
        const due = task?.dueDate ? new Date(task.dueDate) : null;
        return (
          due &&
          due > today &&
          task.status !== "completed" &&
          task.assignedTo?.length > 0
        );
      })
      ?.map((task) => {
        const dueDate = new Date(task.dueDate);
        const diffTime = dueDate.getTime() - today.getTime();
        const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const assigned = project.members.find((m) =>
          task.assignedTo.includes(m.employeeCode)
        );

        return {
          id: task.taskId,
          task: task.name,
          deadline: dueDate.toLocaleDateString(),
          remaining: `${remainingDays} day${remainingDays > 1 ? "s" : ""} left`,
          name: assigned?.name || "Unassigned",
          avatar: assigned?.image ? { src: assigned.image } : avatar1,
        };
      }) || [];

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center mb-0">
        <CardTitle>Upcoming Deadlines</CardTitle>
        <Button type="button" color="secondary" variant="soft">
          View all
        </Button>
      </CardHeader>
      <CardContent className="px-0 overflow-x-auto">
        {upcomingTasks.length > 0 ? (
          <Table>
            <TableHeader className="bg-default-200">
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className="text-sm font-semibold text-default-800 rtl:first:pl-7"
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingTasks.map((item) => (
                <TableRow key={item.id} className="hover:bg-default-100">
                  <TableCell className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={item?.avatar?.src} alt="" />
                      <AvatarFallback>
                        {item.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-default-600">
                      {item.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-default-600 overflow-hidden text-ellipsis whitespace-nowrap max-w-[181px]">
                    {item.task}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-default-600 whitespace-nowrap">
                    {item.deadline}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
  <Badge color="success" variant="soft">
    {item.remaining}
  </Badge>
</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-default-500 py-8 text-sm">
            💤 No upcoming tasks found!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadline;
