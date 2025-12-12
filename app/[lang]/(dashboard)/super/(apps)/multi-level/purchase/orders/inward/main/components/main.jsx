"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Stats from "./statsheader";
import NoData from "./no-data";
import { Switch } from "@/components/ui/switch";
import BasicDataTable from "./table";
import CreateOrderModal from "./modalContents/createOrder";

const Main = ({ session,ordersList, supplierList, productList }) => {
  const [showData, setShowData] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="text-xl font-medium text-default-800">
          Orders Summary
        </div>
        <div className="flex items-center space-x-4">
          <CreateOrderModal
            session={session}
            supplierList={supplierList}
            productList={productList}
          />
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {showData ? "Data View" : "No Data"}
            </span>
            <Switch checked={showData} onCheckedChange={setShowData} />
          </div>
        </div>
      </div>
      <div>
        <Stats salesOrderList={[]} />
      </div>

      {!showData ? (
        <Card className="rounded-xl shadow-none flex items-center justify-center h-[475px]">
          <NoData />
        </Card>
      ) : (
        <Card className="rounded-lg shadow-none">
          <CardContent className="p-4 pt-8">
            <BasicDataTable session={session} ordersList={ordersList}  supplierList={supplierList}
            productList={productList}/>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Main;
