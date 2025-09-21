'use client'

import { useState } from 'react'
import {
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  TrendingUp,
  SortAsc,
  SortDesc,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

const mockCampaigns = [
  {
    id: 1,
    name: 'Spring Product Launch',
    platform: 'Facebook',
    status: 'active',
    budget: 2500,
    spent: 1247,
    reach: 45200,
    clicks: 2341,
    conversions: 89,
    ctr: 5.2,
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    platformColor: 'bg-blue-500'
  },
  {
    id: 2,
    name: 'Tech Community Outreach',
    platform: 'Reddit',
    status: 'paused',
    budget: 800,
    spent: 156,
    reach: 12800,
    clicks: 567,
    conversions: 23,
    ctr: 4.4,
    startDate: '2024-03-05',
    endDate: '2024-04-05',
    platformColor: 'bg-orange-500'
  },
  {
    id: 3,
    name: 'Brand Awareness Campaign',
    platform: 'Instagram',
    status: 'active',
    budget: 1200,
    spent: 890,
    reach: 28700,
    clicks: 1234,
    conversions: 45,
    ctr: 4.3,
    startDate: '2024-02-28',
    endDate: '2024-03-28',
    platformColor: 'bg-pink-500'
  },
  {
    id: 4,
    name: 'Developer Tool Launch',
    platform: 'Hacker News',
    status: 'scheduled',
    budget: 500,
    spent: 0,
    reach: 0,
    clicks: 0,
    conversions: 0,
    ctr: 0,
    startDate: '2024-03-15',
    endDate: '2024-04-15',
    platformColor: 'bg-orange-600'
  },
  {
    id: 5,
    name: 'Holiday Sale Promotion',
    platform: 'Facebook',
    status: 'completed',
    budget: 3000,
    spent: 2987,
    reach: 67500,
    clicks: 3456,
    conversions: 156,
    ctr: 5.1,
    startDate: '2024-02-01',
    endDate: '2024-02-29',
    platformColor: 'bg-blue-500'
  },
  {
    id: 6,
    name: 'Mobile App Promotion',
    platform: 'Instagram',
    status: 'active',
    budget: 1800,
    spent: 945,
    reach: 34200,
    clicks: 1876,
    conversions: 78,
    ctr: 5.5,
    startDate: '2024-03-10',
    endDate: '2024-04-10',
    platformColor: 'bg-pink-500'
  }
]

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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function CampaignList() {
  const [campaigns, setCampaigns] = useState(mockCampaigns)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [selectedCampaigns, setSelectedCampaigns] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.platform.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    const matchesPlatform = platformFilter === 'all' || campaign.platform === platformFilter

    return matchesSearch && matchesStatus && matchesPlatform
  })

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (!sortConfig.key) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (typeof aValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    if (typeof aValue === 'number') {
      return sortConfig.direction === 'asc'
        ? aValue - bValue
        : bValue - aValue
    }

    return 0
  })

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCampaigns(sortedCampaigns.map(c => c.id))
    } else {
      setSelectedCampaigns([])
    }
  }

  const handleSelectCampaign = (campaignId, checked) => {
    if (checked) {
      setSelectedCampaigns(prev => [...prev, campaignId])
    } else {
      setSelectedCampaigns(prev => prev.filter(id => id !== campaignId))
    }
  }

  const SortButton = ({ column, children }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 p-0 hover:bg-transparent"
      onClick={() => handleSort(column)}
    >
      {children}
      {sortConfig.key === column ? (
        sortConfig.direction === 'asc' ? (
          <SortAsc className="ml-2 h-3 w-3" />
        ) : (
          <SortDesc className="ml-2 h-3 w-3" />
        )
      ) : (
        <SortAsc className="ml-2 h-3 w-3 opacity-0" />
      )}
    </Button>
  )

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Reddit">Reddit</SelectItem>
                <SelectItem value="Hacker News">Hacker News</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedCampaigns.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">
                {selectedCampaigns.length} campaigns selected
              </span>
              <Button size="sm" variant="outline">
                <Play className="h-3 w-3 mr-1" />
                Start
              </Button>
              <Button size="sm" variant="outline">
                <Pause className="h-3 w-3 mr-1" />
                Pause
              </Button>
              <Button size="sm" variant="outline">
                <Copy className="h-3 w-3 mr-1" />
                Duplicate
              </Button>
              <Button size="sm" variant="outline">
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          )}

          {/* Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedCampaigns.length === sortedCampaigns.length && sortedCampaigns.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>
                    <SortButton column="name">Campaign</SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton column="platform">Platform</SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton column="status">Status</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton column="budget">Budget</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton column="spent">Spent</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton column="reach">Reach</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton column="clicks">Clicks</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton column="ctr">CTR</SortButton>
                  </TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCampaigns.includes(campaign.id)}
                        onCheckedChange={(checked) => handleSelectCampaign(campaign.id, checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className={cn('w-3 h-3 rounded-full', campaign.platformColor)} />
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {campaign.startDate} - {campaign.endDate}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{campaign.platform}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('capitalize', getStatusColor(campaign.status))}
                      >
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(campaign.budget)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(campaign.spent)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(campaign.reach)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(campaign.clicks)}
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.ctr.toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Campaign
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          {campaign.status === 'active' ? (
                            <DropdownMenuItem>
                              <Pause className="mr-2 h-4 w-4" />
                              Pause Campaign
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <Play className="mr-2 h-4 w-4" />
                              Start Campaign
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Campaign
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {sortedCampaigns.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No campaigns found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}