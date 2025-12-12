"use client";
import React, { useState } from "react";
import { ArrowUpDown, ChevronDown} from "lucide-react";
import toast from "react-hot-toast";
import TableBodyPagination from "@/components/ui/custom/tableBodyPagination";

import AddEmployee from "./modalContents/add-employee";
import AddEmployeeBulk from "./modalContents/add-employee-bulk";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
import { deleteEmployee } from "@/action/superadmin/controller";
import day from "dayjs";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";


export function BasicDataTable({ list, session }) {
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
      accessorKey: "empCode",
      header: () => <div className="text-center">#</div>,
      cell: ({ row }) => {
       
        return (
          <div className="text-center font-medium">{row?.original?.empCode}</div>
        );
      },
    },
    {
      accessorKey: "employeeCode",
      header: () => <div className="text-center">Emp ID</div>,
      cell: ({ row }) => {
       
        return (
          <div className="text-center font-medium">{row?.original?.employeeCode}</div>
        );
      },
    },
    {
      accessorKey: "username",
      header: "Name",
      cell: ({ row }) => (
        <div className="  font-medium  text-card-foreground/80">
          <div className="flex space-x-3  rtl:space-x-reverse items-center">
            <span className="capitalize whitespace-nowrap">
              {row?.original?.name}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="whitespace-nowrap">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => (
        <div className="  font-medium  text-card-foreground/80">
          <div className="flex space-x-3  rtl:space-x-reverse items-center">
            <span className="capitalize whitespace-nowrap">
              {row?.original?.department}
            </span>
          </div>
        </div>
      ),
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
            
              <Button
                size="icon"
                variant="soft"
                className=" h-7 w-7"
                color="info"
                onClick={() => {
                  setClickedButton("edit");
                  // setShowModal(true);
                  setSelectedRow(row?.original);
                }}
              >
                <Icon icon="heroicons:pencil" className="h-4 w-4" />
              </Button>
      
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
        const response = await deleteEmployee(
          selectedRow._id,
          session
        );
        if (response.status === "success") {
          toast.success("Employee deleted successfully", {
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
    if (clickedButton === "edit") {
      try {
        console.log('edit called')
        // setLoading(true);
        // const response = await editUserAction_SuperAdmin(selectedRow._id,formData, session);
        // if (response.status === "success") {
        //   toast.success("User updated successfully", {
        //     autoClose: 1000,
        //   });
        //   handleClose();
        // }
        // if (response.status === "fail") {
        //   toast.error(response.message, {
        //     autoClose: 1000,
        //   });
        //   setLoading(false);
        // }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.msg, {
          autoClose: 1000,
        });
      }
    }
  };

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
        <AddEmployee session={session} />
        <AddEmployeeBulk session={session} />
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
