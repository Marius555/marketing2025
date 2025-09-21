'use client'

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const statsData = [
  {
    title: 'Total Campaigns',
    value: '38',
    change: '+12%',
    trend: 'up',
    icon: Target,
    description: 'Active campaigns across all platforms'
  },
  {
    title: 'Total Reach',
    value: '2.4M',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
    description: 'People reached this month'
  },
  {
    title: 'Ad Spend',
    value: '$12,543',
    change: '-2.1%',
    trend: 'down',
    icon: DollarSign,
    description: 'Total advertising spend'
  },
  {
    title: 'Engagement Rate',
    value: '4.8%',
    change: '+0.9%',
    trend: 'up',
    icon: Activity,
    description: 'Average engagement across platforms'
  }
]

export function CampaignStats({ className }) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
      {statsData.map((stat) => {
        const Icon = stat.icon
        const isPositive = stat.trend === 'up'
        const TrendIcon = isPositive ? TrendingUp : TrendingDown

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs">
                <TrendIcon
                  className={cn(
                    'h-3 w-3',
                    isPositive ? 'text-green-500' : 'text-red-500'
                  )}
                />
                <span
                  className={cn(
                    'font-medium',
                    isPositive ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {stat.change}
                </span>
                <span className="text-muted-foreground">from last month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}