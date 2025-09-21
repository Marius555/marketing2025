'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Target,
  Users,
  DollarSign,
  Calendar,
  Reddit,
  Facebook,
  Instagram,
  Hash
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import DataRangePicker from '@/components/dataRangePicker'

const campaignSchema = z.object({
  // Basic Info
  name: z.string().min(1, 'Campaign name is required'),
  description: z.string().optional(),
  productType: z.string().min(1, 'Product type is required'),

  // Platform Selection
  platforms: z.array(z.string()).min(1, 'At least one platform is required'),

  // Target Audience
  targetAudience: z.object({
    ageRange: z.string().optional(),
    interests: z.array(z.string()).optional(),
    locations: z.array(z.string()).optional(),
  }).optional(),

  // Budget & Schedule
  budget: z.object({
    total: z.string().min(1, 'Total budget is required'),
    type: z.enum(['daily', 'total']),
  }),
  schedule: z.object({
    dateRange: z.object({
      start: z.string().min(1, 'Campaign start date is required'),
      end: z.string().optional(),
    }).refine(data => {
      if (data.end && data.start) {
        const startDate = new Date(data.start)
        const endDate = new Date(data.end)
        return endDate >= startDate
      }
      return true
    }, {
      message: "End date must be after start date"
    }).nullable(),
    timezone: z.string().optional(),
  }),

  // Content
  content: z.object({
    headline: z.string().min(1, 'Headline is required'),
    description: z.string().min(1, 'Content description is required'),
    callToAction: z.string().optional(),
    images: z.array(z.string()).optional(),
  }),
})

const platforms = [
  {
    id: 'reddit',
    name: 'Reddit',
    icon: Reddit,
    color: 'bg-orange-500',
    description: 'Community-driven discussions'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-500',
    description: 'Social media advertising'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'bg-pink-500',
    description: 'Visual content platform'
  },
  {
    id: 'hackernews',
    name: 'Hacker News',
    icon: Hash,
    color: 'bg-orange-600',
    description: 'Tech community platform'
  }
]

const steps = [
  { id: 1, name: 'Basic Info', icon: Target },
  { id: 2, name: 'Platforms', icon: Users },
  { id: 3, name: 'Budget & Schedule', icon: DollarSign },
  { id: 4, name: 'Content', icon: Calendar },
  { id: 5, name: 'Review', icon: Check }
]

export function CampaignWizard({ onComplete, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})

  const form = useForm({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      platforms: [],
      targetAudience: {},
      budget: { type: 'total' },
      schedule: { dateRange: null },
      content: {}
    }
  })

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = (data) => {
    console.log('Campaign data:', data)
    if (onComplete) {
      onComplete(data)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-primary" />
                  Campaign Basics
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Tell us about your campaign and what you're promoting
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Product Launch Q1 2024"
                          {...field}
                          className="focus:ring-primary"
                        />
                      </FormControl>
                      <FormDescription>
                        Give your campaign a memorable name for easy identification
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What are you promoting? *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-primary">
                            <SelectValue placeholder="Select what you're promoting" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="saas">💻 SaaS Product</SelectItem>
                          <SelectItem value="website">🌐 Website</SelectItem>
                          <SelectItem value="mobile-app">📱 Mobile App</SelectItem>
                          <SelectItem value="e-commerce">🛒 E-commerce Store</SelectItem>
                          <SelectItem value="service">🔧 Professional Service</SelectItem>
                          <SelectItem value="other">📝 Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This helps us suggest the best platforms and strategies
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What are your goals? Who is your target audience? What makes your offering unique?"
                          {...field}
                          rows={3}
                          className="focus:ring-primary"
                        />
                      </FormControl>
                      <FormDescription>
                        Help us understand your campaign strategy and objectives
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-primary" />
                  Choose Your Platforms
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Select where you want to reach your audience. You can choose multiple platforms.
                </p>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="platforms"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {platforms.map((platform) => {
                          const Icon = platform.icon
                          const isSelected = field.value?.includes(platform.id)
                          return (
                            <div
                              key={platform.id}
                              className={cn(
                                'relative border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]',
                                isSelected
                                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                  : 'border-muted hover:border-primary/30'
                              )}
                              onClick={() => {
                                const current = field.value || []
                                if (current.includes(platform.id)) {
                                  field.onChange(current.filter(p => p !== platform.id))
                                } else {
                                  field.onChange([...current, platform.id])
                                }
                              }}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={cn('p-3 rounded-lg', platform.color)}>
                                  <Icon className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold">{platform.name}</div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {platform.description}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-2">
                                    {platform.id === 'reddit' && 'Great for: Tech products, community engagement'}
                                    {platform.id === 'facebook' && 'Great for: Broad audience reach, detailed targeting'}
                                    {platform.id === 'instagram' && 'Great for: Visual products, younger demographics'}
                                    {platform.id === 'hackernews' && 'Great for: Tech startups, developer tools'}
                                  </div>
                                </div>
                              </div>
                              {isSelected && (
                                <div className="absolute top-3 right-3">
                                  <div className="bg-primary rounded-full p-1">
                                    <Check className="h-3 w-3 text-primary-foreground" />
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                      {field.value?.length > 0 && (
                        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <p className="text-sm">
                            <strong>Selected:</strong> {field.value.map(id => platforms.find(p => p.id === id)?.name).join(', ')}
                          </p>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-primary/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Budget Planning
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Set your campaign budget and spending approach
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="budget.total"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget Amount *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="1000"
                              {...field}
                              className="pl-10 focus:ring-primary"
                              min="1"
                              step="1"
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Enter your budget in USD
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget Type *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50">
                              <RadioGroupItem value="total" id="total" className="mt-1" />
                              <div className="flex-1">
                                <Label htmlFor="total" className="font-medium">Total Budget</Label>
                                <p className="text-sm text-muted-foreground">
                                  Spend the entire amount over the campaign duration
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50">
                              <RadioGroupItem value="daily" id="daily" className="mt-1" />
                              <div className="flex-1">
                                <Label htmlFor="daily" className="font-medium">Daily Budget</Label>
                                <p className="text-sm text-muted-foreground">
                                  Spend this amount per day (budget × days = total)
                                </p>
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                    Campaign Timeline
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    When should your campaign run?
                  </p>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="schedule.dateRange"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <DataRangePicker
                            className="w-lg"
                            label="Campaign Duration"
                            description="Select when your campaign will start and end. Leave end date empty for ongoing campaigns."
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            isRequired={true}
                            isInvalid={!!fieldState.error}
                            errorMessage={fieldState.error?.message}
                          />
                        </FormControl>

                        {field.value?.start && field.value?.end && (
                          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                            <p className="text-sm">
                              <strong>Campaign Duration:</strong> {
                                (() => {
                                  try {
                                    const startDate = new Date(field.value.start)
                                    const endDate = new Date(field.value.end)
                                    const diffTime = endDate - startDate
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                                    return diffDays > 0 ? `${diffDays} days` : 'Invalid date range'
                                  } catch {
                                    return 'Invalid date format'
                                  }
                                })()
                              }
                            </p>
                          </div>
                        )}

                        {field.value?.start && !field.value?.end && (
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">
                              <strong>Ongoing Campaign:</strong> Will run until manually stopped
                            </p>
                          </div>
                        )}

                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs text-blue-800">
                            💡 <strong>Tip:</strong> Leave end date empty for ongoing campaigns that you'll manually stop
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="content.headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Headline</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Catchy headline for your campaign"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of your campaign content"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content.callToAction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call to Action (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Learn More, Sign Up, Buy Now, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case 5:
        const values = form.getValues()
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Review Your Campaign</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Basic Information</h4>
                <div className="text-sm text-muted-foreground">
                  <p>Name: {values.name}</p>
                  <p>Product Type: {values.productType}</p>
                  {values.description && <p>Description: {values.description}</p>}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium">Platforms</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {values.platforms?.map(platformId => {
                    const platform = platforms.find(p => p.id === platformId)
                    return (
                      <Badge key={platformId} variant="secondary">
                        {platform?.name}
                      </Badge>
                    )
                  })}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium">Budget & Schedule</h4>
                <div className="text-sm text-muted-foreground">
                  <p>Budget: ${values.budget?.total} ({values.budget?.type})</p>
                  {values.schedule?.dateRange?.start && (
                    <p>Start Date: {
                      typeof values.schedule.dateRange.start === 'string'
                        ? values.schedule.dateRange.start
                        : values.schedule.dateRange.start.toString()
                    }</p>
                  )}
                  {values.schedule?.dateRange?.end && (
                    <p>End Date: {
                      typeof values.schedule.dateRange.end === 'string'
                        ? values.schedule.dateRange.end
                        : values.schedule.dateRange.end.toString()
                    }</p>
                  )}
                  {!values.schedule?.dateRange?.end && values.schedule?.dateRange?.start && (
                    <p>Duration: Ongoing campaign</p>
                  )}
                  {!values.schedule?.dateRange?.start && <p>Start Date: Not set</p>}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium">Content</h4>
                <div className="text-sm text-muted-foreground">
                  <p>Headline: {values.content?.headline}</p>
                  <p>Description: {values.content?.description}</p>
                  {values.content?.callToAction && <p>CTA: {values.content.callToAction}</p>}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Campaign</CardTitle>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mt-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2',
                    isCompleted
                      ? 'bg-primary border-primary text-primary-foreground'
                      : isActive
                      ? 'border-primary text-primary'
                      : 'border-muted text-muted-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="ml-2 hidden sm:block">
                  <div className={cn('text-sm font-medium', isActive && 'text-primary')}>
                    {step.name}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-12 h-px bg-muted mx-4" />
                )}
              </div>
            )
          })}
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStepContent()}

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={currentStep === 1 ? onCancel : prevStep}
              >
                {currentStep === 1 ? (
                  'Cancel'
                ) : (
                  <>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </>
                )}
              </Button>

              {currentStep < steps.length ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit">
                  Create Campaign
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}