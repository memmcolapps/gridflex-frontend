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
    const [formData, setFormData] = useState<Band>(band || { name: '', electricityHour: 0 });

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {
        if (typeof e === 'string') {
            // Handle Select change
            setFormData(prev => ({
                ...prev,
                electricityHour: Number(e)
            }));
        } else {
            // Handle Input change
            const { name, value } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        closeModal();
    };

    // Default trigger button if none provided


    // const defaultTrigger = mode === 'add' ? (
    //     <Button
    //         onClick={openModal}
    //         className="flex items-center gap-2 text-white"
    //         variant="default"
    //     >
    //         <PlusIcon className="h-4 w-4" />
    //         Add Band
    //     </Button>
    // ) : (
    //     <Button
    //         onClick={openModal}
    //         variant="outline"
    //         size="sm"
    //         className="gap-1"
    //     >
    //         {/* <PencilIcon className="h-4 w-4" /> */}
    //         Edit
    //     </Button>
    // );

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                {triggerButton ? (
                    <DialogTrigger asChild>
                        {triggerButton}
                    </DialogTrigger>
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

                <DialogContent className="sm:max-w-md bg-white text-black w-500">
                    <DialogHeader>
                        <DialogTitle>{mode === 'add' ? 'Add Band' : `Edit ${band?.name}`}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className='bg-white-700'>
                        <div className="grid gap-4 py-4 bg-white-700">
                            <div className="grid gap-2 bg-white-700">
                                <Label htmlFor="name">Band Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter Band Name"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="electricityHour">Hour Of Electricity</Label>
                                <Select
                                    value={formData.electricityHour.toString()}
                                    onValueChange={handleChange}
                                    required                                                               
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Hour" className='text-black' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 20 }, (_, i) => i + 1).map((hour) => (
                                            <SelectItem key={hour} value={hour.toString()}>
                                                {hour}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="w-full">
                            <DialogFooter className="px-0">
                                <Button
                                    variant="outline"
                                    onClick={closeModal}
                                    type="button"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-[#161CCA] text-white">
                                    {mode === 'add' ? 'Add Band' : 'Save Changes'}
                                </Button>
                            </DialogFooter>
                        </div>

                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}