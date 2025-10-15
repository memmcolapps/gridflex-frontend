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
    onConfirmImage?: () => void;
    title?: string;
    description?: string;
}

const UploadImageDialog: FC<UploadImageDialogProps> = ({
    isOpen,
    onOpenChange,
    onProceed,
    onCancel,
    onConfirmImage,
    title = "Upload Image",
    description = "Upload an image of the meter for verification."
}) => {
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
        if (onConfirmImage) {
            onConfirmImage();
        } else {
            onProceed(selectedImage);
        }
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
                    <DialogTitle className="text-lg font-semibold text-gray-900">{title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-sm text-gray-700">
                        {description}
                    </p>

                    {!previewUrl ? (
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
                                Supported file format: <strong>JPEG, PNG</strong> <br />
                                Maximum file size: <strong>5MB</strong>
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <img
                                        src={previewUrl}
                                        alt="Meter Preview"
                                        className="max-w-full h-auto rounded-lg border-2 border-[#161CCA] shadow-lg"
                                        style={{ maxHeight: "300px", maxWidth: "300px" }}
                                    />
                                    <button
                                        onClick={() => {
                                            setSelectedImage(null);
                                            setPreviewUrl(null);
                                            setError(null);
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                        title="Remove image"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    <strong>Image uploaded successfully!</strong>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {selectedImage?.name} ({(selectedImage?.size ?? 0) / 1024 / 1024 < 1
                                        ? `${Math.round((selectedImage?.size ?? 0) / 1024)} KB`
                                        : `${((selectedImage?.size ?? 0) / 1024 / 1024).toFixed(1)} MB`})
                                </p>
                            </div>
                        </div>
                    )}

                    <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}
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