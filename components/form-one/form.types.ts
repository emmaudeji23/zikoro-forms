
/* ================= TYPES ================= */

export type StepKey =
  | "basicInfo"
  | "health"
  | "mobility"
  | "limb"
  | "muscle"
  | "gait"

export type FormData = {
  basicInfo: {
    therapist?: string
    orderNumber?: string
    deviceNumber?: string

    date?: string // yyyy-MM-dd

    name?: string
    id?: string
    dob?: string // yyyy-MM-dd

    handedness?: "left" | "right"

    height?: number | string
    weight?: number | string

    affectedSide?: "left" | "right" | "bilateral"

    orthosis?: (
      | "fo"
      | "afo"
      | "ko"
      | "kafo"
      | "ho"
      | "hkafo"
      | "ortho"
    )[]
  },

  health: {
    cardiovascular_diseases?: string
    circulatory_disorders?: string
    taking_medications?: boolean
    conditions?: string[]
    sideEffects?: string[]
    infectious_diseases?: string
    allergies?: string
   
    torso?: string
    upperExtremity_left?: string[]
    upperExtremity_right?: string[]
    upperExtremity_symptoms?: string
    otherIssues?: string
 
    activities?: string
    environment?: string
    stairways?: string
    
    walking_distance?: string
    walking_time?: string
    

    travelling?: string[]
    devices?: string[]
    assistance?: boolean

    comment?: string
}

  mobility: {
    walkingDistance?: string
    walkingTime?: string
    devices?: string[]
  }

  limb: Record<string, any>
  muscle: Record<string, any>
  gait: Record<string, any>
}

export type FormState = {
  currentStep: number
  isSubmitting: boolean
  isDraft: boolean
  data: FormData
  errors: Record<string, string>
}


export type HealthSection = {
  generalState?: {
    conditions?: string[]
    hasMedication?: boolean
    sideEffects?: string[]
  }

  functionalLimitations?: {
    torso?: string
    upperExtremity?: {
      left?: string[]
      right?: string[]
      symptoms?: string
    }
    otherIssues?: string
  }

  activities?: {
    activities?: string
    environment?: string
    stairways?: string

    walking?: {
      distance?: string
      time?: string
    }

    travelling?: string[]
    devices?: string[]
    assistance?: boolean

    comment?: string
  }
}