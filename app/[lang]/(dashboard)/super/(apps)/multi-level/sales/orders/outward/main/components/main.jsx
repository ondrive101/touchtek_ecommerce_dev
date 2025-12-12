"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import BasicDataTable from "./table";

const Main = ({list, session}) => {
  return (
    <div className=" space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Supplier List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <BasicDataTable list={list} session={session}/>
        </CardContent>
      </Card>
    </div>
  );
};

export default Main;
