'use client'

import { CampaignStats } from './CampaignStats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const recentCampaigns = [
  {
    id: 1,
    name: 'Spring Product Launch',
    platform: 'Facebook',
    status: 'active',
    budget: '$2,500',
    spent: '$1,247',
    reach: '45.2K',
    clicks: '2,341',
    platformColor: 'bg-blue-500'
  },
  {
    id: 2,
    name: 'Tech Community Outreach',
    platform: 'Reddit',
    status: 'paused',
    budget: '$800',
    spent: '$156',
    reach: '12.8K',
    clicks: '567',
    platformColor: 'bg-orange-500'
  },
  {
    id: 3,
    name: 'Brand Awareness',
    platform: 'Instagram',
    status: 'active',
    budget: '$1,200',
    spent: '$890',
    reach: '28.7K',
    clicks: '1,234',
    platformColor: 'bg-pink-500'
  },
  {
    id: 4,
    name: 'Developer Tool Launch',
    platform: 'Hacker News',
    status: 'scheduled',
    budget: '$500',
    spent: '$0',
    reach: '0',
    clicks: '0',
    platformColor: 'bg-orange-600'
  }
]

const getStatusIcon = (status) => {
  switch (status) {
    case 'active':
      return <Play className="h-3 w-3" />
    case 'paused':
      return <Pause className="h-3 w-3" />
    case 'scheduled':
      return <Clock className="h-3 w-3" />
    case 'completed':
      return <CheckCircle className="h-3 w-3" />
    default:
      return <AlertCircle className="h-3 w-3" />
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-500/10 text-green-600 border-green-200'
    case 'paused':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-200'
    case 'scheduled':
      return 'bg-blue-500/10 text-blue-600 border-blue-200'
    case 'completed':
      return 'bg-gray-500/10 text-gray-600 border-gray-200'
    default:
      return 'bg-red-500/10 text-red-600 border-red-200'
  }
}

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <CampaignStats />

      {/* Recent Campaigns */}
      <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Campaigns</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="grid grid-cols-3 items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Left: Campaign Info */}
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${campaign.platformColor}`} />
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {campaign.platform}
                      </div>
                    </div>
                  </div>

                  {/* Center: Status Badge */}
                  <div className="flex justify-center">
                    <Badge
                      variant="outline"
                      className={`capitalize min-w-[80px] flex items-center justify-center ${getStatusColor(campaign.status)}`}
                    >
                      {getStatusIcon(campaign.status)}
                      <span className="ml-1">{campaign.status}</span>
                    </Badge>
                  </div>

                  {/* Right: Metrics and Menu */}
                  <div className="flex items-center justify-end space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {campaign.spent} / {campaign.budget}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {campaign.reach} reach • {campaign.clicks} clicks
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Campaign
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <TrendingUp className="mr-2 h-4 w-4" />
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {campaign.status === 'active' ? (
                            <>
                              <Pause className="mr-2 h-4 w-4" />
                              Pause Campaign
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Resume Campaign
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
    </div>
  )
}