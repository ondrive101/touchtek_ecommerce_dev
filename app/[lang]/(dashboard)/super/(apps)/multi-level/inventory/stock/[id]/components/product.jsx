"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

import { 
  Package, 
  ShoppingCart, 
  Settings, 
  Clock, 
  Upload, 
  Plus, 
  Pencil, 
  Tag, 
  Box, 
  Trash, 
  Gift, 
  PackageOpen,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  
  X
  // Checkbox
} from "lucide-react";
import Image from "next/image";
import day from "dayjs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Product = ({ product }) => {

  console.log(product)
  const [statsType, setStatsType] = useState("purchase");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    product?.product?.image || "/placeholder-product.jpg"
  );
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [showAddBoxDialog, setShowAddBoxDialog] = useState(false);
  const [showAddComboProductDialog, setShowAddComboProductDialog] = useState(false);
  const [showCreateComboDialog, setShowCreateComboDialog] = useState(false);
  
  // Pricing settings state
  const [pricingSettings, setPricingSettings] = useState({
    basePrice: product?.main?.rate || 0,
    superStockist: {
      silver: 0,
      gold: 0,
      diamond: 0
    },
    dealer: {
      silver: 0,
      gold: 0,
      diamond: 0
    },
    distributor: {
      silver: 0,
      gold: 0,
      diamond: 0
    }
  });

  // Inventory settings state
  const [inventorySettings, setInventorySettings] = useState({
    currentStock: product?.product?.main?.quantity || 0,
    minimumStock: product?.settings?.inventorySettings?.minimumStock || 0,
    maximumStock: product?.settings?.inventorySettings?.maximumStock || 0,
    productCode: product?.product?.productCode || ''
  });

  // Variant settings state
  const [variantSettings, setVariantSettings] = useState({
    canSellLoose: true,
    variants: product?.settings?.variants || [],
  });

  // Add new variant
  const [newVariant, setNewVariant] = useState({
    type: 'box',
    quantity: 6,
    freebies: [],
    rate: 0,
    autoCalculate: true,
    profitMargin: 10,
    discount: 0
  });

  // Calculate prices based on margins
  const calculatePrice = (basePrice, margin) => {
    // round of to the nearest once
    return Math.round((basePrice + (basePrice * margin / 100)) * 100) / 100;
  };

  // Calculate box price
  const calculateBoxPrice = (quantity, freebies = [], profitMargin = 10, discount = 0) => {
    const baseItemPrice = product?.product?.main?.rate || 0;
    const itemsTotal = baseItemPrice * quantity;
    
    // Calculate freebies total
    const freebiesTotal = freebies.reduce((total, freebie) => {
      return total + (freebie.rate * freebie.quantity);
    }, 0);
    
    // Apply profit margin
    const totalBeforeMargin = itemsTotal + freebiesTotal;
    const marginAmount = totalBeforeMargin * (profitMargin / 100);
    
    // Apply discount
    const totalAfterMargin = totalBeforeMargin + marginAmount;
    const discountAmount = totalAfterMargin * (discount / 100);
    
    return Math.round((totalAfterMargin - discountAmount) * 100) / 100;
  };

  // Handle pricing settings change
  const handlePricingChange = (customerType, tier, value) => {
    setPricingSettings(prev => ({
      ...prev,
      [customerType]: {
        ...prev[customerType],
        [tier]: Number(value)
      }
    }));
  };

  // Handle base price change
  const handleBasePriceChange = (value) => {
    setPricingSettings(prev => ({
      ...prev,
      basePrice: Number(value)
    }));
  };

  // Handle inventory settings change
  const handleInventoryChange = (field, value) => {
    setInventorySettings(prev => ({
      ...prev,
      [field]: field === 'productCode' ? value : Number(value)
    }));
  };

  // Handle variant change
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variantSettings.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value
    };
    
    // If auto-calculate is enabled, update the rate
    if (field !== 'rate' && updatedVariants[index].autoCalculate) {
      updatedVariants[index].rate = calculateBoxPrice(
        updatedVariants[index].quantity,
        updatedVariants[index].freebies,
        updatedVariants[index].profitMargin,
        updatedVariants[index].discount
      );
    }
    
    // If changing autoCalculate to true, recalculate the rate
    if (field === 'autoCalculate' && value === true) {
      updatedVariants[index].rate = calculateBoxPrice(
        updatedVariants[index].quantity,
        updatedVariants[index].freebies,
        updatedVariants[index].profitMargin,
        updatedVariants[index].discount
      );
    }
    
    setVariantSettings({
      ...variantSettings,
      variants: updatedVariants
    });
  };

  // Add new variant to list
  const addVariant = () => {
    // Calculate rate if auto-calculate is enabled
    let variantToAdd = { ...newVariant };
    if (variantToAdd.autoCalculate) {
      variantToAdd.rate = calculateBoxPrice(
        variantToAdd.quantity,
        variantToAdd.freebies,
        variantToAdd.profitMargin,
        variantToAdd.discount
      );
    }
    
    setVariantSettings({
      ...variantSettings,
      variants: [...variantSettings.variants, variantToAdd]
    });
    
    // Reset new variant form
    setNewVariant({
      type: 'box',
      quantity: 6,
      freebies: [],
      rate: 0,
      autoCalculate: true,
      profitMargin: 10,
      discount: 0
    });
    
    toast.success('Variant added successfully!');
  };

  // Remove variant
  const removeVariant = (index) => {
    const updatedVariants = [...variantSettings.variants];
    updatedVariants.splice(index, 1);
    
    setVariantSettings({
      ...variantSettings,
      variants: updatedVariants
    });
    
    toast.success('Variant removed successfully!');
  };

  // Add freebie to new variant
  const addFreebie = () => {
    setNewVariant({
      ...newVariant,
      freebies: [...newVariant.freebies, { name: '', quantity: 1, rate: 0 }]
    });
  };

  // Update freebie in new variant
  const updateFreebie = (index, field, value) => {
    const updatedFreebies = [...newVariant.freebies];
    updatedFreebies[index] = {
      ...updatedFreebies[index],
      [field]: value
    };
    
    setNewVariant({
      ...newVariant,
      freebies: updatedFreebies
    });
  };

  // Remove freebie from new variant
  const removeFreebie = (index) => {
    const updatedFreebies = [...newVariant.freebies];
    updatedFreebies.splice(index, 1);
    
    setNewVariant({
      ...newVariant,
      freebies: updatedFreebies
    });
  };

  // Add freebie to existing variant
  const addFreebieToVariant = (variantIndex) => {
    const updatedVariants = [...variantSettings.variants];
    updatedVariants[variantIndex].freebies.push({ name: '', quantity: 1, rate: 0 });
    
    // Recalculate price if auto-calculate is enabled
    if (updatedVariants[variantIndex].autoCalculate) {
      updatedVariants[variantIndex].rate = calculateBoxPrice(
        updatedVariants[variantIndex].quantity,
        updatedVariants[variantIndex].freebies,
        updatedVariants[variantIndex].profitMargin,
        updatedVariants[variantIndex].discount
      );
    }
    
    setVariantSettings({
      ...variantSettings,
      variants: updatedVariants
    });
  };

  // Update freebie in existing variant
  const updateVariantFreebie = (variantIndex, freebieIndex, field, value) => {
    const updatedVariants = [...variantSettings.variants];
    updatedVariants[variantIndex].freebies[freebieIndex] = {
      ...updatedVariants[variantIndex].freebies[freebieIndex],
      [field]: value
    };
    
    // Recalculate price if auto-calculate is enabled
    if (updatedVariants[variantIndex].autoCalculate) {
      updatedVariants[variantIndex].rate = calculateBoxPrice(
        updatedVariants[variantIndex].quantity,
        updatedVariants[variantIndex].freebies,
        updatedVariants[variantIndex].profitMargin,
        updatedVariants[variantIndex].discount
      );
    }
    
    setVariantSettings({
      ...variantSettings,
      variants: updatedVariants
    });
  };

  // Remove freebie from existing variant
  const removeFreebieFromVariant = (variantIndex, freebieIndex) => {
    const updatedVariants = [...variantSettings.variants];
    updatedVariants[variantIndex].freebies.splice(freebieIndex, 1);
    
    // Recalculate price if auto-calculate is enabled
    if (updatedVariants[variantIndex].autoCalculate) {
      updatedVariants[variantIndex].rate = calculateBoxPrice(
        updatedVariants[variantIndex].quantity,
        updatedVariants[variantIndex].freebies,
        updatedVariants[variantIndex].profitMargin,
        updatedVariants[variantIndex].discount
      );
    }
    
    setVariantSettings({
      ...variantSettings,
      variants: updatedVariants
    });
  };

  // Save variant settings
  const saveVariantSettings = () => {
    // Update product with variant settings
    const updatedProduct = {
      ...product,
      variants: {
        ...variantSettings
      }
    };
    
    // Here you would typically make an API call to save the updated product
    // For now, we'll just show a success message
    toast.success('Variant settings updated');
    setShowSettingsDialog(false);
    setSelectedSetting(null);
  };

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const openSettings = (setting) => {
    setSelectedSetting(setting);
    setShowSettingsDialog(true);
  };

  // Save pricing settings
  const savePricingSettings = () => {
    // Here you would typically make an API call to save the settings
    console.log('Saving pricing settings:', pricingSettings);
    toast.success('Pricing settings saved successfully!');
    setSelectedSetting(null);
  };

  // Save inventory settings
  const saveInventorySettings = () => {
    // Here you would typically make an API call to save the settings
    console.log('Saving inventory settings:', inventorySettings);
    toast.success('Inventory settings saved successfully!');
    setSelectedSetting(null);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs>
        <BreadcrumbItem>Inventory</BreadcrumbItem>
        <BreadcrumbItem>Stock</BreadcrumbItem>
        <BreadcrumbItem>Product-View</BreadcrumbItem>
      </Breadcrumbs>

      <div className="grid grid-cols-12 gap-6">
        {/* Product Overview Card */}
        <div className="col-span-12 lg:col-span-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="aspect-square relative rounded-lg overflow-hidden mb-4 bg-slate-100 group">
                <Image
                  src={imagePreview}
                  alt={product?.product?.productName}
                  fill
                  className="object-cover"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="flex flex-col items-center text-white">
                    <Upload className="h-6 w-6 mb-2" />
                    <span className="text-sm">Change Image</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{product?.product?.productName}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    SKU: {product?.product?.skucode}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {product?.product?.status}
                    </span>
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowSettingsDialog(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{product?.product?.category} - {product?.product?.subCategory}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Product Code</p>
                  <p className="font-medium">{product?.product?.productCode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>CV</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{product?.product?.createdByName}</p>
                      <p className="text-xs text-muted-foreground">
                        {day(product?.product?.createdAt).format("MMM D, YYYY")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Stock Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-medium">Main Stock</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{product?.product?.main?.quantity}</div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="text-sm font-medium">₹{product?.product?.main?.amount.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Rate</p>
                      <p className="text-sm font-medium">₹{product?.product?.main?.rate.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-medium">Return Stock</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="text-sm font-medium">0</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Rate</p>
                      <p className="text-sm font-medium">0</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="orders" className="flex-1">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Card>
                <CardHeader className="pb-0">
                  <Tabs defaultValue={statsType} className="w-full">
                    <TabsList>
                      <TabsTrigger value="purchase" onClick={() => setStatsType("purchase")}>
                        Purchase Orders
                      </TabsTrigger>
                      <TabsTrigger value="sales" onClick={() => setStatsType("sales")}>
                        Sales Orders
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent className="pt-6">
                  {statsType === 'purchase' ? (
                    product.purchaseOrders.length > 0 ? (
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-4">
                          {product.purchaseOrders.map((order, index) => (
                            <Card key={index} className="overflow-hidden">
                              <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Order #{order.poid}</span>
                                  </div>
                                  <Badge variant={order.status === "received" ? "success" : "pending"}>
                                    {order.status}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Supplier</p>
                                    <p className="font-medium">{order?.seller?.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Date</p>
                                    <p className="font-medium">{day(order?.createdAt).format("MMM D, YYYY")}</p>
                                  </div>
                                  {/* <div>
                                    <p className="text-muted-foreground">Quantity</p>
                                    <p className="font-medium">{order.items.find((item) => item.itemCode === product.productCode).quantity}</p>
                                  </div> */}
                                  {/* <div>
                                    <p className="text-muted-foreground">Amount</p>
                                    <p className="text-sm font-medium">₹{order.items.find((item) => item.itemCode === product.productCode).amountBT.toFixed(2)}</p>
                                  </div> */}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No purchase orders found
                      </div>  
                    )
                  ) : (
                    product?.salesOrders?.length > 0 ? (
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-4">
                          {product?.salesOrders?.map((order, index) => (
                            <Card key={index} className="overflow-hidden">
                              <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Order #{order.soid}</span>
                                  </div>
                                  <Badge variant={order.status === "delivered" ? "success" : "pending"}>
                                    {order.status}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Customer</p>
                                    <p className="font-medium">{order.customerName}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Date</p>
                                    <p className="font-medium">{day(order.createdAt).format("MMM D, YYYY")}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Quantity</p>
                                    {/* <p className="font-medium">{order.initial.data.items.find((item) => item.productCode === product.productCode).quantitySelected}</p> */}
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Amount</p>
                                    {/* <p className="text-sm font-medium">₹{order.initial.data.items.find((item) => item.productCode === product.productCode).amount}</p> */}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No sales orders found
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Settings Dialog */}
          <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
            <DialogContent size="5xl">
            
              <DialogHeader>
                <DialogTitle>Product Settings</DialogTitle>
                <DialogDescription>Select a setting to modify</DialogDescription>
              </DialogHeader>
              
              {!selectedSetting ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                  <Card className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-blue-500" onClick={() => setSelectedSetting('general')}>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">General Settings</CardTitle>
                      <Pencil className="h-5 w-5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Update product name and descriptions</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-green-500" onClick={() => setSelectedSetting('pricing')}>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Pricing Settings</CardTitle>
                      <Tag className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Manage base price and profit margins</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-amber-500" onClick={() => setSelectedSetting('inventory')}>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Inventory Settings</CardTitle>
                      <Box className="h-5 w-5 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Manage stock levels and codes</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-purple-500" onClick={() => setSelectedSetting('image')}>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Product Image</CardTitle>
                      <Upload className="h-5 w-5 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Update product images</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-rose-500" onClick={() => setSelectedSetting('variants')}>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Product Variants</CardTitle>
                      <PackageOpen className="h-5 w-5 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Manage product variants and combos</p>
                    </CardContent>
                  </Card>
              
                </div>
              ) : selectedSetting === 'general' ? (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input
                      id="name"
                      defaultValue={product.product.productName}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="shortDesc" className="text-right">Short Description</Label>
                    <Textarea
                      id="shortDesc"
                      defaultValue={product.product.shortDescription}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="longDesc" className="text-right">Long Description</Label>
                    <Textarea
                      id="longDesc"
                      defaultValue={product.product.longDescription}
                      className="col-span-3"
                      rows={4}
                    />
                  </div>
                </div>
              ) : selectedSetting === 'pricing' ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Button variant="outline" onClick={() => setSelectedSetting(null)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Settings
                    </Button>
                    <Button onClick={savePricingSettings}>
                      Save Changes
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Base Price</h3>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="basePrice"
                        type="number"
                        defaultValue={pricingSettings.basePrice}
                        className="flex-1"
                        onChange={(e) => handleBasePriceChange(e.target.value)}
                      />
                      <Select defaultValue="INR">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">₹ INR</SelectItem>
                          <SelectItem value="USD">$ USD</SelectItem>
                          <SelectItem value="EUR">€ EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div className="p-2 bg-muted rounded-md">
                        <div className="text-sm text-muted-foreground">Super Stockist (Diamond)</div>
                        <div className="text-lg font-medium">₹{calculatePrice(pricingSettings.basePrice, pricingSettings.superStockist.diamond)}</div>
                      </div>
                      <div className="p-2 bg-muted rounded-md">
                        <div className="text-sm text-muted-foreground">Dealer (Diamond)</div>
                        <div className="text-lg font-medium">₹{calculatePrice(pricingSettings.basePrice, pricingSettings.dealer.diamond)}</div>
                      </div>
                      <div className="p-2 bg-muted rounded-md">
                        <div className="text-sm text-muted-foreground">Distributor (Diamond)</div>
                        <div className="text-lg font-medium">₹{calculatePrice(pricingSettings.basePrice, pricingSettings.distributor.diamond)}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div className="p-2 bg-muted rounded-md">
                        <div className="text-sm text-muted-foreground">Super Stockist (Gold)</div>
                        <div className="text-lg font-medium">₹{calculatePrice(pricingSettings.basePrice, pricingSettings.superStockist.gold)}</div>
                      </div>
                      <div className="p-2 bg-muted rounded-md">
                        <div className="text-sm text-muted-foreground">Dealer (Gold)</div>
                        <div className="text-lg font-medium">₹{calculatePrice(pricingSettings.basePrice, pricingSettings.dealer.gold)}</div>
                      </div>
                      <div className="p-2 bg-muted rounded-md">
                        <div className="text-sm text-muted-foreground">Distributor (Gold)</div>
                        <div className="text-lg font-medium">₹{calculatePrice(pricingSettings.basePrice, pricingSettings.distributor.gold)}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div className="p-2 bg-muted rounded-md">
                        <div className="text-sm text-muted-foreground">Super Stockist (Silver)</div>
                        <div className="text-lg font-medium">₹{calculatePrice(pricingSettings.basePrice, pricingSettings.superStockist.silver)}</div>
                      </div>
                      <div className="p-2 bg-muted rounded-md">
                        <div className="text-sm text-muted-foreground">Dealer (Silver)</div>
                        <div className="text-lg font-medium">₹{calculatePrice(pricingSettings.basePrice, pricingSettings.dealer.silver)}</div>
                      </div>
                      <div className="p-2 bg-muted rounded-md">
                        <div className="text-sm text-muted-foreground">Distributor (Silver)</div>
                        <div className="text-lg font-medium">₹{calculatePrice(pricingSettings.basePrice, pricingSettings.distributor.silver)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <h3 className="text-lg font-semibold mb-4">Profit Margins</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px] text-center">Customer Type</TableHead>
                          <TableHead className="text-center">Silver (%)</TableHead>
                          <TableHead className="text-center">Gold (%)</TableHead>
                          <TableHead className="text-right">Diamond (%)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="text-center">
                          <TableCell className="font-medium">Super Stockist</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Input
                                type="number"
                                defaultValue={pricingSettings.superStockist.silver}
                                className="w-20"
                                onChange={(e) => handlePricingChange('superStockist', 'silver', e.target.value)}
                              />
                            
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="space-y-1">
                              <Input
                                type="number"
                                defaultValue={pricingSettings.superStockist.gold}
                                className="w-20"
                                onChange={(e) => handlePricingChange('superStockist', 'gold', e.target.value)}
                              />
                            
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Input
                                type="number"
                                defaultValue={pricingSettings.superStockist.diamond}
                                className="w-20"
                                onChange={(e) => handlePricingChange('superStockist', 'diamond', e.target.value)}
                              />
                            
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow className="text-center">
                          <TableCell className="font-medium">Dealer</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Input
                                type="number"
                                defaultValue={pricingSettings.dealer.silver}
                                className="w-20"
                                onChange={(e) => handlePricingChange('dealer', 'silver', e.target.value)}
                              />
                           
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Input
                                type="number"
                                defaultValue={pricingSettings.dealer.gold}
                                className="w-20"
                                onChange={(e) => handlePricingChange('dealer', 'gold', e.target.value)}
                              />
                          
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Input
                                type="number"
                                defaultValue={pricingSettings.dealer.diamond}
                                className="w-20"
                                onChange={(e) => handlePricingChange('dealer', 'diamond', e.target.value)}
                              />
                           
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow className="text-center">
                          <TableCell className="font-medium">Distributor</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Input
                                type="number"
                                defaultValue={pricingSettings.distributor.silver}
                                className="w-20"
                                onChange={(e) => handlePricingChange('distributor', 'silver', e.target.value)}
                              />
                           
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Input
                                type="number"
                                defaultValue={pricingSettings.distributor.gold}
                                className="w-20"
                                onChange={(e) => handlePricingChange('distributor', 'gold', e.target.value)}
                              />
                           
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Input
                                type="number"
                                defaultValue={pricingSettings.distributor.diamond}
                                className="w-20"
                                onChange={(e) => handlePricingChange('distributor', 'diamond', e.target.value)}
                              />
                            
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <p className="text-sm text-muted-foreground mt-2">
                      * Percentages represent profit margins over base price. Lower percentage means higher discount.
                    </p>
                  </div>
                </div>
              ) : selectedSetting === 'inventory' ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Button variant="outline" onClick={() => setSelectedSetting(null)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Settings
                    </Button>
                    <Button onClick={saveInventorySettings}>
                      Save Changes
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Stock Management</h3>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentStock">Current Stock</Label>
                        <Input
                          id="currentStock"
                          type="number"
                          defaultValue={inventorySettings.currentStock}
                          onChange={(e) => handleInventoryChange('currentStock', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minimumStock">Minimum Stock</Label>
                        <Input
                          id="minimumStock"
                          type="number"
                          defaultValue={inventorySettings.minimumStock}
                          onChange={(e) => handleInventoryChange('minimumStock', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maximumStock">Maximum Stock</Label>
                        <Input
                          id="maximumStock"
                          type="number"
                          defaultValue={inventorySettings.maximumStock}
                          onChange={(e) => handleInventoryChange('maximumStock', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="productCode">Product Code</Label>
                      <Input
                        id="productCode"
                        defaultValue={inventorySettings.productCode}
                        onChange={(e) => handleInventoryChange('productCode', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="p-4 border rounded-md">
                        <div className="text-sm text-muted-foreground">Stock Status</div>
                        <div className="text-lg font-medium flex items-center mt-1">
                          {inventorySettings.currentStock > inventorySettings.minimumStock ? (
                            <><span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span> In Stock</>
                          ) : inventorySettings.currentStock > 0 ? (
                            <><span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span> Low Stock</>
                          ) : (
                            <><span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span> Out of Stock</>
                          )}
                        </div>
                      </div>
                      <div className="p-4 border rounded-md">
                        <div className="text-sm text-muted-foreground">Restock Level</div>
                        <div className="text-lg font-medium mt-1">
                          {Math.max(0, inventorySettings.minimumStock - inventorySettings.currentStock)} units
                        </div>
                      </div>
                      <div className="p-4 border rounded-md">
                        <div className="text-sm text-muted-foreground">Storage Capacity</div>
                        <div className="text-lg font-medium mt-1">
                          {Math.max(0, inventorySettings.maximumStock - inventorySettings.currentStock)} units
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedSetting === 'image' ? (
                <div className="grid gap-4 py-4">
                  <div className="aspect-square relative rounded-lg overflow-hidden bg-slate-100 mx-auto max-w-[300px]">
                    <Image
                      src={imagePreview}
                      alt={product.product.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex justify-center mt-4">
                    <label className="cursor-pointer">
                      <Button variant="outline" type="button">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Image
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              ) : selectedSetting === 'variants' ? (
                  <ScrollArea className="h-[750px] p-5 ">
                    
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Button variant="outline" onClick={() => setSelectedSetting(null)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Settings
                    </Button>
                    <Button onClick={saveVariantSettings}>
                      Save Changes
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Selling Options</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="loose-selling" 
                        checked={variantSettings.canSellLoose}
                        onCheckedChange={(checked) => {
                          setVariantSettings({
                            ...variantSettings,
                            canSellLoose: checked
                          });
                        }}
                      />
                      <Label htmlFor="loose-selling">Allow selling as loose items (individual units)</Label>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-medium">Box Variants</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create box variants with different quantities and optional freebies
                      </p>
                      
                      {/* Existing variants list */}
                      {variantSettings.variants.length > 0 ? (
                        <div className="space-y-4 mb-6">
                          {variantSettings.variants.map((variant, index) => (
                            <div key={index} className="border rounded-md p-4 space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{variant.type.charAt(0).toUpperCase() + variant.type.slice(1)} ({variant.quantity} items)</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Price: ₹{variant.rate} | {variant.freebies.length} freebies
                                  </p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      // Toggle expanded state for this variant
                                      const updatedVariants = [...variantSettings.variants];
                                      updatedVariants[index].expanded = !updatedVariants[index].expanded;
                                      setVariantSettings({
                                        ...variantSettings,
                                        variants: updatedVariants
                                      });
                                    }}
                                  >
                                    {variant.expanded ? 'Collapse' : 'Expand'}
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => removeVariant(index)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              {variant.expanded && (
                                <div className="space-y-4 pt-2">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor={`variant-${index}-quantity`}>Quantity</Label>
                                      <Input
                                        id={`variant-${index}-quantity`}
                                        type="number"
                                        value={variant.quantity}
                                        onChange={(e) => handleVariantChange(index, 'quantity', parseInt(e.target.value))}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`variant-${index}-rate`}>Rate</Label>
                                      <Input
                                        id={`variant-${index}-rate`}
                                        type="number"
                                        value={variant.rate}
                                        onChange={(e) => handleVariantChange(index, 'rate', parseFloat(e.target.value))}
                                        disabled={variant.autoCalculate}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`variant-${index}-auto-calculate`} 
                                      checked={variant.autoCalculate}
                                      onCheckedChange={(checked) => handleVariantChange(index, 'autoCalculate', checked)}
                                    />
                                    <Label htmlFor={`variant-${index}-auto-calculate`}>Auto-calculate price</Label>
                                  </div>
                                  
                                  {variant.autoCalculate && (
                                    <div className="space-y-2">
                                      <Label htmlFor={`variant-${index}-profit-margin`}>Profit Margin (%)</Label>
                                      <Input
                                        id={`variant-${index}-profit-margin`}
                                        type="number"
                                        value={variant.profitMargin}
                                        onChange={(e) => handleVariantChange(index, 'profitMargin', parseFloat(e.target.value))}
                                      />
                                    </div>
                                  )}
                                  
                                  {variant.autoCalculate && (
                                    <div className="space-y-2">
                                      <Label htmlFor={`variant-${index}-discount`}>Discount (%)</Label>
                                      <Input
                                        id={`variant-${index}-discount`}
                                        type="number"
                                        value={variant.discount}
                                        onChange={(e) => handleVariantChange(index, 'discount', parseFloat(e.target.value))}
                                      />
                                    </div>
                                  )}
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label>Freebies</Label>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => addFreebieToVariant(index)}
                                      >
                                        Add Freebie
                                      </Button>
                                    </div>
                                    
                                    {variant.freebies.length > 0 ? (
                                      <div className="space-y-2">
                                        {variant.freebies.map((freebie, freebieIndex) => (
                                          <div key={freebieIndex} className="flex items-center space-x-2">
                                            <Input
                                              placeholder="Freebie name"
                                              value={freebie.name}
                                              onChange={(e) => updateVariantFreebie(index, freebieIndex, 'name', e.target.value)}
                                              className="flex-1"
                                            />
                                            <Input
                                              type="number"
                                              placeholder="Qty"
                                              value={freebie.quantity}
                                              onChange={(e) => updateVariantFreebie(index, freebieIndex, 'quantity', parseInt(e.target.value))}
                                              className="w-20"
                                            />
                                            <Input
                                              type="number"
                                              placeholder="Rate"
                                              value={freebie.rate}
                                              onChange={(e) => updateVariantFreebie(index, freebieIndex, 'rate', parseFloat(e.target.value))}
                                              className="w-24"
                                            />
                                            <Button 
                                              variant="ghost" 
                                              size="sm"
                                              onClick={() => removeFreebieFromVariant(index, freebieIndex)}
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-muted-foreground">No freebies added</p>
                                    )}
                                  </div>
                                  
                                  {variant.autoCalculate && (
                                    <div className="bg-muted p-3 rounded-md">
                                      <div className="flex justify-between">
                                        <span>Base items cost:</span>
                                        <span>₹{(product?.main?.rate || 0) * variant.quantity}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Freebies cost:</span>
                                        <span>₹{variant.freebies.reduce((total, freebie) => total + (freebie.rate * freebie.quantity), 0)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Profit margin ({variant.profitMargin}%):</span>
                                        <span>₹{((product?.main?.rate || 0) * variant.quantity + variant.freebies.reduce((total, freebie) => total + (freebie.rate * freebie.quantity), 0)) * (variant.profitMargin / 100)}</span>
                                      </div>
                                      {variant.discount > 0 && (
                                        <div className="flex justify-between">
                                          <span>Discount ({variant.discount}%):</span>
                                          <span className="text-red-500">-₹{(((product?.main?.rate || 0) * variant.quantity + variant.freebies.reduce((total, freebie) => total + (freebie.rate * freebie.quantity), 0)) * (1 + variant.profitMargin / 100)) * (variant.discount / 100)}</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between font-medium pt-1 border-t mt-1">
                                        <span>Total price:</span>
                                        <span>₹{variant.rate}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 border rounded-md mb-6">
                          <Package className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                          <p>No box variants added yet</p>
                        </div>
                      )}
                      
                      {/* Add new variant form */}
                      <div className="border rounded-md p-4 space-y-4">
                        <h4 className="font-medium">Add New Box Variant</h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-variant-quantity">Quantity</Label>
                            <Input
                              id="new-variant-quantity"
                              type="number"
                              value={newVariant.quantity}
                              onChange={(e) => setNewVariant({...newVariant, quantity: parseInt(e.target.value)})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-variant-rate">Rate</Label>
                            <Input
                              id="new-variant-rate"
                              type="number"
                              value={newVariant.rate}
                              onChange={(e) => setNewVariant({...newVariant, rate: parseFloat(e.target.value)})}
                              disabled={newVariant.autoCalculate}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="new-variant-auto-calculate" 
                            checked={newVariant.autoCalculate}
                            onCheckedChange={(checked) => setNewVariant({...newVariant, autoCalculate: checked})}
                          />
                          <Label htmlFor="new-variant-auto-calculate">Auto-calculate price</Label>
                        </div>
                        
                        {newVariant.autoCalculate && (
                          <div className="space-y-2">
                            <Label htmlFor="new-variant-profit-margin">Profit Margin (%)</Label>
                            <Input
                              id="new-variant-profit-margin"
                              type="number"
                              value={newVariant.profitMargin}
                              onChange={(e) => setNewVariant({...newVariant, profitMargin: parseFloat(e.target.value)})}
                            />
                          </div>
                        )}
                        
                        {newVariant.autoCalculate && (
                          <div className="space-y-2">
                            <Label htmlFor="new-variant-discount">Discount (%)</Label>
                            <Input
                              id="new-variant-discount"
                              type="number"
                              value={newVariant.discount}
                              onChange={(e) => setNewVariant({...newVariant, discount: parseFloat(e.target.value)})}
                            />
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Freebies</Label>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={addFreebie}
                            >
                              Add Freebie
                            </Button>
                          </div>
                          
                          {newVariant.freebies.length > 0 ? (
                            <div className="space-y-2">
                              {newVariant.freebies.map((freebie, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <Input
                                    placeholder="Freebie name"
                                    value={freebie.name}
                                    onChange={(e) => updateFreebie(index, 'name', e.target.value)}
                                    className="flex-1"
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Qty"
                                    value={freebie.quantity}
                                    onChange={(e) => updateFreebie(index, 'quantity', parseInt(e.target.value))}
                                    className="w-20"
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Rate"
                                    value={freebie.rate}
                                    onChange={(e) => updateFreebie(index, 'rate', parseFloat(e.target.value))}
                                    className="w-24"
                                  />
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => removeFreebie(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No freebies added</p>
                          )}
                        </div>
                        
                        {newVariant.autoCalculate && (
                          <div className="bg-muted p-3 rounded-md">
                            <div className="flex justify-between">
                              <span>Base items cost:</span>
                              <span>₹{(product?.main?.rate || 0) * newVariant.quantity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Freebies cost:</span>
                              <span>₹{newVariant.freebies.reduce((total, freebie) => total + (freebie.rate * freebie.quantity), 0)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Profit margin ({newVariant.profitMargin}%):</span>
                              <span>₹{((product?.main?.rate || 0) * newVariant.quantity + newVariant.freebies.reduce((total, freebie) => total + (freebie.rate * freebie.quantity), 0)) * (newVariant.profitMargin / 100)}</span>
                            </div>
                            {newVariant.discount > 0 && (
                              <div className="flex justify-between">
                                <span>Discount ({newVariant.discount}%):</span>
                                <span className="text-red-500">-₹{(((product?.main?.rate || 0) * newVariant.quantity + newVariant.freebies.reduce((total, freebie) => total + (freebie.rate * freebie.quantity), 0)) * (1 + newVariant.profitMargin / 100)) * (newVariant.discount / 100)}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-medium pt-1 border-t mt-1">
                              <span>Calculated price:</span>
                              <span>₹{calculateBoxPrice(
                                newVariant.quantity,
                                newVariant.freebies,
                                newVariant.profitMargin,
                                newVariant.discount
                              )}</span>
                            </div>
                          </div>
                        )}
                        
                        <Button onClick={addVariant} className="w-full">
                          Add Box Variant
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                </ScrollArea>
              ) : null}
              
              <DialogFooter>
                {selectedSetting ? (
                  <>
                    <Button variant="outline" onClick={() => setSelectedSetting(null)}>Back</Button>
                    {selectedSetting === 'pricing' ? (
                      <Button onClick={savePricingSettings}>Save Changes</Button>
                    ) : selectedSetting === 'inventory' ? (
                      <Button onClick={saveInventorySettings}>Save Changes</Button>
                    ) : selectedSetting === 'variants' ? (
                      <Button onClick={saveVariantSettings}>Save Changes</Button>
                    ) : (
                      <Button onClick={() => {
                        toast.success(`${selectedSetting.charAt(0).toUpperCase() + selectedSetting.slice(1)} settings updated`);
                        setShowSettingsDialog(false);
                        setSelectedSetting(null);
                      }}>Save Changes</Button>
                    )}
                  </>
                ) : (
                  <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>Close</Button>
                )}
              </DialogFooter>
         
            </DialogContent>
          </Dialog>

          {/* Add Box Option Dialog */}
          <Dialog open={showAddBoxDialog} onOpenChange={setShowAddBoxDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Box Packaging Option</DialogTitle>
                <DialogDescription>Create a new box packaging option with freebee item</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="box-name">Box Name</Label>
                    <Input id="box-name" placeholder="e.g. 24 Piece Box" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="piece-count">Number of Pieces</Label>
                    <Input id="piece-count" type="number" placeholder="24" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="box-price">Box Price</Label>
                    <Input id="box-price" type="number" placeholder="1999" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="box-stock">Initial Stock</Label>
                    <Input id="box-stock" type="number" placeholder="10" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="freebee">Freebee Item</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a freebee item" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="water-bottle">Water Bottle</SelectItem>
                      <SelectItem value="tote-bag">Tote Bag</SelectItem>
                      <SelectItem value="keychain">Keychain</SelectItem>
                      <SelectItem value="none">No Freebee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddBoxDialog(false)}>Cancel</Button>
                <Button onClick={() => {
                  toast.success("Box packaging option added successfully!");
                  setShowAddBoxDialog(false);
                }}>Add Box Option</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Combo Product Dialog */}
          <Dialog open={showAddComboProductDialog} onOpenChange={setShowAddComboProductDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Product to Combo</DialogTitle>
                <DialogDescription>Select a product to add to your combo bundle</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Product</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product-a">Product A</SelectItem>
                      <SelectItem value="product-b">Product B</SelectItem>
                      <SelectItem value="product-c">Product C</SelectItem>
                      <SelectItem value="product-d">Product D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" defaultValue="1" min="1" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount Percentage</Label>
                  <Input id="discount" type="number" defaultValue="10" min="0" max="100" />
                  <p className="text-sm text-muted-foreground">Discount applied to this product in the combo</p>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddComboProductDialog(false)}>Cancel</Button>
                <Button onClick={() => {
                  toast.success("Product added to combo successfully!");
                  setShowAddComboProductDialog(false);
                }}>Add to Combo</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Create Combo Dialog */}
          <Dialog open={showCreateComboDialog} onOpenChange={setShowCreateComboDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Product Combo</DialogTitle>
                <DialogDescription>Create a new product combo or bundle with special pricing</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="combo-name">Combo Name</Label>
                  <Input id="combo-name" placeholder="e.g. Summer Special Bundle" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="combo-price">Bundle Price</Label>
                    <Input id="combo-price" type="number" placeholder="1999" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="combo-stock">Initial Stock</Label>
                    <Input id="combo-stock" type="number" placeholder="10" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="combo-description">Description</Label>
                  <Textarea 
                    id="combo-description" 
                    placeholder="Describe this combo bundle" 
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="limited-time" />
                  <Label htmlFor="limited-time">Limited Time Offer</Label>
                </div>
                
                {/* Would include date picker for limited time offers */}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateComboDialog(false)}>Cancel</Button>
                <Button onClick={() => {
                  toast.success("New combo created successfully!");
                  setShowCreateComboDialog(false);
                }}>Create Combo</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Product;