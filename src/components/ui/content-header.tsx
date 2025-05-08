import { cn } from "@/lib/utils"


export function ContentHeader({
    title,
    description,
    className,
}: {
    title: string
    description?: string
    className?: string
}) {
    return (
        <div className={cn("flex flex-col space-y-1", className)}>
            <h1 className="text-4xl font-bold leading-tight tracking-tight mb-3 mt-2">{title}</h1>
            {description && (
                <p className="text-muted-foreground text-md">{description}</p>
            )}
        </div>
    )
}