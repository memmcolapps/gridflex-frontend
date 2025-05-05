import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Band = {
    id?: string;
    name: string;
    electricityHour: number;
};

type BandFormModalProps = {
    mode: 'add' | 'edit';
    band?: Band;
    onSave: (band: Band) => void;
    triggerButton?: React.ReactNode;
};

export default function BandForm({ mode, band, onSave, triggerButton }: BandFormModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<{
        name: string;
        electricityHour: string | undefined;
    }>(
        band
            ? { name: band.name, electricityHour: band.electricityHour.toString() }
            : { name: "", electricityHour: undefined }
    );
    const [bands, setBands] = useState<Band[]>([
        { id: '1', name: 'Band A', electricityHour: 20 },
        { id: '2', name: 'Band B', electricityHour: 16 },
        { id: '3', name: 'Band C', electricityHour: 12 },
        { id: '4', name: 'Band D', electricityHour: 8 },
        { id: '5', name: 'Band E', electricityHour: 4 },
        { id: '6', name: 'Band F', electricityHour: 5 },
    ]);

    const closeModal = () => setIsOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {
        if (typeof e === "string") {
            setFormData((prev) => ({
                ...prev,
                electricityHour: e || undefined,
            }));
        } else {
            const { name, value } = e.target;
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = () => {
        const newBand = {
            name: formData.name,
            electricityHour: formData.electricityHour ? Number(formData.electricityHour) : 0, // Handle 0 as valid
        };
        setBands([...bands, { ...newBand, id: Date.now().toString() }]);
        setFormData({ name: "", electricityHour: undefined });
        closeModal();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {triggerButton ? (
                <DialogTrigger asChild>{triggerButton}</DialogTrigger>
            ) : (
                <DialogTrigger asChild>
                    {mode === 'add' ? (
                        <Button className="flex items-center gap-2 text-black" variant="default">
                            <PlusIcon className="h-4 w-4" />
                            Add Band
                        </Button>
                    ) : (
                        <Button variant="outline" size="sm" className="gap-1">
                            <PencilIcon className="h-4 w-4" />
                            Edit
                        </Button>
                    )}
                </DialogTrigger>
            )}

            <DialogContent className="sm:max-w-[500px] h-100 bg-white text-black">
                <DialogHeader>
                    <DialogTitle>{mode === 'add' ? 'Add Band' : `Edit ${band?.name}`}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="bg-white-700 border-[rgba(228,231,236,1)]">
                    <div className="grid gap-4 bg-white-700">
                        <div className="grid gap-4 bg-white-700 border-[rgba(228,231,236,1)]">
                            <Label htmlFor="name">Band Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required={true}
                                placeholder="Enter Band Name"
                                className="border-[rgba(228,231,236,1)]"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="electricityHour">Hour Of Electricity</Label>
                            <Select
                                value={formData.electricityHour ?? undefined}
                                onValueChange={handleChange}
                                required={true}
                            >
                                <SelectTrigger className="text-gray-400">
                                    <SelectValue placeholder="Select Hour" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 25 }, (_, i) => i).map((hour) => (
                                        <SelectItem key={hour} value={hour.toString()}>
                                            {hour}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <br />
                        <div className="w-full">
                            <DialogFooter className="px-0">
                                <Button
                                    variant="outline"
                                    onClick={closeModal}
                                    type="button"
                                    className="border-[#161CCA] text-[#161CCA]"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-[#161CCA] text-white">
                                    {mode === 'add' ? 'Add Band' : 'Save'}
                                </Button>
                            </DialogFooter>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}