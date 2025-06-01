"use client";

import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Plus,
  Building,
  Wrench,
  Database,
  Zap,
  Plug,
  Grid2X2,
} from "lucide-react";
import { toast } from "sonner";
import type { Node } from "../../service/organaization-service"; // Adjust path
import { AddNodeDialog } from "./dialogs/AddNodeDialog";
import { EditNodeDialog } from "./dialogs/EditNodeDialog";
import { mapNodeInfoToFormData, renderNodeIcon } from "./utils/nodeUtils";
import type { FormData } from "./hooks/useNodeFormValidation";

interface OrganizationNodeProps {
  node: Node; // Expect a Node object from the API
  level?: number;
  onNodeUpdated: () => void; // Callback to notify parent about updates
  onNodeAdded: () => void; // Callback to notify parent about new nodes
}

export const OrganizationNode = ({
  node,
  level = 0,
  onNodeUpdated,
  onNodeAdded,
}: OrganizationNodeProps) => {
  const [children, setChildren] = useState<Node[]>(node.nodesTree ?? []);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedNodeType, setSelectedNodeType] = useState("");
  const [nodeDataForEdit, setNodeDataForEdit] = useState<FormData>(
    mapNodeInfoToFormData(node.nodeInfo),
  );

  // Update internal state when the 'node' prop changes
  useEffect(() => {
    setChildren(node.nodesTree ?? []);
    setNodeDataForEdit(mapNodeInfoToFormData(node.nodeInfo));
  }, [node]);

  const handleAddNode = (data: {
    name: string;
    nodeType: string;
    data: FormData;
  }) => {
    setIsExpanded(true); // Automatically expand the parent when a new child is added
    toast.success(`Successfully added "${data.name}" as a ${data.nodeType}`);
    onNodeAdded(); // Notify the parent to potentially re-fetch or update its state
  };

  const handleEditNode = (data: FormData) => {
    // THIS IS A SIMULATION.
    // In a real application, you would make an API call here
    // to update the node on the backend.
    // After a successful API call, you would likely:
    // 1. Re-fetch the entire tree or
    // 2. Update the local state (nodeDataForEdit) and then call onNodeUpdated.
    // For this example, we'll update local state and notify parent.

    setNodeDataForEdit(data); // Update the local state for the edit dialog
    toast.success(`Successfully updated "${data.name}"`);
    onNodeUpdated(); // Notify the parent to potentially re-fetch or update its state
  };

  const openAddDialog = (type: string) => {
    setSelectedNodeType(type);
    setIsAddDialogOpen(true);
  };

  const displayName = node.nodeInfo?.name ?? node.name;
  const displayNodeType = node.nodeInfo?.type ?? node.name; // Fallback to node.name if type is missing

  return (
    <Card className="border-none">
      <div className="ml-4 pl-5" style={{ marginLeft: `${level * 20}px` }}>
        <div className="flex items-center justify-between gap-2 rounded p-2">
          <span
            className="flex cursor-pointer items-center gap-2 text-gray-800"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {children.length > 0 &&
              (isExpanded ? (
                <ChevronDown size={14} className="text-gray-600" />
              ) : (
                <ChevronRight size={14} className="text-gray-600" />
              ))}
            {renderNodeIcon(displayNodeType)}
            {displayName}
          </span>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="cursor-pointer border-none p-1 text-gray-600 ring-[rgba(22,28,202,0)] hover:text-gray-800 focus:outline-none"
                >
                  <Plus size={14} strokeWidth={2.7} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => openAddDialog("Region")}>
                  <Grid2X2 size={14} className="mr-2 text-gray-700" /> Region
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openAddDialog("Business Hub")}>
                  <Building size={14} className="mr-2 text-gray-700" /> Business
                  Hub
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => openAddDialog("Service Centre")}
                >
                  <Wrench size={14} className="mr-2 text-gray-700" /> Service
                  Centre
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openAddDialog("Substation")}>
                  <Database size={14} className="mr-2 text-gray-700" />{" "}
                  Substation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openAddDialog("Feeder Line")}>
                  <Zap size={14} className="mr-2 text-gray-700" /> Feeder Line
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openAddDialog("Transformer")}>
                  <Plug size={14} className="mr-2 text-gray-700" /> Transformer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={() => setIsEditDialogOpen(true)}
              className="cursor-pointer border-none p-1 text-gray-600 ring-[rgba(22,28,202,0)] hover:text-gray-800 focus:outline-none"
            >
              <Edit size={14} strokeWidth={2.7} />
            </Button>
          </div>
        </div>
        {isExpanded &&
          children.map((childNode) => (
            <OrganizationNode
              key={childNode.id}
              node={childNode}
              level={level + 1}
              onNodeUpdated={onNodeUpdated} // Pass callbacks down
              onNodeAdded={onNodeAdded} // Pass callbacks down
            />
          ))}
        <AddNodeDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={handleAddNode}
          nodeType={selectedNodeType}
        />
        <EditNodeDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleEditNode}
          nodeType={displayNodeType ?? "Node"}
          initialData={nodeDataForEdit}
        />
      </div>
    </Card>
  );
};
