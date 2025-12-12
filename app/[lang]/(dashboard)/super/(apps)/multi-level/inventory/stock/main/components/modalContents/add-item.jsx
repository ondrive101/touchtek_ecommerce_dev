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
  Upload,
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
import { createNewSku_Inventory } from "@/action/superadmin/controller";

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

  const generateSkuCode = () => {
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
    const skuCode = randomLetters + randomDigits;

    // Update form data with new SKU code
    setFormData((prev) => ({
      ...prev,
      skucode: skuCode,
    }));
  };

  const handleInputChange = (name, value, type) => {
    if (type === "select-one") {
      const selectedValue = value;

      if (name === "category") {
        setFormData({
          ...formData,
          category: selectedValue,
        });
      }

      if (name === "subCategory") {
        setFormData({
          ...formData,
          subCategory: selectedValue,
        });
      }

      if (name === "type") {
        setFormData({
          ...formData,
          type: selectedValue,
        });
      }
      if (name === "chargerType") {
        setFormData({
          ...formData,
          chargerType: selectedValue,
        });
      }
      if (name === "cableType") {
        setFormData({
          ...formData,
          cableType: selectedValue,
        });
      }
      if (name === "lithiumType") {
        setFormData({
          ...formData,
          lithiumType: selectedValue,
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formDataObj = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataObj.append(key, formData[key]);
      });

      const response = await createNewSku_Inventory(formDataObj, session);

      if (response.status === "success") {
        toast.success("item created successfully", {
          autoClose: 1000,
        });
        setFormData({});
        setPreviewImage(null);
        setLoading(false);
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
          Add Item
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
                  Create New Order
                </div>
                <p className="text-xs text-default-500 ">
                  Select how many items you want to order
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="invoice-wrapper mt-6 ">
            <div className="grid grid-cols-12 gap-6">
              <Card className="col-span-12 xl:col-span-12  p-2">
                <ScrollArea className="h-[500px]">
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[250px]">
                        <div className="w-full md:w-[375px] space-y-4">
                          <div>
                            <Label className="mb-2">Product Name</Label>
                            <Input
                              type="text"
                              placeholder="Product Name"
                              size="lg"
                              variant="flat"
                              name="productName"
                              id="productName"
                              value={formData?.productName || ""}
                              onChange={(data) =>
                                handleInputChange(
                                  "productName",
                                  data.target.value,
                                  "input"
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label className="mb-2">Product Code</Label>
                            <div className="flex gap-2">
                              <Input
                                type="text"
                                placeholder="Product Code"
                                size="lg"
                                variant="flat"
                                name="skucode"
                                id="skucode"
                                value={formData?.skucode || ""}
                                onChange={(data) =>
                                  handleInputChange(
                                    "skucode",
                                    data.target.value,
                                    "input"
                                  )
                                }
                              />
                              <Button
                                type="button"
                                variant="soft"
                                className="rounded-lg"
                                onClick={generateSkuCode}
                              >
                                Generate
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label className="mb-2">Product Category</Label>
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
                                className="rounded-lg"
                              >
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                              <SelectContent className="z-[1000]">
                                <SelectItem value="Battery">Battery</SelectItem>
                                <SelectItem value="Accessories">
                                  Accessories
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="mb-2">Product Type</Label>
                            <Select
                              onValueChange={(data) =>
                                handleInputChange("type", data, "select-one")
                              }
                              id="type"
                              name="type"
                            >
                              <SelectTrigger
                                variant="flat"
                                className="rounded-lg"
                              >
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                              <SelectContent className="z-[1000]">
                                <SelectItem value="Main">Main</SelectItem>
                                {/* <SelectItem value="Processed">
                                  Processed
                                </SelectItem> */}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="mb-2">Product Sub Category</Label>

                            {formData?.category === "Accessories" ? (
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
                                <SelectTrigger variant="flat">
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
                                </SelectContent>
                              </Select>
                            ) : (
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
                                <SelectTrigger variant="flat">
                                  <SelectValue placeholder="Select Sub Category" />
                                </SelectTrigger>
                                <SelectContent className="z-[1000]">
                                  <SelectItem value="Polymer">
                                    Polymer
                                  </SelectItem>
                                  <SelectItem value="Lithium">
                                    Lithium
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>

                          {formData?.subCategory === "Chargers" && (
                            <div>
                              <Label className="mb-2">Charger Type</Label>
                              <Select
                                onValueChange={(data) =>
                                  handleInputChange(
                                    "chargerType",
                                    data,
                                    "select-one"
                                  )
                                }
                                id="chargerType"
                                name="chargerType"
                              >
                                <SelectTrigger
                                  variant="flat"
                                  className="rounded-lg"
                                >
                                  <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent className="z-[1000]">
                                  <SelectItem value="with-cable">
                                    With Cable
                                  </SelectItem>
                                  <SelectItem value="without-cable">
                                    Without Cable
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {formData?.subCategory === "Lithium" && (
                            <div>
                              <Label className="mb-2">Lithium Type</Label>
                              <Select
                                onValueChange={(data) =>
                                  handleInputChange(
                                    "lithiumType",
                                    data,
                                    "select-one"
                                  )
                                }
                                id="lithiumType"
                                name="lithiumType"
                              >
                                <SelectTrigger
                                  variant="flat"
                                  className="rounded-lg"
                                >
                                  <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent className="z-[1000]">
                                  <SelectItem value="diamond">
                                    Diamond
                                  </SelectItem>
                                  <SelectItem value="premium">
                                    Premium
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {formData?.subCategory === "Chargers" &&
                            formData?.chargerType === "with-cable" && (
                              <div>
                                <Label className="mb-2">Cable Type</Label>
                                <Select
                                  onValueChange={(data) =>
                                    handleInputChange(
                                      "cableType",
                                      data,
                                      "select-one"
                                    )
                                  }
                                  id="cableType"
                                  name="cableType"
                                >
                                  <SelectTrigger
                                    variant="flat"
                                    className="rounded-lg"
                                  >
                                    <SelectValue placeholder="Select Category" />
                                  </SelectTrigger>
                                  <SelectContent className="z-[1000]">
                                    <SelectItem value="C">C</SelectItem>
                                    <SelectItem value="V8">V8</SelectItem>
                                    <SelectItem value="Lightning">
                                      Lightning
                                    </SelectItem>
                                    <SelectItem value="3in1">3in1</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                          <div>
                            <Label className="mb-2">
                              Product Short Description (5-10) words
                            </Label>
                            <Textarea
                              type="text"
                              id="shortDescription"
                              onChange={(data) =>
                                handleInputChange(
                                  "shortDescription",
                                  data.target.value,
                                  "input"
                                )
                              }
                              className="rounded h-10"
                              variant="flat"
                              placeholder="Enter here product short description..."
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 md:flex-none flex flex-col items-end w-[222px] min-w-[222px]">
                        <Label
                          htmlFor="uploadFile"
                          className="cursor-pointer  w-full md:w-[220px] h-[180px] bg-default-100 dark:bg-default-50 rounded-md flex justify-center items-center"
                        >
                          {previewImage ? (
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-md"
                            />
                          ) : (
                            <div className="flex flex-col items-center w-full">
                              <Upload className="ltr:mr-2 rtl:ml-2 h-7 w-7 mb-2 text-primary" />
                              <span className="text-sm font-medium text-primary">
                                Upload Logo
                              </span>
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
                        <div className="mt-2 text-[10px] text-default-600">
                          240 x 240 pixels @ 72 DPI, Maximum size of 1MB to
                          3.5MB.
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div>
                        <Label className="mb-2">
                          Product Long Description (10-40) words
                        </Label>

                        <Textarea
                          type="text"
                          id="longDescription"
                          onChange={(data) =>
                            handleInputChange(
                              "longDescription",
                              data.target.value,
                              "input"
                            )
                          }
                          variant="flat"
                          className="rounded h-10"
                          placeholder="Enter here product long description.."
                        />
                      </div>
                    </div>
                  </CardContent>
                </ScrollArea>
              </Card>
            </div>
          </div>
          {/* Footer */}
          <DialogFooter className="flex justify-center">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>

            {loading ? (
              <Button>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait ...
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit}>
                Create Item
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default AddItem;
