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
import { History, ChevronUp, ChevronDown, FileText, Calendar, FileCheck, StickyNote, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import {
  Loader2,
  Check,
  X,
  Minus,
  Plus,
  Package,
  Truck,
  ClipboardCheck,
  AlertTriangle,
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
import { confirmPurchaseOrder,deletePurchaseReceipt } from "@/action/purchase/controller";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Receipt status options
const receiptStatuses = ["Complete", "Partial", "Rejected"];

const ConfirmOrder = ({ session, supplierList, productList, order }) => {

  // State for loading
  const [loading, setLoading] = useState(false);

  // State for receipt details
  const [receiptData, setReceiptData] = useState({
    receiptDate: day().format("YYYY-MM-DD"),
    receiptStatus: "Partial",
    warehouseNotes: "",
    qualityCheck: "Passed",
  });

  // State for received items
  const [receivedItems, setReceivedItems] = useState([]);

  // State for item notes
  const [itemNotes, setItemNotes] = useState({});

  // State for showing item notes input
  const [showNoteInput, setShowNoteInput] = useState({});

  // State for damage reports
  const [damageReports, setDamageReports] = useState({});

  // State for showing damage report input
  const [showDamageInput, setShowDamageInput] = useState({});

  // State for tracking previous receipts
  const [previousReceipts, setPreviousReceipts] = useState([]);
  const [showPreviousReceipts, setShowPreviousReceipts] = useState(false);
  const [totalPreviouslyReceived, setTotalPreviouslyReceived] = useState({});

  const resetForm = () => {
    setReceiptData({
      receiptDate: day().format("YYYY-MM-DD"),
      receiptStatus: "Partial",
      warehouseNotes: "",
      qualityCheck: "Passed",
    });
    setReceivedItems([]);
    setItemNotes({});
    setShowNoteInput({});
    setDamageReports({});
    setShowDamageInput({});
    setPreviousReceipts([]);
    setShowPreviousReceipts(false);
    setTotalPreviouslyReceived({});
  };

  // Initialize component with order data
  useEffect(() => {
    if (order && order.data && order.data.items) {
      // Check for previous receipts
      const prevReceipts = order.data.previousReceipts || [];
      setPreviousReceipts(prevReceipts);

      // Calculate total previously received quantities for each item
      const prevReceivedTotals = {};
      prevReceipts.forEach((receipt) => {
        receipt?.items?.forEach((item) => {
          if (!prevReceivedTotals[item.itemId]) {
            prevReceivedTotals[item.itemId] = 0;
          }
          prevReceivedTotals[item.itemId] += item.receivedQuantity || 0;
        });
      });
      setTotalPreviouslyReceived(prevReceivedTotals);

      // Map order items to received items with initial values
      const initialReceivedItems = order.data.items.map((item) => {
        // Calculate remaining quantity to be received
        const previouslyReceived = prevReceivedTotals[item.itemId] || 0;
        const remainingQuantity = Math.max(
          0,
          item.quantity - previouslyReceived
        );

        return {
          itemId: item.itemId,
          productName: item.productName,
          category: item.category,
          subCategory: item.subCategory,
          productCode: item.productCode,
          skucode: item.skucode,
          orderedQuantity: item.quantity,
          remainingQuantity: remainingQuantity,
          previouslyReceived: previouslyReceived,
          receivedQuantity: 0, // Default to 0 received
          ratePerUnit: item.ratePerUnit,
          totalValue: 0, // Will be calculated
          taxRate: item.taxRate || 0,
          receiptStatus: "Pending", // Default status
          options: item.options,
        };
      });

      setReceivedItems(initialReceivedItems);

      // Set form data from order
      if (order.data.supplier) {
        setReceiptData((prev) => ({
          ...prev,
          supplier: order.data.supplier.id,
          supplierName: order.data.supplier.name,
        }));
      }
    }
  }, [order]);

  // Handle input changes for receipt data
  const handleInputChange = (name, value) => {
    setReceiptData({
      ...receiptData,
      [name]: value,
    });
  };

  // Update received quantity for an item
  const updateReceivedQuantity = (id, quantity) => {
    setReceivedItems((prevItems) =>
      prevItems.map((item) => {
        if (item.itemId === id) {
          // Ensure quantity doesn't exceed remaining amount
          const validQuantity = Math.min(
            Math.max(0, quantity),
            item.remainingQuantity
          );

          // Calculate new total value
          const newTotalValue = validQuantity * item.ratePerUnit;

          // Determine receipt status
          let status = "Pending";
          if (validQuantity === 0) {
            status = "Pending";
          } else if (validQuantity < item.remainingQuantity) {
            status = "Partial";
          } else {
            status = "Complete";
          }

          return {
            ...item,
            receivedQuantity: validQuantity,
            totalValue: newTotalValue,
            receiptStatus: status,
          };
        }
        return item;
      })
    );
  };

  // Toggle note input for an item
  const toggleNoteInput = (id) => {
    setShowNoteInput((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Update note for an item
  const updateItemNote = (id, note) => {
    setItemNotes((prev) => ({
      ...prev,
      [id]: note,
    }));
  };

  // Toggle damage report input for an item
  const toggleDamageInput = (id) => {
    setShowDamageInput((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Update damage report for an item
  const updateDamageReport = (id, report) => {
    setDamageReports((prev) => ({
      ...prev,
      [id]: report,
    }));
  };

  // Calculate receipt summary
  const calculateReceiptSummary = () => {
    // Calculate totals for current receipt
    const totalOrdered = receivedItems.reduce(
      (sum, item) => sum + item.orderedQuantity,
      0
    );
    const totalRemaining = receivedItems.reduce(
      (sum, item) => sum + item.remainingQuantity,
      0
    );
    const totalReceived = receivedItems.reduce(
      (sum, item) => sum + item.receivedQuantity,
      0
    );
    const totalPrevReceived = receivedItems.reduce(
      (sum, item) => sum + item.previouslyReceived,
      0
    );

    // Calculate item status counts
    const completeItems = receivedItems.filter(
      (item) => item.receiptStatus === "Complete"
    ).length;
    const partialItems = receivedItems.filter(
      (item) => item.receiptStatus === "Partial"
    ).length;
    const pendingItems = receivedItems.filter(
      (item) => item.receiptStatus === "Pending"
    ).length;

    // Calculate overall order completion percentage
    const percentReceived =
      totalRemaining > 0
        ? Math.round((totalReceived / totalRemaining) * 100)
        : 100;

    // Calculate overall order completion (including previous receipts)
    const overallReceived = totalPrevReceived + totalReceived;
    const overallPercentComplete =
      totalOrdered > 0 ? Math.round((overallReceived / totalOrdered) * 100) : 0;

    return {
      totalOrdered,
      totalRemaining,
      totalReceived,
      totalPrevReceived,
      overallReceived,
      completeItems,
      partialItems,
      pendingItems,
      percentReceived,
      overallPercentComplete,
      totalItems: receivedItems.length,
    };
  };

  // Calculate financial summary
  const calculateFinancialSummary = () => {
    const subtotal = receivedItems
      .filter((item) => item.receivedQuantity > 0)
      .reduce((sum, item) => sum + item.totalValue, 0);

    // Group items by tax rate
    const taxGroups = {};
    receivedItems.filter((item) => item.receivedQuantity > 0).forEach((item) => {
      const taxRate = item.taxRate || 0;
      if (!taxGroups[taxRate]) {
        taxGroups[taxRate] = {
          rate: taxRate,
          subtotal: 0,
          tax: 0,
        };
      }

      taxGroups[taxRate].subtotal += item.totalValue;
      taxGroups[taxRate].tax += item.totalValue * (taxRate / 100);
    });

    const totalTax = Object.values(taxGroups).reduce(
      (sum, group) => sum + group.tax,
      0
    );
    const grandTotal = subtotal + totalTax;

    // Separate taxable and non-taxable items
    const taxableItems = receivedItems.filter((item) => item.receivedQuantity > 0 && item.taxRate > 0);
    const nonTaxableItems = receivedItems.filter((item) => item.receivedQuantity > 0 && (!item.taxRate || item.taxRate === 0));

    return {
      subtotalBeforeTax: subtotal,
      taxableAmount: taxableItems.reduce(
        (sum, item) => sum + item.totalValue,
        0
      ),
      nonTaxableAmount: nonTaxableItems.reduce(
        (sum, item) => sum + item.totalValue,
        0
      ),
      taxGroups: Object.values(taxGroups),
      totalTax,
      grandTotal,
      currency: "INR",
    };
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate receipt date
      if (!receiptData.receiptDate) {
        toast.error("Receipt date is required");
        return;
      }

      // Validate if any items were received
      const anyItemsReceived = receivedItems.some(
        (item) => item.receivedQuantity > 0
      );
      if (!anyItemsReceived) {
        toast.error("At least one item must be received");
        return;
      }

      // Prepare financial summary
      const financialSummary = calculateFinancialSummary();
       // Get receipt summary for display
      const receiptSummary = calculateReceiptSummary();

      // Create the receipt data object
      const receiptSubmitData = {
        // Original order data
        orderId: order?._id,
        orderCode: order?.orderCode,

        // Receipt metadata
        receiptDate: receiptData.receiptDate,
        receiptStatus: receiptData.receiptStatus,
        warehouseNotes: receiptData.warehouseNotes,
        qualityCheck: receiptData.qualityCheck,

        // Items received
        items: receivedItems.filter((item) => item.receivedQuantity !== 0).map((item) => {

          const taxAmount = item.taxRate
            ? (item.totalValue * item.taxRate) / 100
            : 0;
          const totalWithTax = item.totalValue + taxAmount;

          return {
            ...item,
            taxAmount,
            totalWithTax,
            note: itemNotes[item.itemId] || "",
            damageReport: damageReports[item.itemId] || "",
          };
        }),

        // Summaries
        financialSummary: {
          subtotalBeforeTax: financialSummary.subtotalBeforeTax,
          taxableAmount: financialSummary.taxableAmount,
          nonTaxableAmount: financialSummary.nonTaxableAmount,
          taxGroups: financialSummary.taxGroups,
          totalTax: financialSummary.totalTax,
          grandTotal: financialSummary.grandTotal,
          currency: "INR",
        },

        receiptSummary: receiptSummary,

        // Metadata
        createdAt: new Date().toISOString(),
      };

      // Show loading state
      setLoading(true);
      // Actual API call would be here with revalidate route
      const response = await confirmPurchaseOrder(
        receiptSubmitData,
        session,
        "/multi-level/purchase/orders/inward/main"
      );
      if (response.status === "success") {
        toast.success("Order receipt confirmed successfully", {
          autoClose: 1000,
        });

        setLoading(false);
        resetForm();
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
  
  const handleDeleteReceipt = async (receiptID) => {

    const payload = {
      receiptId: receiptID,
      orderId: order._id,
    }
    try {
      const response = await deletePurchaseReceipt(payload, session, "/multi-level/purchase/orders/inward/main");
      if (response.status === "success") {
        toast.success("Receipt deleted successfully", {
          autoClose: 1000
        });
        resetForm();
        setLoading(false);
      }
      if (response.status === "fail") {
        toast.error(response.message, {
          autoClose: 1000
        });
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response.data.msg, {
        autoClose: 1000,
      });
    }
  };
  
  // Get receipt summary for display
  const receiptSummary = calculateReceiptSummary();

  // Get financial summary for display
  const financialSummary = calculateFinancialSummary();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="soft" className=" h-7 w-7">
          <Icon icon="heroicons:shopping-cart" className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent size="full" onInteractOutside={() => resetForm()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Confirm Order Receipt - {order?.orderCode || ""}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] overflow-y-auto pr-4">
          {/* Order Summary Card */}
          <Card className="mb-4 border-blue-100">
            <CardHeader className="bg-blue-50 pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-blue-700">
                  Order Summary
                </CardTitle>
                <Badge
                  variant="outline"
                  className="mr-2"
                >
                  {order?.status || ""}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Supplier Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Supplier
                  </h3>
                  <p className="font-medium">
                    {order?.data?.supplier?.name || ""}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order?.data?.supplier?.supplierId || ""}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order?.data?.supplier?.contactNumber || ""}
                  </p>
                </div>

                {/* Order Details */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Order Details
                  </h3>
                  <p className="text-sm">
                    <span className="font-medium">Date:</span>{" "}
                    {order?.data?.orderDate || ""}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Type:</span>{" "}
                    {order?.data?.orderType || ""}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Payment:</span>{" "}
                    {order?.data?.paymentType || ""}
                  </p>
                </div>

                {/* Financial Summary */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Order Value
                  </h3>
                  <p className="text-sm">
                    <span className="font-medium">Subtotal:</span> ₹
                    {order?.data?.financialSummary?.subtotalBeforeTax?.toLocaleString() ||
                      "0"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Tax:</span> ₹
                    {order?.data?.financialSummary?.totalTax?.toLocaleString() ||
                      "0"}
                  </p>
                  <p className="text-lg font-semibold text-blue-600">
                    ₹
                    {order?.data?.financialSummary?.grandTotal?.toLocaleString() ||
                      "0"}
                  </p>
                </div>
              </div>

              {/* Order Note if any */}
              {order?.data?.orderNote && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Order Note
                  </h3>
                  <p className="text-sm">{order.data.orderNote}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Receipt Form */}
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Receipt Details</CardTitle>
            </CardHeader>

            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="receiptDate">Receipt Date</Label>
                  <Input
                    id="receiptDate"
                    type="date"
                    value={receiptData.receiptDate}
                    disabled={true}
                    // onChange={(e) =>
                    //   handleInputChange("receiptDate", e.target.value)
                    // }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="receiptStatus">Receipt Status</Label>
                  <Select
                    value={receiptData.receiptStatus}
                    onValueChange={(value) =>
                      handleInputChange("receiptStatus", value)
                    }
                  >
                    <SelectTrigger id="receiptStatus" className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="z-[1000]">
                      {receiptStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="qualityCheck">Quality Check</Label>
                  <Select
                    value={receiptData.qualityCheck}
                    onValueChange={(value) =>
                      handleInputChange("qualityCheck", value)
                    }
                  >
                    <SelectTrigger id="qualityCheck" className="mt-1">
                      <SelectValue placeholder="Select result" />
                    </SelectTrigger>
                    <SelectContent className="z-[1000]">
                      <SelectItem value="Passed">Passed</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                      <SelectItem value="Partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="warehouseNotes">Warehouse Notes</Label>
                  <Textarea
                    id="warehouseNotes"
                    value={receiptData.warehouseNotes}
                    onChange={(e) =>
                      handleInputChange("warehouseNotes", e.target.value)
                    }
                    placeholder="Add any notes about this receipt"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Receipt Progress */}
          <Card className="mb-4 border-green-100">
            <CardContent className="pt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Current Receipt Progress</h3>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {receiptSummary.percentReceived}% of Remaining
                </Badge>
              </div>

              <Progress
                value={receiptSummary.percentReceived}
                className="h-2 mb-4"
              />

              <div className="flex justify-between items-center mb-2 mt-4">
                <h3 className="font-medium">Overall Order Completion</h3>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  {receiptSummary.overallPercentComplete}% Complete
                </Badge>
              </div>

              <Progress
                value={receiptSummary.overallPercentComplete}
                className="h-2 mb-4 bg-blue-100"
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-2 bg-blue-50 rounded-md">
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-xl font-semibold text-blue-700">
                    {receiptSummary.totalItems}
                  </p>
                </div>

                <div className="p-2 bg-green-50 rounded-md">
                  <p className="text-sm text-gray-600">Previously Received</p>
                  <p className="text-xl font-semibold text-green-700">
                    {receiptSummary.totalPrevReceived} of{" "}
                    {receiptSummary.totalOrdered}
                  </p>
                </div>

                <div className="p-2 bg-yellow-50 rounded-md">
                  <p className="text-sm text-gray-600">Current Receipt</p>
                  <p className="text-xl font-semibold text-yellow-700">
                    {receiptSummary.totalReceived} of{" "}
                    {receiptSummary.totalRemaining}
                  </p>
                </div>

                <div className="p-2 bg-purple-50 rounded-md">
                  <p className="text-sm text-gray-600">Overall Progress</p>
                  <p className="text-xl font-semibold text-purple-700">
                    {receiptSummary.overallReceived} of{" "}
                    {receiptSummary.totalOrdered}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Previous Receipts Section */}
          {previousReceipts?.length > 0 && (
            <Card className="mb-4 border-amber-100 overflow-hidden">
              <CardHeader className="pb-3 bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <History className="h-5 w-5 text-amber-600" />
                    <CardTitle className="text-lg text-amber-700">
                      Previous Receipts
                    </CardTitle>
                    <Badge variant="outline" className="bg-amber-50 border-amber-300 text-amber-700 ml-2">
                      {previousReceipts?.length}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setShowPreviousReceipts(!showPreviousReceipts)
                    }
                    className="text-amber-700 hover:bg-amber-200 hover:text-amber-900 transition-all"
                  >
                    {showPreviousReceipts ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Show Details
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-4 bg-gradient-to-b from-amber-50/50 to-transparent">
                {!showPreviousReceipts ? (
                  <div className="text-center py-3 text-amber-700">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">
                      This order has {previousReceipts?.length} previous receipt
                      {previousReceipts?.length > 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      Click "Show Details" to view the receipt history
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {previousReceipts?.map((receipt, index) => (
                      <div
                        key={receipt.receiptID || index}
                        className="border border-amber-200 rounded-md overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        {/* Receipt Header */}
                        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-3 border-b border-amber-200">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <FileCheck className="h-4 w-4 text-amber-600" />
                              <span className="font-medium text-amber-800">
                                Receipt {index + 1}:
                              </span>
                              <span className="font-medium">
                                {receipt.receiptID || "No ID"}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {/* add delete button */}
                              <Button
                                variant="soft"
                                size="sm"
                                onClick={() => handleDeleteReceipt(receipt.receiptID)}
                              >
                                <Trash className="h-4 w-4" /> Delete
                              </Button>
                              
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-amber-600" />
                                <span className="text-sm">
                                  {receipt.receiptDate || "No date"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Receipt Details */}
                        <div className="p-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div className="bg-amber-50 rounded-md p-2 flex flex-col items-center justify-center">
                              <div className="text-xs text-amber-600 mb-1">Status</div>
                              <Badge
                                variant="outline"
                                className={
                                  receipt.receiptStatus === "Complete"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : receipt.receiptStatus === "Partial"
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    : receipt.receiptStatus === "Rejected"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-gray-50 text-gray-700 border-gray-200"
                                }
                              >
                                {receipt.receiptStatus}
                              </Badge>
                            </div>
                            <div className="bg-blue-50 rounded-md p-2 flex flex-col items-center justify-center">
                              <div className="text-xs text-blue-600 mb-1">Quality Check</div>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {receipt.qualityCheck || "Not Specified"}
                              </Badge>
                            </div>
                            <div className="bg-green-50 rounded-md p-2 flex flex-col items-center justify-center">
                              <div className="text-xs text-green-600 mb-1">Total Value</div>
                              <span className="font-semibold text-green-700">
                                ₹{receipt.financialSummary?.grandTotal?.toLocaleString() ||
                                  "0"}
                              </span>
                            </div>
                          </div>

                          {receipt.warehouseNotes && (
                            <div className="bg-gray-50 p-3 rounded-md mb-3 border border-gray-100">
                              <div className="flex items-center gap-2 mb-1">
                                <StickyNote className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Warehouse Notes:</span>
                              </div>
                              <p className="text-sm text-gray-600">{receipt.warehouseNotes}</p>
                            </div>
                          )}

                          {/* Items Table */}
                          <div className="border border-gray-100 rounded-md overflow-hidden">
                            <div className="bg-gray-50 p-2 border-b border-gray-100">
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Received Items</span>
                              </div>
                            </div>
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-gray-50">
                                  <TableHead>Product</TableHead>
                                  <TableHead className="text-center">Qty</TableHead>
                                  <TableHead>Value</TableHead>
                                  <TableHead>Notes</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {receipt.items
                                  .filter((item) => item.receivedQuantity > 0)
                                  .map((item) => (
                                    <TableRow key={item.itemId}>
                                      <TableCell>
                                        <div className="font-medium">
                                          {item.productName}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {item.skucode}
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-center">{item.receivedQuantity}</TableCell>
                                      <TableCell>
                                        ₹{item.totalValue?.toLocaleString() || "0"}
                                      </TableCell>
                                      <TableCell>
                                        {item.note || item.damageReport ? (
                                          <div className="text-xs">
                                            {item.note && <div>{item.note}</div>}
                                            {item.damageReport && (
                                              <div className="text-red-500 mt-1 flex items-center gap-1">
                                                <AlertTriangle className="h-3 w-3" />
                                                {item.damageReport}
                                              </div>
                                            )}
                                          </div>
                                        ) : (
                                          "-"
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          {/* Items Table */}
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Ordered</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead><div className="text-center">Received</div></TableHead>
                    <TableHead><div className="text-center">Status</div></TableHead>
                    <TableHead>Rate (₹)</TableHead>
                    <TableHead>Value (₹)</TableHead>
                    <TableHead><div className="text-center">Actions</div></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {receivedItems.map((item) => (
                    <TableRow key={item.itemId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="rounded-md h-10 w-10 bg-blue-100">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {item.productName?.substring(0, 2) || "PD"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-xs text-gray-500">
                              {item.skucode} • {item.subCategory}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="font-medium">
                        {item.orderedQuantity}
                      </TableCell>

                      <TableCell className="font-medium">
                        {item.remainingQuantity}
                      </TableCell>

                      <TableCell className="text-center w-24">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            disabled={item.remainingQuantity === 0}
                            onClick={() =>
                              updateReceivedQuantity(
                                item.itemId,
                                (item.receivedQuantity || 0) - 1
                              )
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <Input
                            type="number"
                            min="0"
                            max={item.remainingQuantity}
                            disabled={item.remainingQuantity === 0}
                            value={item.receivedQuantity || 0}
                            onChange={(e) =>
                              updateReceivedQuantity(
                                item.itemId,
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-24 text-center"
                          />

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            disabled={item.remainingQuantity === 0}
                            onClick={() =>
                              updateReceivedQuantity(
                                item.itemId,
                                (item.receivedQuantity || 0) + 1
                              )
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={
                            item.remainingQuantity === 0
                              ? "bg-green-50 text-green-700 border-green-200"
                              : item.remainingQuantity < item.orderedQuantity
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                          }
                        >
                          {item.remainingQuantity === 0
                            ? "Fully Received"
                            : item.remainingQuantity < item.orderedQuantity
                              ? "Partially Received"
                              : "Pending"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {item.ratePerUnit?.toLocaleString()}
                      </TableCell>

                      <TableCell className="font-medium">
                        {item.totalValue?.toLocaleString()}
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-500"
                            onClick={() => toggleNoteInput(item.itemId)}
                            title="Add note"
                          >
                            <Icon
                              icon="heroicons:pencil-square"
                              className="h-4 w-4"
                            />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-amber-500"
                            onClick={() => toggleDamageInput(item.itemId)}
                            title="Report damage"
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Note Input */}
                        {showNoteInput[item.itemId] && (
                          <div className="mt-2">
                            <Textarea
                              placeholder="Add note for this item"
                              value={itemNotes[item.itemId] || ""}
                              onChange={(e) =>
                                updateItemNote(item.itemId, e.target.value)
                              }
                              className="text-sm"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-1"
                              onClick={() => toggleNoteInput(item.itemId)}
                            >
                              Save Note
                            </Button>
                          </div>
                        )}

                        {/* Damage Report Input */}
                        {showDamageInput[item.itemId] && (
                          <div className="mt-2">
                            <Textarea
                              placeholder="Describe any damage"
                              value={damageReports[item.itemId] || ""}
                              onChange={(e) =>
                                updateDamageReport(item.itemId, e.target.value)
                              }
                              className="text-sm"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-1"
                              onClick={() => toggleDamageInput(item.itemId)}
                            >
                              Save Report
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Receipt Value</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex justify-end">
                <div className="w-80 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-medium">
                      {receiptSummary.totalItems}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Received Items:</span>
                    <span className="font-medium">
                      {receiptSummary.totalReceived} of{" "}
                      {receiptSummary.totalOrdered}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      ₹{financialSummary.subtotalBeforeTax.toLocaleString()}
                    </span>
                  </div>

                  {/* Tax breakdown */}
                  {financialSummary.taxGroups.length > 0 && (
                    <div className="border-t border-gray-200 pt-2">
                      <p className="text-sm font-medium mb-1">Tax Breakdown:</p>
                      {financialSummary.taxGroups.map((group) => (
                        <div
                          key={group.rate}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-600">
                            Tax ({group.rate}%):
                          </span>
                          <span>
                            ₹
                            {group.tax.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center border-t border-gray-300 pt-2 mt-2">
                    <span className="text-gray-700 font-medium">
                      Total Amount:
                    </span>
                    <span className="text-lg font-semibold text-blue-600">
                      ₹
                      {financialSummary.grandTotal.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-500">
            <span>
              Confirming receipt for order{" "}
              <span className="font-medium">{order?.orderCode || ""}</span>
            </span>
          </div>

          <div className="flex gap-3">
            <DialogClose asChild>
              <Button variant="outline" type="button" onClick={resetForm}>
                Cancel
              </Button>
            </DialogClose>

            {loading ? (
              <Button disabled className="bg-green-500 hover:bg-green-600">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-600"
                disabled={loading}
              >
                <Truck className="mr-2 h-4 w-4" />
                Confirm Receipt
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmOrder;
