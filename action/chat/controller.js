"use server";
import { revalidatePath } from "next/cache";
import { io } from "socket.io-client";
let socket;

export async function connectSocket() {
  if (!socket) {
    socket = io("http://localhost:5100/support", {
      withCredentials: true,
      query: {
        room: "support",
      },
    });

  }
  return socket;
}

export async function disconnectSocket() {
    if (socket) {
        socket.disconnect();
      }
}
