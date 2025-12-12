"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Stats from "./statsheader";
import { Button } from "@/components/ui/button";
import { Plus, Send } from "lucide-react";
import Link from "next/link";
import AddSupplier from "./modalContents/add-vendor";
import AddSupplierBulk from "./modalContents/add-vendor-bulk";

import BasicDataTable from "./table";

const Main = ({list, session}) => {
  return (
    <div className=" space-y-5">
               <div className="flex items-center justify-between">
                    <div className="text-xl font-medium text-default-800">
                      Suppliers Summary
                    </div>
                    <div className="flex items-center space-x-4">
                    <AddSupplier session={session} />
                    <AddSupplierBulk session={session} />
                    </div>
                  </div>
            <div>
              <Stats list={list} session={session} />
            </div>
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
