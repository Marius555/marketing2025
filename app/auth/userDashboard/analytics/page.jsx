import React from 'react'
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { DashboardHeader } from '@/components/layout/DashboardHeader'

const AnalyticsPage = () => {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <AnalyticsDashboard />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AnalyticsPage