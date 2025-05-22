'use client';

import Link from 'next/link';
import { CircleAlert, CircleCheckBig, CircleX, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatusCardProps {
    title: string;
    value: string;
    change: string;
    changeColor: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    icon: string;
    iconBgColor: string;
    iconColor: string;
    url?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
    title,
    value,
    change,
    changeColor,
    bgColor,
    borderColor,
    textColor,
    icon,
    iconBgColor,
    iconColor,
    url,
}) => {
    const renderIcon = () => {
        const className = `${iconBgColor} p-3 rounded-full ${iconColor}`;
        switch (icon) {
            case 'CircleCheckBig':
                return <CircleCheckBig strokeWidth={2.5} className={className} />;
            case 'CircleAlert':
                return <CircleAlert strokeWidth={2.5} className={className} />;
            case 'CircleX':
                return <CircleX strokeWidth={2.5} className={className} />;
            default:
                return null;
        }
    };

    const cardContent = (
        <Card
            className={`flex-row items-center justify-between p-4 rounded-xl h-40 ${bgColor} ${textColor} border ${borderColor} shadow-xs hover:shadow-sm transition-shadow ${url ? 'cursor-pointer' : 'cursor-default'}`}
        >
            <div className="flex flex-col gap-3">
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="text-lg font-semibold flex items-center gap-2">
                    {value}{' '}
                    <span className={`text-xs flex flex-row items-center ${changeColor}`}>
                        {change}
                        <TrendingUp size={14} />
                    </span>
                </p>
            </div>
            <div className={`${iconBgColor} rounded-full p-2`}>{renderIcon()}</div>
        </Card>
    );

    return url ? (
        <Link href={url} passHref aria-label={`Navigate to ${title} page`}>
            {cardContent}
        </Link>
    ) : (
        cardContent
    );
};