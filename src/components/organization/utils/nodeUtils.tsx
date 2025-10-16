import {
  Building,
  Building2,
  Database,
  Grid2X2,
  Lightbulb,
  Wrench,
  Zap,
} from "lucide-react";
import React from "react";
import { type NodeInfo } from "../../../service/organaization-service";
import {
  normalizeHierarchyType,
  HIERARCHY_TYPES,
} from "../../../utils/hierarchy-utils";

export const mapNodeInfoToFormData = (nodeInfo?: NodeInfo) => {
  if (!nodeInfo) {
    return {
      name: "",
      id: "", // This will be serialNo or regionId/bhubId
      phoneNumber: "",
      email: "",
      contactPerson: "",
      address: "",
      status: "",
      voltage: "",
      longitude: "",
      latitude: "",
      description: "",
      serialNo: "",
      assetId: "",
    };
  }
  return {
    name: nodeInfo.name ?? "",
    id: nodeInfo.serialNo ?? nodeInfo.nodeId ?? "",
    phoneNumber: nodeInfo.phoneNo ?? "",
    email: nodeInfo.email ?? "",
    contactPerson: nodeInfo.contactPerson ?? "",
    address: nodeInfo.address ?? "",
    status:
      nodeInfo.status !== undefined
        ? nodeInfo.status
          ? "Active"
          : "Inactive"
        : "",
    voltage: nodeInfo.voltage ?? "",
    longitude: nodeInfo.longitude ?? "",
    latitude: nodeInfo.latitude ?? "",
    description: nodeInfo.description ?? "",
    serialNo: nodeInfo.serialNo ?? "",
    assetId: nodeInfo.assetId ?? "",
  };
};

export const renderNodeIcon = (nodeTypeString?: string): React.ReactNode => {
  const type = nodeTypeString?.toLowerCase(); // Standardize to lowercase for comparison
  switch (type) {
    case "root":
      return <Building2 size={14} className="text-gray-600" />;
    case "region":
      return <Grid2X2 size={14} className="text-gray-600" />;
    case "business hub":
      return <Building size={14} className="text-gray-600" />;
    case "Service Center":
      return <Wrench size={14} className="text-gray-600" />;
    case "substation":
      return <Database size={14} className="text-gray-600" />;
    case "feeder line":
      return <Zap size={14} className="text-gray-600" />;
    case "transformer":
      return <Lightbulb size={14} className="text-gray-600" />;
    default:
      return null;
  }
};
