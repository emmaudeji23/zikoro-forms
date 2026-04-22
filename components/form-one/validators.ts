import { FormData, FormState } from "./form.types"
import { useForm } from "./FormProvider"
import { STEPS } from "./StepRenderer"

  /* ---------- VALIDATION ---------- */
  export const validateStep = (state:FormState): Record<string, string> => {
     
    const {basicInfo, } = state.data
    const stepKey = state.currentStep
     
    const errors: Record<string, string> = {}

    // SIMPLE RULES (expand later)
    if (stepKey  === 0 ) {
    //   if (!data.name) errors.name = "Name is required"
    //   if (!data.dob) errors.dob = "Date of birth is required"
    }

    if (stepKey  === 1 ) {
    //   if (!data.conditions || data.conditions.length === 0) {
    //     errors.conditions = "Select at least one condition"
    //   }
    }

    return errors
     
  }