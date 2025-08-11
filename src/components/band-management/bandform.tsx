import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Band } from "@/service/band-service";

interface BandFormProps {
  mode: "add" | "edit";
  band?: Band;
  onSave: (band: Omit<Band, "id">) => void;
  triggerButton: React.ReactNode;
}

export default function BandForm({
  mode,
  band,
  onSave,
  triggerButton,
}: BandFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(band?.name ?? "");
  const [hour, sethour] = useState(band?.hour?.toString() ?? "");

  // Reset form when band prop changes
  useEffect(() => {
    if (band) {
      setName(band.name);
      sethour(band.hour.toString());
    }
  }, [band]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedBand = {
      name,
      hour: parseInt(hour, 10),
    };

    onSave(updatedBand);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="h-70 bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Band" : "Edit Band"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Band Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter band name"
                required
                className="border-[rgba(228,231,236,1)]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hour">Electricity Hours</Label>
              <Input
                id="hour"
                type="number"
                value={hour}
                onChange={(e) => sethour(e.target.value)}
                placeholder="Enter electricity hours"
                required
                min="0"
                max="24"
                className="border-[rgba(228,231,236,1)]"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-[#161CCA] text-[#161CCA]"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#161CCA] text-white">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
