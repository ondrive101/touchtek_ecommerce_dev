"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DatePickerWithRange from "@/components/date-picker-with-range";
import Stats from "./statsheader";

import Table from "./table";

const Main = ({productList, session}) => {
  return (
    <div className=" space-y-5">
      <div className="flex items-center justify-between">
                    <div className="text-xl font-medium text-default-800">
                       Inventory Summary
                    </div>
                    <div className="flex items-center space-x-4">
                    {/* <AddSupplier session={session} />
                    <AddSupplierBulk session={session} /> */}
                    </div>
                  </div>
            <div>
              <Stats list={productList} session={session} />
            </div>
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table productList={productList} session={session}/>
        </CardContent>
      </Card>
    </div>
  );
};

export default Main;
