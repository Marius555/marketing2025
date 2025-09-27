'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Target,
  Users,
  DollarSign,
  BookHeart,
  Facebook,
  Instagram,
  Hash,
  MessageCircle,
  ThumbsUp,
  Globe,
  Video,
  Image,
  FileText,
  Calendar,
  Clock,
  MapPin,
  User,
  TrendingUp
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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import DateRangePicker from '../dateRangePicker'

const basicSchema = yup.object({
  name: yup.string().required('Campaign name is required'),
  description: yup.string(),
  platform: yup.string().required('Please select a platform'),
})

const redditSchema = yup.object({
  name: yup.string().required('Campaign name is required'),
  description: yup.string(),
  platform: yup.string().required('Please select a platform'),
  subreddits: yup.array().of(yup.string()).min(1, 'Select at least one subreddit'),
  postType: yup.string().oneOf(['text', 'link']).required('Post type is required'),
  title: yup.string().required('Post title is required').max(300, 'Title must be under 300 characters'),
  content: yup.string().required('Post content is required'),
  linkUrl: yup.string().url('Must be a valid URL'),
})

const facebookSchema = yup.object({
  name: yup.string().required('Campaign name is required'),
  description: yup.string(),
  platform: yup.string().required('Please select a platform'),
  objective: yup.string().required('Campaign objective is required'),
  adFormat: yup.string().required('Ad format is required'),
  budget: yup.number().min(1, 'Budget amount is required').required('Budget is required'),
  headline: yup.string().required('Headline is required'),
  primaryText: yup.string().required('Primary text is required'),
  callToAction: yup.string().required('Call to action is required'),
})

const instagramSchema = yup.object({
  name: yup.string().required('Campaign name is required'),
  description: yup.string(),
  platform: yup.string().required('Please select a platform'),
  adFormat: yup.string().required('Ad format is required'),
  budget: yup.number().min(1, 'Budget amount is required').required('Budget is required'),
  caption: yup.string().required('Caption is required'),
  hashtags: yup.string(),
  callToAction: yup.string().required('Call to action is required'),
})

const hackerNewsSchema = yup.object({
  name: yup.string().required('Campaign name is required'),
  description: yup.string(),
  platform: yup.string().required('Please select a platform'),
  postType: yup.string().oneOf(['story', 'show_hn', 'ask_hn']).required('Post type is required'),
  title: yup.string().required('Title is required').max(80, 'Title must be under 80 characters'),
  content: yup.string(),
  url: yup.string().url('Must be a valid URL'),
})

const platforms = [
  {
    id: 'reddit',
    name: 'Reddit',
    icon: BookHeart,
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
  { id: 2, name: 'Platform', icon: Users },
  { id: 3, name: 'Campaign Details', icon: DollarSign },
  { id: 4, name: 'Review', icon: Check }
]

// Platform-specific data
const redditSubreddits = [
  'r/entrepreneur', 'r/startups', 'r/technology', 'r/programming',
  'r/webdev', 'r/SaaS', 'r/marketing', 'r/smallbusiness'
]

const facebookObjectives = [
  { value: 'traffic', label: 'Website Traffic' },
  { value: 'awareness', label: 'Brand Awareness' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'conversions', label: 'Conversions' },
  { value: 'lead_generation', label: 'Lead Generation' }
]

const adFormats = [
  { value: 'single_image', label: 'Single Image', icon: Image },
  { value: 'single_video', label: 'Single Video', icon: Video },
  { value: 'carousel', label: 'Carousel', icon: FileText }
]

const callToActions = [
  'Learn More', 'Sign Up', 'Download', 'Shop Now', 'Contact Us', 'Get Quote'
]


export function CampaignWizard({ onComplete, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [selectedSubreddits, setSelectedSubreddits] = useState([])
  const [currencyPopoverOpen, setCurrencyPopoverOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      platform: '',
      // Reddit defaults
      subreddits: [],
      postType: 'text',
      title: '',
      content: '',
      linkUrl: '',
      // Facebook/Instagram defaults
      objective: '',
      adFormat: '',
      budget: 100,
      currency: 'USD',
      headline: '',
      primaryText: '',
      caption: '',
      hashtags: '',
      callToAction: '',
      mediaFiles: [],
      // Hacker News defaults
      url: '',
    }
  })

  const nextStep = () => {
    // Step 1: Validate basic info
    if (currentStep === 1) {
      const name = form.getValues('name')
      if (!name || name.trim() === '') {
        form.setError('name', { message: 'Campaign name is required' })
        return
      }
      setCurrentStep(currentStep + 1)
      return
    }

    // Step 2: Validate platform selection
    if (currentStep === 2) {
      if (!selectedPlatform) {
        alert('Please select a platform')
        return
      }
      form.setValue('platform', selectedPlatform)
      setCurrentStep(currentStep + 1)
      return
    }

    // Step 3: Validate platform-specific fields
    if (currentStep === 3) {
      const values = form.getValues()
      let isValid = true
      let errorMessage = ''

      if (selectedPlatform === 'reddit') {
        if (selectedSubreddits.length === 0) {
          errorMessage = 'Please select a subreddit'
          isValid = false
        } else if (!values.title || values.title.trim() === '') {
          errorMessage = 'Post title is required'
          isValid = false
        } else if (!values.content || values.content.trim() === '') {
          errorMessage = 'Post content is required'
          isValid = false
        } else if (values.postType === 'link' && (!values.linkUrl || values.linkUrl.trim() === '')) {
          errorMessage = 'Link URL is required for link posts'
          isValid = false
        }
      } else if (selectedPlatform === 'facebook') {
        if (!values.objective) {
          errorMessage = 'Campaign objective is required'
          isValid = false
        } else if (!values.adFormat) {
          errorMessage = 'Ad format is required'
          isValid = false
        } else if (!values.budget || values.budget <= 0) {
          errorMessage = 'Budget amount is required'
          isValid = false
        } else if (!values.headline || values.headline.trim() === '') {
          errorMessage = 'Headline is required'
          isValid = false
        } else if (!values.primaryText || values.primaryText.trim() === '') {
          errorMessage = 'Primary text is required'
          isValid = false
        } else if (!values.callToAction) {
          errorMessage = 'Call to action is required'
          isValid = false
        }
      } else if (selectedPlatform === 'instagram') {
        if (!values.adFormat) {
          errorMessage = 'Ad format is required'
          isValid = false
        } else if (!values.budget || values.budget <= 0) {
          errorMessage = 'Budget amount is required'
          isValid = false
        } else if (!values.caption || values.caption.trim() === '') {
          errorMessage = 'Caption is required'
          isValid = false
        } else if (!values.callToAction) {
          errorMessage = 'Call to action is required'
          isValid = false
        }
      } else if (selectedPlatform === 'hackernews') {
        if (!values.postType) {
          errorMessage = 'Post type is required'
          isValid = false
        } else if (!values.title || values.title.trim() === '') {
          errorMessage = 'Title is required'
          isValid = false
        } else if (values.postType !== 'ask_hn' && (!values.url || values.url.trim() === '')) {
          errorMessage = 'URL is required for this post type'
          isValid = false
        }
      }

      if (!isValid) {
        alert(errorMessage)
        return
      }

      setCurrentStep(currentStep + 1)
      return
    }

    // Default case
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
    // Add selected subreddits to data for Reddit campaigns
    if (selectedPlatform === 'reddit') {
      data.subreddits = selectedSubreddits
    }

    console.log('Campaign data:', data)

    if (onComplete) {
      onComplete(data)
    }
  }

  const handleSubredditToggle = (subreddit) => {
    const current = selectedSubreddits
    let updated
    if (current.includes(subreddit)) {
      updated = []
    } else {
      updated = [subreddit]
    }
    setSelectedSubreddits(updated)
    form.setValue('subreddits', updated)
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
                  Give your campaign a name and tell us what you're promoting
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
                        Give your campaign a memorable name
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
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What are your goals? What makes your offering unique?"
                          {...field}
                          rows={3}
                          className="focus:ring-primary"
                        />
                      </FormControl>
                      <FormDescription>
                        Brief description of your campaign goals
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
                  Choose Your Platform
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Select the platform where you want to reach your audience
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {platforms.map((platform) => {
                    const Icon = platform.icon
                    const isSelected = selectedPlatform === platform.id
                    return (
                      <div
                        key={platform.id}
                        className={cn(
                          'relative border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]',
                          isSelected
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-muted hover:border-primary/30'
                        )}
                        onClick={() => setSelectedPlatform(platform.id)}
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
              </CardContent>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Campaign Details for {platforms.find(p => p.id === selectedPlatform)?.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure your {selectedPlatform} campaign settings
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                {selectedPlatform === 'reddit' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-primary" />
                        Post Content
                      </h3>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="postType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Post Type *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select post type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="text">Text Post</SelectItem>
                                    <SelectItem value="link">Link Post</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Choose between text or link post
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Post Title *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Engaging title for your Reddit post"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  {field.value?.length || 0}/300 characters
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {form.watch('postType') === 'link' && (
                          <FormField
                            control={form.control}
                            name="linkUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Link URL *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="url"
                                    placeholder="https://your-website.com"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Post Content *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Write your Reddit post content..."
                                  {...field}
                                  rows={4}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Target Subreddits
                      </h3>

                      <FormDescription className="mb-4">
                        Select a subreddit where your post will be shared
                      </FormDescription>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                        {redditSubreddits.map((subreddit) => {
                          const isSelected = selectedSubreddits.includes(subreddit)
                          return (
                            <div
                              key={subreddit}
                              className={cn(
                                'group relative p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm',
                                isSelected
                                  ? 'border-primary bg-muted/20 shadow-sm'
                                  : 'border-muted hover:border-primary/30 hover:bg-muted/10'
                              )}
                              onClick={() => handleSubredditToggle(subreddit)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    'w-2 h-2 rounded-full transition-colors',
                                    isSelected ? 'bg-primary' : 'bg-muted-foreground/30'
                                  )} />
                                  <span className={cn(
                                    'font-medium text-sm transition-colors',
                                    isSelected ? 'text-foreground' : 'text-foreground'
                                  )}>
                                    {subreddit}
                                  </span>
                                </div>
                                <div className={cn(
                                  'transition-all duration-200',
                                  isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-50'
                                )}>
                                  <Check className="h-4 w-4 text-primary" />
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {selectedSubreddits.length === 0 && (
                        <p className="text-sm text-muted-foreground mt-3 text-center py-2">
                          No subreddit selected. Free users can post to 1 subreddit. Choose one to continue.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {selectedPlatform === 'facebook' && (
                  <div className="space-y-6">
                    <div className="border-l-4 border-primary pl-4 mb-6">
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <Facebook className="h-5 w-5 text-primary" />
                        Facebook Ad Campaign
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Create a compelling Facebook ad to reach your target audience
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="objective"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-primary" />
                                Campaign Objective *
                              </FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select objective" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {facebookObjectives.map((obj) => (
                                    <SelectItem key={obj.value} value={obj.value}>
                                      {obj.label}
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
                              <FormLabel className="flex items-center gap-2">
                                <Image className="h-4 w-4 text-primary" />
                                Ad Format *
                              </FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select format" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {adFormats.map((format) => (
                                    <SelectItem key={format.value} value={format.value}>
                                      {format.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="headline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                Headline *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Catchy headline for your Facebook ad"
                                  {...field}
                                  className="w-full"
                                />
                              </FormControl>
                              <FormDescription>Keep it concise and compelling</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="callToAction"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <ThumbsUp className="h-4 w-4 text-primary" />
                                Call to Action *
                              </FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select call to action" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {callToActions.map((cta) => (
                                    <SelectItem key={cta} value={cta.toLowerCase().replace(' ', '_')}>
                                      {cta}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>Choose the desired user action</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="primaryText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <MessageCircle className="h-4 w-4 text-primary" />
                                Primary Text *
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Main text for your Facebook ad"
                                  {...field}
                                  rows={4}
                                  className="w-full"
                                />
                              </FormControl>
                              <FormDescription>Describe your value proposition clearly</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-primary" />
                                Daily Budget *
                              </FormLabel>
                              <FormControl>
                                <div className="relative flex items-center">
                                  <FormField
                                    control={form.control}
                                    name="currency"
                                    render={({ field: currencyField }) => (
                                      <Popover open={currencyPopoverOpen} onOpenChange={setCurrencyPopoverOpen}>
                                        <PopoverTrigger asChild>
                                          <button
                                            type="button"
                                            className="absolute left-3 top-0 bottom-0 z-10 flex items-center gap-1 font-medium text-primary hover:text-primary/80 transition-colors"
                                            style={{ fontSize: '1rem' }}
                                          >
                                            {currencyField.value === 'EUR' ? '€' : currencyField.value === 'GBP' ? '£' : currencyField.value === 'CAD' ? 'C$' : '$'}
                                            <ChevronDown className="h-3 w-3" />
                                          </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-40 p-2">
                                          <div className="space-y-1">
                                            {[
                                              { value: 'USD', label: 'USD', symbol: '$' },
                                              { value: 'EUR', label: 'EUR', symbol: '€' },
                                              { value: 'GBP', label: 'GBP', symbol: '£' },
                                              { value: 'CAD', label: 'CAD', symbol: 'C$' }
                                            ].map((currency) => (
                                              <button
                                                key={currency.value}
                                                type="button"
                                                onClick={() => {
                                                  currencyField.onChange(currency.value)
                                                  setCurrencyPopoverOpen(false)
                                                }}
                                                className={cn(
                                                  'w-full flex items-center justify-between px-2 py-1.5 text-sm rounded hover:bg-accent',
                                                  currencyField.value === currency.value ? 'bg-accent' : ''
                                                )}
                                              >
                                                <span>{currency.label}</span>
                                                <span className="font-medium">{currency.symbol}</span>
                                              </button>
                                            ))}
                                          </div>
                                        </PopoverContent>
                                      </Popover>
                                    )}
                                  />
                                  <Input
                                    type="number"
                                    placeholder="100"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    className="pl-16 h-12 text-lg font-medium"
                                    min="1"
                                    step="1"
                                  />
                                </div>
                              </FormControl>
                              <FormDescription className="flex items-center justify-between text-xs">
                                <span>Amount you're willing to spend per day</span>
                                <span className="text-muted-foreground">Min: $1 | Recommended: $50+</span>
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Media Upload Section for Facebook */}
                      {form.watch('adFormat') && ['single_image', 'single_video', 'carousel'].includes(form.watch('adFormat')) && (
                        <FormField
                          control={form.control}
                          name="mediaFiles"
                          render={({ field }) => {
                            const adFormat = form.watch('adFormat')
                            return (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  {adFormat === 'single_video' ? (
                                    <Video className="h-4 w-4 text-primary" />
                                  ) : (
                                    <Image className="h-4 w-4 text-primary" />
                                  )}
                                  Upload {adFormat === 'single_image' ? 'Image' : adFormat === 'single_video' ? 'Video' : 'Images'} *
                                </FormLabel>
                                <FormControl>
                                  <div className="space-y-4">
                                    <div className="relative border-2 border-dashed border-muted hover:border-primary/50 rounded-lg p-6 text-center transition-colors cursor-pointer">
                                      <input
                                        type="file"
                                        accept={adFormat === 'single_video' ? 'video/*' : 'image/*'}
                                        multiple={adFormat === 'carousel'}
                                        onChange={(e) => {
                                          field.onChange(e.target.files)
                                          console.log('Files selected:', e.target.files)
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                      />
                                      <div className="space-y-3 pointer-events-none">
                                        {adFormat === 'single_video' ? (
                                          <Video className="h-8 w-8 mx-auto text-muted-foreground" />
                                        ) : (
                                          <Image className="h-8 w-8 mx-auto text-muted-foreground" />
                                        )}
                                        <div>
                                          <p className="text-sm font-medium mb-1">
                                            {adFormat === 'single_image' && 'Drop your image here or click to browse'}
                                            {adFormat === 'single_video' && 'Drop your video here or click to browse'}
                                            {adFormat === 'carousel' && 'Drop your images here or click to browse'}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {adFormat === 'single_image' && 'PNG, JPG up to 10MB'}
                                            {adFormat === 'single_video' && 'MP4, MOV up to 100MB'}
                                            {adFormat === 'carousel' && '2-10 images, PNG/JPG up to 10MB each'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* File List Display */}
                                    {field.value && field.value.length > 0 && (
                                      <div className="space-y-2">
                                        <p className="text-sm font-medium text-primary">
                                          {field.value.length} file{field.value.length > 1 ? 's' : ''} selected:
                                        </p>
                                        <div className="space-y-1">
                                          {Array.from(field.value).map((file, index) => (
                                            <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm">
                                              {file.type?.startsWith('video/') ? (
                                                <Video className="h-4 w-4 text-primary" />
                                              ) : (
                                                <Image className="h-4 w-4 text-primary" />
                                              )}
                                              <span className="font-medium">{file.name}</span>
                                              <span className="text-muted-foreground">
                                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )
                          }}
                        />
                      )}

                    </div>
                  </div>
                )}

                {selectedPlatform === 'instagram' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Instagram className="h-5 w-5 text-primary" />
                        Instagram Content
                      </h3>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="adFormat"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ad Format *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select ad format" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {adFormats.map((format) => (
                                      <SelectItem key={format.value} value={format.value}>
                                        {format.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Choose the format for your Instagram ad
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="hashtags"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Hashtags (Optional)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="#marketing #business #startup"
                                    {...field}
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormDescription>
                                  Add relevant hashtags separated by spaces
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="caption"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Caption *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Write your Instagram caption..."
                                  {...field}
                                  rows={4}
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="budget"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-primary" />
                                  Daily Budget *
                                </FormLabel>
                                <FormControl>
                                  <div className="relative flex items-center">
                                    <FormField
                                      control={form.control}
                                      name="currency"
                                      render={({ field: currencyField }) => (
                                        <Popover open={currencyPopoverOpen} onOpenChange={setCurrencyPopoverOpen}>
                                          <PopoverTrigger asChild>
                                            <button
                                              type="button"
                                              className="absolute left-3 top-0 bottom-0 z-10 flex items-center gap-1 font-medium text-primary hover:text-primary/80 transition-colors"
                                              style={{ fontSize: '1rem' }}
                                            >
                                              {currencyField.value === 'EUR' ? '€' : currencyField.value === 'GBP' ? '£' : currencyField.value === 'CAD' ? 'C$' : '$'}
                                              <ChevronDown className="h-3 w-3" />
                                            </button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-40 p-2">
                                            <div className="space-y-1">
                                              {[
                                                { value: 'USD', label: 'USD', symbol: '$' },
                                                { value: 'EUR', label: 'EUR', symbol: '€' },
                                                { value: 'GBP', label: 'GBP', symbol: '£' },
                                                { value: 'CAD', label: 'CAD', symbol: 'C$' }
                                              ].map((currency) => (
                                                <button
                                                  key={currency.value}
                                                  type="button"
                                                  onClick={() => {
                                                    currencyField.onChange(currency.value)
                                                    setCurrencyPopoverOpen(false)
                                                  }}
                                                  className={cn(
                                                    'w-full flex items-center justify-between px-2 py-1.5 text-sm rounded hover:bg-accent',
                                                    currencyField.value === currency.value ? 'bg-accent' : ''
                                                  )}
                                                >
                                                  <span>{currency.label}</span>
                                                  <span className="font-medium">{currency.symbol}</span>
                                                </button>
                                              ))}
                                            </div>
                                          </PopoverContent>
                                        </Popover>
                                      )}
                                    />
                                    <Input
                                      type="number"
                                      placeholder="100"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                      className="pl-14 h-12 text-lg font-medium"
                                      min="1"
                                      step="1"
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription className="flex items-center justify-between text-xs">
                                  <span>Amount you're willing to spend per day</span>
                                  <span className="text-muted-foreground">Min: $1 | Recommended: $50+</span>
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="callToAction"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Call to Action *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select call to action" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {callToActions.map((cta) => (
                                      <SelectItem key={cta} value={cta.toLowerCase().replace(' ', '_')}>
                                        {cta}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Media Upload Section */}
                      {form.watch('adFormat') && (
                        <div className="mt-8">
                          <FormField
                            control={form.control}
                            name="mediaFiles"
                            render={({ field }) => {
                              const adFormat = form.watch('adFormat')
                              return (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2 text-base font-semibold mb-4">
                                    {adFormat === 'single_video' ? (
                                      <Video className="h-5 w-5 text-primary" />
                                    ) : (
                                      <Image className="h-5 w-5 text-primary" />
                                    )}
                                    Upload {adFormat === 'single_image' ? 'Image' : adFormat === 'single_video' ? 'Video' : 'Images'} *
                                  </FormLabel>
                                  <FormControl>
                                    <div className="space-y-4">
                                      <div className="relative border-2 border-dashed border-muted hover:border-primary/50 rounded-lg p-8 text-center transition-colors cursor-pointer">
                                        <input
                                          type="file"
                                          accept={adFormat === 'single_video' ? 'video/*' : 'image/*'}
                                          multiple={adFormat === 'carousel'}
                                          onChange={(e) => {
                                            field.onChange(e.target.files)
                                            console.log('Files selected:', e.target.files)
                                          }}
                                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="space-y-4 pointer-events-none">
                                          {adFormat === 'single_video' ? (
                                            <Video className="h-10 w-10 mx-auto text-muted-foreground" />
                                          ) : (
                                            <Image className="h-10 w-10 mx-auto text-muted-foreground" />
                                          )}
                                          <div>
                                            <p className="text-sm font-medium mb-2">
                                              {adFormat === 'single_image' && 'Drop your image here or click to browse'}
                                              {adFormat === 'single_video' && 'Drop your video here or click to browse'}
                                              {adFormat === 'carousel' && 'Drop your images here or click to browse'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              {adFormat === 'single_image' && 'PNG, JPG up to 10MB'}
                                              {adFormat === 'single_video' && 'MP4, MOV up to 100MB'}
                                              {adFormat === 'carousel' && '2-10 images, PNG/JPG up to 10MB each'}
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      {/* File List Display */}
                                      {field.value && field.value.length > 0 && (
                                        <div className="space-y-2">
                                          <p className="text-sm font-medium text-primary">
                                            {field.value.length} file{field.value.length > 1 ? 's' : ''} selected:
                                          </p>
                                          <div className="space-y-1">
                                            {Array.from(field.value).map((file, index) => (
                                              <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm">
                                                {file.type?.startsWith('video/') ? (
                                                  <Video className="h-4 w-4 text-primary" />
                                                ) : (
                                                  <Image className="h-4 w-4 text-primary" />
                                                )}
                                                <span className="font-medium">{file.name}</span>
                                                <span className="text-muted-foreground">
                                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedPlatform === 'hackernews' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Hash className="h-5 w-5 text-primary" />
                        Hacker News Post
                      </h3>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="postType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Post Type *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select post type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="story">Story</SelectItem>
                                  <SelectItem value="show_hn">Show HN</SelectItem>
                                  <SelectItem value="ask_hn">Ask HN</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Clear, compelling title"
                                  {...field}
                                  className="w-full"
                                />
                              </FormControl>
                              <FormDescription>
                                {field.value?.length || 0}/80 characters
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.watch('postType') !== 'ask_hn' && (
                          <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>URL *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="url"
                                    placeholder="https://your-website.com"
                                    {...field}
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {form.watch('postType') === 'ask_hn' && (
                          <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Question Details</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Provide details about your question..."
                                    {...field}
                                    rows={4}
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Hacker News Tips</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Post during peak hours (9-11 AM EST)</li>
                        <li>• Keep titles under 80 characters</li>
                        <li>• Focus on technical innovation</li>
                        <li>• Engage authentically with comments</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case 4:
        const values = form.getValues()
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Your Campaign</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Review your campaign details before creating
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Basic Information</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Name: {values.name}</p>
                    {values.description && <p>Description: {values.description}</p>}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium">Platform</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">
                      {platforms.find(p => p.id === values.platform)?.name}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium">Campaign Details</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {selectedPlatform === 'reddit' && (
                      <>
                        <p>Subreddits: {values.subreddits?.join(', ')}</p>
                        <p>Post Type: {values.postType}</p>
                        <p>Title: {values.title}</p>
                      </>
                    )}
                    {(selectedPlatform === 'facebook' || selectedPlatform === 'instagram') && (
                      <>
                        {values.objective && <p>Objective: {values.objective}</p>}
                        <p>Ad Format: {values.adFormat}</p>
                        <p>Budget: ${values.budget} ({values.budgetType})</p>
                        <p>Call to Action: {values.callToAction}</p>
                      </>
                    )}
                    {selectedPlatform === 'hackernews' && (
                      <>
                        <p>Post Type: {values.postType}</p>
                        <p>Title: {values.title}</p>
                        {values.url && <p>URL: {values.url}</p>}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="w-full mx-auto">
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
                <Button
                  type="button"
                  onClick={nextStep}
                >
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