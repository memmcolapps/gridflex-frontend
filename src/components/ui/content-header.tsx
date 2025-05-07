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
            <h1 className="text-3xl font-bold leading-tight tracking-tight">{title}</h1>
            {description && (
                <p className="text-muted-foreground text-sm">{description}</p>
            )}
        </div>
    )
}