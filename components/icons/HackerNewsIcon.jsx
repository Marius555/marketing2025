import { cn } from '@/lib/utils'

export function HackerNewsIcon({ className, size = 16, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(`w-${size} h-${size}`, className)}
      style={{ width: size, height: size }}
      fill="currentColor"
      {...props}
    >
      <title>Hacker News</title>
      <path d="M0 0h24v24H0zm12.8 13.446l4.339-8.303h-1.871q-2.143 4.018-2.839 5.786l-.375.96-.32-.75c-.96-2.374-1.931-4.348-3.022-6.243l.129.243H7.857l4.286 8.2v5.52h1.657z"/>
    </svg>
  )
}