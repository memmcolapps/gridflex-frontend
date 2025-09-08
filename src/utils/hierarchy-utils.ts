/**
 * Utility functions for handling hierarchy types and matching
 */

// Define the finite set of hierarchy types
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

/**
 * Normalize a string to match hierarchy types
 * Removes spaces, hyphens, makes lowercase for consistent matching
 */
export function normalizeHierarchyType(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, "") // Remove all spaces
    .replace(/-/g, "") // Remove hyphens
    .replace(/\(.*?\)/g, "") // Remove parentheses and content within
    .trim();
}

/**
 * Check if a normalized string matches any of our defined hierarchy types
 */
export function isValidHierarchyType(
  normalizedType: string,
): normalizedType is HierarchyType {
  return Object.values(HIERARCHY_TYPES).includes(
    normalizedType as HierarchyType,
  );
}

/**
 * Get display label for hierarchy type
 */
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

/**
 * Get all hierarchy options for dropdowns
 */
export function getHierarchyOptions(): Array<{
  value: HierarchyType;
  label: string;
}> {
  return Object.values(HIERARCHY_TYPES).map((type) => ({
    value: type,
    label: getHierarchyDisplayLabel(type),
  }));
}

/**
 * Match a node's type to our hierarchy types
 * Returns the matched hierarchy type or null if no match
 */
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

/**
 * Filter nodes by hierarchy type from nodeInfo.type
 */
export function filterNodesByHierarchyType<
  T extends { nodeInfo?: { type?: string } },
>(nodes: T[], hierarchyType: HierarchyType): T[] {
  return nodes.filter((node) => {
    const matchedType = matchNodeTypeToHierarchy(node.nodeInfo?.type);
    return matchedType === hierarchyType;
  });
}

/**
 * Get units for a specific hierarchy type from organization nodes
 */
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
    label: node.nodeInfo?.name || node.name,
  }));
}

/**
 * Recursively get all nodes with their children flattened
 */
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
