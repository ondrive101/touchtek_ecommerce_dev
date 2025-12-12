import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
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
import { Loader2, Heart } from "lucide-react";
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
import { createSupplier } from "@/action/superadmin/controller";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AddSupplier = ({ session }) => {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    supplierId: "",
    email: "",
    contactNumber: "",
    alternativeContactNumber: "",
    employeeInformed: "",
    gender: "",

    // Address details
    streetAddress: "",
    city: "",
    pinCode: "",
    country: "",
    state: "",
    billingAddressSame: true,

 // Image
    image: null,
  });
  const [showModal, setShowModal] = useState(false);

  const generatSupplierCode = () => {5
    // Generate 2 random uppercase letters
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetters = Array(3)
      .fill(0)
      .map(() => letters[Math.floor(Math.random() * letters.length)])
      .join("");

    // Generate 2 random digits
    const randomDigits = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0");

    // Combine letters and digits
    const supplierId = randomLetters + randomDigits;

    // Update form data with new SKU code
    setFormData((prev) => ({
      ...prev,
      supplierId: supplierId,
    }));
  };

  const handleInputChange = (name, value, type) => {
    if (type === "select-one") {
      const selectedValue = value;

      if (name === "gender") {
        setFormData({
          ...formData,
          gender: selectedValue,
        });
      } else if (name === "referral") {
        setFormData({
          ...formData,
          employeeInformed: selectedValue,
        });
      } else if (name === "type") {
        setFormData({
          ...formData,
          type: selectedValue,
        });
      } else if (name === "category") {
        setFormData({
          ...formData,
          category: selectedValue,
        });
      } else if (name === "subCategory") {
        setFormData({
          ...formData,
          subCategory: selectedValue,
        });
      } else {
        setFormData({
          ...formData,
          [name]: selectedValue,
        });
      }
      return;
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

    if (type === "switch") {
      setFormData({
        ...formData,
        billingAddressSame: value,
      });
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
    // Validate required fields
    const requiredFields = {
      // Basic Information
      name: "Name",
      email: "Email",
      supplierId: "Supplier ID",
      employeeInformed: "Employee Informed",
      gender: "Gender",

      // Contact Information
      contactNumber: "Contact Number",
      alternativeContactNumber: "Alternative Contact Number",


      // Address details
      streetAddress: "Street Address",
      city: "City",
      pinCode: "PIN Code",
      country: "Country",
      state: "State",

      // Customer Category
      type: "Type",
      category: "Category",
      subCategory: "Sub Category",
      // Image
      image: "Image",
    };

    // Check for missing required fields
    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field]) {
        missingFields.push(label);
      }
    }

    // If there are missing fields, show error toast and return
    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`,
        {
          duration: 3000,
        }
      );
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address", {
        duration: 3000,
      });
      return;
    }

    // Validate contact number (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.contactNumber.replace(/\D/g, ""))) {
      toast.error("Contact Number should be 10 digits", {
        duration: 3000,
      });
      return;
    }


    // Validate image
    if (!formData.image) {
      toast.error("Please upload an image", {
        duration: 3000,
      });
      return;
    }

    try {
      // setLoading(true);
      const formDataObj = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataObj.append(key, formData[key]);
      });
      console.log(formDataObj);
      console.log(formData);

      const response = await createSupplier(formDataObj, session);

      if (response.status === "success") {
        toast.success("Supplier created successfully", {
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
      toast.error(error.response?.data?.msg || "An error occurred", {
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
          Add Supplier
        </Button>
      </DialogTrigger>

      {showModal && (
        <DialogContent size="4xl">
          <DialogTitle className="sr-only">Add New Supplier</DialogTitle>
          <DialogDescription className="sr-only">
            Add new supplier details
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
                  Add New Supplier
                </div>
                <p className="text-xs text-default-500 ">Supplier Details</p>
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
                            <h3 className="text-lg font-semibold text-primary mb-4 border-b pb-2">
                              Basic Information
                            </h3>
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
                                <Label className="mb-2 font-medium">
                                  Supplier ID
                                </Label>
                                <div className="flex gap-2">
                                  <Input
                                    type="text"
                                    placeholder="Supplier ID"
                                    size="lg"
                                    variant="flat"
                                    name="supplierId"
                                    id="supplierId"
                                    value={formData?.supplierId || ""}
                                    onChange={(data) =>
                                      handleInputChange(
                                        "supplierId",
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
                                    onClick={generatSupplierCode}
                                  >
                                    Generate
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Label className="mb-2 font-medium">
                                  Email
                                </Label>
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
                                <Label className="mb-2 font-medium">
                                  Contact Number
                                </Label>
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
                                <Label className="mb-2 font-medium">
                                  Alternative Contact
                                </Label>
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

                              <div>
                                <Label className="mb-2 font-medium">
                                  Referral
                                </Label>
                                <Select
                                  onValueChange={(data) =>
                                    handleInputChange(
                                      "referral",
                                      data,
                                      "select-one"
                                    )
                                  }
                                  id="referral"
                                  name="referral"
                                >
                                  <SelectTrigger
                                    variant="flat"
                                    size="md"
                                    className="rounded-md border-default-200 focus:border-primary"
                                  >
                                    <SelectValue placeholder="Select Referral" />
                                  </SelectTrigger>
                                  <SelectContent className="z-[1000]">
                                    <SelectItem value="None">None</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="mb-2 font-medium">
                                  Gender
                                </Label>
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
                                  <SelectTrigger
                                    variant="flat"
                                    size="md"
                                    className="rounded-md border-default-200 focus:border-primary"
                                  >
                                    <SelectValue placeholder="Select Gender" />
                                  </SelectTrigger>
                                  <SelectContent className="z-[1000]">
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">
                                      Female
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          <div className="bg-default-50 p-4 rounded-lg mb-6">
                            <h3 className="text-lg font-semibold text-primary mb-4 border-b pb-2">
                              Address Details
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <Label className="mb-2 font-medium">
                                  Street Address
                                </Label>
                                <Input
                                  type="text"
                                  placeholder="Building No, Street Address"
                                  variant="flat"
                                  id="streetAddress"
                                  onChange={(data) =>
                                    handleInputChange(
                                      "streetAddress",
                                      data.target.value,
                                      "input"
                                    )
                                  }
                                  className="rounded-md border-default-200 focus:border-primary"
                                />
                              </div>
                              <div>
                                <Label className="mb-2 font-medium">City</Label>
                                <Input
                                  type="text"
                                  placeholder="City/Town"
                                  variant="flat"
                                  id="city"
                                  onChange={(data) =>
                                    handleInputChange(
                                      "city",
                                      data.target.value,
                                      "input"
                                    )
                                  }
                                  className="rounded-md border-default-200 focus:border-primary"
                                />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <Label className="mb-2 font-medium">
                                    PIN Code
                                  </Label>
                                  <Input
                                    type="text"
                                    placeholder="PIN Code"
                                    variant="flat"
                                    id="pinCode"
                                    onChange={(data) =>
                                      handleInputChange(
                                        "pinCode",
                                        data.target.value,
                                        "input"
                                      )
                                    }
                                    className="rounded-md border-default-200 focus:border-primary"
                                  />
                                </div>
                                <div>
                                  <Label className="mb-2 font-medium">
                                    Country
                                  </Label>
                                  <Input
                                    type="text"
                                    placeholder="Country"
                                    variant="flat"
                                    id="country"
                                    onChange={(data) =>
                                      handleInputChange(
                                        "country",
                                        data.target.value,
                                        "input"
                                      )
                                    }
                                    className="rounded-md border-default-200 focus:border-primary"
                                  />
                                </div>
                                <div>
                                  <Label className="mb-2 font-medium">
                                    State
                                  </Label>
                                  <Input
                                    type="text"
                                    placeholder="State"
                                    variant="flat"
                                    id="state"
                                    onChange={(data) =>
                                      handleInputChange(
                                        "state",
                                        data.target.value,
                                        "input"
                                      )
                                    }
                                    className="rounded-md border-default-200 focus:border-primary"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center mt-6 w-full md:w-3/4 justify-between">
                                <span className="text-sm font-medium text-gray-900">
                                  Billing Address Same as Supplier Address
                                </span>
                                <div>
                                  <Switch
                                    defaultChecked={
                                      formData?.billingAddressSame
                                    }
                                    onCheckedChange={(checked) =>
                                      handleInputChange(
                                        "billingAddressSame",
                                        checked,
                                        "switch"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-default-50 p-4 rounded-lg mb-6">
                            <h3 className="text-lg font-semibold text-primary mb-4 border-b pb-2">
                              Other Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="mb-2 font-medium">
                                  GSTIN
                                </Label>
                                <Input
                                  type="text"
                                  placeholder="Enter your GSTIN"
                                  variant="flat"
                                  id="gstin"
                                  onChange={(data) =>
                                    handleInputChange(
                                      "gstin",
                                      data.target.value,
                                      "input"
                                    )
                                  }
                                  className="rounded-md border-default-200 focus:border-primary"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="bg-default-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-primary mb-4 border-b pb-2">
                              Return & Product Type
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="mb-2 font-medium">Type</Label>
                                <Select
                                  onValueChange={(data) =>
                                    handleInputChange(
                                      "type",
                                      data,
                                      "select-one"
                                    )
                                  }
                                  id="type"
                                  name="type"
                                >
                                  <SelectTrigger
                                    variant="flat"
                                    size="md"
                                    className="rounded-md border-default-200 focus:border-primary"
                                  >
                                    <SelectValue placeholder="Select a Type" />
                                  </SelectTrigger>
                                  <SelectContent className="z-[1000]">
                                    <SelectItem value="returns">
                                      Returns
                                    </SelectItem>
                                    <SelectItem value="no-returns">
                                      No Returns
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="mb-2 font-medium">
                                  Category
                                </Label>
                                <Select
                                  onValueChange={(data) =>
                                    handleInputChange(
                                      "category",
                                      data,
                                      "select-one"
                                    )
                                  }
                                  id="category"
                                  name="category"
                                >
                                  <SelectTrigger
                                    variant="flat"
                                    size="md"
                                    className="rounded-lg"
                                  >
                                    <SelectValue placeholder="Select Category" />
                                  </SelectTrigger>
                                  <SelectContent className="z-[1000]">
                                    <SelectItem value="Battery">
                                      Battery
                                    </SelectItem>
                                    <SelectItem value="Accessories">
                                      Accessories
                                    </SelectItem>
                                    <SelectItem value="Others">
                                      Others
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="mb-2">
                                  Product Sub Category
                                </Label>
                                <Select
                                  onValueChange={(data) =>
                                    handleInputChange(
                                      "subCategory",
                                      data,
                                      "select-one"
                                    )
                                  }
                                  id="subCategory"
                                  name="subCategory"
                                >
                                  <SelectTrigger variant="flat" size="md">
                                    <SelectValue placeholder="Select Sub Category" />
                                  </SelectTrigger>
                                  <SelectContent className="z-[1000]">
                                    <SelectItem value="TWS">TWS</SelectItem>
                                    <SelectItem value="Chargers">
                                      Chargers
                                    </SelectItem>
                                    <SelectItem value="Data Cables">
                                      Data Cables
                                    </SelectItem>
                                    <SelectItem value="Earphones">
                                      Earphones
                                    </SelectItem>
                                    <SelectItem value="OTG">OTG</SelectItem>
                                    <SelectItem value="Power Banks">
                                      Power Banks
                                    </SelectItem>
                                    <SelectItem value="Speakers">
                                      Speakers
                                    </SelectItem>
                                    <SelectItem value="Others">
                                      Others
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 md:flex-none flex flex-col items-center w-[250px] min-w-[250px]">
                        <div className="bg-default-50 p-4 rounded-lg w-full">
                          <h3 className="text-lg font-semibold text-primary mb-4 border-b pb-2 text-center">
                            Employee Photo
                          </h3>
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
                            240 x 240 pixels @ 72 DPI
                            <br />
                            Maximum size of 1MB to 3.5MB
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

export default AddSupplier;
