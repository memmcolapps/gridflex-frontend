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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";


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
  const [electricityHour, setElectricityHour] = useState(
    band?.electricityHour ?? 1,
  );

  // Reset form when band prop changes
  useEffect(() => {
    if (band) {
      setName(band.name);
      setElectricityHour(band.electricityHour);
    }
  }, [band]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedBand = {
      name,
      electricityHour: electricityHour,
    };

    onSave(updatedBand);
    setOpen(false);
  };

  // Generate hours array from 1 to 24
  const hours = Array.from({ length: 24 }, (_, i) => i + 1);

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
              <Label htmlFor="electricityHour">Electricity Hours</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-[rgba(228,231,236,1)] text-left font-normal"
                  >
                    {electricityHour} {electricityHour === 1 ? "hour" : "hours"}
                    <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 w-full overflow-y-auto">
                  {hours.map((hour) => (
                    <DropdownMenuItem
                      key={hour}
                      onClick={() => setElectricityHour(hour)}
                      className={electricityHour === hour ? "bg-accent" : ""}
                    >
                      {hour} {hour === 1 ? "hour" : "hours"}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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