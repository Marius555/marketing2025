'use client'

import * as React from 'react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar, DollarSign, FileText, Hash, Globe, Users, Target, Sparkles, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import DateRangePicker from '../dateRangePicker'
import { FileUpload } from '@/components/ui/file-upload'

const currencies = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£' },
  { value: 'CAD', label: 'CAD (C$)', symbol: 'C$' },
  { value: 'AUD', label: 'AUD (A$)', symbol: 'A$' },
  { value: 'JPY', label: 'JPY (¥)', symbol: '¥' },
  { value: 'CHF', label: 'CHF (CHF)', symbol: 'CHF' },
  { value: 'SEK', label: 'SEK (kr)', symbol: 'kr' },
  { value: 'NOK', label: 'NOK (kr)', symbol: 'kr' },
  { value: 'DKK', label: 'DKK (kr)', symbol: 'kr' },
]

const platformConfigs = {
  reddit: {
    fields: [
      {
        name: 'subreddit',
        label: 'Target Subreddit',
        type: 'text',
        placeholder: 'e.g., webdev, startups, technology',
        description: 'Which subreddit community do you want to target?',
        required: true
      },
      {
        name: 'postType',
        label: 'Post Type',
        type: 'select',
        options: [
          { value: 'text', label: 'Text Post' },
          { value: 'link', label: 'Link Post' },
          { value: 'image', label: 'Image Post' },
          { value: 'video', label: 'Video Post' }
        ],
        description: 'What type of content will you be sharing?',
        required: true
      },
      {
        name: 'title',
        label: 'Post Title',
        type: 'text',
        placeholder: 'Enter an engaging title for your post',
        description: 'Keep it descriptive and community-appropriate',
        required: true
      },
      {
        name: 'content',
        label: 'Post Content',
        type: 'textarea',
        placeholder: 'Write your post content here...',
        description: 'Provide value to the community while promoting your message',
        required: true
      }
    ]
  },
  facebook: {
    fields: [
      {
        name: 'objective',
        label: 'Campaign Objective',
        type: 'select',
        options: [
          { value: 'awareness', label: 'Brand Awareness' },
          { value: 'traffic', label: 'Drive Traffic' },
          { value: 'engagement', label: 'Engagement' },
          { value: 'leads', label: 'Lead Generation' },
          { value: 'conversions', label: 'Conversions' }
        ],
        description: 'What is your primary campaign goal?',
        required: true
      },
      {
        name: 'audience',
        label: 'Target Audience',
        type: 'text',
        placeholder: 'e.g., Tech professionals, 25-45, interested in productivity',
        description: 'Describe your target audience demographics and interests',
        required: true
      },
      {
        name: 'adFormat',
        label: 'Ad Format',
        type: 'select',
        options: [
          { value: 'single_image', label: 'Single Image' },
          { value: 'single_video', label: 'Single Video' },
          { value: 'carousel', label: 'Carousel' },
          { value: 'collection', label: 'Collection' },
          { value: 'instant_experience', label: 'Instant Experience' }
        ],
        description: 'Choose the format that best showcases your content',
        required: true
      },
      {
        name: 'creative',
        label: 'Ad Creative',
        type: 'textarea',
        placeholder: 'Describe your ad creative, copy, and call-to-action...',
        description: 'Include your ad text, images/videos description, and CTA',
        required: true
      },
      {
        name: 'mediaFiles',
        label: 'Media Files',
        type: 'fileUpload',
        accept: 'image/*,video/*',
        multiple: true,
        maxFiles: 10,
        description: 'Upload images or videos for your ad creative',
        required: false,
        conditional: {
          field: 'adFormat',
          showWhen: ['single_image', 'single_video', 'carousel', 'collection']
        }
      }
    ]
  },
  instagram: {
    fields: [
      {
        name: 'contentType',
        label: 'Content Type',
        type: 'select',
        options: [
          { value: 'feed_post', label: 'Feed Post' },
          { value: 'story', label: 'Story' },
          { value: 'reel', label: 'Reel' },
          { value: 'igtv', label: 'IGTV' },
          { value: 'carousel', label: 'Carousel' }
        ],
        description: 'What type of Instagram content are you creating?',
        required: true
      },
      {
        name: 'caption',
        label: 'Caption',
        type: 'textarea',
        placeholder: 'Write your Instagram caption here...',
        description: 'Engaging caption that tells your story and includes a call-to-action',
        required: true
      },
      {
        name: 'hashtags',
        label: 'Hashtags',
        type: 'text',
        placeholder: '#marketing #socialmedia #business #growth',
        description: 'Include relevant hashtags to increase discoverability (up to 30)',
        required: false
      },
      {
        name: 'targetAudience',
        label: 'Target Audience',
        type: 'text',
        placeholder: 'e.g., Small business owners, creators, marketing professionals',
        description: 'Who do you want to reach with this content?',
        required: true
      }
    ]
  },
  hackernews: {
    fields: [
      {
        name: 'title',
        label: 'Submission Title',
        type: 'text',
        placeholder: 'Enter a clear, descriptive title',
        description: 'Make it technical and valuable to the HN community',
        required: true
      },
      {
        name: 'contentType',
        label: 'Submission Type',
        type: 'select',
        options: [
          { value: 'url', label: 'URL Link' },
          { value: 'text', label: 'Text Post (Ask HN)' },
          { value: 'show', label: 'Show HN' }
        ],
        description: 'What type of content are you sharing?',
        required: true
      },
      {
        name: 'url',
        label: 'URL (if applicable)',
        type: 'text',
        placeholder: 'https://your-website.com/article',
        description: 'Link to your content (for URL submissions)',
        required: false
      },
      {
        name: 'submissionContent',
        label: 'Description/Text',
        type: 'textarea',
        placeholder: 'Provide context or full text for your submission...',
        description: 'Additional context for URL posts or full text for Ask HN posts',
        required: false
      }
    ]
  }
}

const commonFields = [
  {
    name: 'name',
    label: 'Campaign Name',
    type: 'text',
    placeholder: 'Enter a name for your campaign',
    description: 'Internal name to help you identify this campaign',
    required: true
  },
  {
    name: 'budget',
    label: 'Budget',
    type: 'budget',
    description: 'Set your budget for this campaign',
    required: true
  },
  {
    name: 'dateRange',
    label: 'Campaign Duration',
    type: 'dateRange',
    description: 'Select when your campaign will start and end',
    required: true
  },
  {
    name: 'description',
    label: 'Campaign Description',
    type: 'textarea',
    placeholder: 'Describe the goals and strategy for this campaign...',
    description: 'Internal notes about this campaign',
    required: false
  },
  {
    name: 'enhanceWithAI',
    label: 'Enhance with AI',
    type: 'aiEnhance',
    description: 'Let AI help optimize your campaign content and targeting',
    required: false
  }
]

export function CampaignForm({ form, platform, onSubmit }) {
  const [currencyPopoverOpen, setCurrencyPopoverOpen] = React.useState(false)
  const platformFields = platformConfigs[platform?.id] || { fields: [] }
  const allFields = [...commonFields, ...platformFields.fields]

  const renderField = (field) => {
    // Handle conditional fields
    if (field.conditional) {
      const conditionalValue = form.watch(field.conditional.field)
      if (!field.conditional.showWhen.includes(conditionalValue)) {
        return null
      }
    }

    switch (field.type) {
      case 'select':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            rules={{ required: field.required ? `${field.label} is required` : false }}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                <Select onValueChange={formField.onChange} value={formField.value || ''}>
                  <FormControl>
                    <SelectTrigger className="w-full focus:ring-primary">
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>{field.description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'textarea':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            rules={{ required: field.required ? `${field.label} is required` : false }}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={field.placeholder}
                    {...formField}
                    rows={4}
                    className="focus:ring-primary"
                  />
                </FormControl>
                <FormDescription>{field.description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'dateRange':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            rules={{ required: field.required ? `${field.label} is required` : false }}
            render={({ field: formField, fieldState }) => (
              <FormItem>
                <FormControl>
                  <DateRangePicker
                    label={field.label}
                    description={field.description}
                    value={formField.value}
                    onChange={formField.onChange}
                    onBlur={formField.onBlur}
                    isRequired={field.required}
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )

      case 'budget':
        return (
          <FormItem key={field.name}>
            <FormLabel className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>

            {/* Hidden currency field for form data */}
            <FormField
              control={form.control}
              name="currency"
              rules={{ required: field.required ? 'Currency is required' : false }}
              render={({ field: currencyField }) => (
                <input type="hidden" {...currencyField} value={currencyField.value || 'USD'} />
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              rules={{
                required: field.required ? 'Budget is required' : false,
                min: { value: 1, message: 'Budget must be at least 1' }
              }}
              render={({ field: budgetField, fieldState: budgetFieldState }) => {
                const selectedCurrency = form.watch('currency') || 'USD'
                const currencyObj = currencies.find(c => c.value === selectedCurrency) || currencies[0]

                return (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Popover open={currencyPopoverOpen} onOpenChange={setCurrencyPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute left-1 top-1/2 transform -translate-y-1/2 h-7 px-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 border-r border-border"
                            >
                              {currencyObj.symbol}
                              <ChevronDown className="h-3 w-3 ml-1" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-2" align="start">
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-foreground mb-2">Select Currency</div>
                              {currencies.map((currency) => (
                                <Button
                                  key={currency.value}
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className={cn(
                                    "w-full justify-start text-left h-8",
                                    selectedCurrency === currency.value && "bg-primary/10 text-primary"
                                  )}
                                  onClick={() => {
                                    form.setValue('currency', currency.value)
                                    setCurrencyPopoverOpen(false)
                                  }}
                                >
                                  <span className="font-mono mr-2">{currency.symbol}</span>
                                  <span className="text-xs">{currency.label}</span>
                                </Button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                        <Input
                          placeholder="1000"
                          {...budgetField}
                          type="number"
                          min="1"
                          className={cn(
                            "pl-16 focus:ring-primary",
                            budgetFieldState.error && "border-destructive"
                          )}
                        />
                      </div>
                    </FormControl>
                    {budgetFieldState.error && (
                      <FormMessage className="text-xs">{budgetFieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )
              }}
            />
            <FormDescription>{field.description}</FormDescription>
          </FormItem>
        )

      case 'aiEnhance':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {field.label}
                </FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={formField.value === true ? "default" : "outline"}
                      size="sm"
                      onClick={() => formField.onChange(true)}
                      className={cn(
                        "flex-1",
                        formField.value === true && "bg-primary text-primary-foreground"
                      )}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Yes
                    </Button>
                    <Button
                      type="button"
                      variant={formField.value === false ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => formField.onChange(false)}
                      className={cn(
                        "flex-1",
                        formField.value === false && "bg-destructive text-destructive-foreground border-destructive"
                      )}
                    >
                      No
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>{field.description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'date':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            rules={{ required: field.required ? `${field.label} is required` : false }}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...formField}
                    className="focus:ring-primary"
                    min={field.name === 'startDate' ? new Date().toISOString().split('T')[0] : undefined}
                  />
                </FormControl>
                <FormDescription>{field.description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'fileUpload':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            rules={{ required: field.required ? `${field.label} is required` : false }}
            render={({ field: formField }) => {
              // Dynamic file upload configuration based on ad format
              const adFormat = form.watch('adFormat')
              let accept = field.accept
              let maxFiles = field.maxFiles
              let description = field.description

              if (field.name === 'mediaFiles' && adFormat) {
                switch (adFormat) {
                  case 'single_image':
                    accept = 'image/*'
                    maxFiles = 1
                    description = 'Upload one image for your ad (JPG, PNG, GIF)'
                    break
                  case 'single_video':
                    accept = 'video/*'
                    maxFiles = 1
                    description = 'Upload one video for your ad (MP4, MOV, AVI)'
                    break
                  case 'carousel':
                    accept = 'image/*'
                    maxFiles = 10
                    description = 'Upload 2-10 images for your carousel ad'
                    break
                  case 'collection':
                    accept = 'image/*,video/*'
                    maxFiles = 4
                    description = 'Upload up to 4 images or videos for your collection ad'
                    break
                  default:
                    break
                }
              }

              return (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </FormLabel>
                  <FormControl>
                    <FileUpload
                      accept={accept}
                      multiple={maxFiles > 1}
                      maxFiles={maxFiles}
                      onFilesChange={formField.onChange}
                      value={formField.value}
                    />
                  </FormControl>
                  <FormDescription>{description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        )

      default:
        const getFieldIcon = () => {
          if (field.name.includes('name') || field.name.includes('title')) return Target
          if (field.name.includes('url') || field.name.includes('website')) return Globe
          if (field.name.includes('audience') || field.name.includes('target')) return Users
          if (field.name.includes('hashtag')) return Hash
          return FileText
        }
        const Icon = getFieldIcon()

        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            rules={{ required: field.required ? `${field.label} is required` : false }}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={field.placeholder}
                    {...formField}
                    className="focus:ring-primary"
                    type="text"
                  />
                </FormControl>
                <FormDescription>{field.description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )
    }
  }

  if (!platform) {
    return <div>No platform selected</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className={`h-10 w-10 rounded-lg ${platform.color} flex items-center justify-center`}>
                  <platform.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{platform.name} Campaign</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Configure your {platform.name.toLowerCase()} marketing campaign
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {platform.id}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Campaign Basics */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Campaign Details</CardTitle>
              <p className="text-sm text-muted-foreground">
                Basic information about your campaign
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {commonFields.map(renderField)}
            </CardContent>
          </Card>

          {/* Platform-specific fields */}
          {platformFields.fields.length > 0 && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{platform.name} Specific Settings</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure content and targeting for {platform.name}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {platformFields.fields.map(renderField)}
              </CardContent>
            </Card>
          )}
        </div>
      </form>
    </Form>
  )
}