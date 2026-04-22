"use client"

import { useForm } from "./FormProvider"
import { STEPS } from "./StepRenderer"

const ProgressBar = () => {
  const { state, goToStep } = useForm()

  return (
    <nav
      aria-label="Form Progress"
      className="w-full overflow-x-auto"
    >
      <ol className="flex justify-center   ">
      {/* <ol className="flex items-center gap-2 sm:gap-4"> */}
        {STEPS.map((step, index) => {
          const isActive = index === state.currentStep
          const isCompleted = index < state.currentStep

          return (
            <li
              key={step.id}
              className="flex  "
              // className="flex items-center flex-1 min-w-[80px]"
            >
              {/* STEP BUTTON */}
              <button
                onClick={() => goToStep(index)}
                aria-current={isActive ? "step" : undefined}
                className="group flex flex-col items-center focus:outline-none"
              >
                {/* Circle */}
                <div
                  className={`
                    relative flex items-center justify-center
                    w-10 h-10 rounded-full border text-sm font-medium
                    transition-all duration-300

                    ${
                      isActive
                        ? "border-primary text-primary"
                        : isCompleted
                        ? "border-primary bg-primary text-white"
                        : "border-muted-foreground/30 text-muted-foreground"
                    }
                  `}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>

                {/* Label */}
                <span
                  className={`
                    mt-2 text-xs text-center max-w-[80px]
                    transition-colors duration-200

                    ${
                      isActive
                        ? "text-primary"
                        : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  `}
                >
                  {step.title}
                </span>
              </button>

              {/* CONNECTOR LINE */}
              {index < STEPS.length - 1 && (
                <div className="mt-5 h-px mx-1 sm:mx-3 relative w-2 sm:w-4 md:w-8 shrink-0">
                  <div className="absolute inset-0 bg-muted-foreground/20" />

                  <div
                    className={`
                      absolute inset-0 bg-primary transition-all duration-500
                      ${
                        index < state.currentStep
                          ? "w-full"
                          : "w-0"
                      }
                    `}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default ProgressBar