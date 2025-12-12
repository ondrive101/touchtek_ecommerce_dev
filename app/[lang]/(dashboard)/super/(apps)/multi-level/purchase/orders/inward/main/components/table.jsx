"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import TableBodyPagination from "@/components/ui/custom/tableBodyPagination";
import ConfirmOrderModal from "./modalContents/confirmOrder";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "react-hot-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarGroup,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { deletePurchaseOrder } from "@/action/purchase/controller";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import day from "dayjs";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";

export function BasicDataTable({
  ordersList,
  session,
  supplierList,
  productList,
}) {
  console.log("data", ordersList);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showModal, setShowModal] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const [formData, setFormData] = useState({});
  const [clickedButton, setClickedButton] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    {
      accessorKey: "series",
      header: () => <div className="text-center">#</div>,
      cell: ({ row }) => {
        console.log(row);
        return (
          <div className="text-center font-medium">
            {row?.original?.orderSeries}
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      header: () => <div className="text-center">ID</div>,
      cell: ({ row }) => {
        console.log(row);
        return (
          <div className="text-center font-medium">
            {row?.original?.orderCode}
          </div>
        );
      },
    },
    {
      accessorKey: "supplier",
      header: "Supplier",
      cell: ({ row }) => (
        <div className="  font-medium  text-card-foreground/80">
          <div className="flex space-x-3  rtl:space-x-reverse items-center">
            <span className="capitalize whitespace-nowrap">
              {row?.original?.data?.supplier?.name}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => (
        <div className="flex-1">
          {row?.original?.data?.items?.length > 0 && (
            <div>
              <AvatarGroup
                max={3}
                total={row?.original?.data?.items?.length}
                countClass="h-7 w-7"
              >
                {row?.original?.data?.items?.map((item, index) => (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar
                          className="ring-1 ring-background ring-offset-[2px]  ring-offset-background h-7 w-7 "
                          key={`assign-member-${index}`}
                        >
                          <AvatarImage src={item?.image?.src} />
                          <AvatarFallback>
                            {item?.productName?.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      {/* make it content more beautifull */}
                      <TooltipContent>
                        <div className="flex flex-col gap-2">
                          <p>Code: {item?.skucode}</p>
                          <p>Product: {item?.productName}</p>
                          <p>Quantity: {item?.quantity}</p>
                          <p>Rate: {item?.ratePerUnit}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </AvatarGroup>
            </div>
          )}
        </div>
      ),
    },

    {
      accessorKey: "amount",
      header: () => <div className="text-center">Amount</div>,
      cell: ({ row }) => {
        console.log(row);
        return (
          <div className="text-center font-medium">
            {row?.original?.data?.financialSummary?.grandTotal}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }) => (
        <div className="lowercase whitespace-nowrap">
          {day(row.getValue("createdAt")).format("DD-MM-YYYY hh:mm A")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          
          <Badge
            variant="soft"
            color={
              (row.getValue("status") === "in-progress" && "destructive") ||
              (row.getValue("status") === "partial" && "info") ||
              (row.getValue("status") === "completed" && "success")
            }
            className=" capitalize"
          >
            {row.getValue("status")}
          </Badge>
        );
      },
    },

    {
      id: "actions",
      header: "Action",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex gap-3  justify-end">
            <ConfirmOrderModal
              session={session}
              supplierList={supplierList}
              productList={productList}
              order={row?.original}
            />
            <Button
              size="icon"
              variant="soft"
              className=" h-7 w-7"
              color="destructive"
              onClick={() => {
                setClickedButton("Delete");
                setShowModal(true);
                setSelectedRow(row?.original);
              }}
            >
              <Icon icon="heroicons:trash" className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleClose = () => {
    setShowModal(false);
    setClickedButton(null);
    setFormData({});
    setLoading(false);
    setSelectedRow(null);
  };

  const handleSubmit = async () => {
    if (clickedButton === "Delete") {
      try {
        setLoading(true);
        const response = await deletePurchaseOrder(selectedRow._id, session);
        if (response.status === "success") {
          toast.success("Purchase order deleted successfully", {
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
        toast.error(error.response.data.msg, {
          autoClose: 1000,
        });
      }
    }
  };

  const table = useReactTable({
    data: ordersList,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      {clickedButton === "Delete" && (
        <DeleteConfirmationDialog
          open={showModal}
          onClose={() => handleClose()}
          onConfirm={() => handleSubmit()}
          defaultToast={false}
        />
      )}
      <div className="flex items-center flex-wrap gap-2  px-4">
        <Input
          placeholder="Filter emails..."
          className="max-w-sm min-w-[200px] h-10"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <TableBodyPagination table={table} columns={columns} />
    </>
  );
}

export default BasicDataTable;
