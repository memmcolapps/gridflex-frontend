// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ContentHeader } from "@/components/ui/content-header";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { SearchAndFilters } from "@/components/dashboard/SearchAndFilters";
import { MetersInstalledChart } from "@/components/dashboard/MetersInstalledChart";
import { ManufacturerDistribution } from "@/components/dashboard/ManufacturerDistribution";
import { MeterStatus } from "@/components/dashboard/MeterStatus";
import { useDashboard } from "@/hooks/use-dashboard";
import { CompleteProfileModal } from "@/components/profile/completeprofilemodal";
import { EditCompleteProfileModal } from "@/components/profile/editcompleteprofilemodal";

export default function DashboardPage() {
  const [selectedBand, setSelectedBand] = useState("Band");
  const [selectedYear, setSelectedYear] = useState("Year");
  const [selectedMeterType, setSelectedMeterType] = useState("Meter Type");
  const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);
  const [showEditCompleteProfileModal, setShowEditCompleteProfileModal] =
    useState(false);

  // Initial form data
  const [formData] = useState({
    firstName: "Abdulmujib",
    lastName: "Oyewo",
    email: "oyewoabdulmujib2@gmail.com",
    phoneNumber: "",
    newPassword: "12345678",
    confirmPassword: "12345678",
    otp: "",
  });

  const router = useRouter();
  const filters = {
    band: selectedBand,
    year: selectedYear,
    meterType: selectedMeterType,
  };
  const { data: dashboardData, error, isLoading } = useDashboard(filters);

  // Open "Complete Your Profile" modal on fresh login
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const isFreshLogin = localStorage.getItem("fresh_login");

    if (!token) {
      console.log("No token, redirecting to login");
      router.push("/login");
    } else if (isFreshLogin === "true") {
      console.log("Fresh login detected, showing modal");
      setShowCompleteProfileModal(true);
      localStorage.setItem("fresh_login", "false"); // Clear the flag
    } else {
      console.log("Not a fresh login, modal not shown");
    }
  }, [router]);

  // Handle form submission from EditCompleteProfileModal
  const handleEditProfileSubmit = (updatedFormData: typeof formData) => {
    console.log("Profile updated:", updatedFormData);
    // Add logic to save profile data (e.g., API call)
    setShowEditCompleteProfileModal(false);
    setShowCompleteProfileModal(false);
  };

  return (
    <div className="min-h-screen bg-transparent px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full space-y-6 bg-transparent">
        <div className="flex items-start justify-between bg-transparent">
          <ContentHeader
            title="Overview"
            description="General overview of Data Management Dashboard"
          />
        </div>

        <section>
          <SearchAndFilters
            selectedBand={selectedBand}
            setSelectedBand={setSelectedBand}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedMeterType={selectedMeterType}
            setSelectedMeterType={setSelectedMeterType}
          />
        </section>

        <section>
          <div className="grid h-40 w-full grid-cols-1 gap-4 bg-transparent sm:grid-cols-2 md:grid-cols-4">
            <StatusCard
              title="Total Meters"
              value={dashboardData?.cardData?.totalMeter?.toString() || "0"}
              change="+11.01%"
              changeColor="text-black"
              bgColor="bg-[rgba(219,230,254,1)]"
              borderColor="border-blue-100"
              textColor="text-black"
              icon="CircleCheckBig"
              iconBgColor="bg-[rgba(191,211,254,1)]"
              iconColor="text-[rgba(22,28,202,1)]"
              url="/data-management/meter-management"
            />
            <StatusCard
              title="Allocated"
              value={dashboardData?.cardData?.allocated?.toString() || "0"}
              change="-1.01%"
              changeColor="text-black"
              bgColor="bg-[rgb(254,246,195)]"
              borderColor="border-yellow-100"
              textColor="text-black"
              icon="CircleAlert"
              iconBgColor="bg-[rgba(254,231,138,1)]"
              iconColor="text-[rgba(235,161,62,1)]"
            />
            <StatusCard
              title="Assigned"
              value={dashboardData?.cardData?.assigned?.toString() || "0"}
              change="+2.20%"
              changeColor="text-black"
              bgColor="bg-emerald-100"
              borderColor="border-green-100"
              textColor="text-black"
              icon="CircleCheckBig"
              iconBgColor="bg-emerald-200"
              iconColor="text-[rgba(34,197,94,1)]"
            />
            <StatusCard
              title="Deactivated"
              value={dashboardData?.cardData?.deactivated?.toString() || "0"}
              change="-2.08%"
              changeColor="text-black"
              bgColor="bg-[rgb(216,219,223)]"
              borderColor="border-gray-200"
              textColor="text-black"
              icon="CircleX"
              iconBgColor="bg-[rgba(182,186,195,1)]"
              iconColor="text-[rgb(37,39,44)]"
            />
          </div>
        </section>

        <section className="mt-10 rounded-lg bg-transparent pt-6 shadow-sm">
          <MetersInstalledChart />
        </section>

        <section className="px-4">
          <div className="w-full">
            <div className="grid grid-cols-1 gap-6 bg-transparent pt-6 md:grid-cols-2">
              <ManufacturerDistribution />
              <MeterStatus />
            </div>
          </div>
        </section>
      </div>

      {/* Complete Your Profile Modal */}
      <CompleteProfileModal
        open={showCompleteProfileModal}
        onOpenChange={setShowCompleteProfileModal}
        onEditProfile={() => {
          setShowCompleteProfileModal(false);
          setShowEditCompleteProfileModal(true);
        }}
      />

      {/* Edit Complete Profile Modal */}
      <EditCompleteProfileModal
        open={showEditCompleteProfileModal}
        onOpenChange={setShowEditCompleteProfileModal}
        onSubmit={handleEditProfileSubmit}
        initialFormData={formData}
      />
    </div>
  );
}
