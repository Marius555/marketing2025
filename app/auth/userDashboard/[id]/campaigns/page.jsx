import React from 'react'
import { CampaignList } from '@/components/campaigns/CampaignList'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { DashboardHeader } from '@/components/layout/DashboardHeader'

const CampaignsPage = ({ params }) => {
  const { id } = React.use(params)

  console.log('Campaigns Page ID:', id)

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
              <h1 className="text-3xl font-bold tracking-tight">All Campaigns</h1>
              <p className="text-muted-foreground">
                Manage and monitor all your marketing campaigns across platforms for user: {id}
              </p>
            </div>

            <CampaignList />
          </div>
        </main>
      </div>
    </div>
  )
}

export default CampaignsPage