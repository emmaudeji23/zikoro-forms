"use client"

import { useForm } from "./FormProvider"
 
import { DatePickerField } from "../shared/DatePickerField"
 
import { MultiSelectPills } from "../shared/MultiSelectPills"
import { InputField } from "../shared/InputField"
 import { ToggleGroupField } from "../shared/ToggleGroupField"

const Step1 = () => {
  const { state, updateField } = useForm()
  const data = state.data.basicInfo
  const errors = state.errors

  return (
    <div className=" gap-3 grid sm:grid-cols-2 ">
 
        <InputField
          label="Orthotist / Therapist"
          value={data.therapist || ""}
          onChange={(e) =>
            updateField("basicInfo", "therapist", e.target.value)
          }
        />

        <InputField
          label="Order Number"
          value={data.orderNumber || ""}
          onChange={(e) =>
            updateField("basicInfo", "orderNumber", e.target.value)
          }
        />

        <InputField
          label="Device Number"
          value={data.deviceNumber || ""}
          onChange={(e) =>
            updateField("basicInfo", "deviceNumber", e.target.value)
          }
        />

        <DatePickerField
          label="Date"
          name="date"
          value={data.date}
          onChange={(val) =>
            updateField("basicInfo", "date", val)
          }
        />
   

     
        <InputField
          label="Patient Name"
          value={data.name || ""}
          onChange={(e) =>
            updateField("basicInfo", "name", e.target.value)
          }
        />

        <InputField
          label="ID"
          value={data.id || ""}
          onChange={(e) =>
            updateField("basicInfo", "id", e.target.value)
          }
        />

        <DatePickerField
          label="Date of Birth"
          name="dob"
          value={data.dob}
          onChange={(val) =>
            updateField("basicInfo", "dob", val)
          }
        />

        <ToggleGroupField
          label="Handedness"
          value={data.handedness}
          onChange={(val: any) =>
            updateField("basicInfo", "handedness", val)
          }
          options={[
            { label: "Left-handed", value: "left" },
            { label: "Right-handed", value: "right" },
          ]}
        />
 

 
        <InputField
          label="Weight (kg)"
          value={data.weight || ""}
          onChange={(e) =>
            updateField("basicInfo", "weight", e.target.value)
          }
        />

        <InputField
          label="Height (cm)"
          value={data.height || ""}
          onChange={(e) =>
            updateField("basicInfo", "height", e.target.value)
          }
        />
      

 
        <ToggleGroupField
          label="Affected Side"
          value={data.affectedSide}
          onChange={(val: any) =>
            updateField("basicInfo", "affectedSide", val)
          }
          options={[
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },
            { label: "Bilateral", value: "bilateral" },
          ]}
        />

        <MultiSelectPills
          label="Type of Orthosis"
          value={data.orthosis || []}
          onChange={(val: any) =>
            updateField("basicInfo", "orthosis", val)
          }
          options={[
            { label: "FO", value: "fo" },
            { label: "AFO", value: "afo" },
            { label: "KO", value: "ko" },
            { label: "KAFO", value: "kafo" },
            { label: "HO", value: "ho" },
            { label: "HKAFO", value: "hkafo" },
            { label: "Orthoprosthesis", value: "ortho" },
          ]}
        />
 

    </div>
  )
}

export default Step1