"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { FormState, StepKey } from "./form.types"
import { validateStep } from "./validators"
import { STEPS } from "./StepRenderer"

type FormContextType = {
  state: FormState

  // actions
  updateField: (section: StepKey, field: string, value: any) => void
  setSection: (section: StepKey, values: Record<string, any>) => void
  setErrors: (errors: Record<string, string>) => void
  clearErrors: () => void

  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void

//   validateStep: () => boolean

  saveDraft: () => void
  clearDraft: () => void

  submit: () => Promise<void>
}

/* ================= CONSTANTS ================= */

const STORAGE_KEY = "orthotics-form"

/* ================= INITIAL STATE ================= */

const initialState: FormState = {
  currentStep: 0,
  isSubmitting: false,
  isDraft: true,
  data: {
    basicInfo: {},
    health: {},
    // mobility: {},
    limb: {},
    muscle: {},
    gait: {},
  },
  errors: {},
}

/* ================= CONTEXT ================= */

const FormContext = createContext<FormContextType | null>(null)

/* ================= PROVIDER ================= */

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<FormState>(initialState)

  /* ---------- UPDATE FIELD ---------- */
  const updateField = (section: StepKey, field: string, value: any) => {
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [section]: {
          ...prev.data[section],
          [field]: value,
        },
      },
    }))
  }

  /* ---------- SET WHOLE SECTION ---------- */
  const setSection = (section: StepKey, values: Record<string, any>) => {
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [section]: {
          ...prev.data[section],
          ...values,
        },
      },
    }))
  }

  /* ---------- ERRORS ---------- */
  const setErrors = (errors: Record<string, string>) => {
    setState(prev => ({ ...prev, errors }))
  }

  const clearErrors = () => {
    setState(prev => ({ ...prev, errors: {} }))
  }

  /* ---------- NAVIGATION ---------- */
  const nextStep = () => {
    if (state.currentStep < STEPS.length - 1) {
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
      }))
    }
  }

  const prevStep = () => {
    if (state.currentStep > 0) {
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1,
      }))
    }
  }

  const goToStep = (step: number) => {
    if (step >= 0 && step < STEPS.length) {
      setState(prev => ({ ...prev, currentStep: step }))
    }
  }



  /* ---------- DRAFT ---------- */
  const saveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data))
  }

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY)
  }

  /* ---------- LOAD DRAFT ---------- */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setState(prev => ({
        ...prev,
        data: JSON.parse(saved),
      }))
    }
  }, [])

  /* ---------- SUBMIT ---------- */
  const submit = async () => {
    const errors = validateStep(state)
    if (Object.values(errors).length > 0){
        setErrors(errors)
        return
    }

    setState(prev => ({ ...prev, isSubmitting: true }))

    try {
      // 🔥 replace with API later
      console.log("FINAL SUBMISSION:", state.data)

      clearDraft()

      setState(prev => ({
        ...prev,
        isDraft: false,
      }))
    } catch (error) {
      console.error(error)
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }))
    }
  }

  /* ---------- AUTO SAVE (optional but nice UX) ---------- */
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data))
    }, 500)

    return () => clearTimeout(timeout)
  }, [state.data])

  /* ---------- CONTEXT VALUE ---------- */
  const value: FormContextType = {
    state,

    updateField,
    setSection,

    setErrors,
    clearErrors,

    nextStep,
    prevStep,
    goToStep,

    

    saveDraft,
    clearDraft,

    submit,
  }

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}

/* ================= HOOK ================= */

export const useForm = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error("useForm must be used within FormProvider")
  }
  return context
}