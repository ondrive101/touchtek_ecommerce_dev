"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Checkbox } from "@/components/ui/checkbox";
import { SiteLogo,TouchtekLogo } from "@/components/svg";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useRouter } from "next/navigation";
import { getSession, signIn} from "next-auth/react";


const schema = z.object({
  email: z.union([
    z.string().email({ message: "Invalid email format." }),
    z.string().regex(/^[A-Za-z0-9]+$/, {
      message: "Invalid format. Must be a valid email or alphanumeric employee code.",
    }),
  ]),
  password: z.string().min(4),
});
const LogInForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = React.useState("password");
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");

  const router = useRouter();


  const togglePasswordType = () => {
    if (passwordType === "text") {
      setPasswordType("password");
    } else if (passwordType === "password") {
      setPasswordType("text");
    }
  };


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
  });
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  

  const onSubmit = (data) => {
    startTransition(async () => {
      let response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (response?.error) {
        toast.error(response.error);
      } else {
        
        // Wait for the session to be updated
        const session = await getSession();

    
        if (
          (session !== null || session !== undefined) &&
          session?.user.department === "admin" && session?.user?.team === "admin"
        ) {
          // If login is successful, display success message
          toast.success("Login Successful");
          window.location.assign("/super/kanban");
          reset();
        } else if (
          (session !== null || session !== undefined) &&
          session?.user.department === "crm"
        ) {
          toast.success("Login Successful");
          window.location.assign("/crm/dashboard");
          reset();
        }else if (
          (session !== null || session !== undefined) &&
          session?.user.department === "employee"
        ) {
          toast.success("Login Successful");
          window.location.assign("/employee/kanban");
          reset();
        } else if (
          (session !== null || session !== undefined) &&
          session?.user.department === "purchase"
        ) {
          toast.success("Login Successful");
          window.location.assign("/purchase/dashboard");
          reset();
        } else if (
          (session !== null || session !== undefined) &&
          session?.user.department === "account"
        ) {
          toast.success("Login Successful");
          window.location.assign("/accounts/dashboard");
          reset();
        } else {
          toast.error("You are not authorized to login");
        }
       
      }
    });
  };
  return (
    <div className="w-full ">
      <Link href="/dashboard" className="inline-block">
        {/* <TouchtekLogo className="h-20 w-40 2xl:w-40 2xl:h-16 text-primary" /> */}
      </Link>
      <div className="2xl:mt-1 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
        {/* Hello Touchtek */}
      </div>
      <div className="2xl:text-lg text-base text-default-600 mt-2 leading-6">
        Enter the information you entered while registering.
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="2xl:mt-7 mt-8">
        <div className="relative">
          <Input
            removeWrapper
            type="text"
            id="email"
            size={!isDesktop2xl ? "xl" : "lg"}
            placeholder=" "
            disabled={isPending}
            {...register("email")}
            className={cn("peer", {
              "border-destructive": errors.email,
            })}
          />
          <Label
            htmlFor="email"
            className={cn(
              " absolute text-base text-default-600  rounded-t duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0]   bg-background  px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75  peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1",
              {
                " text-sm ": isDesktop2xl,
              }
            )}
          >
            Email
          </Label>
        </div>
        {errors.email && (
          <div className=" text-destructive mt-2">{errors.email.message}</div>
        )}

        <div className="relative mt-6">
          <Input
            removeWrapper
            type={passwordType === "password" ? "password" : "text"}
            id="password"
            size={!isDesktop2xl ? "xl" : "lg"}
            placeholder=" "
            disabled={isPending}
            {...register("password")}
            className={cn("peer", {
              "border-destructive": errors.password,
            })}
          />
          <Label
            htmlFor="password"
            className={cn(
              " absolute text-base  rounded-t text-default-600  duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0]   bg-background  px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75  peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1",
              {
                " text-sm ": isDesktop2xl,
              }
            )}
          >
            Password
          </Label>
          <div
            className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
            onClick={togglePasswordType}
          >
            {passwordType === "password" ? (
              <Icon icon="heroicons:eye" className="w-4 h-4 text-default-400" />
            ) : (
              <Icon
                icon="heroicons:eye-slash"
                className="w-4 h-4 text-default-400"
              />
            )}
          </div>
        </div>
        {errors.password && (
          <div className=" text-destructive mt-2">
            {errors.password.message}
          </div>
        )}

        <div className="mt-5  mb-6 flex flex-wrap gap-2">
          <div className="flex-1 flex  items-center gap-1.5 ">
            <Checkbox
              size="sm"
              className="border-default-300 mt-[1px]"
              id="isRemebered"
            />
            <Label
              htmlFor="isRemebered"
              className="text-sm text-default-600 cursor-pointer whitespace-nowrap"
            >
              Remember me
            </Label>
          </div>
          <Link href="#" className="flex-none text-sm text-primary">
            Forget Password?
          </Link>
        </div>
        <Button
          className="w-full"
          disabled={isPending}
          size={!isDesktop2xl ? "lg" : "md"}
        >
          {isPending && (
            <Loader2 className="ltr:mr-2 rtl:ml-2 h-4 w-4 animate-spin" />
          )}
          {isPending ? "Loading..." : "Sign In"}
        </Button>
      </form>
      <div className="mt-6 text-center text-base text-default-600">
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-primary">
          Sign Up{" "} 
        </Link>
      </div>
    </div>
  );
};

export default LogInForm;
