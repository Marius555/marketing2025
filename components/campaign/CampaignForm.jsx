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
import { Checkbox } from '@/components/ui/checkbox'
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

const targetAudienceOptions = {
  demographics: [
    { value: 'age_18_24', label: '18-24 years', category: 'Age Groups' },
    { value: 'age_25_34', label: '25-34 years', category: 'Age Groups' },
    { value: 'age_35_44', label: '35-44 years', category: 'Age Groups' },
    { value: 'age_45_54', label: '45-54 years', category: 'Age Groups' },
    { value: 'age_55_65', label: '55-65 years', category: 'Age Groups' },
    { value: 'age_65_plus', label: '65+ years', category: 'Age Groups' },
    { value: 'gender_all', label: 'All Genders', category: 'Gender' },
    { value: 'gender_male', label: 'Male', category: 'Gender' },
    { value: 'gender_female', label: 'Female', category: 'Gender' },
    { value: 'gender_non_binary', label: 'Non-binary', category: 'Gender' },
  ],
  professions: [
    { value: 'business_owners', label: 'Business Owners', category: 'Professions' },
    { value: 'entrepreneurs', label: 'Entrepreneurs', category: 'Professions' },
    { value: 'marketing_professionals', label: 'Marketing Professionals', category: 'Professions' },
    { value: 'software_developers', label: 'Software Developers', category: 'Professions' },
    { value: 'designers', label: 'Designers', category: 'Professions' },
    { value: 'students', label: 'Students', category: 'Professions' },
    { value: 'healthcare_workers', label: 'Healthcare Workers', category: 'Professions' },
    { value: 'teachers', label: 'Teachers & Educators', category: 'Professions' },
    { value: 'sales_professionals', label: 'Sales Professionals', category: 'Professions' },
    { value: 'consultants', label: 'Consultants', category: 'Professions' },
    { value: 'executives', label: 'C-Level Executives', category: 'Professions' },
    { value: 'freelancers', label: 'Freelancers', category: 'Professions' },
  ],
  interests: [
    { value: 'technology', label: 'Technology', category: 'Interests' },
    { value: 'business', label: 'Business & Finance', category: 'Interests' },
    { value: 'marketing', label: 'Marketing & Advertising', category: 'Interests' },
    { value: 'health_fitness', label: 'Health & Fitness', category: 'Interests' },
    { value: 'travel', label: 'Travel', category: 'Interests' },
    { value: 'food_cooking', label: 'Food & Cooking', category: 'Interests' },
    { value: 'fashion_beauty', label: 'Fashion & Beauty', category: 'Interests' },
    { value: 'sports', label: 'Sports', category: 'Interests' },
    { value: 'gaming', label: 'Gaming', category: 'Interests' },
    { value: 'entertainment', label: 'Entertainment', category: 'Interests' },
    { value: 'education', label: 'Education & Learning', category: 'Interests' },
    { value: 'home_garden', label: 'Home & Garden', category: 'Interests' },
  ],
  industries: [
    { value: 'saas', label: 'SaaS & Software', category: 'Industries' },
    { value: 'ecommerce', label: 'E-commerce', category: 'Industries' },
    { value: 'healthcare', label: 'Healthcare', category: 'Industries' },
    { value: 'education', label: 'Education', category: 'Industries' },
    { value: 'finance', label: 'Finance & Banking', category: 'Industries' },
    { value: 'real_estate', label: 'Real Estate', category: 'Industries' },
    { value: 'retail', label: 'Retail', category: 'Industries' },
    { value: 'hospitality', label: 'Hospitality & Tourism', category: 'Industries' },
    { value: 'automotive', label: 'Automotive', category: 'Industries' },
    { value: 'nonprofit', label: 'Non-profit', category: 'Industries' },
    { value: 'manufacturing', label: 'Manufacturing', category: 'Industries' },
    { value: 'media', label: 'Media & Publishing', category: 'Industries' },
  ],
  behaviors: [
    { value: 'online_shoppers', label: 'Frequent Online Shoppers', category: 'Behaviors' },
    { value: 'social_media_active', label: 'Social Media Active Users', category: 'Behaviors' },
    { value: 'early_adopters', label: 'Early Technology Adopters', category: 'Behaviors' },
    { value: 'mobile_users', label: 'Mobile-first Users', category: 'Behaviors' },
    { value: 'video_consumers', label: 'Video Content Consumers', category: 'Behaviors' },
    { value: 'podcast_listeners', label: 'Podcast Listeners', category: 'Behaviors' },
    { value: 'newsletter_subscribers', label: 'Newsletter Subscribers', category: 'Behaviors' },
    { value: 'app_users', label: 'Mobile App Users', category: 'Behaviors' },
    { value: 'brand_conscious', label: 'Brand Conscious Consumers', category: 'Behaviors' },
    { value: 'price_sensitive', label: 'Price Sensitive Shoppers', category: 'Behaviors' },
  ]
}

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
      },
      {
        name: 'mediaFile',
        label: 'Media File',
        type: 'fileUpload',
        accept: 'image/*,video/*',
        multiple: false,
        maxFiles: 1,
        description: 'Upload your image or video for the post (required for image/video posts)',
        required: false
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
        type: 'multiSelect',
        description: 'Select demographics, interests, and behaviors that match your target audience',
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
        description: 'Upload images or videos for your ad creative (required for most ad formats)',
        required: false
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
        type: 'multiSelect',
        description: 'Select demographics, interests, and behaviors that match your target audience',
        required: true
      },
      {
        name: 'mediaFiles',
        label: 'Media Files',
        type: 'fileUpload',
        accept: 'image/*,video/*',
        multiple: true,
        maxFiles: 10,
        description: 'Upload images or videos for your Instagram content',
        required: false
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
    // Handle conditional fields (excluding file upload fields which are now always visible)
    if (field.conditional && field.type !== 'fileUpload') {
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

            <div className="flex gap-3 w-full">
              {/* Budget Amount Field */}
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
                    <FormItem className="flex-[2]">
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

              {/* Budget Type Field */}
              <FormField
                control={form.control}
                name="budgetType"
                rules={{ required: field.required ? 'Budget type is required' : false }}
                render={({ field: budgetTypeField }) => (
                  <FormItem className="flex-[1]">
                    <FormControl>
                      <Select onValueChange={budgetTypeField.onChange} value={budgetTypeField.value || 'daily'}>
                        <SelectTrigger className="focus:ring-primary w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

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
              // Dynamic file upload configuration based on ad format or post type
              const adFormat = form.watch('adFormat')
              const postType = form.watch('postType')
              let accept = field.accept
              let maxFiles = field.maxFiles
              let description = field.description

              // Handle Facebook ad formats
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

              // Handle Reddit post types
              if (field.name === 'mediaFile' && postType) {
                switch (postType) {
                  case 'image':
                    accept = 'image/*'
                    maxFiles = 1
                    description = 'Upload an image for your Reddit post (JPG, PNG, GIF, WebP)'
                    break
                  case 'video':
                    accept = 'video/*'
                    maxFiles = 1
                    description = 'Upload a video for your Reddit post (MP4, MOV, WebM)'
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

      case 'multiSelect':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            rules={{ required: field.required ? `${field.label} is required` : false }}
            render={({ field: formField }) => {
              const allOptions = Object.values(targetAudienceOptions).flat()
              const selectedValues = formField.value || []
              const [popoverOpen, setPopoverOpen] = React.useState(false)

              const toggleOption = React.useCallback((optionValue) => {
                const current = selectedValues
                if (current.includes(optionValue)) {
                  formField.onChange(current.filter(v => v !== optionValue))
                } else {
                  formField.onChange([...current, optionValue])
                }
              }, [selectedValues, formField.onChange])

              const getDisplayText = React.useCallback(() => {
                if (selectedValues.length === 0) {
                  return ''
                }
                const selectedLabels = selectedValues
                  .map(value => allOptions.find(opt => opt.value === value)?.label)
                  .filter(Boolean)

                if (selectedLabels.length <= 3) {
                  return selectedLabels.join(', ')
                } else {
                  return `${selectedLabels.slice(0, 2).join(', ')}, +${selectedLabels.length - 2} more`
                }
              }, [selectedValues, allOptions])

              const groupedOptions = Object.entries(targetAudienceOptions)

              return (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger asChild>
                        <div
                          className={cn(
                            "flex h-9 w-full rounded-md border border-input bg-transparent dark:bg-input/30 px-3 py-1 text-base shadow-xs cursor-pointer",
                            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none",
                            "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                            "justify-between items-center transition-[color,box-shadow]"
                          )}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              setPopoverOpen(!popoverOpen)
                            }
                          }}
                        >
                          <span className={cn(
                            "truncate",
                            selectedValues.length === 0 && "text-muted-foreground"
                          )}>
                            {selectedValues.length === 0
                              ? 'Select target audience...'
                              : getDisplayText()
                            }
                          </span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="start">
                        <div
                          className="p-4 space-y-4 max-h-80 overflow-y-auto scroll-smooth"
                          tabIndex={-1}
                          role="listbox"
                          onWheel={(e) => {
                            // Ensure scroll events are properly handled
                            e.stopPropagation()
                          }}
                        >
                          {groupedOptions.map(([groupKey, options]) => (
                            <div key={groupKey} className="space-y-2">
                              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                {options[0]?.category || groupKey}
                              </div>
                              <div className="grid grid-cols-1 gap-2">
                                {options.map((option) => (
                                  <div
                                    key={option.value}
                                    className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50"
                                  >
                                    <Checkbox
                                      id={`checkbox-${option.value}`}
                                      checked={selectedValues.includes(option.value)}
                                      onCheckedChange={() => toggleOption(option.value)}
                                    />
                                    <label
                                      className="text-sm cursor-pointer flex-1"
                                      htmlFor={`checkbox-${option.value}`}
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>{field.description}</FormDescription>
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
                  <platform.icon size={20} className="text-white" />
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