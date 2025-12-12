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
import {
  Loader2,
  Search,
  Plus,
  Trash2,
  X,
  Minus,
  ShoppingCart,
} from "lucide-react";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import day from "dayjs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPurchaseOrder } from "@/action/purchase/controller";

const paymentTypes = ["Cash", "Credit Card", "Bank Transfer"];
const orderTypes = ["Standard", "Urgent", "Scheduled"];
const orderStatuses = ["Pending"];

const CreateOrder = ({ session, supplierList, productList }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    supplier: "",
    orderStatus: "Pending",
    payment: "",
    orderType: "",
    orderDate: day().format("YYYY-MM-DD"),
    deliveryDate: "",
    orderNote: "",
  });

  const [orderItems, setOrderItems] = useState([]);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [supplierSearchInput, setSupplierSearchInput] = useState("");
  const [foundSuppliers, setFoundSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierNotFound, setSupplierNotFound] = useState(false);
  const [chargerProducts, setChargerProducts] = useState({});
  const [productTaxes, setProductTaxes] = useState({});

  const handleInputChange = (name, value, type) => {
    if (type === "select-one") {
      const selectedValue = value;

      if (name === "supplier") {
        setFormData({
          ...formData,
          supplier: selectedValue,
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

  const checkIfCharger = (product) => {
    return product.subCategory?.toLowerCase() === "charger";
  };



  const toggleProductTax = (id, isTaxable) => {
    setProductTaxes({
      ...productTaxes,
      [id]: isTaxable ? productTaxes[id]?.rate || 18 : null,
    });
  };

  const setProductTaxRate = (id, rate) => {
    if (productTaxes[id] !== null) {
      setProductTaxes({
        ...productTaxes,
        [id]: parseFloat(rate) || 0,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      supplier: "",
      orderStatus: "Pending",
      payment: "",
      orderType: "",
      orderDate: day().format("YYYY-MM-DD"),
      deliveryDate: "",
      orderNote: "",
    });
    setOrderItems([]);
    setProductSearchQuery("");
    setSupplierSearchInput("");
    setFoundSuppliers([]);
    setSelectedSupplier(null);
    setSupplierNotFound(false);
    setChargerProducts({});
    setProductTaxes({});
  };

  // Function to search for suppliers by ID or name
  const searchSupplier = () => {
    if (!supplierSearchInput.trim()) {
      toast.error("Please enter a supplier ID or name", {
        autoClose: 1000,
      });
      return;
    }

    const searchTerm = supplierSearchInput.trim().toLowerCase();

    console.log("searchTerm", searchTerm);
    console.log("supplierList", supplierList);

    // Find all matching suppliers
    const matchingSuppliers = supplierList.filter(
      (supplier) =>
        supplier.supplierId?.toLowerCase() === searchTerm ||
        supplier.name?.toLowerCase().includes(searchTerm)
    );

    if (matchingSuppliers.length > 0) {
      setFoundSuppliers(matchingSuppliers);
      setSupplierNotFound(false);

      // If only one supplier found, select it automatically
      if (matchingSuppliers.length === 1) {
        selectSupplier(matchingSuppliers[0]);
        toast.success(`Supplier found: ${matchingSuppliers[0].name}`, {
          autoClose: 1000,
        });
      } else {
        toast.success(`${matchingSuppliers.length} suppliers found`, {
          autoClose: 1000,
        });
      }
    } else {
      setFoundSuppliers([]);
      setSelectedSupplier(null);
      setFormData({
        ...formData,
        supplier: "",
      });
      setSupplierNotFound(true);
      toast.error("Supplier not found", {
        autoClose: 1000,
      });
    }
  };

  // Function to select a supplier from the list
  const selectSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      ...formData,
      supplier: supplier._id,
    });
    setFoundSuppliers([]);
  };

  // Function to clear supplier search
  const clearSupplierSearch = () => {
    setSupplierSearchInput("");
    setFoundSuppliers([]);
    setSelectedSupplier(null);
    setSupplierNotFound(false);
    setFormData({
      ...formData,
      supplier: "",
    });
  };

  // Function to filter products based on search input
  const filteredProducts = productList.filter(
    (item) =>
      item.skucode?.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      item.productName?.toLowerCase().includes(productSearchQuery.toLowerCase())
  );

  // Function to add product to the order table
  const addProductToOrder = (product) => {
    const existingItem = orderItems.find((item) => item._id === product._id);

    if (existingItem) {
      // If product already exists, show a message
      toast.error(
        `${product.productName || product.skucode} already in order`,
        {
          autoClose: 1000,
        }
      );
      return;
    } else {
      // Add new product with default values
      setOrderItems([
        ...orderItems,
        {
          ...product,
          quantity: 1,
          ratePerUnit: 0,
          totalValue: 0,
        },
      ]);

      // Check if product is a charger and set default cable option
      if (checkIfCharger(product)) {
        setChargerProducts({
          ...chargerProducts,
          [product._id]: false, // Default to without cable
        });
      }

      // Set default tax status (not taxable)
      setProductTaxes({
        ...productTaxes,
        [product._id]: null, // null means no tax
      });
    }

    // Show success alert
    toast.success(`${product.productName || product.skucode} added to order`, {
      autoClose: 1000,
    });
  };

  // Function to remove product from the order table
  const removeProductFromOrder = (id) => {
    const itemToRemove = orderItems.find((item) => item._id === id);
    setOrderItems(orderItems.filter((item) => item._id !== id));

    // Show alert
    toast.success(
      `${itemToRemove.productName || itemToRemove.skucode} removed from order`,
      {
        autoClose: 1000,
      }
    );
  };

  // Function to update product quantity and recalculate total
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      toast.error("Quantity must be greater than 0", {
        autoClose: 1000,
      });
      return;
    }

    setOrderItems(
      orderItems.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: quantity,
              totalValue: quantity * item.ratePerUnit,
            }
          : item
      )
    );
  };

  // Function to update rate per unit and recalculate total
  const updateRate = (id, rate) => {
    if (rate < 0) {
      toast.error("Rate cannot be negative", {
        autoClose: 1000,
      });
      return;
    }

    setOrderItems(
      orderItems.map((item) =>
        item._id === id
          ? {
              ...item,
              ratePerUnit: rate,
              totalValue: item.quantity * rate,
            }
          : item
      )
    );
  };

  const handleSubmit = async () => {
    try {
      // Validate all required fields
      if (!formData.supplier) {
        toast.error("Supplier is required", {
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
        toast.error("Payment Type is required", {
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
      if (!orderItems.length) {
        toast.error("At least one product is required", {
          autoClose: 1000,
        });
        return;
      }

      // Find the selected supplier from the list
      const supplierDetails = supplierList.find(
        (supplier) => supplier._id === formData.supplier
      );

      // Prepare order items data with additional options like cable for chargers
      const orderItemsData = orderItems.map((item) => {
        const itemTotal = (item.quantity || 1) * (item.ratePerUnit || 0);
        const taxRate = productTaxes[item._id];
        const taxAmount = taxRate ? (itemTotal * taxRate) / 100 : 0;

        return {
          itemId: item._id,
          productName: item.productName,
          category: item.category,
          productCode: item.productCode,
          skucode: item.skucode,
          subCategory: item.subCategory,
          quantity: item.quantity || 1,
          ratePerUnit: item.ratePerUnit || 0,
          totalValue: itemTotal,
          taxable: taxRate !== null,
          taxRate: taxRate || 0,
          taxAmount: taxAmount,
          totalWithTax: itemTotal + taxAmount,
          data: item.data,
        };
      });

      // Calculate subtotal and tax details
      const subtotalBeforeTax = orderItemsData.reduce(
        (sum, item) => sum + item.totalValue,
        0
      );

      // Separate taxable and non-taxable items
      const taxableItems = orderItemsData.filter((item) => item.taxable);
      const nonTaxableItems = orderItemsData.filter((item) => !item.taxable);

      // Calculate tax by tax rate groups
      const taxGroups = {};
      taxableItems.forEach((item) => {
        const rate = item.taxRate;
        if (!taxGroups[rate]) {
          taxGroups[rate] = {
            rate: rate,
            subtotal: 0,
            tax: 0,
          };
        }
        taxGroups[rate].subtotal += item.totalValue;
        taxGroups[rate].tax += item.taxAmount;
      });

      const totalTax = Object.values(taxGroups).reduce(
        (sum, group) => sum + group.tax,
        0
      );
      const grandTotal = subtotalBeforeTax + totalTax;

      // Create the comprehensive order object
      const purchaseOrderData = {
        // Order metadata
        orderDate: formData.orderDate,
        deliveryDate: formData.deliveryDate,
        orderStatus: formData.orderStatus,
        orderType: formData.orderType,
        paymentType: formData.payment,
        orderNote: formData.orderNote,
        createdAt: new Date().toISOString(),

        // Supplier information
        supplier: {
          id: supplierDetails._id,
          supplierId: supplierDetails.supplierId,
          name: supplierDetails.name,
          email: supplierDetails.email,
          contactNumber: supplierDetails.contactNumber,
          address: supplierDetails.streetAddress
            ? `${supplierDetails.streetAddress}, ${
                supplierDetails.city || ""
              }, ${supplierDetails.state || ""}`
            : "No address provided",
        },

        // Order items
        items: orderItemsData,

        // Financial details
        financialSummary: {
          subtotalBeforeTax: subtotalBeforeTax,
          taxableAmount: taxableItems.reduce(
            (sum, item) => sum + item.totalValue,
            0
          ),
          nonTaxableAmount: nonTaxableItems.reduce(
            (sum, item) => sum + item.totalValue,
            0
          ),
          taxGroups: Object.values(taxGroups),
          totalTax: totalTax,
          grandTotal: grandTotal,
          currency: "INR",
        },
      };

      const response = await createPurchaseOrder(purchaseOrderData, session);

      if (response.status === "success") {
        toast.success("Order created successfully", {
          autoClose: 1000,
        });
        resetForm();
        setShowModal(false);
      }
      if (response.status === "fail") {
        toast.error(response.message, {
          autoClose: 1000,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response.data.msg, {
        autoClose: 1000,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="md"
          className="rounded-lg text-default-200 font-medium"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
          Create Purchase Order
        </Button>
      </DialogTrigger>

      {showModal && (
        <DialogContent size="full" onInteractOutside={() => resetForm()}>
          <ScrollArea className="h-[700px] p-5 ">
            <DialogHeader>
              <div className="flex items-center gap-3 p-2">
                <div className="h-12 w-12 rounded-sm border border-border grid place-content-center bg-blue-50">
                  <Icon
                    icon="heroicons:shopping-cart"
                    className="w-5 h-5 text-blue-500"
                  />
                </div>
                <div>
                  <div className="text-base font-semibold text-default-700 mb-1">
                    Create New Purchase Order
                  </div>
                  <p className="text-xs text-default-500">
                    Search for suppliers and add products to your order
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Supplier and Order Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Supplier Selection */}
                <Card className="col-span-1 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium">
                      Supplier Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Search by Supplier ID or Name"
                          value={supplierSearchInput}
                          onChange={(e) =>
                            setSupplierSearchInput(e.target.value)
                          }
                          className="w-full"
                        />
                        <Button
                          type="button"
                          onClick={searchSupplier}
                          className="whitespace-nowrap bg-blue-500 hover:bg-blue-600"
                        >
                          <Search className="w-4 h-4 mr-2" />
                          Search
                        </Button>
                      </div>

                      {/* Display multiple suppliers if found */}
                      {foundSuppliers.length > 1 && (
                        <div className="border rounded-md p-3 bg-gray-50 mt-2">
                          <h3 className="font-medium text-sm mb-2">
                            Found {foundSuppliers.length} suppliers:
                          </h3>
                          <ScrollArea className="h-[150px]">
                            {foundSuppliers.map((supplier) => (
                              <div
                                key={supplier._id}
                                className="border-b last:border-0 p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => selectSupplier(supplier)}
                              >
                                <div className="flex justify-between">
                                  <h4 className="font-medium">
                                    {supplier.name}
                                  </h4>
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                    {supplier.supplierId}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {supplier.contactNumber} u2022{" "}
                                  {supplier.email || "No email"}
                                </div>
                              </div>
                            ))}
                          </ScrollArea>
                        </div>
                      )}

                      {/* Display selected supplier */}
                      {selectedSupplier && (
                        <div className="border rounded-md p-3 bg-blue-50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-base">
                                {selectedSupplier.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                ID: {selectedSupplier.supplierId}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearSupplierSearch}
                              className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 gap-y-1 text-sm">
                            <div>
                              <span className="text-gray-500">Email:</span>{" "}
                              {selectedSupplier.email || "N/A"}
                            </div>
                            <div>
                              <span className="text-gray-500">Contact:</span>{" "}
                              {selectedSupplier.contactNumber || "N/A"}
                            </div>
                            <div>
                              <span className="text-gray-500">Address:</span>{" "}
                              {selectedSupplier.streetAddress
                                ? `${selectedSupplier.streetAddress}, ${
                                    selectedSupplier.city || ""
                                  }, ${selectedSupplier.state || ""}`
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                      )}

                      {supplierNotFound && (
                        <div className="border border-red-200 rounded-md p-3 bg-red-50 text-center">
                          <p className="text-red-600">
                            No supplier found with the provided ID or name
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearSupplierSearch}
                            className="mt-2 text-xs"
                          >
                            Clear Search
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Order Details */}
                <Card className="col-span-1 md:col-span-2 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium">
                      Order Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Order Status
                        </Label>
                        <Select
                          defaultValue="Pending"
                          onValueChange={(data) =>
                            handleInputChange("orderStatus", data, "select-one")
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Order Status" />
                          </SelectTrigger>
                          <SelectContent className="z-[1000]">
                            {orderStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Payment Type
                        </Label>
                        <Select
                          onValueChange={(data) =>
                            handleInputChange("payment", data, "select-one")
                          }
                        >
                          <SelectTrigger className="w-full">
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
                        <Label className="text-sm font-medium mb-2 block">
                          Order Type
                        </Label>
                        <Select
                          onValueChange={(data) =>
                            handleInputChange("orderType", data, "select-one")
                          }
                        >
                          <SelectTrigger className="w-full">
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

                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Order Date
                        </Label>
                        <Input
                          type="date"
                          defaultValue={day().format("YYYY-MM-DD")}
                          onChange={(e) =>
                            handleInputChange(
                              "orderDate",
                              e.target.value,
                              "input"
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Expected Delivery Date
                        </Label>
                        <Input
                          type="date"
                          onChange={(e) =>
                            handleInputChange(
                              "deliveryDate",
                              e.target.value,
                              "input"
                            )
                          }
                        />
                      </div>
                      <div></div>
                      <div className="col-span-3">
                        <Label className="text-sm font-medium mb-2 block">
                          Order Note
                        </Label>
                        <Textarea
                          placeholder="Type any additional notes here..."
                          className="resize-none"
                          onChange={(data) =>
                            handleInputChange(
                              "orderNote",
                              data.target.value,
                              "input"
                            )
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Product Search Section */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-medium">
                      Add Products
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-normal">
                        {orderItems.length} items in order
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Search Input */}
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        type="text"
                        placeholder="Search products by code or name..."
                        value={productSearchQuery}
                        onChange={(e) => setProductSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Products List */}
                    <div className="border rounded-md">
                      <ScrollArea className="h-[200px]">
                        {filteredProducts.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-2">
                            {filteredProducts.map((item) => (
                              <div
                                key={item._id}
                                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md border"
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar className="rounded-md h-10 w-10 bg-blue-100">
                                    <AvatarImage src={item.image} />
                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                      {item.productName?.substring(0, 2) ||
                                        item.skucode?.substring(0, 2) ||
                                        "PD"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {item.productName || item.skucode}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {item.skucode} •{" "}
                                      {item.subCategory || "N/A"} •{" "}
                                      {item.subCategory === "Chargers" &&
                                        item.data.filter(
                                          (data) => data.type === "Chargers"
                                        )[0].data.chargerType}
                                      •{" "}
                                      {item.subCategory === "Chargers" &&
                                        item.data.filter(
                                          (data) => data.type === "Chargers"
                                        )[0].data.isCable &&
                                        item.data.filter(
                                          (data) => data.type === "Chargers"
                                        )[0].data.cableType}
                                    </p>
                                    {item.shortDescription && (
                                      <p className="text-xs text-gray-600 italic mt-1">
                                        {item.shortDescription.length > 30
                                          ? `${item.shortDescription.substring(
                                              0,
                                              30
                                            )}...`
                                          : item.shortDescription}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                  onClick={() => addProductToOrder(item)}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[200px] text-center">
                            <p className="text-gray-500">No products found</p>
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Table Section */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orderItems.length > 0 ? (
                    <div className="space-y-4">
                      <div className="border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-center">
                                Product
                              </TableHead>
                              <TableHead>
                                <div className="text-left">Category</div>
                              </TableHead>

                              <TableHead>
                                <div className="text-center">Quantity</div>
                              </TableHead>
                              <TableHead>
                                <div className="text-center">Rate (₹)</div>
                              </TableHead>
                              <TableHead>
                                <div className="text-center">
                                  Total Value (₹)
                                </div>
                              </TableHead>
                              <TableHead>
                                <div className="text-center">Tax</div>
                              </TableHead>
                              <TableHead className="text-center w-[80px]">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orderItems.map((item) => (
                              <TableRow key={item._id}>
                                <TableCell className="text-center">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="rounded-md h-10 w-10 bg-blue-100">
                                      <AvatarImage src={item.image} />
                                      <AvatarFallback className="bg-blue-100 text-blue-600">
                                        {item.productName?.substring(0, 2) ||
                                          item.skucode?.substring(0, 2) ||
                                          "PD"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="text-left">
                                      <p className="font-medium">
                                        {item.productName || item.skucode}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {item.skucode}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="text-left">
                                    <p className="font-medium">
                                      {item.category}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {item.subCategory}
                                    </p>
                                  </div>
                                </TableCell>

                                <TableCell className="text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() =>
                                        updateQuantity(
                                          item._id,
                                          Math.max(1, (item.quantity || 1) - 1)
                                        )
                                      }
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <Input
                                      type="number"
                                      min="1"
                                      value={item.quantity || 1}
                                      onChange={(e) =>
                                        updateQuantity(
                                          item._id,
                                          parseInt(e.target.value) || 1
                                        )
                                      }
                                      className="w-16 text-center"
                                    />
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() =>
                                        updateQuantity(
                                          item._id,
                                          (item.quantity || 1) + 1
                                        )
                                      }
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.ratePerUnit || 0}
                                    onChange={(e) =>
                                      updateRate(
                                        item._id,
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="w-24 text-center mx-auto"
                                  />
                                </TableCell>
                                <TableCell className="text-center font-medium">
                                  {(
                                    (item.quantity || 1) *
                                    (item.ratePerUnit || 0)
                                  ).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        id={`tax-${item._id}`}
                                        checked={
                                          productTaxes[item._id] !== null
                                        }
                                        onChange={(e) =>
                                          toggleProductTax(
                                            item._id,
                                            e.target.checked
                                          )
                                        }
                                        className="h-4 w-4"
                                      />
                                      <label
                                        htmlFor={`tax-${item._id}`}
                                        className="text-sm"
                                      >
                                        Taxable
                                      </label>
                                    </div>
                                    {productTaxes[item._id] !== null && (
                                      <div className="flex items-center gap-1">
                                        <Input
                                          type="number"
                                          min="0"
                                          max="100"
                                          step="0.01"
                                          value={productTaxes[item._id] || 0}
                                          onChange={(e) =>
                                            setProductTaxRate(
                                              item._id,
                                              e.target.value
                                            )
                                          }
                                          className="w-16 text-center"
                                        />
                                        <span className="text-xs">%</span>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 mx-auto"
                                    onClick={() =>
                                      removeProductFromOrder(item._id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Order Summary */}
                      <div className="flex justify-end p-4 bg-gray-50 rounded-md">
                        <div className="w-80 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Items:</span>
                            <span className="font-medium">
                              {orderItems.length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">
                              ₹
                              {orderItems
                                .reduce(
                                  (sum, item) =>
                                    sum +
                                    (item.quantity || 1) *
                                      (item.ratePerUnit || 0),
                                  0
                                )
                                .toLocaleString()}
                            </span>
                          </div>

                          {/* Tax breakdown */}
                          {Object.entries(productTaxes).filter(
                            ([id, rate]) => rate !== null
                          ).length > 0 && (
                            <div className="border-t border-gray-200 pt-2">
                              <p className="text-sm font-medium mb-1">
                                Tax Breakdown:
                              </p>
                              {(() => {
                                // Calculate tax groups
                                const taxGroups = {};

                                // Process each taxable item
                                Object.entries(productTaxes).forEach(
                                  ([id, rate]) => {
                                    if (rate === null) return; // Skip non-taxable items

                                    const item = orderItems.find(
                                      (item) => item._id === id
                                    );
                                    if (!item) return; // Skip if item not found

                                    const itemTotal =
                                      (item.quantity || 1) *
                                      (item.ratePerUnit || 0);
                                    const taxAmount = itemTotal * (rate / 100);

                                    // Group by tax rate
                                    if (!taxGroups[rate]) {
                                      taxGroups[rate] = { rate, amount: 0 };
                                    }
                                    taxGroups[rate].amount += taxAmount;
                                  }
                                );

                                // Render tax groups
                                return Object.values(taxGroups).map((group) => (
                                  <div
                                    key={group.rate}
                                    className="flex justify-between items-center text-sm"
                                  >
                                    <span className="text-gray-600">
                                      Tax ({group.rate}%):
                                    </span>
                                    <span>
                                      ₹
                                      {group.amount.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                    </span>
                                  </div>
                                ));
                              })()}
                            </div>
                          )}

                          <div className="flex justify-between items-center border-t border-gray-300 pt-2 mt-2">
                            <span className="text-gray-700 font-medium">
                              Total Amount:
                            </span>
                            <span className="text-lg font-semibold text-blue-600">
                              ₹
                              {orderItems
                                .reduce((sum, item) => {
                                  const itemTotal =
                                    (item.quantity || 1) *
                                    (item.ratePerUnit || 0);
                                  const taxRate = productTaxes[item._id];
                                  const taxAmount = taxRate
                                    ? (itemTotal * taxRate) / 100
                                    : 0;
                                  return sum + itemTotal + taxAmount;
                                }, 0)
                                .toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <ShoppingCart className="h-12 w-12 text-gray-300 mb-2" />
                      <p className="text-gray-500 mb-4">Your order is empty</p>
                      <p className="text-sm text-gray-400 max-w-md">
                        Search and add products from the section above to create
                        your purchase order.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <DialogFooter className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-500">
                {selectedSupplier ? (
                  <span>
                    Creating order for{" "}
                    <span className="font-medium">{selectedSupplier.name}</span>
                  </span>
                ) : (
                  <span>Please select a supplier</span>
                )}
              </div>
              <div className="flex gap-3">
                <DialogClose asChild>
                  <Button variant="outline" type="button" onClick={resetForm}>
                    Cancel
                  </Button>
                </DialogClose>

                {loading ? (
                  <Button disabled className="bg-blue-500 hover:bg-blue-600">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Create Purchase Order
                  </Button>
                )}
              </div>
            </DialogFooter>
          </ScrollArea>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default CreateOrder;
