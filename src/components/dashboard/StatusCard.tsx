import { CircleAlert, CircleCheckBig, CircleX, TrendingUp } from 'lucide-react';

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

    return (
        <div
            className={`flex items-center justify-between p-4 rounded-xl ${bgColor} ${textColor} border ${borderColor} shadow-xs hover:shadow-sm transition-shadow`}
        >
            <div className='flex flex-col gap-3'>
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="text-lg font-semibold flex items-center gap-2">
                    {value}{' '}
                    <span className={`text-xs flex flex-row items-center ${changeColor}`}>
                        {change}
                        <TrendingUp size={14} />
                    </span>
                </p>
            </div>
            <div className={`${bgColor.replace('50', '100')} rounded-full p-2`}>{renderIcon()}</div>
        </div>
    );
};