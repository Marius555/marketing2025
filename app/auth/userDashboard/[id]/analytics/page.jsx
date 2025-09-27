import React from 'react'
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { DashboardHeader } from '@/components/layout/DashboardHeader'

const AnalyticsPage = ({ params }) => {
  const { id } = React.use(params)

  console.log('Analytics Page ID:', id)

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
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
              <p className="text-muted-foreground">
                Analytics dashboard for user: {id}
              </p>
            </div>

            <AnalyticsDashboard />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AnalyticsPage