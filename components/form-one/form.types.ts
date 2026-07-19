
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

  // mobility: {
  //   walkingDistance?: string
  //   walkingTime?: string
  //   devices?: string[]
  // }

  limb: Record<string, any>
  muscle: Record<string, any>
  gait: Record<string, any>

  // 2. Details on the affected side / on the appearance
  // 2.1. General
  general_diagnosis_2_1: {
    cause_underlying_disease?: string[]
    diagnosis_since?: string
    functional_limitations?: string
    leg_length_discrepancy?: string
    history_complaints?: string[]
    comments?: string
  }

  // 2.2. Pain 
  pain_2_2: {
    general_pain_in_the_leg?: string[]
    area?: string
    how_intense_is_the_pain?: string
    comments?: string
  }

  // 2.3. Sensitivity 
  sensitivity_2_3: {
    no_findings?: boolean,
    warm_or_cold_sensitivity?: string
    sharp_or_dull_sensitivity?: string
    preasure_sensitivity?: string
    preasure_localisation?: string
    // capability_of_bearing_load
    capable_of_contact?: boolean
    capable_of_bearing_load?: boolean
    if_capable_of_bearing_load_ho_much?: string
    comments?: string
  }


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