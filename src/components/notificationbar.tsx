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
                    className="fixed sm:absolute top-4 sm:top-22 right-4 sm:right-12 m-2 p-1 rounded-full text-white transition duration-200 ease-in-out"
                    aria-label="Reopen notification"
                >
                    <CircleAlert size={18} strokeWidth={2.75} className='cursor-pointer'/>
                </button>
            ) : (
                <div
                    className={`py-3 sm:py-4 px-4 sm:px-6 flex justify-between items-center w-full ${bgColor} ${isTopBanner ? 'rounded-tl-[10px] rounded-tr-[10px]' : ''}`}
                >
                    <div className="flex flex-col w-full">
                        <div className="flex flex-row gap-2 items-center flex-wrap">
                            {title && (
                                <h2 className={`text-base sm:text-lg font-medium ${textColor}`}>
                                    {title}
                                </h2>
                            )}
                            {showIcon && (
                                <CircleAlert
                                    strokeWidth={2.0}
                                    size={16}
                                    className={`cursor-pointer ${textColor}`}
                                />
                            )}
                            {title2 && (
                                <h2 className={`text-base sm:text-lg font-medium ${textColor}`}>
                                    {title2}
                                </h2>
                            )}
                        </div>
                        {description && (
                            <div className={`text-sm sm:text-base font-medium ${textColor}`}>
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
                            className="fixed sm:absolute top-4 sm:top-22 right-4 sm:right-12 m-2 p-4 rounded-full text-white transition duration-200 ease-in-out ml-2"
                            aria-label="Close"
                        >
                            <CircleAlert size={18} strokeWidth={2.75} className='cursor-pointer'/>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}