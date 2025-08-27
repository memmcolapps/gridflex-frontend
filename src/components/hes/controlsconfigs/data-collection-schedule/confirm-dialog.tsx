"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText: string;
    cancelText?: string;
    backgroundColor: string;
    alertTriangleColor: string;
    confirmButtonColor: string;
    cancelButtonColor: string;
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText,
    cancelText = "Cancel",
    backgroundColor,
    alertTriangleColor,
    confirmButtonColor,
    cancelButtonColor,
}: ConfirmDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`sm:max-w-[425px] ${backgroundColor} h-fit`} >
                <DialogHeader className="flex items-start">
                    <AlertTriangle className={`${alertTriangleColor} mb-2`} size={20} />
                    <DialogTitle className="mt-4">{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className={`w-full sm:w-auto ${cancelButtonColor}`}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`w-full sm:w-auto ${confirmButtonColor}`}
                    >
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}