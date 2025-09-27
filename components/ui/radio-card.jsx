'use client'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

export function RadioCard({
  id,
  name,
  value,
  checked,
  onChange,
  title,
  description,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors",
        checked ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "",
        className
      )}
      onClick={onChange}
      {...props}
    >
      <div className="mt-1 h-4 w-4 relative">
        <div className={cn(
          "h-4 w-4 rounded-full border-2 bg-transparent flex items-center justify-center",
          checked ? "border-primary" : "border-gray-300"
        )}>
          {checked && (
            <div className="h-2 w-2 rounded-full bg-primary"></div>
          )}
        </div>
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex-1">
        <Label htmlFor={id} className="font-medium cursor-pointer">
          {title}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}