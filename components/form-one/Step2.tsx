"use client"

import { useForm } from "./FormProvider"
import { MultiSelectPills } from "../shared/MultiSelectPills"
import { InputField } from "../shared/InputField"
import { ToggleGroupField } from "../shared/ToggleGroupField"
import { SectionBlock } from "../shared/SectionBlock"
import { CheckboxWithInputField } from "../shared/CheckboxWithInputField"
import { CheckboxItem } from "../shared/CheckboxItem"
import { MultiSelectInlineField } from "../shared/MultiSelectInlineField"
import { TextareaField } from "../shared/TextareaField"

const Step2 = () => {
  const { state, updateField } = useForm()
  const data = state.data.health

  return (
    <div className="space-y-6">

      {/* =========================
        1. GENERAL STATE OF HEALTH
      ========================= */}
      <SectionBlock title="1. General State of Health" className="sm:grid-cols-1">

        <CheckboxWithInputField
          label= "Cardiovascular diseases"
          value={data?.cardiovascular_diseases || ""}
          onValueChange={(val: string) =>{
            updateField("health", "cardiovascular_diseases", val)}
          }
        />

        <CheckboxWithInputField
          label= "Currently taking medication"
          value={data?.circulatory_disorders || ""}
          onValueChange={(val: string) =>
            updateField("health", "circulatory_disorders", val)}
        />

        <MultiSelectPills
          label="Conditions"
          value={data.conditions || []}
          onChange={(val: string[]) =>
            updateField("health", "conditions", val)
          }
          options={[
            { label: "Diabetes", value: "diabetes" },
            { label: "Neuropathy", value: "neuropathy" },
            { label: "Coordination disorders / Balance disorders / Dizziness", value: "balance" },
          ]}
        />

        <CheckboxWithInputField
          label= "Infectious diseases"
          value={data?.infectious_diseases || ""}
          onValueChange={(val: string) =>{
            updateField("health", "infectious_diseases", val)}
          }
        />

        <CheckboxWithInputField
          label= "Allergies"
          value={data?.allergies || ""}
          onValueChange={(val: string) =>
            updateField("health", "allergies", val)}
        />

        {/* CONDITIONAL */}
        <div className="space-y-3">
          <CheckboxItem
          label= "Currently taking medication"
          checked={data?.taking_medications || false }
          onChange={(val) =>
            updateField("health", "taking_medications", val)}
        />
        {data.taking_medications && (
          <MultiSelectInlineField
            label="Medication Side Effects"
            value={data.sideEffects || []}
            onChange={(val: string[]) =>
              updateField("health", "sideEffects", val)
            }
            options={[
              { label: "Affects sensitivity to pain", value: "pain" },
              { label: "Swelling", value: "swelling" },
              { label: "Blood-thinning", value: "blood" },
              { label: "Affects balance", value: "balance" },
              { label: "Affects sight", value: "sight" },
            ]}
            hasOthersOption={true}
          />
        )}
        </div>
        

      </SectionBlock>

      {/* =========================
        2. FUNCTIONAL LIMITATIONS
      ========================= */}
  
        <SectionBlock title="Functional Limitations" className="sm:grid-cols-1">

          <CheckboxWithInputField
            label="Functional limitations / Complaints torso "
            value={data.torso || ""}
            onValueChange={(val: string) =>
            updateField("health", "torso", val)}
            placeholder="What are the types"
          />

          <MultiSelectPills
            label=" Functional limitations / Complaints upper extremity (Left)"
            value={data.upperExtremity_left || []}
            onChange={(val: string[]) =>
              updateField("health", "upperExtremity_left", val)
            }
            options={[
              { label: "Shoulder", value: "shoulder" },
              { label: "Elbow", value: "elbow" },
              { label: "Wrist / Hand", value: "wrist" },
            ]}
          />

          <MultiSelectPills
            label=" Functional limitations / Complaints Upper Extremity (Right)"
            value={data.upperExtremity_right || []}
            onChange={(val: string[]) =>
              updateField("health", "upperExtremity_right", val)
            }
            options={[
              { label: "Shoulder", value: "shoulder" },
              { label: "Elbow", value: "elbow" },
              { label: "Wrist / Hand", value: "wrist" },
            ]}
          />

          <InputField
            label=" Symptoms "
            value={data.upperExtremity_symptoms || ""}
            onChange={(e: any) =>
              updateField(
                "health",
                "upperExtremity_symptoms",
                e.target.value
              )
            }
          />

          <TextareaField 
            label="Other illness / limitations / pain"
            value={data.otherIssues || ""}
            onChange={(e:any) =>
              updateField("health", "otherIssues", e.target.value)
            }
          />

        </SectionBlock>

 
        {/* =========================
            3. ACTIVITIES / MOBILITY
          ========================= */}
          <SectionBlock title="Activities / Mobility" className="sm:grid-cols-1">

            <InputField
              label="Relevant Activities"
              value={data?.activities || ""}
              onChange={(e: any) =>
                updateField("health", "activities", e.target.value)
              }
            />

            <InputField
              label="Environment"
              value={data?.environment || ""}
              onChange={(e: any) =>
                updateField("health", "environment", e.target.value)
              }
            />

            <InputField
              label="Stairways / Inclines"
              value={data?.stairways || ""}
              onChange={(e: any) =>
                updateField("health", "stairways", e.target.value)
              }
            />

            {/* WALKING */}
            <div className="grid sm:grid-cols-2 gap-3">
              <InputField
                label="Walking Distance"
                value={data?.walking_distance || ""}
                onChange={(e: any) =>
                  updateField("health", "walking_distance", e.target.value)
                }
              />

              <InputField
                label="Walking Time"
                value={data?.walking_time || ""}
                onChange={(e: any) =>
                  updateField("health", "walking_time", e.target.value)
                }
              />
            </div>

            {/* TRAVELLING */}
            <MultiSelectInlineField
              label="Travelling"
              value={data?.travelling || []}
              onChange={(val: string[]) =>
                updateField("health", "travelling", val)
              }
              options={[
                { label: "On foot", value: "foot" },
                { label: "Bicycle", value: "bicycle" },
                { label: "Motorcycle", value: "motorcycle" },
                { label: "Car", value: "car" },
                { label: "Public transport", value: "public" },
              ]}
              hasOthersOption
            />

            {/* DEVICES */}
            <MultiSelectInlineField
              label="Assistive Devices"
              value={data?.devices || []}
              onChange={(val: string[]) =>
                updateField("health", "devices", val)
              }
              options={[
                { label: "Orthosis", value: "orthosis" },
                { label: "Cane", value: "cane" },
                { label: "One crutch", value: "one_crutch" },
                { label: "Two crutches", value: "two_crutches" },
                { label: "Walker", value: "walker" },
                { label: "Wheelchair", value: "wheelchair" },
                { label: "Power wheelchair", value: "power_wc" },
                { label: "Stair lift", value: "stair_lift" },
              ]}
              hasOthersOption
            />

            {/* ASSISTANCE */}
            <CheckboxItem
              label="Requires Personal Assistance"
              checked={data?.assistance || false}
              onChange={(val) =>
                updateField("health", "assistance", val)
              }
            />

            {/* COMMENT */}
            <TextareaField
              label="Comments"
              value={data?.comment || ""}
              onChange={(e: any) =>
                updateField("health", "comment", e.target.value)
              }
            />

          </SectionBlock>

    </div>
  )
}

export default Step2