import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Ban, X, CheckCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import { useDeactivateOrActivateGroupPermission } from "@/hooks/use-groups";
import { toast } from "sonner";

interface GroupPermission {
  id: string;
  groupTitle: string;
  isActive?: boolean;
  status?: boolean;
  permissions: {
    view: boolean;
    edit: boolean;
    approve: boolean;
    disable: boolean;
  };
  modules: Array<{
    name: string;
    access: boolean;
    subModules: Array<{ name: string; access: boolean }>;
  }>;
}

export default function GroupStatusToggleDropdownItem({
  group,
}: {
  group: GroupPermission;
}) {
  const { mutate: toggleGroupStatus, isPending } =
    useDeactivateOrActivateGroupPermission();

  // Check if group has a status property, otherwise assume it's active
  const isActive = group.status ?? group.isActive ?? true;
  const actionText = isActive ? "Deactivate" : "Activate";
  const actionDescription = isActive
    ? "Are you sure you want to deactivate this group permission? Users with this group will lose their access permissions."
    : "Are you sure you want to activate this group permission? Users with this group will regain their access permissions.";

  const handleToggleGroupStatus = () => {
    const newStatus = !isActive;
    toggleGroupStatus(
      { groupId: group.id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(
            `Group permission ${newStatus ? "activated" : "deactivated"} successfully`,
          );
        },
        onError: (error) => {
          toast.error(
            `Failed to ${newStatus ? "activate" : "deactivate"} group permission: ${error.message}`,
          );
        },
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          {isActive ? <Ban size={14} /> : <CheckCircle size={14} />}
          <span>{actionText} Group Permission</span>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm rounded-xl border-[rgba(228,231,236,1)] p-6">
        <AlertDialogCancel asChild>
          <button className="absolute top-4 right-4 rounded-sm border-none bg-transparent p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X size={16} />
          </button>
        </AlertDialogCancel>

        <div className="flex flex-col space-y-4 pt-2">
          <div className="">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full ${isActive ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
            >
              <AlertTriangle size={28} />
            </div>
          </div>

          {/* Header content */}
          <AlertDialogHeader className="space-y-2 text-center">
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">
              {actionText} Group Permission
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-600">
              {actionDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Footer with buttons */}
          <AlertDialogFooter className="flex flex-row gap-3 pt-4">
            <AlertDialogCancel className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleGroupStatus}
              disabled={isPending}
              className={`flex-1 rounded-lg px-4 py-2.5 font-medium text-white transition-colors ${
                isActive
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              } ${isPending ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {isPending ? `${actionText.slice(0, -1)}ing...` : actionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
