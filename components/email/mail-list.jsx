"use client";
import React from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@iconify/react";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";

import { deleteMail } from "@/action/email/controller";
import { toast } from "react-hot-toast";
import { revalidateCurrentPath } from "next/cache";
import { usePathname } from "next/navigation";
export function MailList({ mail, handleSelectedMail, session, pathname }) {
  const [isChecked, setIsChecked] = React.useState(false);
  const { id, name, label, text, starred } = mail;
  const [open, setOpen] = React.useState(false);

  const handleDeleteMail = async () => {
    try {
      // const response = await deleteMail(id, session);
      toast.success("Mail deleted successfully", {
        autoClose: 1000,
      });

      // if (response.status === "success") {
      //   toast.success("Mail deleted successfully", {
      //     autoClose: 1000,
      //   });
      //   // await revalidateCurrentPath(pathname);
      // }
      // if (response.status === "fail" || response.status === "error") {
      //   toast.error(response.message, {
      //     autoClose: 1000,
      //   });
      // }
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        autoClose: 1000,
      });
    }
  };

  return (
    <>
      <DeleteConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => handleDeleteMail(id)}
      />
      <div
        className={cn(
          "flex items-center py-5 px-6  border-b border-default-100 hover:bg-primary/10  cursor-pointer group relative",
          {
            "bg-primary/10 hover:bg-primary/10": isChecked,
          }
        )}
        onClick={() => handleSelectedMail(id)}
      >
        <Checkbox
          className="border-default-300 p-0 ltr:mr-6 rtl:ml-6"
          onClick={(e) => {
            e.stopPropagation();
            setIsChecked(!isChecked);
          }}
        />

        <div
          className="ltr:mr-6 rtl:ml-6"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {starred ? (
            <Icon
              icon="heroicons:star-16-solid"
              className="w-4 h-4 text-yellow-400"
            />
          ) : (
            <Icon icon="heroicons:star" className="w-4 h-4 text-default-600" />
          )}
        </div>
        <div className="text-sm text-default-600 mr-4 min-w-max capitalize font-semibold">
          {name}
        </div>
        <div className="flex-1 flex-shrink overflow-hidden min-w-[100px] mr-7">
          <p className="truncate text-sm text-default-600">{text}</p>
        </div>
        <div
          className={cn(
            "h-2 w-2 rounded-full bg-default-300 ltr:mr-1.5 rtl:ml-1.5",
            {
              "bg-success": label === "private",
              "bg-primary": label === "work",
              "bg-destructive": label === "company",
              "bg-yellow-500": label === "private",
            }
          )}
        ></div>
        <div className="text-sm text-default-600 whitespace-nowrap">
          {formatDistanceToNow(new Date(mail.date), {
            addSuffix: true,
          })}
        </div>
        <div className="hidden absolute top-0 ltr:right-0 rtl:left-0 h-full w-fit px-5 bg-background   z-10 md:group-hover:flex items-center">
          <Button
            size="icon"
            className="bg-transparent hover:bg-transparent  hover:bg-default-50 rounded-full"
          >
            <Icon
              icon="heroicons:archive-box-arrow-down"
              className="w-5 h-5 text-default-600"
            />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            size="icon"
            className="bg-transparent hover:bg-transparent  hover:bg-default-50 rounded-full"
          >
            <Icon icon="heroicons:trash" className="w-5 h-5 text-default-600" />
          </Button>
        </div>
      </div>
    </>
  );
}
