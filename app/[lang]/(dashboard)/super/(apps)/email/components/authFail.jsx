"use client";
import Image from "next/image";
import lightImage from "@/public/images/error/light-401.png";
import darkImage from "@/public/images/error/dark-401.png";
import { toast } from "react-hot-toast";
import {
  resetMailSetup,
  revalidateCurrentPath,
} from "@/action/email/controller";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useState } from "react";
const AuthFail = ({ session }) => {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handleResetMailSetup = async () => {
    try {
      setIsLoading(true);
      const response = await resetMailSetup(session);

      if (response.status === "success") {
        toast.success("Mail deleted successfully", {
          autoClose: 1000,
        });
        await revalidateCurrentPath(pathname);
      }
      if (response.status === "fail" || response.status === "error") {
        toast.error(response.message, {
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        autoClose: 1000,
      });
    }
  };
  return (
    <div className="min-h-screen  overflow-y-auto flex justify-center items-start p-10">
      <div className="w-full flex flex-col items-center">
        <div className="max-w-[542px]">
          <Image
            src={theme === "dark" ? darkImage : lightImage}
            alt="error image"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-16 text-center">
          <div className="text-2xl md:text-4xl lg:text-5xl font-semibold text-default-900">
            You are not Authorized
          </div>
          <div className="mt-3 text-default-600 text-sm md:text-base">
            You are missing the required rights to be able to access <br /> this
            page
          </div>
          {isLoading ? (
            <Button
              className="mt-9  md:min-w-[300px]"
              size="lg"
              disabled
            >
              Resetting Mail Setup...
            </Button>
          ) : (
            <Button
              className="mt-9  md:min-w-[300px]"
              size="lg"
              onClick={handleResetMailSetup}
            >
            Reset Mail Setup
          </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthFail;
