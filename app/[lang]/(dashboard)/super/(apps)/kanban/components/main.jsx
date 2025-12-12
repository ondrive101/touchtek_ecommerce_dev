"use client";
import TaskBoard from "@/components/task";
import { usePathname } from "next/navigation";

const Main = ({ session, departmentEmployees }) => {
  const pathname = usePathname();

  return (
    <>
      <TaskBoard session={session} departmentEmployees={departmentEmployees} />
    </>
  );
};

export default Main;
