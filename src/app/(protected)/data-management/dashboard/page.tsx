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
import { statusCards } from "@/lib/dashboardData";
import { CompleteProfileModal } from "@/components/profile/completeprofilemodal";
import { EditCompleteProfileModal } from "@/components/profile/editcompleteprofilemodal";

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
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
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-screen-2xl space-y-6 bg-transparent">
        <div className="flex items-start justify-between bg-transparent">
          <ContentHeader
            title="Overview"
            description="General overview of Data Management Dashboard"
          />
        </div>

        <section>
          <SearchAndFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
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
            {statusCards.map((card, index) => (
              <StatusCard key={index} {...card} />
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-lg bg-transparent pt-6 shadow-sm">
          <MetersInstalledChart />
        </section>

        <section>
          <div className="grid grid-cols-1 gap-6 bg-transparent pt-6 md:grid-cols-2">
            <ManufacturerDistribution />
            <MeterStatus />
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
