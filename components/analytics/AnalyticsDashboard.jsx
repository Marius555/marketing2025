'use client'

import { useState } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  MousePointer,
  Eye,
  BarChart3,
  Filter
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock data for analytics
const performanceData = [
  { date: '2024-01-01', reach: 12400, clicks: 450, conversions: 23, spend: 120 },
  { date: '2024-01-02', reach: 15600, clicks: 678, conversions: 34, spend: 156 },
  { date: '2024-01-03', reach: 18200, clicks: 823, conversions: 45, spend: 189 },
  { date: '2024-01-04', reach: 16800, clicks: 756, conversions: 38, spend: 167 },
  { date: '2024-01-05', reach: 21300, clicks: 945, conversions: 52, spend: 234 },
  { date: '2024-01-06', reach: 19700, clicks: 887, conversions: 47, spend: 203 },
  { date: '2024-01-07', reach: 23100, clicks: 1023, conversions: 61, spend: 278 },
]

const platformData = [
  { platform: 'Facebook', campaigns: 8, spend: 3420, reach: 89500, conversions: 234 },
  { platform: 'Instagram', campaigns: 12, spend: 2890, reach: 76200, conversions: 189 },
  { platform: 'Reddit', campaigns: 5, spend: 890, reach: 34100, conversions: 67 },
  { platform: 'Hacker News', campaigns: 3, spend: 450, reach: 12800, conversions: 23 },
]

const conversionFunnelData = [
  { stage: 'Impressions', value: 125000, percentage: 100 },
  { stage: 'Clicks', value: 6250, percentage: 5.0 },
  { stage: 'Landing Page', value: 4875, percentage: 3.9 },
  { stage: 'Sign-ups', value: 975, percentage: 0.78 },
  { stage: 'Conversions', value: 195, percentage: 0.16 },
]

const campaignPerformance = [
  { name: 'Spring Launch', platform: 'Facebook', status: 'active', spend: 1247, revenue: 4830, roi: 287 },
  { name: 'Tech Outreach', platform: 'Reddit', status: 'paused', spend: 156, revenue: 489, roi: 213 },
  { name: 'Brand Awareness', platform: 'Instagram', status: 'active', spend: 890, revenue: 2340, roi: 163 },
  { name: 'Dev Tool Launch', platform: 'Hacker News', status: 'scheduled', spend: 0, revenue: 0, roi: 0 },
]

const COLORS = {
  Facebook: '#1877F2',
  Instagram: '#E4405F',
  Reddit: '#FF4500',
  'Hacker News': '#FF6600'
}

const MetricCard = ({ title, value, change, icon: Icon, trend }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-center space-x-2">
            <p className="text-3xl font-bold">{value}</p>
            {change && (
              <div className={`flex items-center text-sm ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {change}
              </div>
            )}
          </div>
        </div>
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
    </CardContent>
  </Card>
)

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedPlatform, setSelectedPlatform] = useState('all')

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your campaign performance and ROI across all platforms.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="reddit">Reddit</SelectItem>
              <SelectItem value="hackernews">Hacker News</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Spend"
          value="$8,650"
          change="+12.5%"
          icon={DollarSign}
          trend="up"
        />
        <MetricCard
          title="Total Reach"
          value="212.6K"
          change="+8.2%"
          icon={Users}
          trend="up"
        />
        <MetricCard
          title="Total Clicks"
          value="6,250"
          change="+15.7%"
          icon={MousePointer}
          trend="up"
        />
        <MetricCard
          title="Conversions"
          value="513"
          change="+22.3%"
          icon={TrendingUp}
          trend="up"
        />
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={performanceData}>
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
                  <Line yAxisId="right" type="monotone" dataKey="spend" stroke="#ff7300" strokeWidth={3} dot={{ fill: '#ff7300' }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Daily Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value, name) => [
                        value.toLocaleString(),
                        name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="conversions" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="clicks" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* ROI by Campaign */}
            <Card>
              <CardHeader>
                <CardTitle>ROI by Campaign</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={campaignPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'roi' ? `${value}%` : `$${value}`,
                      name === 'roi' ? 'ROI' : name.charAt(0).toUpperCase() + name.slice(1)
                    ]} />
                    <Legend />
                    <Bar dataKey="roi" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Platform Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Spend by Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="spend"
                      label={({ platform, percentage }) => `${platform} ${percentage?.toFixed(1)}%`}
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.platform]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Spend']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Platform Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={platformData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="reach" fill="#8884d8" />
                    <Bar dataKey="conversions" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Platform Stats Table */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformData.map((platform) => (
                  <div key={platform.platform} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: COLORS[platform.platform] }}
                      />
                      <div>
                        <div className="font-medium">{platform.platform}</div>
                        <div className="text-sm text-muted-foreground">
                          {platform.campaigns} campaigns
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-8 text-right">
                      <div>
                        <div className="text-sm text-muted-foreground">Spend</div>
                        <div className="font-medium">${platform.spend.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Reach</div>
                        <div className="font-medium">{platform.reach.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Conversions</div>
                        <div className="font-medium">{platform.conversions}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Campaign Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignPerformance.map((campaign) => (
                  <div key={campaign.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[campaign.platform] }}
                      />
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {campaign.platform}
                        </div>
                      </div>
                      <Badge
                        variant={campaign.status === 'active' ? 'default' :
                                campaign.status === 'paused' ? 'secondary' : 'outline'}
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-8 text-right">
                      <div>
                        <div className="text-sm text-muted-foreground">Spend</div>
                        <div className="font-medium">${campaign.spend.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Revenue</div>
                        <div className="font-medium">${campaign.revenue.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">ROI</div>
                        <div className={`font-medium ${campaign.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {campaign.roi}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-6">
          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnelData.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{stage.stage}</span>
                      <div className="text-right">
                        <div className="font-medium">{stage.value.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{stage.percentage}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full transition-all duration-300"
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                    {index < conversionFunnelData.length - 1 && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}