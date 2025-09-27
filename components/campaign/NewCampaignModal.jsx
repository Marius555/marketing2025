'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
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
      budgetMin: '',
      budgetMax: '',
      currency: 'USD',
      dateRange: { start: null, end: null },
      description: '',
      enhanceWithAI: false,
      // Reddit fields
      subreddit: '',
      postType: '',
      title: '',
      content: '',
      // Facebook fields
      objective: '',
      audience: '',
      adFormat: '',
      creative: '',
      mediaFiles: [],
      // Instagram fields
      contentType: '',
      caption: '',
      hashtags: '',
      targetAudience: '',
      // Hacker News fields
      url: '',
      submissionContent: ''
    }
  })

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

  const onSubmit = (data) => {
    console.log('Campaign data:', data)
    // TODO: Implement campaign creation API call
    handleClose()
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

          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>

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