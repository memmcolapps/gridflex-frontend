"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DeactivateVirtualMeterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onProceed: () => void;
}

export function DeactivateVirtualMeterDialog({ isOpen, onOpenChange, onProceed }: DeactivateVirtualMeterDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="h-fit bg-white text-black" style={{ width: "500px", maxWidth: "none" }}>
        <DialogHeader>
          <DialogTitle className="font-semibold">Deactivate Virtual Meter</DialogTitle>
          <DialogDescription>
            Deactivate any existing virtual meters at{" "}
            <span className="font-bold">{"5, Glorious Orimerumnu, Obafemi Owode, Ogun State"}</span> before assigning an
            actual meter, or proceed if not applicable.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label className="font-medium">
              Virtual meters <span className="text-red-600">*</span>
            </Label>
            <Select>
              <SelectTrigger className="mt-2 w-full">
                <SelectValue placeholder="Select meter" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="V-201021223-5" className="flex items-center gap-4 w-full">
                  <div className="flex items-center justify-between flex-1 gap-12">
                    <span>V-201021223</span>
                    <span>5, Glorious Orimerumnu, Obafemi Owode, Ogun State</span>
                  </div>
                </SelectItem>
                <SelectItem value="V-201021223-6" className="flex items-center gap-4 w-full">
                  <div className="flex items-center justify-between flex-1 gap-12">
                    <span>V-201021223</span>
                    <span>6, Glorious Orimerumnu, Obafemi Owode, Ogun State</span>
                  </div>
                </SelectItem>
                <SelectItem value="V-201021223-7" className="flex items-center gap-4 w-full">
                  <div className="flex items-center justify-between flex-1 gap-12">
                    <span>V-201021223</span>
                    <span>7, Glorious Orimerumnu, Obafemi Owode, Ogun State</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border border-[#161CCA] text-[#161CCA] cursor-pointer"
          >
            Cancel
          </Button>
          <Button onClick={onProceed} className="bg-[#161CCA] text-white cursor-pointer">
            Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}