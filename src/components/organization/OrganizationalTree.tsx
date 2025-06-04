"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchOrganizationNodes,
  type Node,
} from "../../service/organaization-service";
import { OrganizationNode } from "./OrganizationNode";

const OrganizationalTree = () => {
  const [organizationNodes, setOrganizationNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrganizationNodes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const nodes = await fetchOrganizationNodes();
      setOrganizationNodes(nodes);
    } catch (err) {
      console.error("Error fetching organization nodes:", err);
      setError("Failed to fetch organization nodes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrganizationNodes();
  }, [loadOrganizationNodes]);

  // Callback to trigger a re-fetch of the tree when a node is added/updated
  const handleTreeUpdate = useCallback(() => {
    loadOrganizationNodes();
  }, [loadOrganizationNodes]);

  if (loading) {
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
        <p>{error}</p>
        <Button onClick={loadOrganizationNodes} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {organizationNodes.length > 0 ? (
        organizationNodes.map((node) => (
          <OrganizationNode
            key={node.id}
            node={node}
            onNodeUpdated={handleTreeUpdate}
            onNodeAdded={handleTreeUpdate}
          />
        ))
      ) : (
        <div className="text-center text-gray-500">
          No organization nodes found.
        </div>
      )}
    </div>
  );
};

export default OrganizationalTree;
