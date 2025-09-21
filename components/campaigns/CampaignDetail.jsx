'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Play,
  Pause,
  Edit,
  Copy,
  MoreHorizontal,
  TrendingUp,
  Users,
  MousePointer,
  DollarSign,
  Calendar,
  Target,
  Settings,
  BarChart3
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'

// Mock campaign data
const campaignData = {
  id: 1,
  name: 'Spring Product Launch',
  platform: 'Facebook',
  status: 'active',
  startDate: '2024-03-01',
  endDate: '2024-03-31',
  budget: {
    total: 2500,
    spent: 1247,
    remaining: 1253,
    type: 'total'
  },
  targeting: {
    ageRange: '25-45',
    interests: ['Technology', 'Business', 'Marketing'],
    locations: ['United States', 'Canada'],
    audience: 'Custom Audience'
  },
  creative: {
    headline: 'Boost Your Productivity with Our New Tool',
    description: 'Discover how our latest productivity app can transform your workflow.',
    callToAction: 'Learn More',
    linkUrl: 'https://example.com/product'
  },
  performance: {
    reach: 45200,
    impressions: 89500,
    clicks: 2341,
    conversions: 89,
    ctr: 5.2,
    cpc: 0.53,
    cpm: 13.92,
    roas: 287
  }
}

const performanceHistory = [
  { date: '2024-03-01', reach: 3200, clicks: 145, conversions: 8, spend: 89 },
  { date: '2024-03-02', reach: 4100, clicks: 189, conversions: 12, spend: 112 },
  { date: '2024-03-03', reach: 5300, clicks: 234, conversions: 15, spend: 134 },
  { date: '2024-03-04', reach: 4800, clicks: 201, conversions: 11, spend: 98 },
  { date: '2024-03-05', reach: 6200, clicks: 278, conversions: 18, spend: 156 },
  { date: '2024-03-06', reach: 5900, clicks: 256, conversions: 14, spend: 145 },
  { date: '2024-03-07', reach: 7100, clicks: 312, conversions: 21, spend: 178 },
]

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-500/10 text-green-600 border-green-200'
    case 'paused':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-200'
    case 'completed':
      return 'bg-gray-500/10 text-gray-600 border-gray-200'
    default:
      return 'bg-red-500/10 text-red-600 border-red-200'
  }
}

const getPlatformColor = (platform) => {
  const colors = {
    'Facebook': 'bg-blue-500',
    'Instagram': 'bg-pink-500',
    'Reddit': 'bg-orange-500',
    'Hacker News': 'bg-orange-600'
  }
  return colors[platform] || 'bg-gray-500'
}

const MetricCard = ({ title, value, subtitle, icon: Icon, trend, change }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-muted rounded-lg">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        {change && (
          <div className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
)

export function CampaignDetail({ campaignId, onBack }) {
  const [campaign] = useState(campaignData)

  const budgetUsedPercentage = (campaign.budget.spent / campaign.budget.total) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${getPlatformColor(campaign.platform)}`} />
            <div>
              <h1 className="text-2xl font-bold">{campaign.name}</h1>
              <p className="text-muted-foreground">
                {campaign.platform} • {campaign.startDate} - {campaign.endDate}
              </p>
            </div>
            <Badge variant="outline" className={getStatusColor(campaign.status)}>
              {campaign.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {campaign.status === 'active' ? (
            <Button variant="outline" size="sm">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          ) : (
            <Button variant="outline" size="sm">
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate Campaign
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChart3 className="mr-2 h-4 w-4" />
                Export Analytics
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Campaign Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Reach"
          value={campaign.performance.reach.toLocaleString()}
          subtitle={`${campaign.performance.impressions.toLocaleString()} impressions`}
          icon={Users}
          trend="up"
          change="+8.2%"
        />
        <MetricCard
          title="Clicks"
          value={campaign.performance.clicks.toLocaleString()}
          subtitle={`${campaign.performance.ctr}% CTR`}
          icon={MousePointer}
          trend="up"
          change="+15.7%"
        />
        <MetricCard
          title="Conversions"
          value={campaign.performance.conversions}
          subtitle={`$${campaign.performance.cpc} CPC`}
          icon={TrendingUp}
          trend="up"
          change="+22.3%"
        />
        <MetricCard
          title="Spend"
          value={`$${campaign.budget.spent.toLocaleString()}`}
          subtitle={`$${campaign.budget.remaining.toLocaleString()} remaining`}
          icon={DollarSign}
          trend="up"
          change="+12.5%"
        />
      </div>

      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Budget Usage</span>
              <span className="text-sm text-muted-foreground">
                ${campaign.budget.spent.toLocaleString()} / ${campaign.budget.total.toLocaleString()}
              </span>
            </div>
            <Progress value={budgetUsedPercentage} className="w-full" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">${campaign.budget.spent.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Spent</div>
              </div>
              <div>
                <div className="text-2xl font-bold">${campaign.budget.remaining.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{campaign.performance.roas}%</div>
                <div className="text-sm text-muted-foreground">ROAS</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="targeting">Targeting</TabsTrigger>
          <TabsTrigger value="creative">Creative</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={performanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value, name) => [
                      name === 'spend' ? `$${value}` : value.toLocaleString(),
                      name.charAt(0).toUpperCase() + name.slice(1)
                    ]}
                  />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="reach" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Area yAxisId="left" type="monotone" dataKey="clicks" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Line yAxisId="right" type="monotone" dataKey="spend" stroke="#ff7300" strokeWidth={2} dot={{ fill: '#ff7300' }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Click-through Rate</span>
                    <span className="font-medium">{campaign.performance.ctr}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost per Click</span>
                    <span className="font-medium">${campaign.performance.cpc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost per Mille</span>
                    <span className="font-medium">${campaign.performance.cpm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversion Rate</span>
                    <span className="font-medium">
                      {((campaign.performance.conversions / campaign.performance.clicks) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Averages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Reach</span>
                    <span className="font-medium">
                      {Math.round(campaign.performance.reach / 7).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clicks</span>
                    <span className="font-medium">
                      {Math.round(campaign.performance.clicks / 7).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversions</span>
                    <span className="font-medium">
                      {Math.round(campaign.performance.conversions / 7)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spend</span>
                    <span className="font-medium">
                      ${Math.round(campaign.budget.spent / 7)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="targeting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audience Targeting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Demographics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Age Range</span>
                        <span className="text-sm font-medium">{campaign.targeting.ageRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Audience Type</span>
                        <span className="text-sm font-medium">{campaign.targeting.audience}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Locations</h4>
                    <div className="flex flex-wrap gap-2">
                      {campaign.targeting.locations.map((location) => (
                        <Badge key={location} variant="secondary">
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {campaign.targeting.interests.map((interest) => (
                        <Badge key={interest} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creative" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ad Creative</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Headline</h4>
                  <p className="text-lg">{campaign.creative.headline}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p>{campaign.creative.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Call to Action</h4>
                    <Badge variant="default">{campaign.creative.callToAction}</Badge>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Destination URL</h4>
                    <a
                      href={campaign.creative.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm break-all"
                    >
                      {campaign.creative.linkUrl}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Basic Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Campaign ID</span>
                        <span className="text-sm font-medium">#{campaign.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Platform</span>
                        <span className="text-sm font-medium">{campaign.platform}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Status</span>
                        <Badge variant="outline" className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Schedule</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Start Date</span>
                        <span className="text-sm font-medium">{campaign.startDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">End Date</span>
                        <span className="text-sm font-medium">{campaign.endDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Budget Configuration</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Budget Type</span>
                        <span className="text-sm font-medium capitalize">{campaign.budget.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Budget</span>
                        <span className="text-sm font-medium">${campaign.budget.total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Spent</span>
                        <span className="text-sm font-medium">${campaign.budget.spent.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}