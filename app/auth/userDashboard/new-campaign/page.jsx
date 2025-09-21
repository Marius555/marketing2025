'use client'

import React, { useState } from 'react'
import { CampaignWizard } from '@/components/campaigns/CampaignWizard'
import { RedditCampaign } from '@/components/campaigns/platforms/RedditCampaign'
import { FacebookCampaign } from '@/components/campaigns/platforms/FacebookCampaign'
import { InstagramCampaign } from '@/components/campaigns/platforms/InstagramCampaign'
import { HackerNewsCampaign } from '@/components/campaigns/platforms/HackerNewsCampaign'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const NewCampaignPage = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('wizard')

  const handleCampaignComplete = (data) => {
    console.log('Campaign created:', data)
    // Handle campaign creation - could redirect to campaign list or show success message
  }

  const handleCancel = () => {
    // Handle cancel - could redirect back to dashboard
    console.log('Campaign creation cancelled')
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
                Choose your platform and create a targeted marketing campaign.
              </p>
            </div>

            <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="wizard">Campaign Wizard</TabsTrigger>
                <TabsTrigger value="reddit">Reddit</TabsTrigger>
                <TabsTrigger value="facebook">Facebook</TabsTrigger>
                <TabsTrigger value="instagram">Instagram</TabsTrigger>
                <TabsTrigger value="hackernews">Hacker News</TabsTrigger>
              </TabsList>

              <TabsContent value="wizard">
                <CampaignWizard
                  onComplete={handleCampaignComplete}
                  onCancel={handleCancel}
                />
              </TabsContent>

              <TabsContent value="reddit">
                <RedditCampaign
                  onSubmit={handleCampaignComplete}
                  onCancel={handleCancel}
                />
              </TabsContent>

              <TabsContent value="facebook">
                <FacebookCampaign
                  onSubmit={handleCampaignComplete}
                  onCancel={handleCancel}
                />
              </TabsContent>

              <TabsContent value="instagram">
                <InstagramCampaign
                  onSubmit={handleCampaignComplete}
                  onCancel={handleCancel}
                />
              </TabsContent>

              <TabsContent value="hackernews">
                <HackerNewsCampaign
                  onSubmit={handleCampaignComplete}
                  onCancel={handleCancel}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

export default NewCampaignPage