'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentHeader } from '@/components/ui/content-header';
import { StatusCard } from '@/components/dashboard/StatusCard';
import { SearchAndFilters } from '@/components/dashboard/SearchAndFilters';
import { MetersInstalledChart } from '@/components/dashboard/MetersInstalledChart';
import { ManufacturerDistribution } from '@/components/dashboard/ManufacturerDistribution';
import { MeterStatus } from '@/components/dashboard/MeterStatus';
import { statusCards } from '@/lib/dashboardData';

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBand, setSelectedBand] = useState('Band');
  const [selectedYear, setSelectedYear] = useState('Year');
  const [selectedMeterType, setSelectedMeterType] = useState('Meter Type');

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto px-4 md:px-6">
        <div className="flex justify-between items-start mb-6 mt-4 max-w-[1000px] mx-auto">
          <ContentHeader
            title="Overview"
            description="General overview of Data Management Dashboard"
          />
        </div>
        <section className="mb-6 max-w-[1000px] mx-auto">
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
        <section className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 w-[1000px] h-[90px] mx-auto">
            {statusCards.map((card, index) => (
              <StatusCard key={index} {...card} />
            ))}
          </div>
        </section>
        <div className="mb-6 mx-auto">
          <MetersInstalledChart />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-[1000px] mx-auto">
          <ManufacturerDistribution />
          <MeterStatus />
        </div>
      </div>
    </div>
  );
}