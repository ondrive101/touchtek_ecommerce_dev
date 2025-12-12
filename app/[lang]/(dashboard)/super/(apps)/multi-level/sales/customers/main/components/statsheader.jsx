"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle, XCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Stats = ({customerList}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card className="rounded-xl shadow-none">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6" >
          <div className={`bg-gray-100 p-2 rounded-full`}>
          <Users className={`h-5 w-5 text-gray-600`} />
        </div>
          <Select>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Today" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">This week</SelectItem>
                      </SelectContent>
                    </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="All Customers"
              value={customerList?.length}
              // change="+16.80%"
              color="blue"
              icon={Users}
              className="border-r"
            />
            <StatCard
              title="Active"
              value={customerList?.filter((customer) => customer.status === "active").length}
              // change="+85%"
              color="green"
              icon={CheckCircle}
              className="border-r"
            />
            <StatCard
              title="In-Active"
              value={customerList?.filter((customer) => customer.status === "inactive").length}
              // change="-10%"
              color="red"
              icon={XCircle}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-xl shadow-none">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className={`bg-gray-100 p-2 rounded-full`}>
          <Settings className={`h-5 w-5 text-gray-600`} />
        </div>
        <Select>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Today" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">This week</SelectItem>
                    </SelectContent>
                  </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="New Customers"
              value="0"
              // change="+16.80%"
              color="blue"
              icon={Users}
              className="border-r"
            />
            <StatCard
              title="Purchasing"
              value="0"
              // change="+85%"
              color="green"
              icon={CheckCircle}
              className="border-r"
            />
            <StatCard
              title="Abandoned Carts"
              value="0"
              // change="-10%"
              color="red"
              icon={XCircle}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard = ({ title, value, change, color, icon: Icon, className }) => {
  return (
    <div className={`bg-white p-6 rounded-lg ${className}`} >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <div className="flex items-center gap-2 mt-2">
          <p className="text-2xl font-medium text-gray-700">{value}</p>
          <p className={`text-${color}-500 text-sm`}>{change}</p>
          </div>
        </div>
        <div className={`bg-${color}-100 p-2 rounded-full`}>
          <Icon className={`h-5 w-5 text-${color}-600`} />
        </div>
      </div>
    </div>
  );
};

export default Stats;
