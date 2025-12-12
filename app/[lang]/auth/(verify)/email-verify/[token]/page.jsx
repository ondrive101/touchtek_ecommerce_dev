"use client";

import Image from "next/image";
import auth3Light from "@/public/images/auth/auth3-light.png";
import auth3Dark from "@/public/images/auth/auth3-dark.png";
import EmailVerified from "./verify-email";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { verifyUser } from "@/action/auth-action";

const VerifyPage = () => {
  const { token } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  const fetchData = async () => {
    try {
      if (loading) {
        const response = await verifyUser(token);

        if (response?.status === "success") {
          toast.success(response?.message);
          router.push("/auth/login");
        } else {
          toast.error(response?.message);
        }
      }
    } catch (error) {
      toast.error("Error verifying your email. Please try again.");
      console.error("Error verifying email:", error?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (verified) {
      router.replace("/auth/login");
      return;
    }

    await fetchData();
    setVerified(true);
  };

  // useEffect(() => {
  //   if (!token || !loading) return; // Ensure loading is true and token exists

  //   fetchData();
  // }, [token, loading]);

  return (
    <div className="loginwrapper  flex justify-center items-center relative overflow-hidden">
      <Image
        src={auth3Dark}
        alt="background image"
        className="absolute top-0 left-0 w-full h-full light:hidden"
      />
      <Image
        src={auth3Light}
        alt="background image"
        className="absolute top-0 left-0 w-full h-full dark:hidden"
      />
      <div className="w-full bg-card py-5 max-w-xl  rounded-xl relative z-10 2xl:p-6 xl:p-12 p-6 m-4 ">
        <EmailVerified handleConfirm={handleConfirm} verified={verified} />
      </div>
    </div>
  );
};

export default VerifyPage;
