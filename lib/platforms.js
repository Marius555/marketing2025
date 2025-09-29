import { FacebookIcon, InstagramIcon, RedditIcon, HackerNewsIcon } from '@/components/icons'

export const platforms = [
  {
    id: 'reddit',
    name: 'Reddit',
    description: 'Community discussions',
    icon: RedditIcon,
    color: 'bg-orange-500',
    brandColor: '#FF4500'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Social advertising',
    icon: FacebookIcon,
    color: 'bg-blue-500',
    brandColor: '#1877F2'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Visual content',
    icon: InstagramIcon,
    color: 'bg-pink-500',
    brandColor: '#E4405F'
  },
  {
    id: 'hackernews',
    name: 'Hacker News',
    description: 'Tech community',
    icon: HackerNewsIcon,
    color: 'bg-orange-600',
    brandColor: '#FF6600'
  }
]

export const getPlatformById = (id) => {
  return platforms.find(platform => platform.id === id)
}

export const getPlatformIcon = (id, props = {}) => {
  const platform = getPlatformById(id)
  if (!platform) return null

  const IconComponent = platform.icon
  return <IconComponent {...props} />
}