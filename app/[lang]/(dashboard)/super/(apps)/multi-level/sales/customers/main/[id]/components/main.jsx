"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, Upload } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import shortImage from "@/public/images/avatar/avatar-11.jpg";

import BasicDataTable from "./table";

import { Icon } from "@iconify/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import day from "dayjs";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Main = ({ session, customer }) => {

  const totalOrderAmount = customer?.salesOrders?.data?.financialSummary?.grandTotal
  console.log('customer', customer)
  return (
    <>
      {/* heads */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-center text-center sm:text-left">
          <h1 className="text-md font-semibold text-gray-700">
            Customer ID
            <span className="ml-2 font-light text-gray-500">
              #{customer?.customer?._id}
            </span>
          </h1>
          <h1 className="text-md font-semibold text-gray-700">
            Customer Since
            <span className="ml-2 font-light text-gray-500">
              {day(customer?.customer?.createdAt).format("DD-MMM YYYY h:mm A")}
            </span>
          </h1>
          <h1 className="text-md font-semibold text-gray-700">
            Tracking ID
            <span className="ml-2 font-light text-gray-500">
              #{customer?.customer?.customerId}
            </span>
          </h1>
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Button className="rounded-lg" color="dark">
            Edit Customer
          </Button>
          <Button className=" rounded-lg" color="destructive">
            Suspend Customer
          </Button>
        </div>
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* customer info */}
        <div className="bg-white p-4 rounded-xl  flex flex-col h-full">
          <div className="flex-grow">
            <div className="header flex items-center w-full justify-between mb-6">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 rounded">
                  <AvatarImage src={shortImage.src} />
                  <AvatarFallback>SN</AvatarFallback>
                </Avatar>
                <div className="ml-4 flex flex-col justify-start">
                  <h2 className="text-lg font-semibold">
                    {customer?.customer?.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Last Order 12 Jan 2025
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded capitalize">
                  {customer?.customer?.customerCategory}
                </span>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded w-max">
                  {customer?.customer?.status}
                </span>
              </div>
            </div>
          </div>
          <div className="footer flex space-x-12 mt-4">
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700 tracking-wide">
                Phone
              </p>
              <p className="text-sm text-gray-500">
                +91 {customer?.customer?.contactNumber}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700 tracking-wide">
                Email
              </p>
              <p className="text-sm text-gray-500">
                {customer?.customer?.email}
              </p>
            </div>
          </div>
        </div>
        {/* address */}
        <div className="bg-white p-4 rounded-xl  flex flex-col h-full">
          <div className="flex-grow">
            <div className="header flex items-center w-full justify-between mb-6">
              <div className="flex items-center">
                <div className={`bg-gray-100 p-2 rounded-xl`}>
                  <Icon
                    icon="mdi:map-marker"
                    className="text-gray-700 text-2xl"
                  />
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-700">
                  Address
                </h3>
              </div>
            </div>
          </div>
          <div className="footer flex space-x-12 mt-4">
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700 tracking-wide">
                Home Address
              </p>
              <p className="text-sm text-gray-500">
                {customer?.customer?.streetAddress} {customer?.customer?.state}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700 tracking-wide">
                Billing Address
              </p>
              <p className="text-sm text-gray-500">
                {customer?.customer?.streetAddress} {customer?.customer?.state}
              </p>
            </div>
          </div>
        </div>
        {/* total orders */}
        <div className="bg-white p-4 rounded-xl  flex flex-col h-full">
          <div className="flex-grow">
            <div className="header flex items-center w-full justify-between mb-6">
              <div className="flex items-center">
                <div className={`bg-gray-100 p-2 rounded-xl`}>
                  <Icon icon="mdi:cart" className="text-gray-700 text-2xl" />
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-700">
                  Total Order
                </h3>
              </div>
            </div>
          </div>
          <div className="footer flex space-x-12 mt-4">
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700 tracking-wide">
                Total Orders
              </p>
              <p className="text-sm text-gray-500">{customer?.totalOrdersAmount}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700 tracking-wide">
                Average Order Value
              </p>
              <p className="text-sm text-gray-500">{customer?.totalOrdersAverage}</p>
            </div>
          </div>
        </div>

        {/* order status */}
        <div className="bg-white p-4 rounded-xl  flex flex-col h-full">
          <div className="flex-grow">
            <div className="header flex items-center w-full justify-between mb-6">
              <div className="flex items-center">
                <div className={`bg-gray-100 p-2 rounded-xl`}>
                  <Icon
                    icon="mdi:currency-usd"
                    className="text-gray-700 text-2xl"
                  />
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-700">
                  Order Status
                </h3>
              </div>
            </div>
          </div>
          <div className="footer flex space-x-12 mt-4">
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700 tracking-wide">
                All Orders
              </p>
              <p className="text-sm text-gray-500">{customer?.salesOrders?.length}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700 tracking-wide">
                Pending
              </p>
              <p className="text-sm text-gray-500">{customer?.salesOrders?.filter((order) => order?.status === "in-progress").length}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700 tracking-wide">
                Completed
              </p>
              <p className="text-sm text-gray-500">{customer?.salesOrders?.filter((order) => order?.status === "completed").length}</p>
            </div>
          </div>
        </div>

        {/* order issues */}
        <div className="bg-white p-4 rounded-xl  flex flex-col h-full">
          <div className="flex-grow">
            <div className="header flex items-center w-full justify-between mb-6">
              <div className="flex items-center">
                <div className={`bg-gray-100 p-2 rounded-xl`}>
                  <Icon
                    icon="mdi:cart-off"
                    className="text-gray-700 text-2xl"
                  />
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-700">
                  Order Issues
                </h3>
              </div>
            </div>
          </div>
          <div className="footer flex space-x-12 mt-4">
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700 tracking-wide">
                Cancelled
              </p>
              <p className="text-sm text-gray-500">25</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700 tracking-wide">
                Returned
              </p>
              <p className="text-sm text-gray-500">15</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700 tracking-wide">
                Damaged
              </p>
              <p className="text-sm text-gray-500">5</p>
            </div>
          </div>
        </div>

        {/* abandoned orders */}
        <div className="bg-white p-4 rounded-xl  flex flex-col h-full">
          <div className="flex-grow">
            <div className="header flex items-center w-full justify-between mb-6">
              <div className="flex items-center">
                <div className={`bg-gray-100 p-2 rounded-xl`}>
                  <Icon
                    icon="mdi:cart-off"
                    className="text-gray-700 text-2xl"
                  />
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-700">
                  Abandoned
                </h3>
              </div>
            </div>
          </div>
          <div className="footer flex space-x-12 mt-4">
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700 tracking-wide">
                Abandoned
              </p>
              <p className="text-sm text-gray-500">45</p>
            </div>
          </div>
        </div>

        {/* shipping performance */}
        {/* <div className="bg-white p-4 rounded-lg shadow-md flex flex-col h-full">
     <div className="flex-grow">
      <div className="header flex items-center w-full justify-between mb-6">
       <div className="flex items-center">
       <Icon icon="mdi:truck" className="text-gray-700 text-2xl" />
        <h3 className="ml-4 text-lg font-semibold text-gray-700">
         Shipping Performance
        </h3>
       </div>
      </div>
     </div>
     <div className="footer flex space-x-12 mt-4">
      <div className="space-y-2">
       <p className="text-sm font-bold text-gray-700 tracking-wide">
        TOTAL SHIPMENTS
       </p>
       <p className="text-sm text-gray-500">
        425
       </p>
      </div>
      <div className="space-y-2">
       <p className="text-sm font-bold text-gray-700 tracking-wide">
        ON-TIME DELIVERY
       </p>
       <p className="text-sm text-gray-500">
        95%
       </p>
      </div>
     </div>
    </div> */}

        {/* customer feedback */}
        {/* <div className="bg-white p-4 rounded-lg shadow-md flex flex-col h-full">
     <div className="flex-grow">
      <div className="header flex items-center w-full justify-between mb-6">
       <div className="flex items-center">
        <Icon icon="mdi:comment" className="text-gray-700 text-2xl" />
        <h3 className="ml-4 text-lg font-semibold text-gray-700">
         Customer Feedback
        </h3>
       </div>
      </div>
     </div>
     <div className="footer flex space-x-12 mt-4">
      <div className="space-y-2">
       <p className="text-sm font-bold text-gray-700 tracking-wide">
        AVERAGE RATING
       </p>
       <p className="text-sm text-gray-500">
        4.7
       </p>
      </div>
      <div className="space-y-2">
       <p className="text-sm font-bold text-gray-700 tracking-wide">
        TOTAL REVIEWS
       </p>
       <p className="text-sm text-gray-500">
        250
       </p>
      </div>
     </div>
    </div> */}

        {/* conversion metrics */}
        {/* <div className="bg-white p-4 rounded-lg shadow-md flex flex-col h-full">
     <div className="flex-grow">
      <div className="header flex items-center w-full justify-between mb-6">
       <div className="flex items-center">
       <Icon icon="mdi:percent" className="text-gray-700 text-2xl" />
        <h3 className="ml-4 text-lg font-semibold text-gray-700">
         Conversion Metrics
        </h3>
       </div>
      </div>
     </div>
     <div className="footer flex space-x-12 mt-4">
      <div className="space-y-2">
       <p className="text-sm font-bold text-gray-700 tracking-wide">
        LEADS
       </p>
       <p className="text-sm text-gray-500">
        750
       </p>
      </div>
      <div className="space-y-2">
       <p className="text-sm font-bold text-gray-700 tracking-wide">
        CONVERSIONS
       </p>
       <p className="text-sm text-gray-500">
        225
       </p>
      </div>
      <div className="space-y-2">
       <p className="text-sm font-bold text-gray-700 tracking-wide">
        CONVERSION RATE
       </p>
       <p className="text-sm text-gray-500">
        30%
       </p>
      </div>
     </div>
    </div> */}
      </div>

      <Card className="rounded-xl shadow-none mt-6">
        <CardContent className="p-4 pt-8">
          <BasicDataTable list={customer?.salesOrders} customer={customer?.customer} session={session} />
        </CardContent>
      </Card>
    </>
  );
};

export default Main;
