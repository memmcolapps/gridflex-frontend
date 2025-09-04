import { Plus } from "lucide-react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGroupPermissions } from "@/hooks/use-groups";
import { useOrg } from "@/hooks/use-org";
import { type CreateUserPayload } from "@/types/users-groups";

export type User = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  groupPermission: string;
  lastActive: Date;
  hierarchy: string;
  unitName: string;
  dateAdded?: Date;
  defaultPassword: string;
};

type AddUserFormProps = {
  onSave: (user: CreateUserPayload) => void;
  triggerButton?: React.ReactNode;
};

export default function AddUserForm({
  onSave,
  triggerButton,
}: AddUserFormProps) {
  const { data: groupPermissions, isLoading: isLoadingGroupPermissions } =
    useGroupPermissions();
  const { nodes: orgData, isLoading: isLoadingOrg } = useOrg();

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    groupPermission: "",
    lastActive: new Date(),
    hierarchy: "",
    unitName: "",
    defaultPassword: "",
  });

  const getAllNodesWithChildren = (
    nodes: typeof orgData,
  ): Array<{ value: string; label: string }> => {
    const result: Array<{ value: string; label: string }> = [];

    const processNode = (node: (typeof orgData)[0]) => {
      if (node.nodesTree && node.nodesTree.length > 0) {
        result.push({
          value: node.id,
          label: node.name,
        });

        node.nodesTree.forEach((childNode) => processNode(childNode));
      }
    };

    nodes.forEach((node) => processNode(node));
    return result;
  };

  const findNodeById = (
    nodes: typeof orgData,
    nodeId: string,
  ): (typeof orgData)[0] | null => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return node;
      }
      if (node.nodesTree) {
        const found = findNodeById(node.nodesTree, nodeId);
        if (found) return found;
      }
    }
    return null;
  };

  const hierarchies = getAllNodesWithChildren(orgData);

  const getUnitsForHierarchy = (hierarchyId: string) => {
    const selectedHierarchy = findNodeById(orgData, hierarchyId);
    if (!selectedHierarchy?.nodesTree) return [];

    return selectedHierarchy.nodesTree.map((subNode) => ({
      value: subNode.id,
      label: subNode.name,
    }));
  };

  const availableUnits = formData.hierarchy
    ? getUnitsForHierarchy(formData.hierarchy)
    : [];

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | string, field?: string) => {
      if (typeof e === "string" && field) {
        setFormData((prev) => {
          const newData = {
            ...prev,
            [field]: e,
          };

          if (field === "hierarchy") {
            newData.unitName = "";
          }

          return newData;
        });
      } else if (typeof e !== "string") {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    },
    [],
  );

  const handleSubmit = async () => {
    onSave({
      user: {
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.defaultPassword,
        nodeId: formData.unitName,
      },
      groupId: formData.groupPermission,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton ?? (
          <Button
            className="flex items-center gap-2 text-black"
            variant="default"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="h-fit bg-white text-black sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Fill out the form to add a new user.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter first name"
                className="border-[rgba(228,231,236,1)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Enter last name"
                className="border-[rgba(228,231,236,1)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
                className="border-[rgba(228,231,236,1)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupPermission">
                Group Permission <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.groupPermission}
                onValueChange={(value) =>
                  handleChange(value, "groupPermission")
                }
                required
              >
                <SelectTrigger className="w-full border-[rgba(228,231,236,1)]">
                  <SelectValue
                    placeholder="Select group permission"
                    className="text-black-600"
                  />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingGroupPermissions ? (
                    <SelectItem value="loading" disabled>
                      Loading group permissions...
                    </SelectItem>
                  ) : (
                    groupPermissions.map((permission) => (
                      <SelectItem key={permission.id} value={permission.id}>
                        {permission.groupTitle}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hierarchy">
                Organizational Hierarchy <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.hierarchy}
                onValueChange={(value) => handleChange(value, "hierarchy")}
              >
                <SelectTrigger className="w-full border-[rgba(228,231,236,1)]">
                  <SelectValue placeholder="Select hierarchy" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingOrg ? (
                    <SelectItem value="loading" disabled>
                      Loading hierarchies...
                    </SelectItem>
                  ) : (
                    hierarchies.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitName">
                Unit Name <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.unitName}
                onValueChange={(value) => handleChange(value, "unitName")}
                required
                disabled={!formData.hierarchy || isLoadingOrg}
              >
                <SelectTrigger className="w-full border-[rgba(228,231,236,1)]">
                  <SelectValue
                    placeholder={
                      !formData.hierarchy
                        ? "Select hierarchy first"
                        : "Select unit name"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingOrg ? (
                    <SelectItem value="loading" disabled>
                      Loading units...
                    </SelectItem>
                  ) : availableUnits.length === 0 ? (
                    <SelectItem value="no-units" disabled>
                      No units available
                    </SelectItem>
                  ) : (
                    availableUnits.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="defaultPassword">
                Default Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="defaultPassword"
                name="defaultPassword"
                type="password"
                value={formData.defaultPassword}
                onChange={handleChange}
                required
                placeholder="Enter default password"
                className="w-full border-[rgba(228,231,236,1)]"
              />
            </div>
          </div>
          <div className="mt-12 flex justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              type="button"
              className="cursor-pointer border-[#161CCA] text-[#161CCA]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="cursor-pointer bg-[#161CCA] text-white"
            >
              Add User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
