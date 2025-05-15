import { NotificationBar } from "@/components/notificationbar";
import OrganizationalTree from "@/components/organization/OrganizationalTree";
import { Card } from "@/components/ui/card";
import { ContentHeader } from "@/components/ui/content-header";
import { Edit } from "lucide-react";

export default function OrganizationPage() {
    return (
        <div className="min-h-screen">
            <NotificationBar
                title="Organization Structure"
                bgColor="bg-[rgba(22,28,202,1)]"
                textColor="text-white"
                isTopBanner={true}
            />
            <NotificationBar
                title2="How to use"
                description={
                    <div className="flex items-center gap-2 ml-2 mt-2">
                        <Edit size={14}/>
                        <span>Edit/View an existing organization</span>
                    </div>
                }
                bgColor="bg-[rgba(219,230,254,1)]"
                textColor="text-[rgba(22,28,202,1)]"
                closable={true}
                showIcon={true}
                isTopBanner={false}
            />
            <Card className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl space-y-6 border-none bg-white shadow-sm rounded-lg">
                <div className="flex justify-between items-start pt-6">
                    <ContentHeader
                        title="Organization Hierarchy"
                        description="Build your organisation structure"
                    />
                </div>
                <section>
                    <OrganizationalTree />
                </section>
            </Card>
        </div>
    );
}