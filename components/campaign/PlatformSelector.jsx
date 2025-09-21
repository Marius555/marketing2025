'use client'

import {
  MessagesSquare,
  Users2,
  Image,
  Terminal
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const platforms = [
  {
    id: 'reddit',
    name: 'Reddit',
    description: 'Community discussions',
    icon: MessagesSquare
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Social advertising',
    icon: Users2
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Visual content',
    icon: Image
  },
  {
    id: 'hackernews',
    name: 'Hacker News',
    description: 'Tech community',
    icon: Terminal
  }
]

export function PlatformSelector({ onSelect }) {
  return (
    <div className="grid gap-2">
      {platforms.map((platform) => {
        const Icon = platform.icon

        return (
          <Card
            key={platform.id}
            className="cursor-pointer hover:shadow-lg hover:border-primary/20 transition-all duration-200 group"
            onClick={() => onSelect(platform)}
          >
            <CardContent className="p-2">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg border bg-muted flex items-center justify-center transition-transform group-hover:scale-105">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors leading-tight">
                    {platform.name}
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5 leading-tight">
                    {platform.description}
                  </CardDescription>
                </div>
                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}