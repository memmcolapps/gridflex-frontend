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
  const [selectedBand, setSelectedBand] = useState("All Bands");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedMeterClass, setSelectedMeterClass] = useState("Meter Class");
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
    band: selectedBand !== "All Bands" ? selectedBand : undefined,
    year: selectedYear !== "All Years" ? selectedYear : undefined,
    meterClass:
      selectedMeterClass !== "Meter Class" ? selectedMeterClass : undefined,
  };
  const { data: statusCardData, isLoading: statusCardLoading } =
    useDashboard(filters); // For status cards only

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

  if (statusCardLoading) {
    return (
      <div className="min-h-screen bg-transparent px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full space-y-6 bg-transparent">
          <div className="flex items-start justify-between bg-transparent">
            <ContentHeader
              title="Overview"
              description="General overview of Data Management Dashboard"
            />
          </div>

          {/* Loading Skeleton for Filters */}
          <section>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <div className="h-10 animate-pulse rounded-md bg-gray-200"></div>
                <div className="h-10 animate-pulse rounded-md bg-gray-200"></div>
                <div className="h-10 animate-pulse rounded-md bg-gray-200"></div>
              </div>
            </div>
          </section>

          {/* Loading Skeleton for Status Cards */}
          <section>
            <div className="grid h-40 w-full grid-cols-1 gap-4 bg-transparent sm:grid-cols-2 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
                  </div>
                  <div className="mt-4">
                    <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                    <div className="mt-2 h-4 w-12 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Loading Skeleton for Chart */}
          <section className="mt-10 rounded-lg border border-gray-200 bg-white pt-6 shadow-sm">
            <div className="mb-4 px-6">
              <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="mb-6 flex gap-2 px-6">
              <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
              <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="mx-6 mb-6 h-[200px] animate-pulse rounded bg-gray-100"></div>
          </section>

          {/* Loading Skeleton for Bottom Section */}
          <section className="px-4">
            <div className="w-full">
              <div className="grid grid-cols-1 gap-6 bg-transparent pt-6 md:grid-cols-2">
                {/* Manufacturer Distribution Skeleton */}
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="p-6">
                    <div className="mb-4 h-6 w-40 animate-pulse rounded bg-gray-200"></div>
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div className="mr-2 h-3 w-3 animate-pulse rounded-full bg-gray-200"></div>
                            <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                          </div>
                          <div className="h-4 w-8 animate-pulse rounded bg-gray-200"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Meter Status Skeleton */}
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="p-6">
                    <div className="mb-4 h-6 w-24 animate-pulse rounded bg-gray-200"></div>
                    <div className="flex flex-col gap-4 md:flex-row">
                      <div className="w-full space-y-3 md:w-1/2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="flex items-center">
                            <div className="mr-2 h-3 w-3 animate-pulse rounded-full bg-gray-200"></div>
                            <div className="h-4 w-16 flex-grow animate-pulse rounded bg-gray-200"></div>
                            <div className="h-4 w-8 animate-pulse rounded bg-gray-200"></div>
                          </div>
                        ))}
                      </div>
                      <div className="h-[200px] w-full animate-pulse rounded bg-gray-100 md:w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent px-4 py-6 sm:px-6 lg:px-8">
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
            selectedMeterClass={selectedMeterClass}
            setSelectedMeterClass={setSelectedMeterClass}
          />
        </section>
        <section>
          {statusCardLoading ? (
            <div className="grid h-40 w-full grid-cols-1 gap-4 bg-transparent sm:grid-cols-2 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
                  </div>
                  <div className="mt-4">
                    <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                    <div className="mt-2 h-4 w-12 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid h-40 w-full grid-cols-1 gap-4 bg-transparent sm:grid-cols-2 md:grid-cols-4">
              <StatusCard
                title="Total Meters"
                value={statusCardData?.cardData?.totalMeter?.toString() ?? "0"}
                change="+11.01%"
                changeColor="text-black"
                bgColor="bg-[rgba(219,230,254,1)]"
                borderColor="border-blue-100"
                textColor="text-black"
                icon="CircleCheckBig"
                iconBgColor="bg-[rgba(191,211,254,1)]"
                iconColor="text-[rgba(22,28,202,1)]"
              />
              <StatusCard
                title="Allocated"
                value={statusCardData?.cardData?.allocated?.toString() ?? "0"}
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
                value={statusCardData?.cardData?.assigned?.toString() ?? "0"}
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
                value={statusCardData?.cardData?.deactivated?.toString() ?? "0"}
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
          )}
        </section>

        <section className="mt-10 rounded-lg bg-transparent pt-6 shadow-sm">
          <MetersInstalledChart />
        </section>

        <section>
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
