'use client'

import { useState } from 'react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PlatformSelector } from './PlatformSelector'
import { CampaignForm } from './CampaignForm'

const STEPS = {
  PLATFORM_SELECTION: 'platform',
  CAMPAIGN_DETAILS: 'details'
}

export function NewCampaignModal({ open, onOpenChange }) {
  const [currentStep, setCurrentStep] = useState(STEPS.PLATFORM_SELECTION)
  const [selectedPlatform, setSelectedPlatform] = useState(null)

  const form = useForm({
    defaultValues: {
      // Common fields
      platform: '',
      name: '',
      budget: '',
      budgetType: 'daily',
      currency: 'USD',
      dateRange: { start: null, end: null },
      description: '',
      enhanceWithAI: false,
      // Reddit fields
      subreddit: '',
      postType: '',
      title: '',
      content: '',
      mediaFile: null,
      // Facebook fields
      objective: '',
      audience: [],
      adFormat: '',
      creative: '',
      mediaFiles: [],
      // Instagram fields
      contentType: '',
      caption: '',
      hashtags: '',
      targetAudience: [],
      // Hacker News fields
      url: '',
      submissionContent: ''
    }
  })

  // Debug: Watch for file field changes
  const mediaFile = form.watch('mediaFile')
  const mediaFiles = form.watch('mediaFiles')

  React.useEffect(() => {
    console.log('🎯 Form file field changed - mediaFile:', mediaFile, typeof mediaFile, mediaFile instanceof File)
  }, [mediaFile])

  React.useEffect(() => {
    console.log('🎯 Form file field changed - mediaFiles:', mediaFiles, Array.isArray(mediaFiles), mediaFiles?.length)
    if (mediaFiles && Array.isArray(mediaFiles)) {
      mediaFiles.forEach((file, index) => {
        console.log(`  - mediaFiles[${index}]:`, file, typeof file, file instanceof File)
      })
    }
  }, [mediaFiles])

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform)
    form.setValue('platform', platform.id)
    setCurrentStep(STEPS.CAMPAIGN_DETAILS)
  }

  const handleBack = () => {
    setCurrentStep(STEPS.PLATFORM_SELECTION)
    setSelectedPlatform(null)
  }

  const handleClose = () => {
    setCurrentStep(STEPS.PLATFORM_SELECTION)
    setSelectedPlatform(null)
    form.reset()
    onOpenChange(false)
  }

  const prepareFormData = (data) => {
    const formData = new FormData()

    console.log('🔧 prepareFormData - Starting with data:', data)

    // Add basic campaign fields
    Object.entries(data).forEach(([key, value]) => {
      console.log(`🔍 Processing field "${key}":`, value, typeof value)

      if (value === null || value === undefined) {
        console.log(`⏭️ Skipping null/undefined field: ${key}`)
        return
      }

      // Handle date range object
      if (key === 'dateRange' && value && typeof value === 'object') {
        console.log('📅 Processing dateRange:', value)
        if (value.start) {
          formData.append('dateRangeStart', value.start)
          console.log('✅ Added dateRangeStart:', value.start)
        }
        if (value.end) {
          formData.append('dateRangeEnd', value.end)
          console.log('✅ Added dateRangeEnd:', value.end)
        }
        return
      }

      // Handle array fields (audience, targetAudience) - but NOT file arrays
      if (Array.isArray(value) && !key.includes('mediaFile')) {
        console.log(`📊 Processing array field "${key}":`, value)
        formData.append(key, JSON.stringify(value))
        console.log(`✅ Added array field "${key}" as JSON`)
        return
      }

      // Handle single file (Reddit mediaFile)
      if (key === 'mediaFile') {
        console.log('📁 Processing single mediaFile:', value)

        if (value instanceof File) {
          formData.append('mediaFile', value)
          console.log('✅ Added single mediaFile to FormData:', value.name, value.size, 'bytes')
        } else if (value) {
          console.warn('⚠️ mediaFile is not a File object:', typeof value, value)
        } else {
          console.log('💡 No mediaFile provided')
        }
        return
      }

      // Handle multiple files (Facebook/Instagram mediaFiles)
      if (key === 'mediaFiles') {
        console.log('📁 Processing multiple mediaFiles:', value)

        if (Array.isArray(value)) {
          console.log(`📊 mediaFiles is array with ${value.length} items`)

          value.forEach((file, index) => {
            console.log(`📄 Processing file ${index}:`, file, typeof file, file instanceof File)

            if (file instanceof File) {
              formData.append('mediaFiles', file)
              console.log(`✅ Added mediaFiles[${index}] to FormData:`, file.name, file.size, 'bytes')
            } else {
              console.warn(`⚠️ mediaFiles[${index}] is not a File object:`, typeof file, file)
            }
          })
        } else if (value instanceof File) {
          // Handle case where single file is passed instead of array
          console.log('📄 Single file provided for mediaFiles, converting to array')
          formData.append('mediaFiles', value)
          console.log('✅ Added single file as mediaFiles:', value.name, value.size, 'bytes')
        } else if (value === null || value === undefined) {
          console.log('💡 No mediaFiles provided (null/undefined)')
        } else {
          console.warn('⚠️ mediaFiles is invalid type:', typeof value, value)
          console.warn('⚠️ Expected array or File, but got:', value?.constructor?.name || 'unknown')
        }
        return
      }

      // Handle regular fields
      if (typeof value === 'boolean') {
        formData.append(key, value.toString())
        console.log(`✅ Added boolean field "${key}":`, value.toString())
      } else if (typeof value === 'string' || typeof value === 'number') {
        formData.append(key, value.toString())
        console.log(`✅ Added field "${key}":`, value.toString())
      } else {
        console.warn(`⚠️ Unhandled field type for "${key}":`, typeof value, value)
      }
    })

    // Log final FormData contents
    console.log('📋 Final FormData contents:')
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`)
      } else {
        console.log(`  ${key}: ${value}`)
      }
    }

    return formData
  }

  const onSubmit = async (data) => {
    try {
      console.log('=== FORM SUBMISSION DEBUG ===')
      console.log('Raw form data from React Hook Form:', data)

      // Ensure mediaFiles is always an array
      if (!Array.isArray(data.mediaFiles)) {
        console.warn('⚠️ mediaFiles is not an array, normalizing:', typeof data.mediaFiles, data.mediaFiles)
        if (data.mediaFiles === null || data.mediaFiles === undefined) {
          data.mediaFiles = []
        } else if (data.mediaFiles instanceof File) {
          data.mediaFiles = [data.mediaFiles]
        } else {
          console.error('❌ mediaFiles has unexpected type:', typeof data.mediaFiles, data.mediaFiles)
          data.mediaFiles = []
        }
      }

      // Check for file fields specifically
      console.log('File field analysis:')
      console.log('- mediaFile:', data.mediaFile, typeof data.mediaFile, data.mediaFile instanceof File)
      console.log('- mediaFiles:', data.mediaFiles, Array.isArray(data.mediaFiles), data.mediaFiles?.length)

      // Safe array iteration for mediaFiles (now guaranteed to be an array)
      data.mediaFiles.forEach((file, index) => {
        console.log(`  - mediaFiles[${index}]:`, file, typeof file, file instanceof File)
      })

      // Convert to FormData for file upload support
      const formData = prepareFormData(data)

      // Log FormData contents for debugging
      console.log('FormData prepared with files:')
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`)
        } else {
          console.log(`${key}: ${value}`)
        }
      }

      // Call API route instead of server action
      const response = await fetch('/api/campaigns/create', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        // Show success message (possibly with upload warnings)
        if (result.uploadErrors && result.uploadErrors.length > 0) {
          toast.warning(result.message || 'Campaign created with file upload issues')
          console.warn('Upload errors:', result.uploadErrors)
        } else {
          toast.success(result.message || 'Campaign created successfully!')
        }

        console.log('Campaign created with ID:', result.campaignId)
        console.log('Campaign data:', result.data)
        handleClose()
      } else {
        toast.error(result.message || 'Failed to create campaign')
        console.error('Campaign creation failed:', result.message)
      }
    } catch (error) {
      console.error('Error submitting campaign:', error)
      toast.error('An unexpected error occurred. Please try again.')
    }
  }

  const isFormValid = form.formState.isValid
  const isSubmitting = form.formState.isSubmitting

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentStep === STEPS.PLATFORM_SELECTION
              ? 'Create New Campaign'
              : `Create ${selectedPlatform?.name} Campaign`
            }
          </DialogTitle>
          <DialogDescription>
            {currentStep === STEPS.PLATFORM_SELECTION
              ? 'Choose a platform to get started with your marketing campaign.'
              : `Fill in the details for your ${selectedPlatform?.name} campaign.`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {currentStep === STEPS.PLATFORM_SELECTION ? (
            <PlatformSelector onSelect={handlePlatformSelect} />
          ) : (
            <CampaignForm
              form={form}
              platform={selectedPlatform}
              onSubmit={onSubmit}
            />
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {currentStep === STEPS.CAMPAIGN_DETAILS && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>

          <div>
            {currentStep === STEPS.CAMPAIGN_DETAILS && (
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Campaign'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}