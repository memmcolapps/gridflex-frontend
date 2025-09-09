import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Ban, X } from "lucide-react";
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

const handleDeactivateUser = (userId: string) => {
  console.log(`Deactivating user with ID: ${userId}`);
};

export default function DeactivateUserDropdownItem({
  user,
}: {
  user: { id: string };
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Ban size={14} />
          <span>Deactivate</span>
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
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle size={28} />
            </div>
          </div>

          {/* Header content */}
          <AlertDialogHeader className="space-y-2 text-center">
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">
              Deactivate User
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-600">
              Are you sure you want to deactivate this user? They will no longer
              be able to access their account.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Footer with buttons */}
          <AlertDialogFooter className="flex flex-row gap-3 pt-4">
            <AlertDialogCancel className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeactivateUser(user.id)}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
