import { Footer } from "@/components/footer";

export default function MeterManagementPage() {
    return (
        <div className="flex flex-col space-y-4">
            <h1 className="text-4xl font-bold leading-tight tracking-tight mb-3 mt-2">Meter Management</h1>
            <p className="text-muted-foreground text-md">Manage your meters here.</p>
            <Footer/>
        </div>
    )
}