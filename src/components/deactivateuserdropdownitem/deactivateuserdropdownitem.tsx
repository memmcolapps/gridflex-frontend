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
  // Add your deactivation logic here
};

export default function DeactivateUserDropdownItem({ user }: { user: { id: string } }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Ban size={14}/>
          <span className="cursor-pointer">Deactivate</span>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm rounded-xl p-6 border-[rgba(228,231,236,1)]">
      <AlertDialogCancel asChild>
          <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </AlertDialogCancel>
        <div className="flex flex-col space-y-3 mt-8">
          <div className="w-full flex items-start">
            <div className="bg-red-100 text-red-600 p-3 rounded-full w-16 h-16 ml-0">
              <AlertTriangle size={28} />
            </div>
          </div>
          <AlertDialogHeader className="space-y-1">
            <AlertDialogTitle className="text-lg font-semibold">Deactivate User</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to deactivate user?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="w-full flex justify-between items-center pt-4 px-0">
            <div className="flex justify-start w-1/2">
             
              <AlertDialogCancel
                className="border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 px-6 py-2 rounded-md font-medium"
              >
                Cancel
              </AlertDialogCancel>
            </div>
            <div className="flex justify-end w-1/2">
            <AlertDialogAction
                onClick={() => handleDeactivateUser(user.id)}
                className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-md font-medium"
              >
                Deactivate
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>

        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
