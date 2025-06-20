'use client';

import { CircleAlert } from 'lucide-react';
import { useState } from 'react';

interface NavigationBannerProps {
    title?: string;
    title2?: string;
    description?: React.ReactNode;
    bgColor: string;
    textColor: string;
    closable?: boolean;
    onClose?: () => void;
    showIcon?: boolean;
    isTopBanner?: boolean;
}

export function NotificationBar({
    title,
    title2,
    description,
    bgColor,
    textColor,
    closable = false,
    showIcon = false,
    onClose,
    isTopBanner = false,
}: NavigationBannerProps) {
    const [isClosed, setIsClosed] = useState(false);

    return (
        <div>
            {isClosed ? (
                <button
                    onClick={() => setIsClosed(false)}
                    className="absolute top-27 right-17 m-2 p-1 rounded-full text-white transition duration-200 ease-in-out"
                    aria-label="Reopen notification"
                >
                    <CircleAlert size={18} strokeWidth={2.75} />
                </button>
            ) : (
                <div
                    className={`py-4 px-6 flex justify-between items-center ${bgColor} ${isTopBanner ? 'rounded-tl-[10px] rounded-tr-[10px]' : ''}`}
                >
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-2 items-center">
                            <h2 className={`text-lg font-medium ${textColor}`}>{title}</h2>
                            {showIcon && (
                                <CircleAlert
                                    strokeWidth={2.0}
                                    size={16}
                                    className={`cursor-pointer ${textColor}`}
                                />
                            )}
                            <h2 className={`text-lg font-medium ${textColor}`}>{title2}</h2>
                        </div>
                        {description && (
                            <div className="text-base font-medium text-[rgba(38,38,38,1)]">
                                {description}
                            </div>
                        )}
                    </div>
                    {closable && (
                        <button
                            onClick={() => {
                                setIsClosed(true);
                                if (onClose) onClose();
                            }}
                            className="p-1 rounded-full -mt-38 text-white transition duration-200 ease-in-out"
                            aria-label="Close"
                        >
                            <CircleAlert size={18} strokeWidth={2.75} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
