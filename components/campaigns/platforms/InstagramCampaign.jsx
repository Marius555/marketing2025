'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Camera,
  Hash,
  Users,
  Heart,
  MessageCircle,
  Share,
  Eye,
  Image,
  Video,
  Calendar
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
import { Label } from '@/components/ui/label'

const instagramCampaignSchema = z.object({
  contentType: z.enum(['post', 'story', 'reel', 'igtv']),
  mediaType: z.enum(['image', 'video', 'carousel']),
  caption: z.string().min(1, 'Caption is required'),
  hashtags: z.array(z.string()).max(30, 'Maximum 30 hashtags allowed'),
  targeting: z.object({
    demographics: z.object({
      ageRange: z.object({
        min: z.number().min(13),
        max: z.number().max(65),
      }),
      gender: z.array(z.string()),
      locations: z.array(z.string()),
    }),
    interests: z.array(z.string()),
    behaviors: z.array(z.string()),
    lookalikesAudiences: z.array(z.string()).optional(),
  }),
  schedule: z.object({
    publishTime: z.string(),
    timezone: z.string(),
    frequency: z.string().optional(),
  }),
  goals: z.object({
    likes: z.number().min(0).optional(),
    comments: z.number().min(0).optional(),
    shares: z.number().min(0).optional(),
    saves: z.number().min(0).optional(),
    reach: z.number().min(0).optional(),
  }),
  influencerTags: z.array(z.string()).optional(),
  locationTag: z.string().optional(),
})

const contentTypes = [
  { value: 'post', label: 'Feed Post', description: 'Regular Instagram post' },
  { value: 'story', label: 'Instagram Story', description: '24-hour story content' },
  { value: 'reel', label: 'Instagram Reel', description: 'Short-form video content' },
  { value: 'igtv', label: 'IGTV', description: 'Long-form video content' },
]

const popularHashtags = [
  '#marketing', '#business', '#entrepreneur', '#startup', '#saas',
  '#technology', '#innovation', '#digitalmarketing', '#socialmedia',
  '#growth', '#productivity', '#success', '#motivation', '#leadership',
  '#ecommerce', '#webdesign', '#mobileapp', '#ai', '#automation',
  '#branding', '#contentmarketing', '#seo', '#analytics', '#conversion'
]

const demographics = {
  interests: [
    'Business and Industry', 'Technology', 'Marketing', 'Entrepreneurship',
    'E-commerce', 'SaaS', 'Mobile Apps', 'Web Development', 'Digital Marketing',
    'Social Media', 'Startups', 'Innovation', 'Productivity', 'Online Business'
  ],
  behaviors: [
    'Small business owners', 'Technology early adopters', 'Frequent online shoppers',
    'Mobile device users', 'Social media influencers', 'Digital content creators',
    'Business decision makers', 'Software purchasers', 'Online learners'
  ]
}

const bestPostingTimes = [
  { time: '6:00 AM', description: 'Early morning engagement' },
  { time: '12:00 PM', description: 'Lunch break peak' },
  { time: '5:00 PM', description: 'After work hours' },
  { time: '7:00 PM', description: 'Evening peak time' },
  { time: '9:00 PM', description: 'Night scrolling time' },
]

export function InstagramCampaign({ onSubmit, onCancel, initialData }) {
  const [selectedHashtags, setSelectedHashtags] = useState(initialData?.hashtags || [])
  const [customHashtag, setCustomHashtag] = useState('')
  const [selectedInterests, setSelectedInterests] = useState(initialData?.targeting?.interests || [])
  const [selectedBehaviors, setSelectedBehaviors] = useState(initialData?.targeting?.behaviors || [])

  const form = useForm({
    resolver: zodResolver(instagramCampaignSchema),
    defaultValues: {
      contentType: 'post',
      mediaType: 'image',
      caption: '',
      hashtags: [],
      targeting: {
        demographics: {
          ageRange: { min: 18, max: 65 },
          gender: ['all'],
          locations: ['United States'],
        },
        interests: [],
        behaviors: [],
        lookalikesAudiences: [],
      },
      schedule: {
        publishTime: '12:00',
        timezone: 'EST',
        frequency: 'once',
      },
      goals: {
        likes: 100,
        comments: 20,
        shares: 10,
        saves: 15,
        reach: 5000,
      },
      influencerTags: [],
      locationTag: '',
      ...initialData,
    }
  })

  const watchContentType = form.watch('contentType')

  const handleHashtagToggle = (hashtag) => {
    if (selectedHashtags.includes(hashtag)) {
      const updated = selectedHashtags.filter(h => h !== hashtag)
      setSelectedHashtags(updated)
      form.setValue('hashtags', updated)
    } else if (selectedHashtags.length < 30) {
      const updated = [...selectedHashtags, hashtag]
      setSelectedHashtags(updated)
      form.setValue('hashtags', updated)
    }
  }

  const addCustomHashtag = () => {
    if (customHashtag && !selectedHashtags.includes(customHashtag) && selectedHashtags.length < 30) {
      const hashtag = customHashtag.startsWith('#') ? customHashtag : `#${customHashtag}`
      const updated = [...selectedHashtags, hashtag]
      setSelectedHashtags(updated)
      form.setValue('hashtags', updated)
      setCustomHashtag('')
    }
  }

  const handleInterestToggle = (interest) => {
    if (selectedInterests.includes(interest)) {
      const updated = selectedInterests.filter(i => i !== interest)
      setSelectedInterests(updated)
      form.setValue('targeting.interests', updated)
    } else {
      const updated = [...selectedInterests, interest]
      setSelectedInterests(updated)
      form.setValue('targeting.interests', updated)
    }
  }

  const handleBehaviorToggle = (behavior) => {
    if (selectedBehaviors.includes(behavior)) {
      const updated = selectedBehaviors.filter(b => b !== behavior)
      setSelectedBehaviors(updated)
      form.setValue('targeting.behaviors', updated)
    } else {
      const updated = [...selectedBehaviors, behavior]
      setSelectedBehaviors(updated)
      form.setValue('targeting.behaviors', updated)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-pink-500 rounded">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <span>Instagram Campaign Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Content Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {contentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-muted-foreground">
                                  {type.description}
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
                  name="mediaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select media type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="image">
                            <div className="flex items-center space-x-2">
                              <Image className="h-4 w-4" />
                              <span>Image</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="video">
                            <div className="flex items-center space-x-2">
                              <Video className="h-4 w-4" />
                              <span>Video</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="carousel">
                            <div className="flex items-center space-x-2">
                              <Image className="h-4 w-4" />
                              <span>Carousel</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Caption */}
              <FormField
                control={form.control}
                name="caption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caption</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write an engaging caption for your Instagram post..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/2200 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Hashtags */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Hash className="h-5 w-5" />
                  <FormLabel>Hashtags ({selectedHashtags.length}/30)</FormLabel>
                </div>

                {/* Popular Hashtags */}
                <div>
                  <Label className="text-sm text-muted-foreground">Popular Hashtags</Label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                    {popularHashtags.map((hashtag) => (
                      <Button
                        key={hashtag}
                        type="button"
                        variant={selectedHashtags.includes(hashtag) ? "default" : "outline"}
                        size="sm"
                        className="justify-start text-xs"
                        onClick={() => handleHashtagToggle(hashtag)}
                        disabled={!selectedHashtags.includes(hashtag) && selectedHashtags.length >= 30}
                      >
                        {hashtag}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Hashtag */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom hashtag"
                    value={customHashtag}
                    onChange={(e) => setCustomHashtag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomHashtag())}
                  />
                  <Button
                    type="button"
                    onClick={addCustomHashtag}
                    disabled={!customHashtag || selectedHashtags.length >= 30}
                  >
                    Add
                  </Button>
                </div>

                {/* Selected Hashtags */}
                <div className="flex flex-wrap gap-2">
                  {selectedHashtags.map((hashtag) => (
                    <Badge
                      key={hashtag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleHashtagToggle(hashtag)}
                    >
                      {hashtag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Targeting */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Audience Targeting</h3>
                </div>

                {/* Interests */}
                <div className="space-y-3">
                  <Label>Interests</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {demographics.interests.map((interest) => (
                      <Button
                        key={interest}
                        type="button"
                        variant={selectedInterests.includes(interest) ? "default" : "outline"}
                        size="sm"
                        className="justify-start text-xs"
                        onClick={() => handleInterestToggle(interest)}
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Behaviors */}
                <div className="space-y-3">
                  <Label>Behaviors</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {demographics.behaviors.map((behavior) => (
                      <Button
                        key={behavior}
                        type="button"
                        variant={selectedBehaviors.includes(behavior) ? "default" : "outline"}
                        size="sm"
                        className="justify-start text-xs"
                        onClick={() => handleBehaviorToggle(behavior)}
                      >
                        {behavior}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Schedule */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Publishing Schedule</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="schedule.publishTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publish Time</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {bestPostingTimes.map((time) => (
                              <SelectItem key={time.time} value={time.time}>
                                <div>
                                  <div className="font-medium">{time.time}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {time.description}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="schedule.timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                            <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                            <SelectItem value="CST">Central Time (CST)</SelectItem>
                            <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="schedule.frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="once">Post Once</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Engagement Goals */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Engagement Goals</h3>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <FormField
                    control={form.control}
                    name="goals.likes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>Likes</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="goals.comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>Comments</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="goals.shares"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-1">
                          <Share className="h-3 w-3" />
                          <span>Shares</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="goals.saves"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-1">
                          <span>Saves</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="goals.reach"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>Reach</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  Create Instagram Campaign
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}