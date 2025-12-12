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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import avatar1 from "@/public/images/avatar/avatar-1.jpg";

const columns = [
  { key: "employee", label: "Employee" },
  { key: "task name", label: "Task Name" },
  { key: "deadline", label: "Deadline" },
  { key: "overdue", label: "Overdue" },
];

const OverdueTask = ({ project }) => {
  const today = new Date();

  const overdueTasks = project?.tasks
    ?.filter((task) => {
      // ✅ Filter only if dueDate is valid and overdue
      if (!task.dueDate) return false;
      const due = new Date(task.dueDate);
      return due < today;
    })
    .map((task) => {
      const assigned = project.members.find((m) =>
        task.assignedTo.includes(m.employeeCode)
      );

      const dueDate = new Date(task.dueDate);
      const overdueDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));

      return {
        id: task.taskId,
        task: task.name,
        deadline: dueDate.toLocaleDateString(),
        overdue: overdueDays,
        name: assigned?.name || "Unassigned",
        avatar: assigned?.image ? { src: assigned.image } : avatar1,
      };
    });

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center mb-0">
        <CardTitle>Overdue Task</CardTitle>
      </CardHeader>
      {overdueTasks?.length < 1 ? (
            <div className="p-10 text-center max-w-md mx-auto">
            <div className="flex justify-center mb-4">
                <div className="bg-gray-100 rounded-full p-6">
                    <img alt="Illustration of an empty shopping bag" className="w-16 h-16" src="https://storage.googleapis.com/a1aa/image/xCd_DojMKbtR-IFTcEC1b5lwmS9id2hw7vPmK13FZCg.jpg" width="64" height="64"/>
                </div>
            </div>
            <h1 className="text-xl font-semibold mb-2">No Overdue Task Found</h1>
        </div>
      ) : (
      <CardContent className="px-0 pb-0 overflow-x-auto">
        <Table>
          <TableHeader className="bg-default-200">
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className="text-sm font-semibold text-default-800 last:text-right rtl:first:pl-6 h-12"
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>



          
          <TableBody>
            {overdueTasks?.map((item) => (
              <TableRow key={item.id} className="hover:bg-default-100">
                <TableCell className="flex items-center gap-2 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={item?.avatar?.src} alt="" />
                    <AvatarFallback>
                      {item.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-default-600 py-1">
                    {item.name}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-medium text-default-600 py-1 overflow-hidden text-ellipsis whitespace-nowrap max-w-[181px]">
                  {item.task}
                </TableCell>
                <TableCell className="text-sm font-medium text-default-600 py-1">
                  {item.deadline}
                </TableCell>
                <TableCell className="text-sm font-medium text-default-600 last:text-end py-1 whitespace-nowrap">
                  <Badge color="warning" variant="soft">
                    {item.overdue} day{item.overdue > 1 ? "s" : ""}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          
        </Table>
      </CardContent>
      )}
    </Card>
  );
};

export default OverdueTask;
