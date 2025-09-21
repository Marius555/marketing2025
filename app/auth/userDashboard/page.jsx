import React from 'react'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { DashboardOverview } from '@/components/dashboard/DashboardOverview'

const UserDashboard = () => {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader />

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Overview of your marketing campaigns and performance metrics.
              </p>
            </div>

            <DashboardOverview />
          </div>
        </main>
      </div>
    </div>
  )
}

export default UserDashboard
