'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Globe,
  Target,
  DollarSign,
  Users,
  Share2,
  Zap,
  Calendar,
  Image,
  Video,
  FileText
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

const facebookCampaignSchema = z.object({
  objective: z.string().min(1, 'Campaign objective is required'),
  adFormat: z.string().min(1, 'Ad format is required'),
  targeting: z.object({
    ageRange: z.object({
      min: z.number().min(13),
      max: z.number().max(65),
    }),
    gender: z.array(z.string()),
    locations: z.array(z.string()),
    interests: z.array(z.string()),
    behaviors: z.array(z.string()),
    customAudiences: z.array(z.string()).optional(),
  }),
  budget: z.object({
    type: z.enum(['daily', 'lifetime']),
    amount: z.number().min(1),
    bidStrategy: z.string(),
  }),
  schedule: z.object({
    startDate: z.string(),
    endDate: z.string().optional(),
    adSchedule: z.array(z.string()).optional(),
  }),
  creative: z.object({
    headline: z.string().min(1, 'Headline is required'),
    primaryText: z.string().min(1, 'Primary text is required'),
    description: z.string().optional(),
    callToAction: z.string(),
    linkUrl: z.string().url().optional(),
    images: z.array(z.string()).optional(),
  }),
  placement: z.array(z.string()).min(1, 'At least one placement is required'),
})

const campaignObjectives = [
  { value: 'awareness', label: 'Brand Awareness', description: 'Increase brand recognition' },
  { value: 'reach', label: 'Reach', description: 'Show ads to maximum people' },
  { value: 'traffic', label: 'Traffic', description: 'Drive website visits' },
  { value: 'engagement', label: 'Engagement', description: 'Increase post engagement' },
  { value: 'app_installs', label: 'App Installs', description: 'Drive mobile app installs' },
  { value: 'video_views', label: 'Video Views', description: 'Promote video content' },
  { value: 'lead_generation', label: 'Lead Generation', description: 'Collect leads' },
  { value: 'conversions', label: 'Conversions', description: 'Drive specific actions' },
]

const adFormats = [
  { value: 'single_image', label: 'Single Image', icon: Image },
  { value: 'single_video', label: 'Single Video', icon: Video },
  { value: 'carousel', label: 'Carousel', icon: Image },
  { value: 'slideshow', label: 'Slideshow', icon: Video },
  { value: 'collection', label: 'Collection', icon: FileText },
]

const placements = [
  { value: 'facebook_feed', label: 'Facebook Feed', description: 'Main Facebook news feed' },
  { value: 'facebook_stories', label: 'Facebook Stories', description: 'Facebook Stories' },
  { value: 'facebook_marketplace', label: 'Marketplace', description: 'Facebook Marketplace' },
  { value: 'facebook_video_feeds', label: 'Video Feeds', description: 'In-stream video ads' },
  { value: 'facebook_right_column', label: 'Right Column', description: 'Desktop right column' },
  { value: 'instagram_feed', label: 'Instagram Feed', description: 'Instagram main feed' },
  { value: 'instagram_stories', label: 'Instagram Stories', description: 'Instagram Stories' },
  { value: 'instagram_reels', label: 'Instagram Reels', description: 'Instagram Reels' },
]

const interests = [
  'Technology', 'Business', 'Marketing', 'Entrepreneurship', 'SaaS', 'E-commerce',
  'Mobile apps', 'Web development', 'Digital marketing', 'Social media',
  'Startups', 'Innovation', 'Productivity', 'Online business'
]

const callToActions = [
  { value: 'learn_more', label: 'Learn More' },
  { value: 'shop_now', label: 'Shop Now' },
  { value: 'sign_up', label: 'Sign Up' },
  { value: 'download', label: 'Download' },
  { value: 'get_quote', label: 'Get Quote' },
  { value: 'contact_us', label: 'Contact Us' },
  { value: 'book_now', label: 'Book Now' },
  { value: 'apply_now', label: 'Apply Now' },
]

export function FacebookCampaign({ onSubmit, onCancel, initialData }) {
  const [selectedInterests, setSelectedInterests] = useState(initialData?.targeting?.interests || [])
  const [selectedPlacements, setSelectedPlacements] = useState(initialData?.placement || [])

  const form = useForm({
    resolver: zodResolver(facebookCampaignSchema),
    defaultValues: {
      objective: initialData?.objective || '',
      adFormat: initialData?.adFormat || '',
      targeting: {
        ageRange: { min: 18, max: 65 },
        gender: ['all'],
        locations: ['United States'],
        interests: [],
        behaviors: [],
        customAudiences: [],
      },
      budget: {
        type: 'daily',
        amount: 20,
        bidStrategy: 'lowest_cost',
      },
      schedule: {
        startDate: '',
        endDate: '',
        adSchedule: [],
      },
      creative: {
        headline: '',
        primaryText: '',
        description: '',
        callToAction: 'learn_more',
        linkUrl: '',
        images: [],
      },
      placement: [],
      ...initialData,
    }
  })

  const watchAgeRange = form.watch('targeting.ageRange')
  const watchBudgetType = form.watch('budget.type')

  const handleInterestToggle = (interest) => {
    const current = selectedInterests
    if (current.includes(interest)) {
      const updated = current.filter(i => i !== interest)
      setSelectedInterests(updated)
      form.setValue('targeting.interests', updated)
    } else {
      const updated = [...current, interest]
      setSelectedInterests(updated)
      form.setValue('targeting.interests', updated)
    }
  }

  const handlePlacementToggle = (placement) => {
    const current = selectedPlacements
    if (current.includes(placement)) {
      const updated = current.filter(p => p !== placement)
      setSelectedPlacements(updated)
      form.setValue('placement', updated)
    } else {
      const updated = [...current, placement]
      setSelectedPlacements(updated)
      form.setValue('placement', updated)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-blue-500 rounded">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <span>Facebook Campaign Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Campaign Objective & Ad Format */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="objective"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Objective</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select objective" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {campaignObjectives.map((objective) => (
                            <SelectItem key={objective.value} value={objective.value}>
                              <div>
                                <div className="font-medium">{objective.label}</div>
                                <div className="text-xs text-muted-foreground">
                                  {objective.description}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad Format</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ad format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {adFormats.map((format) => {
                            const Icon = format.icon
                            return (
                              <SelectItem key={format.value} value={format.value}>
                                <div className="flex items-center space-x-2">
                                  <Icon className="h-4 w-4" />
                                  <span>{format.label}</span>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Audience Targeting */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Audience Targeting</h3>
                </div>

                {/* Age Range */}
                <div className="space-y-3">
                  <Label>Age Range: {watchAgeRange?.min} - {watchAgeRange?.max}</Label>
                  <div className="px-3">
                    <FormField
                      control={form.control}
                      name="targeting.ageRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Slider
                              value={[field.value?.min || 18, field.value?.max || 65]}
                              onValueChange={([min, max]) => field.onChange({ min, max })}
                              min={13}
                              max={65}
                              step={1}
                              className="w-full"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Interests */}
                <div className="space-y-3">
                  <Label>Interests</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {interests.map((interest) => (
                      <Button
                        key={interest}
                        type="button"
                        variant={selectedInterests.includes(interest) ? "default" : "outline"}
                        size="sm"
                        className="justify-start"
                        onClick={() => handleInterestToggle(interest)}
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedInterests.map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Budget & Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <h3 className="text-lg font-medium">Budget</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="budget.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">Daily Budget</SelectItem>
                            <SelectItem value="lifetime">Lifetime Budget</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget.amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {watchBudgetType === 'daily' ? 'Daily' : 'Lifetime'} Budget ($)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <h3 className="text-lg font-medium">Schedule</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="schedule.startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="schedule.endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Ad Creative */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Ad Creative</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="creative.headline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Headline</FormLabel>
                        <FormControl>
                          <Input placeholder="Catchy headline" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="creative.callToAction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Call to Action</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {callToActions.map((cta) => (
                              <SelectItem key={cta.value} value={cta.value}>
                                {cta.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="creative.primaryText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Main ad copy that describes your offer"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="creative.linkUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Ad Placements */}
              <div className="space-y-4">
                <FormLabel>Ad Placements</FormLabel>
                <FormDescription>
                  Choose where your ads will be displayed
                </FormDescription>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {placements.map((placement) => (
                    <div
                      key={placement.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedPlacements.includes(placement.value)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-muted hover:border-blue-200'
                      }`}
                      onClick={() => handlePlacementToggle(placement.value)}
                    >
                      <div className="font-medium">{placement.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {placement.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Create Facebook Campaign
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}