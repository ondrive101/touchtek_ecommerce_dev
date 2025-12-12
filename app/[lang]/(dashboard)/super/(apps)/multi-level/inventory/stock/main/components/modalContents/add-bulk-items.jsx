import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
// Import UTC plugin if you need UTC handling
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { Loader2, Heart } from "lucide-react";
import Table from "./bulk-table";
import {
  Plus,
  Trash2,
  ShoppingCart,
  Package,
  Minus,
  X,
  Check,
  Upload,
} from "lucide-react";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addBulkSkus } from "@/action/superadmin/controller";
import * as XLSX from "xlsx"; // Import xlsx

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
function excelToDayjs(excelDate) {
  // Excel epoch is 1899-12-31
  const excelEpoch = dayjs.utc("1899-12-31");
  // Adjust for Excel's leap year bug (subtract 2 days)
  const daysOffset = excelDate - 2;

  // Add days to epoch
  const result = excelEpoch.add(daysOffset, "day");
  return result;
}

const AddItems = ({ session }) => {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]); // Store selected items
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [excelData, setExcelData] = useState([]);

  const handleClose = () => {
    setShowModal(false);
    setFormData(null);
    setLoading(false);
    setPreviewImage(null);
    setExcelData([]);
  };
  const handleInputChange = (name, value, type) => {
    if (type === "file" && value.target.files[0]) {
      const file = value.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" }); // Use array type

        // Assuming you want to read the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Parse the data as JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log(jsonData); // Logs the data from the Excel sheet
        //format excel date value to date string
        jsonData.forEach((row) => {
          if (row.dateOfBirth) {
            const dayjsDate = excelToDayjs(row.dateOfBirth);
            row.dateOfBirth = dayjsDate.format("YYYY-MM-DD");
          }
          if (row.dateOfJoining) {
            const dayjsDate = excelToDayjs(row.dateOfJoining);
            row.dateOfJoining = dayjsDate.format("YYYY-MM-DD");
          }
        });

        // Optionally, set it in state or process further
        setExcelData(jsonData);
      };

      reader.readAsArrayBuffer(file); // Use readAsArrayBuffer
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const response = await addBulkSkus(excelData, session);

      if (response.status === "success") {
        toast.success("items created successfully", {
          autoClose: 1000,
        });
        setLoading(false);
        handleClose();
      }
      if (response.status === "fail") {
        toast.error(response.message, {
          autoClose: 1000,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg, {
        autoClose: 1000,
      });
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          //   size="md"
          //   color="secondary"
          variant="outline"
          className="rounded-lg"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
          Add List
        </Button>
      </DialogTrigger>

      {showModal && (
        <DialogContent size="4xl">
          <DialogTitle className="sr-only">Add New Items</DialogTitle>
          <DialogDescription className="sr-only">
            Upload item data using Excel sheet to create multiple items
            at once
          </DialogDescription>
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
                  Add New Item
                </div>
                <p className="text-xs text-default-500 ">
                  Item List
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="invoice-wrapper mt-6">
            <div className="grid grid-cols-12 gap-6">
              <Card className="col-span-12 xl:col-span-12 p-4 shadow-md border-t-4 border-t-primary">
                <ScrollArea className="h-[450px] overflow-y-auto">
                  <CardContent className="p-2">
                    <div className="invoice-wrapper mt-6 ">
                      <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[250px]">
                          <div className="w-full md:w-[375px] space-y-4">
                            <div>
                              <Label className="mb-2">
                                Employeee Data Excel Sheet
                              </Label>
                              <Input
                                type="file"
                                id="uploadFile"
                                accept=".xlsx, .xls"
                                onChange={(data) =>
                                  handleInputChange("excel", data, "file")
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {excelData.length > 0 && (
                        <div className="mt-4">
                          <Table list={excelData} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </ScrollArea>
              </Card>
            </div>
          </div>
          {/* Footer */}
          <DialogFooter className="flex justify-center mt-6 border-t pt-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                onClick={handleClose}
                className="rounded-md border-default-200 hover:bg-default-100"
              >
                Cancel
              </Button>
            </DialogClose>

            {loading ? (
              <Button className="rounded-md bg-primary hover:bg-primary/90 ml-3">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait ...
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                className="rounded-md bg-primary hover:bg-primary/90 ml-3"
              >
                <Check className="mr-2 h-4 w-4" />
                Create Bulk Employees
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default AddItems;
