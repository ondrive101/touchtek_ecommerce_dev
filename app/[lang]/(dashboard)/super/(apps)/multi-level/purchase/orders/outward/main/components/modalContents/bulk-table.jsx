"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import TableBodyPagination from "@/components/ui/custom/tableBodyPagination";

export function BasicDataTable({ list}) {
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
      accessorKey: "name",
      header: () => <div className="text-center">Name</div>,
      cell: ({ row }) => {
       console.log(row)
        return (
          <div className="text-center font-medium">{row?.original?.name}</div>
        );
      },
    },
    {
        accessorKey: "supplierId",
        header: () => <div className="text-center">ID</div>,
        cell: ({ row }) => {
         console.log(row)
          return (
            <div className="text-center font-medium">{row?.original?.supplierId}</div>
          );
        },
      },
    {
        accessorKey: "gender",
        header: () => <div className="text-center">Gender</div>,
        cell: ({ row }) => {
         console.log(row)
          return (
            <div className="text-center font-medium">{row?.original?.gender}</div>
          );
        },
      },
   
    {
      accessorKey: "contactNumber",
      header: () => <div className="text-center">Contact Number</div>,
      cell: ({ row }) => {
       console.log(row)
        return (
          <div className="text-center font-medium">{row?.original?.contactNumber}</div>
        );
      },
    },
  ];


  const table = useReactTable({
    data: list,
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
      <div>
      <TableBodyPagination table={table} columns={columns}/>
      </div>
  </>
  );
}

export default BasicDataTable;
