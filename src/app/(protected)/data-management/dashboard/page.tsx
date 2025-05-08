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
    <div className=" min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl space-y-6">
        <div className="flex justify-between items-start pt-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full h-40">
            {statusCards.map((card, index) => (
              <StatusCard key={index} {...card} />
            ))}
          </div>
        </section>

        <section className='mt-10 pt-6 rounded-lg bg-white shadow-sm'>
          <MetersInstalledChart />
        </section>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <ManufacturerDistribution/>
            <MeterStatus/>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
