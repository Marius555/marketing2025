'use client'

import React from 'react'
import { CampaignWizard } from '@/components/campaigns/CampaignWizard'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { DashboardHeader } from '@/components/layout/DashboardHeader'

const NewCampaignPage = ({ params }) => {
  const { id } = React.use(params)

  console.log('New Campaign Page ID:', id)

  const handleCampaignComplete = (data) => {
    console.log('Campaign created for user:', id, 'Campaign data:', data)
    // Handle campaign creation - could redirect to campaign list or show success message
    // You can add navigation logic here, e.g., router.push(`/auth/userDashboard/${id}`)
  }

  const handleCancel = () => {
    // Handle cancel - could redirect back to dashboard
    console.log('Campaign creation cancelled for user:', id)
    // You can add navigation logic here, e.g., router.push(`/auth/userDashboard/${id}`)
  }

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
              <h1 className="text-3xl font-bold tracking-tight">Create New Campaign</h1>
              <p className="text-muted-foreground">
                Create a targeted marketing campaign with our step-by-step wizard
              </p>
            </div>

            <CampaignWizard
              onComplete={handleCampaignComplete}
              onCancel={handleCancel}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default NewCampaignPage