import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Loader2, Heart } from "lucide-react";
import {
  Plus,
  Trash2,
  ShoppingCart,
  Package,
  Minus,
  X,
  Check,
} from "lucide-react";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import img1 from "@/public/images/all-img/headphone-2.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {createSalesOrderAction_Sales} from "@/action/sales/sales-action";

const customers = ["Customer 1", "Customer 2", "Customer 3"];
const paymentTypes = ["Cash", "Credit Card", "Bank Transfer"];
const orderTypes = ["Online", "In-Store"];
const orderStatuses = ["Pending"];


const CreateOrder = ({ product, session }) => {
  console.log(product)
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer: "",
    orderStatus: "",
    payment: "",
    orderType: "",
    orderDate: "",
    orderTime: "",
  });
  const [selectedItems, setSelectedItems] = useState([]); // Store selected items
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showModal, setShowModal] = useState(false);


  const handleInputChange = (name, value, type) => {
    if (type === "select-one") {
      const selectedValue = value;

      if (name === "customer") {
        setFormData({
          ...formData,
          customer: selectedValue,
        });
      }

      if (name === "orderStatus") {
        setFormData({
          ...formData,
          orderStatus: selectedValue,
        });
      }

      if (name === "payment") {
        setFormData({
          ...formData,
          payment: selectedValue,
        });
      }

      if (name === "orderType") {
        setFormData({
          ...formData,
          orderType: selectedValue,
        });
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to filter items based on search input
  const filteredItems = productList.filter((item) =>
    item.skucode.toLowerCase().includes(searchQuery.toLowerCase())
  );



  // Function to add item to the cart
  const addItemToCart = (item) => {
    const existingItem = selectedItems.find((i) => i._id === item._id);

    if (existingItem) {
      //check quantity upto item quantity
      if (existingItem.quantitySelected >= item.initial.quantity) {
        toast.error("Quantity exceeds available stock", {
          autoClose: 1000,
        });
        return;
      }

      // If item already exists, increase quantity
      setSelectedItems(
        selectedItems.map((i) =>
          i._id === item._id
            ? { ...i, quantitySelected: (i.quantitySelected || 1) + 1 }
            : i
        )
      );
    } else {
      // Add new item with quantity 1
      setSelectedItems([...selectedItems, { ...item, quantitySelected: 1 }]);
    }

    // Show success alert
    toast.success(`${item.skucode} added to cart`, {
      autoClose: 1000,
    });
  };

  // Function to remove item from the cart
  const removeItemFromCart = (id) => {
    const itemToRemove = selectedItems.find((item) => item._id === id);
    setSelectedItems(selectedItems.filter((item) => item._id !== id));

    // Show alert
    toast.success(`${itemToRemove.skucode} removed from cart`, {
      autoClose: 1000,
    });
  };

  // Function to increase item quantity
  const increaseQuantity = (id) => {
    const item = selectedItems.find((item) => item._id === id);
    if (item.quantitySelected >= item.initial.quantity) {
      toast.error("Quantity exceeds available stock", {
        autoClose: 1000,
      });
      return;
    }
    setSelectedItems(
      selectedItems.map((item) =>
        item._id === id
          ? { ...item, quantitySelected: (item.quantitySelected || 1) + 1 }
          : item
      )
    );
  };

  // Function to decrease item quantity
  const decreaseQuantity = (id) => {
    const item = selectedItems.find((item) => item._id === id);
    if (item.quantitySelected <= 1) {
      toast.error("Quantity cannot be less than 1", {
        autoClose: 1000,
      });
      return;
    }
    setSelectedItems(
      selectedItems.map((item) =>
        item._id === id && item.quantitySelected > 1
          ? { ...item, quantitySelected: item.quantitySelected - 1 }
          : item
      )
    );

  };

  // Calculate total price
  const totalPrice = selectedItems.reduce(
    (sum, item) =>
      sum + (item.initial.amount / item.initial.quantity) * (item.quantitySelected || 1),
    0
  );




  const handleSubmit = async () => {

    try {
    
      // validate all items 
      if (!formData.customer) {
        toast.error("Customer is required", {
          autoClose: 1000,
        });
        return;
      }
      if (!formData.orderStatus) {
        toast.error("Order Status is required", {
          autoClose: 1000,
        });
        return;
      }
      if (!formData.payment) {
        toast.error("Payment is required", {
          autoClose: 1000,
        });
        return;
      }
      if (!formData.orderType) {
        toast.error("Order Type is required", {
          autoClose: 1000,
        });
        return;
      }
      if (!formData.orderDate) {
        toast.error("Order Date is required", {
          autoClose: 1000,
        });
        return;
      }
      if (!formData.orderTime) {
        toast.error("Order Time is required", {
          autoClose: 1000,
        });
        return;
      }
      if (!selectedItems.length) {
        toast.error("At least one item is required", {
          autoClose: 1000,
        });
        return;
      }


      const filteredItems = selectedItems.map((item) => ({
        itemId: item._id,
        productName: item.productName,
        category: item.category,
        productCode: item.productCode,
        skucode: item.skucode,
        subCategory: item.subCategory,
        quantitySelected: item.quantitySelected,
        rate: item.initial.amount / item.initial.quantity,
        amount: (item.initial.amount / item.initial.quantity) * (item.quantitySelected || 1),
        
      }));


      
      setLoading(true);
      const response = await createSalesOrderAction_Sales({...formData,items: filteredItems, subTotal: totalPrice, customerObj: customerList.find((item) => item._id === formData.customer)}, session);
  
      if (response.status === "success") {
        toast.success("order created successfully", {
          autoClose: 1000,
        });
        setFormData({});
        setLoading(false);
        setSelectedItems([]);
        setShowModal(false);
       
        
      }
      if (response.status === "fail" || response.status === "error") {
        toast.error(response.message, {
          autoClose: 1000,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        autoClose: 1000,
      });
    }
    }




  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="md" className="rounded-lg text-default-200 font-medium" onClick={() => setShowModal(true)}>
          <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
          Create Order
        </Button>
      </DialogTrigger>

      {showModal && (
        <DialogContent size="5xl">
          <DialogHeader>
            <div className="flex items-center gap-3 p-2">
              <div className="h-12 w-12 rounded-sm border border-border grid place-content-center">
                <Icon
                  icon="heroicons:square-3-stack-3d"
                  className="w-5 h-5 text-default-500"
                />
              </div>
              <div>
                <div className="text-base font-semibold text-default-700  mb-1">
                  Create New Order
                </div>
                <p className="text-xs text-default-500 ">
                  Select how many items you want to order
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6">
            {/* Order Details Section */}
            <div className="space-y-4">
              {/* Customer Selection */}
              <Label className="text-sm font-medium ">Customer</Label>
              <Select
                onValueChange={(data) =>
                  handleInputChange("customer", data, "select-one")
                }
              >
                <SelectTrigger className="w-full" variant="flat">
                  <SelectValue placeholder="Select Customer" />
                </SelectTrigger>
                <SelectContent className="z-[1000]">
                  {customerList.map((customer) => (
                    <SelectItem key={customer._id} value={customer._id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Payment Type & Order Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-3">
                    Payment Type
                  </Label>
                  <Select
                    onValueChange={(data) =>
                      handleInputChange("payment", data, "select-one")
                    }
                  >
                    <SelectTrigger className="w-full" variant="flat">
                      <SelectValue placeholder="Payment Type" />
                    </SelectTrigger>
                    <SelectContent className="z-[1000]">
                      {paymentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3">Order Type</Label>
                  <Select
                    onValueChange={(data) =>
                      handleInputChange("orderType", data, "select-one")
                    }
                  >
                    <SelectTrigger className="w-full" variant="flat">
                      <SelectValue placeholder="Order Type" />
                    </SelectTrigger>
                    <SelectContent className="z-[1000]">
                      {orderTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Order Date & Time */}
              <Label className="text-sm font-medium">Order Date & Time</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  className="w-full"
                  value={formData?.orderDate}
                  onChange={(data) =>
                    handleInputChange("orderDate", data.target.value, "input")
                  }
                  variant="flat"
                />
                <Input
                  type="time"
                  className="w-full"
                  value={formData?.orderTime}
                  onChange={(data) =>
                    handleInputChange("orderTime", data.target.value, "input")
                  }
                  variant="flat"
                />
              </div>

              {/* Order Status */}
              <Label className="text-sm font-medium">Order Status</Label>
              <Select
                onValueChange={(data) =>
                  handleInputChange("orderStatus", data, "select-one")
                }
              >
                <SelectTrigger className="w-full" variant="flat">
                  <SelectValue placeholder="Select Order Status" />
                </SelectTrigger>
                <SelectContent className="z-[1000]">
                  {orderStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Order Note */}
              <Label className="text-sm font-medium">Order Note</Label>
              <Textarea
                placeholder="Type here..."
                variant="flat"
                onChange={(data) =>
                  handleInputChange("orderNote", data.target.value, "input")
                }
              />
            </div>

            {/* Items Selection Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-medium">
                  {showCart ? "Cart Items" : "Items"}
                </Label>

                {/* Cart Toggle Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCart(!showCart)}
                  className="flex items-center gap-2"
                >
                  {showCart ? (
                    <>
                      <Package className="w-4 h-4" />
                      <span>Show Items</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Show Cart</span>
                      {selectedItems.length > 0 && (
                        <Badge variant="destructive" className="ml-1">
                          {selectedItems.length}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </div>

              {/* Items Selection View */}
              <AnimatePresence mode="wait">
                {!showCart ? (
                  <motion.div
                    key="items"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Search Input */}
                    <div className="mb-2">
                      <Input
                        type="text"
                        placeholder="Search items by product code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    {/* Items List with ScrollArea */}
                    <div className="border rounded-md">
                      <ScrollArea className="h-[300px]">
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item) => (
                            <div
                              key={item._id}
                              className="flex items-center justify-between px-3 py-3 hover:bg-gray-100 cursor-pointer border-b"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="rounded-[8px] h-14 w-14">
                                  <AvatarImage src={item.image} />
                                  <AvatarFallback>CD</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-semibold text-gray-900 mb-1">
                                    {item.skucode}
                                  </p>
                                  <p className="text-xs font-medium text-gray-700">
                                    {item.subCategory}
                                  </p>

                                  {item.quantity !== 0 && (
                                    <p className="text-xs font-semibold text-gray-800 flex gap-4">
                                      <span className="text-green-600">
                                      
                                        {(
                                          item.initial.amount / item.initial.quantity
                                        ).toLocaleString()}
                                        /unit{" "}
                                      </span>
                                      <span className="text-gray-500">
                                        Available: {item.initial.quantity}
                                      </span>
                                    </p>
                                  
                                  )}
                                </div>
                              </div>
                              {item.initial.quantity===0 ? (
                                <>
                                <Badge variant="destructive" color="destructive" className="ml-1">
                                  Out of Stock
                                </Badge>
                                </>
                              ):(
                                <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => addItemToCart(item)}
                              >
                                Add Item
                              </Button>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 p-4 text-center">
                            No items found
                          </p>
                        )}
                      </ScrollArea>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border rounded-lg p-4"
                  >
                    {selectedItems.length > 0 ? (
                      <>
                        <ScrollArea className="h-[250px] mb-4">
                          {selectedItems.map((item) => (
                            <div
                              key={item._id}
                              className="flex justify-between items-center border-b py-3"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="rounded-[8px] h-10 w-10">
                                  <AvatarImage src={item.image} />
                                  <AvatarFallback>CD</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">
                                    {item.skucode}
                                  </p>
                                  <p className="text-xs font-semibold text-gray-800 flex gap-4">
                                    <span className="text-green-600">
                                      {" "}
                                      ₹
                                      {(
                                        item.initial.amount / item.initial.quantity
                                      ).toLocaleString()}
                                      /unit{" "}
                                    </span>
                                    <span className="text-gray-500">Remaining: {item.initial.quantity - item.quantitySelected}</span>
                                  </p>
                                  {/* <p className="text-xs text-gray-500">₹{item.price.toLocaleString()}</p> */}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Quantity Controls */}
                                <div className="flex items-center bg-gray-100 rounded-lg">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-l-lg"
                                    onClick={() => decreaseQuantity(item._id)}
                                    disabled={item.quantitySelected <= 1}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center">
                                    {item.quantitySelected || 1}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    className="h-8 w-8 rounded-r-lg"
                                    onClick={() => increaseQuantity(item._id)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>

                                {/* Remove Button */}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => removeItemFromCart(item._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </ScrollArea>

                        {/* Cart Summary */}
                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total Items:</span>
                            <span>{selectedItems.length}</span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="font-medium">Total Amount:</span>
                            <span className="text-lg font-semibold">
                              ₹{totalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[250px] text-center">
                        <ShoppingCart className="h-12 w-12 text-gray-300 mb-2" />
                        <p className="text-gray-500 mb-4">Your cart is empty</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowCart(false)}
                        >
                          Browse Items
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="flex justify-center">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>



            {loading ?  (
                  <Button>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait ...
                </Button>
            )
            :(
            <Button type="button" onClick={handleSubmit}>
              Create Order
            </Button>

            )}
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default CreateOrder;
