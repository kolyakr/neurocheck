import React from "react";
import { HistoryOverview } from "@/features/history";

const HistoryPage = () => {
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
