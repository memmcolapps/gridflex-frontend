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
import { normalizeHierarchyType } from "../../../utils/hierarchy-utils";

export const mapNodeInfoToFormData = (nodeInfo?: NodeInfo, nodeName?: string) => {
  if (!nodeInfo) {
    return {
      name: nodeName ?? "",
      regionId: "",
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
    regionId: nodeInfo.regionId ?? "",
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
  if (!nodeTypeString) return null;

  const normalizedType = normalizeHierarchyType(nodeTypeString);

  switch (normalizedType) {
    case "region":
      return <Grid2X2 size={14} className="text-gray-600" />;
    case "businesshub":
      return <Building size={14} className="text-gray-600" />;
    case "servicecenter":
      return <Wrench size={14} className="text-gray-600" />;
    case "substation":
      return <Database size={14} className="text-gray-600" />;
    case "feederline":
      return <Zap size={14} className="text-gray-600" />;
    case "dss":
      return <Lightbulb size={14} className="text-gray-600" />;
    default:
      const type = nodeTypeString.toLowerCase();
      if (type === "root") {
        return <Building2 size={14} className="text-gray-600" />;
      }
      if (type === "transformer") {
        return <Lightbulb size={14} className="text-gray-600" />;
      }
      return null;
  }
};
