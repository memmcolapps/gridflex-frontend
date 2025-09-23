import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useCreateIncident } from "@/hooks/use-incident";
import { useState } from "react";

export default function IncidentDialog({ isOpen, onOpenChange }: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}) {

    const { mutate: sendMessage, isPending } = useCreateIncident();
    const [message, setMessage] = useState('')

    const handleSubmit = () => {
        sendMessage(
            {
                message,
            },
            {
                onSuccess: () => {
                    setMessage("");
                },
            }
        );
    };


    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="h-auto rounded-lg bg-white shadow-lg sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <div className="space-y-4">
                        <Label htmlFor="message" className="text-lg font-none">
                            Message
                        </Label>
                        <Textarea
                            id="message"
                            name="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="focus:outline-none focus:ring-0 focus:border-transparent  h-50 border-gray-200"
                            placeholder="Message..."
                        />
                        <Button
                            onClick={handleSubmit}
                            variant={"default"}
                            disabled={isPending}
                            className="text-md w-full cursor-pointer gap-2 text-white px-8 py-6 font-semibold bg-[#161CCA]"
                        >
                            {isPending ? "Sending..." : "Send"}
                            variant={"default"}
                            className="text-md w-full cursor-pointer gap-2 text-white px-8 py-6 font-semibold bg-[#161CCA]"
                        >
                            Send
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    )
}