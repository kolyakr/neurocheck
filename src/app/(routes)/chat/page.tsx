import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth";
import { redirect } from "next/navigation";

const ChatPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/chat");
  }

  return <div>ChatPage</div>;
};

export default ChatPage;
