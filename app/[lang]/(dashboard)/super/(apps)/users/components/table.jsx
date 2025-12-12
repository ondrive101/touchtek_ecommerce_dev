"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import UserDetails from "./forms/UserDetails";
import { Label } from "@/components/ui/label";
import { Loader2, Heart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TeamViewModel from "./modalContents/team-view-model";
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
import {
  createUserAction_SuperAdmin,
  deleteUserAction_SuperAdmin,
  editUserAction_SuperAdmin,
} from "@/action/superadmin/users-action";
import { createDepartment } from "@/action/superadmin/controller";
export function BasicDataTable({session,departmentList,employeeList }) {
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
        return (
          <div className="text-center font-medium">{row?.original?.series}</div>
        );
      },
    },
    {
      accessorKey: "id",
      header: () => <div className="text-left">ID</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">{row?.original?.code}</div>
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
      accessorKey: "users",
      header: () => <div className="text-center">Users</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">{row?.original?.teams?.length}</div>
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
         
              <TeamViewModel
                session={session}
                department={row?.original}
                employeeList={employeeList}
              />
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
    if (clickedButton === "add-user") {
      // //check all field must present and not empty
      if (
        formData.name === undefined ||
        formData.name === "" ||
        formData.email === undefined ||
        formData.email === "" ||
        formData.password === undefined ||
        formData.password === "" ||
        formData.role === undefined ||
        formData.role === ""
      ) {
        toast.error("All fields are required", {
          autoClose: 1000,
        });
        return;
      }

      try {
        setLoading(true);
        const response = await createUserAction_SuperAdmin(formData, session);
        if (response.status === "success") {
          toast.success("User created successfully", {
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

    if (clickedButton === "add-department") {
      // //check all field must present and not empty
      if (
        formData.name === undefined) {
        toast.error("Please select department", {
          autoClose: 1000,
        });
        return;
      }

      try {
        setLoading(true);
        const response = await createDepartment(formData, session);
        if (response.status === "success") {
          toast.success("Department created successfully", {
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
    if (clickedButton === "Delete") {
      try {
        setLoading(true);
        const response = await deleteUserAction_SuperAdmin(
          selectedRow._id,
          session
        );
        if (response.status === "success") {
          toast.success("User deleted successfully", {
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
        setLoading(true);
        const response = await editUserAction_SuperAdmin(selectedRow._id,formData, session);
        if (response.status === "success") {
          toast.success("User updated successfully", {
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
    data: departmentList,
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
        {/* <Button
          onClick={async () => {
            setClickedButton("add-user");
            setShowModal(true);
          }}
          className="whitespace-nowrap"
        >
          <Plus className="w-4 h-4  ltr:mr-2 rtl:ml-2 " />
          Create User
        </Button> */}
        <Button
          onClick={async () => {
            setClickedButton("add-department");
            setShowModal(true);
          }}
          className="whitespace-nowrap"
        >
          <Plus className="w-4 h-4  ltr:mr-2 rtl:ml-2 " />
          Add Department
        </Button>
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

      <div className="flex items-center flex-wrap gap-4 px-4 py-4">
        <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="flex gap-2  items-center">
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
      {/* //modal */}
      {clickedButton !== "Delete" && (
        <ModalComponent
          showModal={showModal}
          handleClose={handleClose}
          handleOk={handleClose}
          title={clickedButton === "add-user" ? "Add User" :clickedButton === "edit" ? "Edit User" :clickedButton === "add-department" ? "Add Department" : null}
          size="sm"
          bottom="false"
          message={
            clickedButton === "add-user" ? (
              <>
                <form>
                  <UserDetails
                    handleInputChange={handleInputChange}
                    name="name"
                    description=""
                    lable="Name"
                    type="text"
                  />
                  <UserDetails
                    handleInputChange={handleInputChange}
                    name="email"
                    description=""
                    lable="Email Address"
                    type="email"
                  />
                  <UserDetails
                    handleInputChange={handleInputChange}
                    name="password"
                    description=""
                    lable="Password"
                    type="password"
                  />

                  <div className="mt-6">
                    <Label htmlFor="type" className="mb-3">
                      Role
                    </Label>
                    <Select
                      onValueChange={(data) =>
                        handleInputChange("role", data, "select-one")
                      }
                      id="type"
                      name="type"
                      placeholder="Select State"
                      className="w-full"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent className="z-[1001]">
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="inventory">Inventory</SelectItem>
                        <SelectItem value="crm">CRM</SelectItem>
                        <SelectItem value="account">Account</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="purchase">Purchase</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* bottom button */}
                  <div className="mt-12 flex gap-6">
                    <Button
                      color="warning"
                      variant="soft"
                      className="flex-1"
                      onClick={() => {
                        handleClose();
                      }}
                    >
                      Cancel
                    </Button>

                    {loading ? (
                      <Button type="button" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please Wait...
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        disabled={isPending}
                        onClick={handleSubmit}
                        className="flex-1"
                      >
                        Create User
                      </Button>
                    )}
                  </div>
                </form>
              </>
            ) :clickedButton === "add-department" ? (
              <>
                <form>
                  <div className="mt-6">
                    <Label htmlFor="type" className="mb-3">
                      Department:
                    </Label>
                    <Select
                      onValueChange={(data) =>
                        handleInputChange("name", data, "select-one")
                      }
                      id="type"
                      name="type"
                      placeholder="Select Department"
                      className="w-full"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent className="z-[1001]">
                        <SelectItem value="admin">Admin</SelectItem>
                        {/* <SelectItem value="inventory">Inventory</SelectItem>
                        <SelectItem value="crm">CRM</SelectItem> */}
                        <SelectItem value="employee">Employee</SelectItem>
                        {/* <SelectItem value="account">Account</SelectItem>
                        <SelectItem value="purchase">Purchase</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem> */}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* bottom button */}
                  <div className="mt-12 flex gap-6">
                    <Button
                      color="warning"
                      variant="soft"
                      className="flex-1"
                      onClick={() => {
                        handleClose();
                      }}
                    >
                      Cancel
                    </Button>

                    {loading ? (
                      <Button type="button" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please Wait...
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        disabled={isPending}
                        onClick={handleSubmit}
                        className="flex-1"
                      >
                        Create User
                      </Button>
                    )}
                  </div>
                </form>
              </>
            ) :clickedButton === "edit" ? (
              <>
                <form>
                  <UserDetails
                    handleInputChange={handleInputChange}
                    name="name"
                    description=""
                    lable="Name"
                    type="text"
                  />
                  <UserDetails
                    handleInputChange={handleInputChange}
                    name="email"
                    description=""
                    lable="Email Address"
                    type="email"
                  />
                  <UserDetails
                    handleInputChange={handleInputChange}
                    name="password"
                    description=""
                    lable="Password"
                    type="password"
                  />

                  <div className="mt-6">
                    <Label htmlFor="type" className="mb-3">
                      Role
                    </Label>
                    <Select
                      onValueChange={(data) =>
                        handleInputChange("role", data, "select-one")
                      }
                      id="type"
                      name="type"
                      placeholder="Select Role"
                      className="w-full"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent className="z-[1001]">
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="inventory">Inventory</SelectItem>
                        <SelectItem value="crm">CRM</SelectItem>
                        <SelectItem value="account">Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-6">
                    <Label htmlFor="type" className="mb-3">
                      Status
                    </Label>
                    <Select
                      onValueChange={(data) =>
                        handleInputChange("status", data, "select-one")
                      }
                      id="type"
                      name="status"
                      placeholder="Select Status"
                      className="w-full"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent className="z-[1001]">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* bottom button */}
                  <div className="mt-12 flex gap-6">
                    <Button
                      color="warning"
                      variant="soft"
                      className="flex-1"
                      onClick={() => {
                        handleClose();
                      }}
                    >
                      Cancel
                    </Button>

                    {loading ? (
                      <Button type="button" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please Wait...
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        disabled={isPending}
                        onClick={handleSubmit}
                        className="flex-1"
                      >
                        {clickedButton === "add-user" ? "Create User" :clickedButton === "edit" ? "Edit User" :null}
                      </Button>
                    )}
                  </div>
                </form>
              </>
            ) : null
          }
        />
      )}
    </>
  );
}

export default BasicDataTable;
