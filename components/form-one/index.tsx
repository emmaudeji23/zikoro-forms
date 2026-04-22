'use client'
import { FormProvider } from "./FormProvider"
import ProgressBar from "./ProgressBar"
import Navigation from "./Navigation"
import { StepRenderer } from "./StepRenderer"
import { PrintPreviewModal } from "./PrintPreview"
import { MedicalFormPrintTemplate } from "./MedicalFormPrintTemplate"

const FormOne = () => {
  return (
    <FormProvider>
      <main className="min-h-screen mx-auto max-w-3xl px-4 py-10 space-y-8">
          
          {/* Header */}
          <header className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Patient Assessment
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete the form step by step. Your progress is saved automatically.
            </p>
          </header>
          <MedicalFormPrintTemplate />

          {/* Progress */}
          <ProgressBar />

          {/* Form Card */}
          <div className="relative">
            <StepRenderer />
          </div>

          {/* Navigation */}
          <Navigation />


         
      </main>
    </FormProvider>
  )
}

export default FormOne