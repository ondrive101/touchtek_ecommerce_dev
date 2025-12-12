import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import avatar1 from "@/public/images/avatar/avatar-4.jpg";

const TeamCard = ({ item, project, handleView }) => {
  const { name, departmentName, image, employeeCode } = item;

  const avatar = image || avatar1;
  const today = new Date();

  // Filter tasks assigned to this employee
  const memberTasks = project.tasks.filter((task) =>
    task.assignedTo.includes(employeeCode)
  );

  const total = memberTasks.length;
  const completed = memberTasks.filter((t) => t.status === "completed").length;
  const overdue = memberTasks.filter(
    (t) => new Date(t.dueDate) < today && t.status !== "completed"
  ).length;
  const incomplete = total - completed;

  const stats = [
    { name: "Total Task", count: total, color: "primary" },
    { name: "Completed", count: completed, color: "success" },
    { name: "Incomplete", count: incomplete, color: "info" },
    { name: "Overdue Task", count: overdue, color: "destructive" },
  ];

  const colorMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-green-100 text-green-600",
    info: "bg-blue-100 text-blue-600",
    destructive: "bg-red-100 text-red-600",
  };

  return (
    <Card className="p-6 bg-background">
      <CardContent className="p-0">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full overflow-hidden">
            <Image
              src={project?.employees?.find((emp) => emp.employeeCode === employeeCode)?.image || avatar1}
              alt={name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Name and Department */}
        <div className="text-center text-lg font-medium text-default-800 mt-3 capitalize">
          {name}
        </div>
        <div className="text-center text-sm text-default-600 capitalize">
          {departmentName}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-4">
          <Button variant="secondary" onClick={() => handleView(item)}>
            View
          </Button>
          {/* <Button>Message</Button> */}
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`flex flex-col items-center p-3 rounded ${
                colorMap[stat.color]
              }`}
            >
              <div className="text-sm font-medium capitalize whitespace-nowrap">
                {stat.name}:
              </div>
              <div className="text-sm font-semibold">{stat.count}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
