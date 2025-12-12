import { NextResponse } from "next/server";
import { serverapi } from "@/config/axios.config";
import avatar3 from "@/public/images/avatar/avatar-3.jpg";
export async function POST(request, response) {
  try {
    let reqBody = await request.json();
    
    const server_response = await serverapi.post(`/auth/register/auth/verify/${reqBody.token}`);

    console.log(server_response)

    return NextResponse.json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (e) {
    return NextResponse.json({
      status: "fail",
      message: e.response.data.msg,
    });
  }
}