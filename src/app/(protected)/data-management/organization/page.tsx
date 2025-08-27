// pages/organization/index.tsx (Your existing page component)
import { NotificationBar } from "@/components/notificationbar";
import OrganizationalTree from "@/components/organization/OrganizationalTree";
import { Card } from "@/components/ui/card";
import { ContentHeader } from "@/components/ui/content-header";
import { Edit } from "lucide-react";

export default function OrganizationPage() {
  return (
    <div className="min-h-screen bg-transparent p-6">
      <NotificationBar
        title="Organization Structure"
        bgColor="bg-[rgba(22,28,202,1)]"
        textColor="text-white"
        isTopBanner={true}
      />
      <NotificationBar
        title2="How to use"
        description={
          <div className="mt-2 flex items-center gap-2">
            <Edit size={14} />
            <span>Edit/View an existing organization</span>
          </div>
        }
        bgColor="bg-[rgba(219,230,254,1)]"
        textColor="text-[rgba(22,28,202,1)]"
        closable={true}
        showIcon={true}
        isTopBanner={false}
      />
      <Card className="max-w-screen-2xl space-y-6 rounded-lg border-none bg-transparent p-6 px-4 shadow-sm sm:px-6 lg:px-8">
        <div className="flex items-start justify-between bg-transparent pt-6">
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
