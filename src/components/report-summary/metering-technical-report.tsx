import { useState, useRef, useEffect } from "react";
import { Folder, KeyRound, Repeat, TrendingUp, Zap } from "lucide-react";
import { Card } from "../ui/card";

export function MeteringTechnicalReport() {
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const carouselRef = useRef<HTMLDivElement | null>(null);

    const cards = [
        { icon: Zap, title: "Feeder Report", subtitle: "Overview of Feeders" },
        { icon: Folder, title: "Monthly ASCII Report", subtitle: "Monthly Data Export" },
        { icon: KeyRound, title: "New Application Setup", subtitle: "Setup And Applications" },
        { icon: TrendingUp, title: "Consumption Report", subtitle: "Consumption Energy Usage" },
        { icon: Repeat, title: "Feeder to DSS Mapping", subtitle: "Mapping Of Feeders TO DSS" },
    ];

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollLeft);
        if (carouselRef.current) {
            carouselRef.current.style.cursor = "grabbing";
        }
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        if (carouselRef.current) {
            carouselRef.current.style.cursor = "grab";
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (carouselRef.current) {
            carouselRef.current.style.cursor = "grab";
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - startX;
        if (carouselRef.current) {
            carouselRef.current.scrollLeft = scrollLeft - x;
        }
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setIsDragging(true);
        if (e.touches.length > 0) {
            setStartX(e.touches[0]!.pageX - scrollLeft);
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        if (e.touches.length > 0) {
            const x = e.touches[0]!.pageX - startX;
            if (carouselRef.current) {
                carouselRef.current.scrollLeft = scrollLeft - x;
            }
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrollLeft(carouselRef.current?.scrollLeft ?? 0);
        };
        if (carouselRef.current) {
            const carousel = carouselRef.current;
            carousel.addEventListener("scroll", handleScroll);
            return () => carousel.removeEventListener("scroll", handleScroll);
        }
    }, []);

    return (
        <div className="w-full" style={{ maxWidth: '100%'}}>
            <h3 className="text-3xl font-semibold text-gray-700 p-2">
                Metering/ Technical Reports
            </h3>
            <div className="w-full p-2 overflow-hidden">
                <div
                    ref={carouselRef}
                    className="flex flex-row gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar"
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ cursor: "grab" }}
                >
                    {cards.map((card, index) => (
                        <Card
                            key={index}
                            className="w-90 px-6 shadow-none py-12 border border-gray-200 rounded-lg cursor-pointer flex-shrink-0 snap-start"
                        >
                            <div className="flex flex-row gap-2 items-center text-gray-700 font-semibold text-2xl">
                                <card.icon size={20} />
                                {card.title}
                            </div>
                            <h3 className="text-md font-medium text-gray-500">
                                {card.subtitle}
                            </h3>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}