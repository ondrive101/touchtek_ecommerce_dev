"use client";

import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";
import { verifyUser } from "@/action/auth-action";

import DashTailLogo from "@/public/images/logo/logo-2.png";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const EmailVerified = ({handleConfirm, verified}) => {
 

  return (
    <div style={container}>
      <section>
        <div className="flex flex-col items-center pt-10">
          <Img src={DashTailLogo.src} alt="DashTail" className="w-[160px]" />
          <Text className="mt-8 text-xl font-medium text-slate-900 ">
            Your Email Has Been Verified
          </Text>
          <Text className="text-sm text-center my-0 text-slate-900">
            Congratulations! Your email address has been successfully verified.
            You can now enjoy all the features Coinexpay has to offer.
          </Text>
          <Button
            className="bg-violet-600 mb-10 mt-8 cursor-pointer"
            style={button}
            // href="/auth/login"
            onClick={handleConfirm}
          >
            {verified ? "Go to Login Page" : "Click to Verify"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default EmailVerified;

const container = {
  backgroundColor: "#fff",
  border: "1px solid #f0f0f0",
  borderRadius: "12px",
};

const button = {
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center",
  display: "block",
  width: "210px",
  padding: "12px 7px",
  marginLeft: "40px",
};
