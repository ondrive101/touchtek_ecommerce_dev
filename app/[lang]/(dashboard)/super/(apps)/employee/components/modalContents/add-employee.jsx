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
  Upload
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
import { createEmployee } from "@/action/superadmin/controller";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


const AddItem = ({ session }) => {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]); // Store selected items
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const generatEmployeeCode = () => {
    // Generate 2 random uppercase letters
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetters = Array(2)
      .fill(0)
      .map(() => letters[Math.floor(Math.random() * letters.length)])
      .join("");

    // Generate 2 random digits
    const randomDigits = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0");

    // Combine letters and digits
    const employeeCode = randomLetters + randomDigits;

    // Update form data with new SKU code
    setFormData((prev) => ({
      ...prev,
      employeeCode: employeeCode,
    }));
  };

  const handleInputChange = (name, value, type) => {
    
    if (type === "select-one") {
      const selectedValue = value;

      if (name === "department") {
        setFormData({
          ...formData,
          department: selectedValue,
        });
      }
    }

    if (type === "file") {
      const file = value.target.files[0];
      if (file) {
        // Update FormData
        setFormData((prev) => ({
          ...prev,
          image: file,
        }));

        // Show image preview
        const imageURL = URL.createObjectURL(file);
        setPreviewImage(imageURL);
      }
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData(null);
    setLoading(false);
    setPreviewImage(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formDataObj = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataObj.append(key, formData[key]);
      });
      console.log(formDataObj);
      console.log(formData);

      const response = await createEmployee(formDataObj, session);

      if (response.status === "success") {
        toast.success("Employee created successfully", {
          autoClose: 1000,
        });
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
          // size="md"
          // color="secondary"
          variant="outline"
          className="rounded-lg"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
          Add Employee
        </Button>
      </DialogTrigger>

      {showModal && (
        <DialogContent size="4xl">
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
                  Add New Employee
                </div>
                <p className="text-xs text-default-500 ">
                  Employee Details
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="invoice-wrapper mt-6">
            <div className="grid grid-cols-12 gap-6">
              <Card className="col-span-12 xl:col-span-12 p-4 shadow-md border-t-4 border-t-primary">
                <ScrollArea className="h-[450px]">
                <CardContent className="p-2">
                  <div className="flex flex-wrap gap-6">
                    <div className="flex-1 min-w-[300px]">
                      <div className="w-full space-y-5">
                        <div className="bg-default-50 p-4 rounded-lg mb-6">
                          <h3 className="text-lg font-semibold text-primary mb-4 border-b pb-2">Basic Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="mb-2 font-medium">Name</Label>
                              <Input
                                type="text"
                                placeholder="Name"
                                size="lg"
                                variant="flat"
                                name="name"
                                id="name"
                                value={formData?.name || ""}
                                onChange={(data) =>
                                  handleInputChange(
                                    "name",
                                    data.target.value,
                                    "input"
                                  )
                                }
                                className="rounded-md border-default-200 focus:border-primary"
                              />
                            </div>
                            <div>
                              <Label className="mb-2 font-medium">Employee Code</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="text"
                                  placeholder="Employee Code"
                                  size="lg"
                                  variant="flat"
                                  name="employeeCode"
                                  id="employeeCode"
                                  value={formData?.employeeCode || ""}
                                  onChange={(data) =>
                                    handleInputChange(
                                      "employeeCode",
                                      data.target.value,
                                      "input"
                                    )
                                  }
                                  className="rounded-md border-default-200 focus:border-primary"
                                />
                                <Button
                                  type="button"
                                  variant="soft"
                                  className="rounded-md bg-primary/10 text-primary hover:bg-primary/20"
                                  onClick={generatEmployeeCode}
                                >
                                  Generate
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label className="mb-2 font-medium">Email</Label>
                              <Input
                                type="email"
                                placeholder="Email"
                                size="lg"
                                variant="flat"
                                name="email"
                                id="email"
                                value={formData?.email || ""}
                                onChange={(data) =>
                                  handleInputChange(
                                    "email",
                                    data.target.value,
                                    "input"
                                  )
                                }
                                className="rounded-md border-default-200 focus:border-primary"
                              />
                            </div>
                            <div>
                              <Label className="mb-2 font-medium">Official Email</Label>
                              <Input
                                type="email"
                                placeholder="Official Email"
                                size="lg"
                                variant="flat"
                                name="officialEmail"
                                id="officialEmail"
                                value={formData?.officialEmail || ""}
                                onChange={(data) =>
                                  handleInputChange(
                                    "officialEmail",
                                    data.target.value,
                                    "input"
                                  )
                                }
                                className="rounded-md border-default-200 focus:border-primary"
                              />
                            </div>
                          
                            <div>
                              <Label className="mb-2 font-medium">Department</Label>
                              <Select
                                onValueChange={(data) =>
                                  handleInputChange("department", data, "select-one")
                                }
                                id="department"
                                name="department"
                              >
                                <SelectTrigger variant="flat" className="rounded-md border-default-200 focus:border-primary">
                                  <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent className="z-[1000]">
                                  <SelectItem value="Accounts">Accounts</SelectItem>
                                  <SelectItem value="Admin">Admin</SelectItem>
                                  <SelectItem value="HR">HR</SelectItem>
                                  <SelectItem value="IT">IT</SelectItem>
                                  <SelectItem value="CRM">CRM</SelectItem>
                                  <SelectItem value="Support">Support</SelectItem>
                                  <SelectItem value="Telecaller">Telecaller</SelectItem>
                                  <SelectItem value="Designer">Designer</SelectItem>
                                  <SelectItem value="Marketing">Marketing</SelectItem>
                                  <SelectItem value="Operations">Operations</SelectItem>
                                  <SelectItem value="Production">Production</SelectItem>
                                  <SelectItem value="Sales">Sales</SelectItem>
                                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="mb-2 font-medium">Gender</Label>
                              <Select
                                onValueChange={(data) =>
                                  handleInputChange(
                                    "gender",
                                    data,
                                    "select-one"
                                  )
                                }
                                id="gender"
                                name="gender"
                              >
                                <SelectTrigger variant="flat" className="rounded-md border-default-200 focus:border-primary">
                                  <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent className="z-[1000]">
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="bg-default-50 p-4 rounded-lg mb-6">
                          <h3 className="text-lg font-semibold text-primary mb-4 border-b pb-2">Contact Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="mb-2 font-medium">Contact Number</Label>
                              <Input
                                type="tel"
                                id="contactNumber"
                                onChange={(data) =>
                                  handleInputChange(
                                    "contactNumber",
                                    data.target.value,
                                    "input"
                                  )
                                }
                                className="rounded-md border-default-200 focus:border-primary"
                                variant="flat"
                                placeholder="Enter contact number"
                              />
                            </div>
                            <div>
                              <Label className="mb-2 font-medium">Alternative Contact</Label>
                              <Input
                                type="tel"
                                id="alternativeContactNumber"
                                onChange={(data) =>
                                  handleInputChange(
                                    "alternativeContactNumber",
                                    data.target.value,
                                    "input"
                                  )
                                }
                                className="rounded-md border-default-200 focus:border-primary"
                                variant="flat"
                                placeholder="Enter alternative contact"
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label className="mb-2 font-medium">
                              Current Address
                            </Label>
                            <Textarea
                              type="text"
                              id="currentAddress"
                              onChange={(data) =>
                                handleInputChange(
                                  "currentAddress",
                                  data.target.value,
                                  "input"
                                )
                              }
                              className="rounded-md border-default-200 focus:border-primary min-h-[80px]"
                              variant="flat"
                              placeholder="Enter current address..."
                            />
                          </div>
                          <div className="mt-4">
                            <Label className="mb-2 font-medium">
                              Permanent Address
                            </Label>
                            <Textarea
                              type="text"
                              id="permanentAddress"
                              onChange={(data) =>
                                handleInputChange(
                                  "permanentAddress",
                                  data.target.value,
                                  "input"
                                )
                              }
                              className="rounded-md border-default-200 focus:border-primary min-h-[80px]"
                              variant="flat"
                              placeholder="Enter permanent address..."
                            />
                          </div>
                        </div>
                        <div className="bg-default-50 p-4 rounded-lg mb-6">
                          <h3 className="text-lg font-semibold text-primary mb-4 border-b pb-2">Important Dates</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="mb-2 font-medium">Date of Birth</Label>
                              <Input
                                type="date"
                                id="dateOfBirth"
                                onChange={(data) =>
                                  handleInputChange(
                                    "dateOfBirth",
                                    data.target.value,
                                    "input"
                                  )
                                }
                                className="rounded-md border-default-200 focus:border-primary"
                                variant="flat"
                              />
                            </div>
                            <div>
                              <Label className="mb-2 font-medium">Joining Date</Label>
                              <Input
                                type="date"
                                id="joiningDate"
                                onChange={(data) =>
                                  handleInputChange(
                                    "joiningDate",
                                    data.target.value,
                                    "input"
                                  )
                                }
                                className="rounded-md border-default-200 focus:border-primary"
                                variant="flat"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="bg-default-50 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-primary mb-4 border-b pb-2">Emergency Contact</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="mb-2 font-medium">Emergency Contact Person</Label>
                              <Input
                                type="text"
                                id="emergencyContactPerson"
                                onChange={(data) =>
                                  handleInputChange(
                                    "emergencyContactPerson",
                                    data.target.value,
                                    "input"
                                  )
                                }
                                className="rounded-md border-default-200 focus:border-primary"
                                variant="flat"
                                placeholder="Enter contact person name"
                              />
                            </div>
                            <div>
                              <Label className="mb-2 font-medium">Relationship</Label>
                              <Input
                                type="text"
                                id="emergencyContactRelation"
                                onChange={(data) =>
                                  handleInputChange(
                                    "emergencyContactRelation",
                                    data.target.value,
                                    "input"
                                  )
                                }
                                className="rounded-md border-default-200 focus:border-primary"
                                variant="flat"
                                placeholder="Enter relationship"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 md:flex-none flex flex-col items-center w-[250px] min-w-[250px]">
                      <div className="bg-default-50 p-4 rounded-lg w-full">
                        <h3 className="text-lg font-semibold text-primary mb-4 border-b pb-2 text-center">Employee Photo</h3>
                        <Label
                          htmlFor="uploadFile"
                          className="cursor-pointer w-full md:w-[220px] h-[220px] bg-default-100 dark:bg-default-50 rounded-lg flex justify-center items-center border-2 border-dashed border-default-200 hover:border-primary transition-colors mx-auto overflow-hidden"
                        >
                          {previewImage ? (
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-md"
                            />
                          ) : (
                            <div className="flex flex-col items-center w-full">
                              <Upload className="h-10 w-10 mb-3 text-primary" />
                              <span className="text-sm font-medium text-primary">
                                Upload Photo
                              </span>
                              <p className="text-xs text-default-500 mt-2 text-center px-4">
                                Click or drag and drop
                              </p>
                            </div>
                          )}
                          <Input
                            type="file"
                            className="hidden"
                            id="uploadFile"
                            accept="image/*"
                            onChange={(data) =>
                              handleInputChange("image", data, "file")
                            }
                          />
                        </Label>
                        <div className="mt-3 text-[11px] text-default-600 text-center">
                          240 x 240 pixels @ 72 DPI<br/>Maximum size of 1MB to 3.5MB
                        </div>
                      </div>
                    </div>
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
                Create Employee
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default AddItem;
