export const HIERARCHY_TYPES = {
  REGION: "region",
  BUSINESS_HUB: "businesshub",
  SERVICE_CENTER: "servicecenter",
  SUBSTATION: "substation",
  FEEDER_LINE: "feederline",
  DISTRIBUTION_SUBSTATION: "distributionsubstation",
} as const;

export type HierarchyType =
  (typeof HIERARCHY_TYPES)[keyof typeof HIERARCHY_TYPES];

export function normalizeHierarchyType(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .replace(/\(.*?\)/g, "")
    .trim();
}

export function isValidHierarchyType(
  normalizedType: string,
): normalizedType is HierarchyType {
  return Object.values(HIERARCHY_TYPES).includes(
    normalizedType as HierarchyType,
  );
}

export function getHierarchyDisplayLabel(hierarchyType: HierarchyType): string {
  switch (hierarchyType) {
    case HIERARCHY_TYPES.REGION:
      return "Region";
    case HIERARCHY_TYPES.BUSINESS_HUB:
      return "Business Hub";
    case HIERARCHY_TYPES.SERVICE_CENTER:
      return "Service Center";
    case HIERARCHY_TYPES.SUBSTATION:
      return "Substation";
    case HIERARCHY_TYPES.FEEDER_LINE:
      return "Feeder Line";
    case HIERARCHY_TYPES.DISTRIBUTION_SUBSTATION:
      return "Distribution Substation (DSS)";
    default:
      return hierarchyType;
  }
}

export function getHierarchyOptions(): Array<{
  value: HierarchyType;
  label: string;
}> {
  return Object.values(HIERARCHY_TYPES).map((type) => ({
    value: type,
    label: getHierarchyDisplayLabel(type),
  }));
}

export function matchNodeTypeToHierarchy(
  nodeType?: string,
): HierarchyType | null {
  if (!nodeType) return null;

  const normalized = normalizeHierarchyType(nodeType);

  if (isValidHierarchyType(normalized)) {
    return normalized;
  }

  return null;
}

export function filterNodesByHierarchyType<
  T extends { nodeInfo?: { type?: string } },
>(nodes: T[], hierarchyType: HierarchyType): T[] {
  return nodes.filter((node) => {
    const matchedType = matchNodeTypeToHierarchy(node.nodeInfo?.type);
    return matchedType === hierarchyType;
  });
}

export function getUnitsForHierarchy<
  T extends {
    nodeInfo?: { type?: string; name?: string };
    name: string;
    id: string;
  },
>(
  nodes: T[],
  hierarchyType: HierarchyType,
): Array<{ value: string; label: string }> {
  const filteredNodes = filterNodesByHierarchyType(nodes, hierarchyType);

  return filteredNodes.map((node) => ({
    value: node.id,
    label: node.nodeInfo?.name ?? node.name,
  }));
}

export function flattenOrganizationNodes<T extends { nodesTree?: T[] }>(
  nodes: T[],
): T[] {
  const result: T[] = [];

  function processNode(node: T) {
    result.push(node);
    if (node.nodesTree && node.nodesTree.length > 0) {
      node.nodesTree.forEach(processNode);
    }
  }

  nodes.forEach(processNode);
  return result;
}
