'use client'

import {
  Plus,
  Copy,
  BarChart3,
  Calendar,
  Upload,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const quickActions = [
  {
    title: 'New Campaign',
    description: 'Create a new marketing campaign',
    icon: Plus,
    action: 'primary',
    href: '/auth/userDashboard/new-campaign'
  },
  {
    title: 'Duplicate Campaign',
    description: 'Copy an existing campaign',
    icon: Copy,
    action: 'secondary',
    href: '/auth/userDashboard/campaigns'
  },
  {
    title: 'View Analytics',
    description: 'Check campaign performance',
    icon: BarChart3,
    action: 'secondary',
    href: '/auth/userDashboard/analytics'
  },
  {
    title: 'Schedule Posts',
    description: 'Plan your content calendar',
    icon: Calendar,
    action: 'secondary',
    href: '/auth/userDashboard/calendar'
  },
  {
    title: 'Import Data',
    description: 'Upload campaign data',
    icon: Upload,
    action: 'secondary',
    href: '/auth/userDashboard/import'
  },
  {
    title: 'Export Report',
    description: 'Download campaign reports',
    icon: Download,
    action: 'secondary',
    href: '/auth/userDashboard/export'
  }
]

export function QuickActions({ className }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {quickActions.map((action) => {
            const Icon = action.icon

            return (
              <Button
                key={action.title}
                variant={action.action === 'primary' ? 'default' : 'outline'}
                className={cn(
                  'h-auto p-4 justify-start whitespace-normal',
                  action.action === 'primary' && 'bg-primary hover:bg-primary/90'
                )}
              >
                <div className="flex items-start space-x-3">
                  <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-medium leading-tight">{action.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-tight">
                      {action.description}
                    </div>
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}