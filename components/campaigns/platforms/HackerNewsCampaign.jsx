'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Hash,
  Clock,
  TrendingUp,
  Users,
  MessageCircle,
  ExternalLink,
  AlertTriangle,
  Info,
  CheckCircle
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'

const hackerNewsCampaignSchema = z.object({
  postType: z.enum(['story', 'ask', 'show']),
  title: z.string().min(1, 'Title is required').max(80, 'Title must be under 80 characters'),
  url: z.string().url().optional(),
  content: z.string().optional(),
  timing: z.object({
    submitTime: z.string(),
    timezone: z.string(),
    dayOfWeek: z.array(z.string()),
  }),
  communityGuidelines: z.object({
    noSelfPromotion: z.boolean(),
    originalContent: z.boolean(),
    relevantToTech: z.boolean(),
    notClickbait: z.boolean(),
  }),
  engagementGoals: z.object({
    points: z.number().min(0).optional(),
    comments: z.number().min(0).optional(),
    frontPage: z.boolean().optional(),
  }),
  tags: z.array(z.string()).optional(),
})

const postTypes = [
  {
    value: 'story',
    label: 'Story',
    description: 'Share interesting articles, news, or content',
    example: 'Interesting article about AI developments'
  },
  {
    value: 'ask',
    label: 'Ask HN',
    description: 'Ask the community a question',
    example: 'Ask HN: What\'s your experience with remote work?'
  },
  {
    value: 'show',
    label: 'Show HN',
    description: 'Show your project or creation to the community',
    example: 'Show HN: I built a productivity app for developers'
  }
]

const optimalTimes = [
  { time: '8:00 AM EST', description: 'Morning browsing peak', score: 'High' },
  { time: '10:00 AM EST', description: 'Mid-morning engagement', score: 'Medium' },
  { time: '2:00 PM EST', description: 'Afternoon peak', score: 'High' },
  { time: '6:00 PM EST', description: 'Evening browsing', score: 'Medium' },
  { time: '9:00 PM EST', description: 'Night reading time', score: 'Low' },
]

const bestDays = [
  { day: 'monday', label: 'Monday', description: 'Work week start' },
  { day: 'tuesday', label: 'Tuesday', description: 'High engagement' },
  { day: 'wednesday', label: 'Wednesday', description: 'Mid-week peak' },
  { day: 'thursday', label: 'Thursday', description: 'Strong activity' },
  { day: 'friday', label: 'Friday', description: 'Weekend prep' },
  { day: 'saturday', label: 'Saturday', description: 'Weekend browsing' },
  { day: 'sunday', label: 'Sunday', description: 'Lower activity' },
]

const contentCategories = [
  'Artificial Intelligence', 'Startups', 'Programming', 'Security',
  'Web Development', 'Mobile Development', 'DevOps', 'Data Science',
  'Blockchain', 'Open Source', 'Career', 'Remote Work',
  'Productivity', 'Technology News', 'Software Tools'
]

const guidelines = [
  {
    key: 'noSelfPromotion',
    title: 'No Excessive Self-Promotion',
    description: 'Content should provide value beyond promoting your own product/service'
  },
  {
    key: 'originalContent',
    title: 'Original or High-Value Content',
    description: 'Share original insights or genuinely interesting/useful content'
  },
  {
    key: 'relevantToTech',
    title: 'Relevant to Tech Community',
    description: 'Content should be interesting to developers, entrepreneurs, and tech professionals'
  },
  {
    key: 'notClickbait',
    title: 'No Clickbait Titles',
    description: 'Titles should be descriptive and accurate, not sensationalized'
  }
]

export function HackerNewsCampaign({ onSubmit, onCancel, initialData }) {
  const [selectedDays, setSelectedDays] = useState(initialData?.timing?.dayOfWeek || [])
  const [selectedTags, setSelectedTags] = useState(initialData?.tags || [])

  const form = useForm({
    resolver: zodResolver(hackerNewsCampaignSchema),
    defaultValues: {
      postType: 'story',
      title: '',
      url: '',
      content: '',
      timing: {
        submitTime: '8:00 AM EST',
        timezone: 'EST',
        dayOfWeek: [],
      },
      communityGuidelines: {
        noSelfPromotion: false,
        originalContent: false,
        relevantToTech: false,
        notClickbait: false,
      },
      engagementGoals: {
        points: 50,
        comments: 10,
        frontPage: false,
      },
      tags: [],
      ...initialData,
    }
  })

  const watchPostType = form.watch('postType')
  const watchGuidelines = form.watch('communityGuidelines')

  const allGuidelinesChecked = Object.values(watchGuidelines || {}).every(Boolean)

  const handleDayToggle = (day) => {
    const current = selectedDays
    if (current.includes(day)) {
      const updated = current.filter(d => d !== day)
      setSelectedDays(updated)
      form.setValue('timing.dayOfWeek', updated)
    } else {
      const updated = [...current, day]
      setSelectedDays(updated)
      form.setValue('timing.dayOfWeek', updated)
    }
  }

  const handleTagToggle = (tag) => {
    const current = selectedTags
    if (current.includes(tag)) {
      const updated = current.filter(t => t !== tag)
      setSelectedTags(updated)
      form.setValue('tags', updated)
    } else {
      const updated = [...current, tag]
      setSelectedTags(updated)
      form.setValue('tags', updated)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-orange-600 rounded">
              <Hash className="h-5 w-5 text-white" />
            </div>
            <span>Hacker News Campaign Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Post Type Selection */}
              <FormField
                control={form.control}
                name="postType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Type</FormLabel>
                    <FormDescription>
                      Choose the type of post that best fits your content
                    </FormDescription>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {postTypes.map((type) => (
                        <div
                          key={type.value}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            field.value === type.value
                              ? 'border-orange-600 bg-orange-50'
                              : 'border-muted hover:border-orange-200'
                          }`}
                          onClick={() => field.onChange(type.value)}
                        >
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {type.description}
                          </div>
                          <div className="text-xs text-muted-foreground mt-2 italic">
                            {type.example}
                          </div>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Content */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {watchPostType === 'ask' ? 'Question Title' :
                         watchPostType === 'show' ? 'Project Title' : 'Story Title'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            watchPostType === 'ask' ? 'Ask HN: What\'s your experience with...' :
                            watchPostType === 'show' ? 'Show HN: I built a tool for...' :
                            'Descriptive title for your story'
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/80 characters. Keep it clear and descriptive.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(watchPostType === 'story' || watchPostType === 'show') && (
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <ExternalLink className="h-4 w-4 inline mr-1" />
                          {watchPostType === 'show' ? 'Project URL' : 'Article/Content URL'}
                        </FormLabel>
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
                )}

                {watchPostType === 'ask' && (
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide more context for your question..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <Separator />

              {/* Content Categories */}
              <div className="space-y-4">
                <FormLabel>Content Categories (Optional)</FormLabel>
                <FormDescription>
                  Select relevant categories to help with timing and targeting
                </FormDescription>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {contentCategories.map((category) => (
                    <Button
                      key={category}
                      type="button"
                      variant={selectedTags.includes(category) ? "default" : "outline"}
                      size="sm"
                      className="justify-start text-xs"
                      onClick={() => handleTagToggle(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Timing */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Optimal Timing</h3>
                </div>

                <FormField
                  control={form.control}
                  name="timing.submitTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Submit Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {optimalTimes.map((time) => (
                            <SelectItem key={time.time} value={time.time}>
                              <div className="flex items-center justify-between w-full">
                                <div>
                                  <div className="font-medium">{time.time}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {time.description}
                                  </div>
                                </div>
                                <Badge
                                  variant={time.score === 'High' ? 'default' :
                                          time.score === 'Medium' ? 'secondary' : 'outline'}
                                  className="ml-2"
                                >
                                  {time.score}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <Label>Best Days to Post</Label>
                  <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                    {bestDays.map((day) => (
                      <Button
                        key={day.day}
                        type="button"
                        variant={selectedDays.includes(day.day) ? "default" : "outline"}
                        size="sm"
                        className="text-xs"
                        onClick={() => handleDayToggle(day.day)}
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Engagement Goals */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Engagement Goals</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="engagementGoals.points"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Points</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="50"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Upvotes - downvotes
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="engagementGoals.comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>Target Comments</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="10"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="engagementGoals.frontPage"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0 mt-6">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div>
                          <FormLabel>Front Page Goal</FormLabel>
                          <FormDescription className="text-xs">
                            Aim to reach HN front page
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Community Guidelines */}
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-2">Community Guidelines Compliance</div>
                    <div className="text-sm">
                      Please confirm your content follows Hacker News community standards:
                    </div>
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  {guidelines.map((guideline) => (
                    <FormField
                      key={guideline.key}
                      control={form.control}
                      name={`communityGuidelines.${guideline.key}`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div>
                            <FormLabel className="font-medium">
                              {guideline.title}
                            </FormLabel>
                            <FormDescription>
                              {guideline.description}
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                {allGuidelinesChecked && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-green-600">
                      All community guidelines confirmed. Your campaign is ready for submission.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700"
                  disabled={!allGuidelinesChecked}
                >
                  Create Hacker News Campaign
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}