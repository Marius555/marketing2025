'use client'

import { useState } from 'react'
import {
  Home,
  Plus,
  BarChart3,
  Settings,
  Calendar,
  DollarSign,
  Target,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { NewCampaignModal } from '@/components/campaign/NewCampaignModal'
import { RedditIcon, FacebookIcon, InstagramIcon, HackerNewsIcon } from '@/components/icons'

const sidebarItems = [
  {
    title: 'Overview',
    icon: Home,
    href: '/auth/userDashboard',
    badge: null
  },
  {
    title: 'New Campaign',
    icon: Plus,
    href: '/auth/userDashboard/new-campaign',
    badge: null
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    href: '/auth/userDashboard/analytics',
    badge: null
  },
  {
    title: 'Calendar',
    icon: Calendar,
    href: '/auth/userDashboard/calendar',
    badge: null
  },
  {
    title: 'Budget',
    icon: DollarSign,
    href: '/auth/userDashboard/budget',
    badge: null
  }
]

const platformItems = [
  {
    title: 'Reddit Campaigns',
    icon: RedditIcon,
    href: '/auth/userDashboard/reddit',
    badge: '12',
    color: 'bg-orange-500'
  },
  {
    title: 'Facebook Campaigns',
    icon: FacebookIcon,
    href: '/auth/userDashboard/facebook',
    badge: '8',
    color: 'bg-blue-500'
  },
  {
    title: 'Instagram Campaigns',
    icon: InstagramIcon,
    href: '/auth/userDashboard/instagram',
    badge: '15',
    color: 'bg-pink-500'
  },
  {
    title: 'Hacker News',
    icon: HackerNewsIcon,
    href: '/auth/userDashboard/hackernews',
    badge: '3',
    color: 'bg-orange-600'
  }
]

export function DashboardSidebar({ className }) {
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('/auth/userDashboard')
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false)

  return (
    <div
      className={cn(
        'border-r bg-background transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">MarketCamp</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-auto py-4">
          {/* Main Navigation */}
          <div className="space-y-1 px-3">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.href

              return (
                <Button
                  key={item.href}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    'w-full justify-start',
                    collapsed && 'justify-center px-2'
                  )}
                  onClick={() => {
                    if (item.href === '/auth/userDashboard/new-campaign') {
                      setShowNewCampaignModal(true)
                    } else {
                      setActiveItem(item.href)
                    }
                  }}
                >
                  <Icon className={cn('h-4 w-4', !collapsed && 'mr-3')} />
                  {!collapsed && (
                    <span className="flex-1 text-left">{item.title}</span>
                  )}
                  {!collapsed && item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </div>

          <Separator className="my-4" />

          {/* Platform Section */}
          {!collapsed && (
            <div className="px-3">
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Platforms
              </h3>
            </div>
          )}

          <div className="space-y-1 px-3">
            {platformItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.href

              return (
                <Button
                  key={item.href}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    'w-full justify-start',
                    collapsed && 'justify-center px-2'
                  )}
                  onClick={() => setActiveItem(item.href)}
                >
                  <div className={cn('h-4 w-4 rounded', item.color, 'flex items-center justify-center')}>
                    <Icon size={12} className="text-white" />
                  </div>
                  {!collapsed && (
                    <span className="flex-1 text-left ml-3">{item.title}</span>
                  )}
                  {!collapsed && item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-3">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'w-full justify-start',
              collapsed && 'justify-center px-2'
            )}
            onClick={() => setActiveItem('/auth/userDashboard/settings')}
          >
            <Settings className={cn('h-4 w-4', !collapsed && 'mr-3')} />
            {!collapsed && <span>Settings</span>}
          </Button>
        </div>

        <NewCampaignModal
          open={showNewCampaignModal}
          onOpenChange={setShowNewCampaignModal}
        />
      </div>
    </div>
  )
}