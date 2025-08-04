import type { FC } from "react";
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Input } from "../ui/input";

interface UploadImageDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onProceed: (image: File | null) => void;
    onCancel: () => void;
}

const UploadImageDialog: FC<UploadImageDialogProps> = ({ isOpen, onOpenChange, onProceed, onCancel }) => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    // Handle file selection
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size must be less than 5MB");
                setSelectedImage(null);
                setPreviewUrl(null);
                return;
            }
            if (!["image/jpeg", "image/png"].includes(file.type)) {
                setError("Only JPEG or PNG images are allowed");
                setSelectedImage(null);
                setPreviewUrl(null);
                return;
            }
        }
        setSelectedImage(file);
        setPreviewUrl(file ? URL.createObjectURL(file) : null);
        setError(null);
    };

    // Clean up preview URL
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // Handle Proceed
    const handleProceedClick = () => {
        onProceed(selectedImage);
        setSelectedImage(null);
        setPreviewUrl(null);
        setError(null);
    };

    // Handle Cancel
    const handleCancelClick = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        setError(null);
        onCancel();
    };

    // Trigger file input click
    const handleUploadAreaClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-lg p-6 h-fit bg-white">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">Upload Image</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {/* <p className="text-sm text-gray-700">
                        Upload an image of the meter for verification. Click{" "}
                        <a href="/template-image.jpg" className="text-[#161CCA] font-medium" download>
                            here
                        </a>{" "}
                        to download a sample image format.
                    </p> */}

                    <div
                        onClick={handleUploadAreaClick}
                        className={cn(
                            "cursor-pointer border border-dashed border-[#161CCA] rounded-lg py-10 px-4 text-center flex flex-col items-center justify-center gap-2 hover:border-[#161CCA] transition"
                        )}
                    >
                        <PlusIcon className="text-[#161CCA]" size={14} />
                        <p>
                            Click <span className="text-[#161CCA]">here</span> to upload image or Drag <br /> <span className="text-center"> and Drop</span>
                        </p>
                        <p className="text-md text-gray-500">
                            Supported file format: <strong>Jpeg, .PNG</strong> <br />
                            Maximum file size: <strong>2MB</strong>
                        </p>
                    </div>

                    <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                

                    {/* {error && <p className="text-sm text-red-600">{error}</p>}
                    {previewUrl && (
                        <div className="space-y-2">
                            <Label>Image Preview</Label>
                            <img
                                src={previewUrl}
                                alt="Meter Preview"
                                className="max-w-full h-auto rounded-md border border-gray-300"
                                style={{ maxHeight: "300px" }}
                            />
                        </div>
                    )} */}
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleCancelClick}
                        className="border-[#161CCA] text-[#161CCA] cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleProceedClick}
                        className="bg-[#161CCA] text-white cursor-pointer"
                    >
                        Proceed
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UploadImageDialog;