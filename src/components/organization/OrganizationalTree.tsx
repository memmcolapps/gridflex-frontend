"use client";

import { Loader2 } from "lucide-react";
import { OrganizationNode } from "./OrganizationNode";
import { useOrg } from "@/hooks/use-org";

const OrganizationalTree = () => {
  const { nodes, isLoading, error } = useOrg();

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[rgba(22,28,202,1)]" />
        <span className="ml-2 text-gray-600">Loading organization tree...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {nodes.length > 0 ? (
        nodes.map((node) => <OrganizationNode key={node.id} node={node} />)
      ) : (
        <div className="text-center text-gray-500">
          No organization nodes found.
        </div>
      )}
    </div>
  );
};

export default OrganizationalTree;
