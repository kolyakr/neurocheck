import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth";
import { redirect } from "next/navigation";
import { HistoryOverview } from "@/features/history";

const HistoryPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/history");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Diagnosis History</h1>
        <p className="text-muted-foreground">
          Track your symptoms and monitor patterns over time
        </p>
      </div>
      <HistoryOverview />
    </div>
  );
};

export default HistoryPage;
