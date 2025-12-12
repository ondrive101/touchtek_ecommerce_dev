"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddCustomer from "./modalContents/add-customer";
import AddBulkCustomer from "./modalContents/add-customer-bulk";
import Stats from "./statsheader";
import { Button } from "@/components/ui/button";
import { Plus, Send } from "lucide-react";
import Link from "next/link";

import BasicDataTable from "./table";

const Main = ({ list, session }) => {
  return (
    <div className=" space-y-5">
            <div className="flex items-center justify-between">
              <div className="text-xl font-medium text-default-800">
                Customers Summary
              </div>
              <div className="flex items-center space-x-4">
                <AddCustomer session={session}/>
                <AddBulkCustomer session={session}/>
              </div>
            </div>
      <div>
        <Stats customerList={list} session={session} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Customers List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <BasicDataTable list={list} session={session} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Main;
