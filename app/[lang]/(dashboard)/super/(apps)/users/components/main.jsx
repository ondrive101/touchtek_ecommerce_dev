"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import BasicDataTable from "./table";

const Main = ({ session, departmentList, employeeList }) => {
  return (
    <div className=" app-height space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Department List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <BasicDataTable
            session={session}
            departmentList={departmentList}
            employeeList={employeeList}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Main;
