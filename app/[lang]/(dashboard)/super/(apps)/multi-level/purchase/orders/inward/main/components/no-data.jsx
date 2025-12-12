import React from 'react'
import { Button } from "@/components/ui/button";
import { Plus, Send } from "lucide-react";
import Link from "next/link";

const NoData = () => {
  return (
    <div className="p-10 text-center max-w-md mx-auto">
    <div className="flex justify-center mb-4">
        <div className="bg-gray-100 rounded-full p-6">
            <img alt="Illustration of an empty shopping bag" className="w-16 h-16" src="https://storage.googleapis.com/a1aa/image/xCd_DojMKbtR-IFTcEC1b5lwmS9id2hw7vPmK13FZCg.jpg" width="64" height="64"/>
        </div>
    </div>
    <h1 className="text-xl font-semibold mb-2">No Orders Yet?</h1>
    <p className="text-gray-500 mb-6">Add products to your store and start selling to see orders here.</p>
    <div className="flex justify-center">
    <Link href="/sales/orders/create-order">
        <Button size="md" className="rounded-xl text-default-200 font-medium">
            <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2 " />
            Add New Order
          </Button>
          </Link>
    </div>
</div>
  )
}

export default NoData