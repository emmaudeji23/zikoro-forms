"use client"

import React from "react"
import { useForm } from "./FormProvider"
import { STEPS } from "./StepRenderer"
import { Button } from "../ui/button"
import { validateStep } from "./validators"
import {
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle2,
  Loader2,
} from "lucide-react"

const Navigation = () => {
  const {
    nextStep,
    prevStep,
    saveDraft,
    submit,
    state,
    setErrors,
  } = useForm()

  const isLastStep = state.currentStep === STEPS.length - 1
  const isFirstStep = state.currentStep === 0

  const handleNext = () => {
    const errors = validateStep(state)

    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return
    }

    nextStep()
  }

  return (
    <footer
      className="
        flex  items-center justify-between 
        gap-4
      "
      aria-label="Form navigation"
    >
      {/* Back */}
      <Button
        variant="ghost"
        onClick={prevStep}
        disabled={isFirstStep}
        aria-disabled={isFirstStep}
        className="
          flex items-center gap-2
          transition-all duration-200
          disabled:opacity-40
        "
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      {/* Right actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        
        {/* Save Draft */}
        <Button
          variant="outline"
          onClick={saveDraft}
          className="
            flex items-center gap-2
            transition-all duration-200
            border-foreground
          "
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Save Draft</span>
        </Button>

        {/* Next / Submit */}
        {isLastStep ? (
          <Button
            onClick={submit}
            disabled={state.isSubmitting}
            className="
              flex items-center gap-2
              transition-all duration-200
            "
          >
            {state.isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Submit
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="
              flex items-center gap-2
              transition-all duration-200
            "
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </footer>
  )
}

export default Navigation