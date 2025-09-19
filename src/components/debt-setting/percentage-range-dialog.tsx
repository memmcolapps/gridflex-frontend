import React, { useState } from "react";
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
import { useBand } from "@/hooks/use-band";
import { useCreatePercentageRange } from "@/hooks/use-debit-settings";
import { toast } from "sonner";

const AddPercentageRangeDialog = () => {
  const [open, setOpen] = useState(false);
  const [percentage, setPercentage] = useState("");
  const [percentageCode, setPercentageCode] = useState("");
  const [band, setBand] = useState("");
  const [amountStartRange, setAmountStartRange] = useState("");
  const [amountEndRange, setAmountEndRange] = useState("");
  const { bands } = useBand();
  const { mutate, isPending } = useCreatePercentageRange();

  // Filter the bands to only include those with an 'Approved' status.
  const approvedBands = bands.filter(band => band.approveStatus === "Approved");

  const handleSubmit = () => {
    const startRange = amountStartRange;
    const endRange = amountEndRange;
    const selectedBand = bands.find((b) => b.name === band);

    if (
      percentage &&
      percentageCode &&
      selectedBand &&
      startRange &&
      endRange
    ) {
      mutate(
        {
          percentage,
          code: percentageCode,
          bandId: selectedBand!.id,
          amountStartRange: startRange,
          amountEndRange: endRange,
        },
        {
          onSuccess: (response) => {
            setPercentage("");
            setPercentageCode("");
            setBand("");
            setAmountStartRange("");
            setAmountEndRange("");
            setOpen(false);
            toast.success(response.responsedesc ?? "Percentage range created successfully!");
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      );
    } else {
      toast.error("Please fill in all required fields correctly.");
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
                // You should now disable based on the new array
                disabled={isPending || approvedBands.length === 0}
              >
                <SelectTrigger className="focus:ring-ring/50 h-10 w-full rounded-md border-[#bebebe] px-3">
                  <SelectValue
                    // Update the placeholder to reflect the new state
                    placeholder={isPending ? "Loading bands..." : "Select Band"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {/* Use the new 'approvedBands' array here */}
                  {approvedBands.length > 0 ? (
                    approvedBands.map((bandItem) => (
                      <SelectItem key={bandItem.id} value={bandItem.name}>
                        {bandItem.name}
                      </SelectItem>
                    ))
                  ) : isPending ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    <SelectItem value="no-bands" disabled>
                      No approved bands available
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
            isPending ||
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