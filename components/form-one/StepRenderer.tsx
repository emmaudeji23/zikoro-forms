
import { useForm } from "./FormProvider"
import Step1 from "./Step1"
import Step2 from "./Step2"
import Step3 from "./Step3"

export const STEPS = [
  { id: "basicInfo", title: "Basic Info", description:"", instructions:"" },
  { id: "health", title: "Health", description:"", instructions:"" },
  { id: "general_diagnosis_2_1", title: "General Diagnosis", description:"", instructions:"" },
  { id: "limb", title: "Limb Details", description:"", instructions:"" },
  { id: "muscle", title: "Muscle Strength", description:"", instructions:"" },
  { id: "gait", title: "Gait Analysis", description:"", instructions:"" },
]

const stepMap = [
  Step1,
  Step2,
  Step3,
  () => <div>Muscle (coming soon)</div>,
  () => <div>Gait (coming soon)</div>,
  () => <div>Gait (coming soon)</div>,
  () => <div>Gait (coming soon)</div>,
  () => <div>Gait (coming soon)</div>,
]

export const StepRenderer = () => {
  const { state } = useForm()
  const StepComponent = stepMap[state.currentStep]

  return (
    <div className="relative overflow-hidden">
      <div
        key={state.currentStep}
        className="
          animate-in fade-in slide-in-from-right-4
          duration-300 ease-out
        "
      >
        <div className="rounded border p-5 sm:p-6 bg-muted/30 ">
          <StepComponent />
        </div>
      </div>
    </div>
  )
}