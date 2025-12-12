"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import UserDetails from "./forms/Details";
import { Label } from "@/components/ui/label";
import { Loader2, Heart } from "lucide-react";
import TableBodyPagination from "@/components/ui/custom/tableBodyPagination";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTableFacetedFilter } from "@/components/ui/faceted-filter";

import { Plus } from "lucide-react";
import { ModalComponent } from "@/components/ui/modalBox";
import { Button } from "@/components/ui/button";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import ViewProduct from "./modalContents/viewProduct";
import { deleteProduct_Inventory } from "@/action/superadmin/controller";
import AddItem from "./modalContents/add-item";
import AddBulkItems from "./modalContents/add-bulk-items";
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
import { paymentType,subCategory } from "@/lib/utils/constants";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

export function BasicDataTable({ productList, session }) {
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
      accessorKey: "category",
      header: ({ column }) => (
        <div className="text-center">
          <DataTableFacetedFilter
            column={column}
            title="Category"
            options={paymentType}
          />
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row?.original?.category}
          </div>
        );
      },
    },
    {
      accessorKey: "subCategory",
      header: ({ column }) => (
        <div className="text-center">
          <DataTableFacetedFilter
            column={column}
            title="Sub-Category"
            options={subCategory}
          />
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row?.original?.subCategory}
          </div>
        );
      },
    },
    {
      accessorKey: "product name",
      header: () => <div className="text-center">Product Name</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row?.original?.productName}
          </div>
        );
      },
    },
    {
      accessorKey: "SKU Code",
      header: <div className="text-center">SKU Code</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row?.original?.skucode}
          </div>
        );
      },
    },
    {
      accessorKey: "available stock",
      header: <div className="text-center">Stock</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row?.original?.main?.quantity||0}
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: <div className="text-center">Amount</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row?.original?.main?.amount||0}
          </div>
        );
      },
    },
    // {
    //   accessorKey: "createdAt",
    //   header: "Created Date",
    //   cell: ({ row }) => (
    //     <div className="lowercase whitespace-nowrap">
    //       {day(row.getValue("createdAt")).format("DD-MM-YYYY hh:mm A")}
    //     </div>
    //   ),
    // },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant="soft"
          color={
            (row.getValue("status") === "inactive" && "destructive") ||
            (row.getValue("status") === "active" && "success")
          }
          className=" capitalize"
        >
          {row.getValue("status")}
        </Badge>
      ),
    },

    {
      id: "actions",
      header: "Action",
      enableHiding: false,
      cell: ({ row }) => {
       
        return (
          <div className="flex gap-3  justify-end">
            <Link href={`./${row?.original?._id}`}>
              <Button
                size="icon"
                variant="soft"
                className="h-7 w-7"
                onClick={() => {
                  setClickedButton("view");
                  setShowModal(true);
                  setSelectedRow(row?.original);
                }}
              >
                <Icon icon="heroicons:eye" className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="icon"
              variant="soft"
              className=" h-7 w-7"
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

  const handleInputChange = (name, value, type) => {
    if (type === "select-one") {
      const selectedValue = value;

      if (name === "role") {
        setFormData({
          ...formData,
          role: selectedValue,
        });
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClose = () => {
    setShowModal(false);
    setClickedButton(null);
    setFormData({});
    setLoading(false);
    setSelectedRow(null);
  };

  const handleSubmit = async () => {
    console.log("called handlesubmit");
    if (clickedButton === "Delete") {
      try {
        setLoading(true);
        const response = await deleteProduct_Inventory(
          selectedRow._id,
          session
        );
        if (response.status === "success") {
          toast.success("Product deleted successfully", {
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
    data: productList,
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
          value={table.getColumn("email")?.getFilterValue() || ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm min-w-[200px] h-10"
        />
        <AddItem session={session}/>
        <AddBulkItems session={session}/>
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
