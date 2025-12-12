import { NextResponse } from "next/server";



export async function authMiddleware(request) {
  try {
    // ...code
    console.log('called')
 

  } catch (error) {
    // Handle authentication error (JWT validation failure or other errors)
    return NextResponse.json({
      message: "authentication invalid",
    }, { status: 401 });
  }
}
