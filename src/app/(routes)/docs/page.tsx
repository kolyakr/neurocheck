import React from "react";
import { DocsSidebar, DocsContent } from "@/features/docs";

export default function DocsPage() {
  return (
    <div className="flex gap-6">
      <DocsSidebar />
      <div className="flex-1">
        <DocsContent />
      </div>
    </div>
  );
}
