import type { FC } from "react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ConfirmImageDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    image: File | null;
    onProceed: () => void;
    onCancel: () => void;
}

const ConfirmImageDialog: FC<ConfirmImageDialogProps> = ({ isOpen, onOpenChange, image, onProceed, onCancel }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Generate preview URL
    useEffect(() => {
        if (image) {
            const url = URL.createObjectURL(image);
            setPreviewUrl(url);
            return () => {
                URL.revokeObjectURL(url);
            };
        }
        setPreviewUrl(null);
    }, [image]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="h-fit overflow-y-auto bg-white w-[600px]">
                <DialogHeader>
                    <DialogTitle>Upload Image</DialogTitle>
                    {/* <DialogDescription>Confirm the uploaded meter image.</DialogDescription> */}
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {previewUrl ? (
                        <div className="space-y-2">
                            {/* <Label>Uploaded Image</Label> */}
                            <Image
                                src={previewUrl}
                                alt="Meter Confirmation"
                                className="max-w-full h-auto rounded-md border border-gray-300"
                                width={600} // Specify the width of the image
                                height={300} // Specify the height of the image
                                style={{ maxHeight: "300px" }}
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No image available.</p>
                    )}
                </div>
                <div className="flex justify-between mt-4">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="border-[#161CCA] text-[#161CCA] hover:bg-gray-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onProceed}
                        disabled={!image}
                        className={
                            image
                                ? "bg-[#161CCA] text-white hover:bg-[#0f1a9c]"
                                : "bg-blue-300 text-white cursor-not-allowed"
                        }
                    >
                        Proceed
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmImageDialog;