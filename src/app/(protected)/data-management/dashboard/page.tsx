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
import { Footer } from '@/components/footer';

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
    <div className="bg-gray-50 min-h-screen -mt-10">
      <div className="mx-auto px-4 md:px-6">
        <div className="flex justify-between items-start mb-6 max-w-[1000px] mx-auto pt-6">
          <ContentHeader className='mt-10'
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
          <div className="w-[1000px] md:max-w-full mx-auto overflow-x-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 w-[1000px] min-h-[90px]">
              {statusCards.map((card, index) => (
                <StatusCard key={index} {...card} />
              ))}
            </div>
          </div>
        </section>
        <section className="mb-6">
          <div className="w-[1000px] md:max-w-full mx-auto overflow-x-auto">
            <MetersInstalledChart />
          </div>
        </section>
        <section>
          <div className="w-[1000px] md:max-w-full mx-auto overflow-x-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-[1000px]">
              <ManufacturerDistribution />
              <MeterStatus />
            </div>
          </div>
        </section>
        <Footer/>
      </div>
    </div>
  );
}