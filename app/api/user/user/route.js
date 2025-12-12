import { NextResponse, NextRequest } from "next/server";
import { serverapi } from "@/config/axios.config";
import { getToken } from "next-auth/jwt";
import { jwtDecrypt } from "jose";

export async function POST(request, response) {
  const headers = request.headers;

  const authorizationHeader = headers.get("cookie");

  const token = authorizationHeader.split("=")[1];

  let reqBody = await request.json();

  if (reqBody.route === "getCurrentUser") {
    try {
      const { data } = await serverapi.get("/users/current-user", {
        headers: {
          Cookie: `${token}`,
        },
      });

      return NextResponse.json({
        status: "success",
        message: "request successfully",
        data: data,
      });
    } catch (e) {
      return NextResponse.json({
        status: "fail",
        message: e.response.data.msg,
      });
    }
  }


    // If no route is matched
    return NextResponse.json(
      {
        status: "fail",
        message: "Invalid route",
      },
      { status: 400 }
    );
}
