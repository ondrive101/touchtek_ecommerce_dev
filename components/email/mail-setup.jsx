import React, { useTransition, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";

import {
  createMailSetup,
  revalidateCurrentPath,
} from "@/action/email/controller";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus, Send } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const MailSetup = ({ pathname, session }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmitSetup = async (values) => {
    try {
      setIsLoading(true);
      // validate fields
      if (!values.email || !values.password) {
        toast.error("Please fill all fields", {
          autoClose: 1000,
        });
        setIsLoading(false);
        return;
      }
      // Prepare the task data
      const payload = {
        ...values,
      };

      // Call the API to create or update task
      const response = await createMailSetup(payload, session);

      if (response.status === "success") {
        // Show success message
        toast.success("Mail Setup Successfully");

        // reset fields
        form.reset();

        // Revalidate the path to refresh the data
        await revalidateCurrentPath(pathname);
        setIsLoading(false);
        setIsDialogOpen(false);
      }
      if (response.status === "fail" || response.status === "error") {
        toast.error(response.message, {
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Something went wrong", {
        duration: 3000,
      });
    }
  };
  return (
    <>
      <div className="p-10 text-center max-w-md mx-auto app-height">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 rounded-full p-6">
            <img
              alt="Illustration of an empty shopping bag"
              className="w-16 h-16"
              src="https://storage.googleapis.com/a1aa/image/xCd_DojMKbtR-IFTcEC1b5lwmS9id2hw7vPmK13FZCg.jpg"
              width="64"
              height="64"
            />
          </div>
        </div>
        <h1 className="text-xl font-semibold mb-2">No Setup Email?</h1>
        <p className="text-gray-500 mb-6">
          {" "}
          Setup Email to send emails to your customers.
        </p>
        <div className="flex justify-center">
          <Button
            size="md"
            className="rounded-xl text-default-200 font-medium"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2 " />
            Setup Email
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Email Setup</DialogTitle>
                <DialogDescription>
                  Configure your email settings to send emails
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={form.handleSubmit(handleSubmitSetup)}
                className="space-y-4"
              >
                <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      placeholder="your-email@example.com"
                      {...form.register("email")}
                      className={cn(
                        form.formState.errors.email && "border-red-500"
                      )}
                    />
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.email?.message || ""}
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium mb-1"
                    >
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...form.register("password")}
                      className={cn(
                        form.formState.errors.password && "border-red-500"
                      )}
                    />
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.password?.message || ""}
                    </p>
                  </div>

                  {/* <div>
                    <label
                      htmlFor="smtpServer"
                      className="block text-sm font-medium mb-1"
                    >
                      SMTP Server
                    </label>
                    <Input
                      id="smtpServer"
                      placeholder="mail.touchtek.in"
                      disabled
                      className={cn(
                        form.formState.errors.smtpServer && "border-red-500"
                      )}
                    />
                    <p className="text-xs mt-1 text-muted-foreground">
                      Default SMTP server for TouchTek
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="port"
                        className="block text-sm font-medium mb-1"
                      >
                        Port
                      </label>
                      <Input
                        id="port"
                        placeholder="587"
                        disabled
                        className={cn(
                          form.formState.errors.port && "border-red-500"
                        )}
                      />
                      <p className="text-xs mt-1 text-muted-foreground">
                        Default port for SMTP server
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="encryption"
                        className="block text-sm font-medium mb-1"
                      >
                        Encryption
                      </label>
                      <Select disabled defaultValue="tls">
                        <SelectTrigger>
                          <SelectValue placeholder="Select encryption" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="ssl">SSL</SelectItem>
                          <SelectItem value="tls">TLS</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs mt-1 text-muted-foreground">
                        TLS encryption is used
                      </p>
                    </div>
                  </div> */}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Configuration"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default MailSetup;
