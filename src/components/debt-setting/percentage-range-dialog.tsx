import React, { useState, useEffect } from "react";
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
import { PlusCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { Band } from "@/service/band-service";
import { useBand } from "@/hooks/use-band";

type AddPercentageRangeDialogProps = {
  onAddPercentageRange: (range: {
    percentage: string;
    percentageCode: string;
    band: string;
    amountStartRange: string;
    amountEndRange: string;
  }) => void;
};

const AddPercentageRangeDialog = ({
  onAddPercentageRange,
}: AddPercentageRangeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [percentage, setPercentage] = useState("");
  const [percentageCode, setPercentageCode] = useState("");
  const [band, setBand] = useState("");
  const [amountStartRange, setAmountStartRange] = useState("");
  const [amountEndRange, setAmountEndRange] = useState("");
  const [loading, setLoading] = useState(false);
  const { bands, error } = useBand();

  const handleSubmit = () => {
    if (
      percentage &&
      percentageCode &&
      band &&
      amountStartRange &&
      amountEndRange
    ) {
      onAddPercentageRange({
        percentage,
        percentageCode,
        band,
        amountStartRange,
        amountEndRange,
      });
      setPercentage("");
      setPercentageCode("");
      setBand("");
      setAmountStartRange("");
      setAmountEndRange("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="lg"
          className="flex cursor-pointer items-center bg-[rgba(22,28,202,1)] text-white"
        >
          <PlusCircle size={14} className="mr-2" />
          Add Percentage Range
        </Button>
      </DialogTrigger>
      <DialogContent className="h-fit w-full bg-white">
        <DialogHeader>
          <DialogTitle>Add Percentage Range</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="percentage">Percentage</Label>
            <Input
              id="percentage"
              placeholder="Enter percentage"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              className="focus:ring-ring/50 border-[#bebebe]"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 gap-x-4">
            <div>
              <Label htmlFor="percentagecode" className="mb-2">
                Percentage Code
              </Label>
              <Input
                id="percentagecode"
                placeholder="Enter percentage code"
                value={percentageCode}
                onChange={(e) => setPercentageCode(e.target.value)}
                className="focus:ring-ring/50 border-[#bebebe]"
              />
            </div>
            <div>
              <Label htmlFor="band" className="mb-2">
                Band
              </Label>
              <Select
                value={band}
                onValueChange={setBand}
                disabled={loading || bands.length === 0}
              >
                <SelectTrigger className="focus:ring-ring/50 h-10 w-full rounded-md border-[#bebebe] px-3">
                  <SelectValue
                    placeholder={loading ? "Loading bands..." : "Select Band"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {bands.length > 0 ? (
                    bands.map((bandItem) => (
                      <SelectItem key={bandItem.id} value={bandItem.name}>
                        {bandItem.name}
                      </SelectItem>
                    ))
                  ) : loading ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    <SelectItem value="no-bands" disabled>
                      No bands available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 gap-x-4">
            <div>
              <Label htmlFor="amountStartRange" className="mb-2">
                Amount Start Range
              </Label>
              <Input
                id="amountStartRange"
                placeholder="Enter amount"
                value={amountStartRange}
                onChange={(e) => setAmountStartRange(e.target.value)}
                className="focus:ring-ring/50 border-[#bebebe]"
              />
            </div>
            <div>
              <Label htmlFor="amountEndRange" className="mb-2">
                Amount End Range
              </Label>
              <Input
                id="amountEndRange"
                placeholder="Enter amount"
                value={amountEndRange}
                onChange={(e) => setAmountEndRange(e.target.value)}
                className="focus:ring-ring/50 border-[#bebebe]"
              />
            </div>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          className="bg-[rgba(22,28,202,1)] text-white"
          disabled={
            loading ||
            !percentage ||
            !percentageCode ||
            !band ||
            !amountStartRange ||
            !amountEndRange
          }
        >
          Add
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddPercentageRangeDialog;
