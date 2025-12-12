"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";

import { Label } from "@/components/ui/label";
import { Loader2, Heart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Plus } from "lucide-react";
import { ModalComponent } from "@/components/ui/modalBox";
import { Button } from "@/components/ui/button";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

export function BasicDataTable({ orders, session }) {
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
      accessorKey: "orderID",
      header: () => <div className="text-center">Order ID</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            #{row?.original?.oid}
          </div>
        );
      },
    },
    {
      accessorKey: "seller",
      header: <div className="text-center">Seller</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row?.original?.seller?.name}
          </div>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: <div className="text-center">Quantity</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row?.original?.quantity}
          </div>
        );
      },
    },
    {
      accessorKey: "unit",
      header: <div className="text-center">Unit</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row?.original?.unit}
          </div>
        );
      },
    },

    {
      accessorKey: "price",
      header: <div className="text-center">Price</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row?.original?.rate}
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
            {row?.original?.amountBT}
          </div>
        );
      },
    },


    {
      accessorKey: "createdAt",
      header: <div className="text-center">Created Date</div>,
      cell: ({ row }) => (
        <div className="lowercase whitespace-nowrap text-center">
          {day(row.getValue("createdAt")).format("DD-MM-YYYY hh:mm A")}
        </div>
      ),
    },
    {
      accessorKey: "orderStatus",
      header: <div className="text-center">Status</div>,
      cell: ({ row }) => (
        <div className="text-center items-center font-medium">
        <Badge
          variant="soft"
          color={
            (row?.original?.orderStatus === "in-progress" && "info") ||
            (row?.original?.orderStatus === "received" && "success")
          }
          className=" capitalize"
        >
          {row?.original?.orderStatus}
        </Badge>
        </div>
      ),
    },

  ];


  const table = useReactTable({
    data: orders,
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

      <div className="flex items-center flex-wrap gap-2  px-4">
        <Input
          placeholder="Filter orders..."
          className="max-w-sm min-w-[200px] h-10"
        />
    {/* column selection */}
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

      {/* table */}
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* //pagination */}

      <div className="flex items-center flex-wrap gap-4 px-4 py-4">
        <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="flex gap-2  items-center">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Rows per page
            </p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8"
          >
            <Icon
              icon="heroicons:chevron-left"
              className="w-5 h-5 rtl:rotate-180"
            />
          </Button>

          {table.getPageOptions().map((page, pageIdx) => (
            <Button
              key={`basic-data-table-${pageIdx}`}
              onClick={() => table.setPageIndex(pageIdx)}
              variant={`${
                pageIdx === table.getState().pagination.pageIndex
                  ? ""
                  : "outline"
              }`}
              className={cn("w-8 h-8")}
            >
              {page + 1}
            </Button>
          ))}

          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <Icon
              icon="heroicons:chevron-right"
              className="w-5 h-5 rtl:rotate-180"
            />
          </Button>
        </div>
      </div>
    </>
  );
}

export default BasicDataTable;
