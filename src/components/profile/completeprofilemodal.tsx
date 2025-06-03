// components/modals/CompleteProfileModal.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CompleteProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditProfile: () => void;
}

export function CompleteProfileModal({ open, onOpenChange, onEditProfile }: CompleteProfileModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] h-fit bg-white space-y-2">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            To keep your account secure and fully functional, please add your phone number and update your password.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button
            onClick={onEditProfile}
            className="w-fit bg-[#161CCA] hover:bg-blue-700 text-white cursor-pointer"
          >
            Edit Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}