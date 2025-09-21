'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  MessageCircle,
  Info,
  Clock,
  TrendingUp,
  Users,
  MessageSquare,
  ThumbsUp
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

const redditCampaignSchema = z.object({
  subreddits: z.array(z.string()).min(1, 'At least one subreddit is required'),
  postType: z.enum(['text', 'link', 'image']),
  title: z.string().min(1, 'Title is required').max(300, 'Title must be under 300 characters'),
  content: z.string().min(1, 'Content is required'),
  linkUrl: z.string().url().optional(),
  timing: z.object({
    bestTimes: z.array(z.string()),
    timezone: z.string(),
  }),
  targetKarma: z.number().min(0).optional(),
  engagementGoals: z.object({
    upvotes: z.number().min(0).optional(),
    comments: z.number().min(0).optional(),
    shares: z.number().min(0).optional(),
  }),
  communityGuidelines: z.boolean(),
})

const popularSubreddits = [
  { name: 'r/entrepreneur', members: '1.2M', description: 'Business and startup discussions' },
  { name: 'r/startups', members: '1.5M', description: 'Startup community' },
  { name: 'r/technology', members: '14M', description: 'Technology news and discussions' },
  { name: 'r/programming', members: '4.2M', description: 'Programming discussions' },
  { name: 'r/webdev', members: '800K', description: 'Web development community' },
  { name: 'r/SaaS', members: '150K', description: 'Software as a Service discussions' },
  { name: 'r/marketing', members: '180K', description: 'Marketing strategies and tips' },
  { name: 'r/smallbusiness', members: '1.8M', description: 'Small business community' },
]

const bestPostingTimes = [
  { time: '9:00 AM EST', description: 'Morning engagement peak' },
  { time: '1:00 PM EST', description: 'Lunch break activity' },
  { time: '6:00 PM EST', description: 'Evening peak hours' },
  { time: '9:00 PM EST', description: 'Night browsing time' },
]

export function RedditCampaign({ onSubmit, onCancel, initialData }) {
  const [selectedSubreddits, setSelectedSubreddits] = useState(initialData?.subreddits || [])

  const form = useForm({
    resolver: zodResolver(redditCampaignSchema),
    defaultValues: {
      subreddits: initialData?.subreddits || [],
      postType: initialData?.postType || 'text',
      title: initialData?.title || '',
      content: initialData?.content || '',
      linkUrl: initialData?.linkUrl || '',
      timing: {
        bestTimes: initialData?.timing?.bestTimes || [],
        timezone: initialData?.timing?.timezone || 'EST',
      },
      targetKarma: initialData?.targetKarma || 100,
      engagementGoals: {
        upvotes: initialData?.engagementGoals?.upvotes || 50,
        comments: initialData?.engagementGoals?.comments || 10,
        shares: initialData?.engagementGoals?.shares || 5,
      },
      communityGuidelines: false,
    }
  })

  const watchPostType = form.watch('postType')

  const handleSubredditToggle = (subreddit) => {
    const current = selectedSubreddits
    if (current.includes(subreddit)) {
      const updated = current.filter(s => s !== subreddit)
      setSelectedSubreddits(updated)
      form.setValue('subreddits', updated)
    } else {
      const updated = [...current, subreddit]
      setSelectedSubreddits(updated)
      form.setValue('subreddits', updated)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-orange-500 rounded">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span>Reddit Campaign Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Subreddit Selection */}
              <div className="space-y-4">
                <FormLabel>Target Subreddits</FormLabel>
                <FormDescription>
                  Select relevant subreddits where your campaign will be posted
                </FormDescription>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {popularSubreddits.map((subreddit) => (
                    <div
                      key={subreddit.name}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedSubreddits.includes(subreddit.name)
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-muted hover:border-orange-200'
                      }`}
                      onClick={() => handleSubredditToggle(subreddit.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{subreddit.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {subreddit.description}
                          </div>
                        </div>
                        <Badge variant="secondary">{subreddit.members}</Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedSubreddits.map((subreddit) => (
                    <Badge
                      key={subreddit}
                      variant="default"
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      {subreddit}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Post Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="postType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Post Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select post type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="text">Text Post</SelectItem>
                            <SelectItem value="link">Link Post</SelectItem>
                            <SelectItem value="image">Image Post</SelectItem>
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
                        <FormLabel>Post Title</FormLabel>
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

                  {watchPostType === 'link' && (
                    <FormField
                      control={form.control}
                      name="linkUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link URL</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {watchPostType === 'text' ? 'Post Content' : 'Post Description'}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your Reddit post content here..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  {/* Timing */}
                  <div>
                    <FormLabel>Best Posting Times</FormLabel>
                    <FormDescription className="mb-3">
                      Select optimal times for maximum engagement
                    </FormDescription>
                    <div className="space-y-2">
                      {bestPostingTimes.map((timeSlot) => (
                        <FormField
                          key={timeSlot.time}
                          control={form.control}
                          name="timing.bestTimes"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(timeSlot.time)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value || []
                                    if (checked) {
                                      field.onChange([...current, timeSlot.time])
                                    } else {
                                      field.onChange(current.filter(t => t !== timeSlot.time))
                                    }
                                  }}
                                />
                              </FormControl>
                              <div>
                                <FormLabel className="text-sm font-normal">
                                  {timeSlot.time}
                                </FormLabel>
                                <FormDescription className="text-xs">
                                  {timeSlot.description}
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Engagement Goals */}
                  <div className="space-y-3">
                    <FormLabel>Engagement Goals</FormLabel>

                    <FormField
                      control={form.control}
                      name="engagementGoals.upvotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm flex items-center">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Target Upvotes
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="50"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="engagementGoals.comments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm flex items-center">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Target Comments
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="10"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Community Guidelines */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <FormField
                    control={form.control}
                    name="communityGuidelines"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div>
                          <FormLabel>
                            I acknowledge Reddit community guidelines
                          </FormLabel>
                          <FormDescription>
                            I understand and will follow each subreddit's rules, avoid spam,
                            and engage authentically with the community.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </AlertDescription>
              </Alert>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={!form.watch('communityGuidelines')}
                >
                  Create Reddit Campaign
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}