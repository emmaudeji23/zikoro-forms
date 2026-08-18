import { SectionBlock } from '../shared/SectionBlock'
import { MultiSelectPills } from '../shared/MultiSelectPills'
import { useForm } from './FormProvider'
import { InputField, InputFieldLine } from '../shared/InputField'
import { TextareaField } from '../shared/TextareaField'
import { SingleSelectPills } from '../shared/SingleSelectPills'
import { Label } from '../ui/label'
import { MultiSelectInlineField } from '../shared/MultiSelectInlineField'
import { MultiSelectPillsExtended } from '../shared/MultiSelectPillsExtended'

const Step4 = () => {
  const { state, updateField } = useForm()
  const data = state.data?.joint_diagnosis_or_contractures

  return (
    <>
    <SectionBlock 
      heading="2.6. Joint diagnosis / contractures"
      title="2.6.1. Foot type  "
      className='sm:grid-cols-1 '
    >
      <Label htmlFor="foot_malpositions" className="">
        Foot malpositions
      </Label>
      <div className="pl-4 space-y-4">
        <MultiSelectPills
          // label='Foot malpositions '
          value={data?.foot_malpositions||[]}
          onChange={(val: string[]) => updateField("joint_diagnosis_or_contractures", "foot_malpositions", val)}
          options={[
            { label: "Splayfoot", value: "Splayfoot" },
            { label: "Fallen arch", value: "Fallen arch" },
            { label: "Flatfoot", value: "Flatfoot" },
            { label: "Skew foot", value: "Skew foot" },
            { label: "High arch ", value: "High arch " },
            { label: "Lowered high arch ", value: "Lowered high arch " },
            { label: "Pigeon toes", value: "Pigeon toes" },
            { label: "Club foot", value: "Club foot" },
            { label: "Pes equinus ", value: "Pes equinus " },
            { label: "Talipes calcaneus", value: "Talipes calcaneus" },
          ]}
          // allowOther
          itemsStyle={'gap-y-4 gap-x-4'}
          // containerStyle="w-72"
        />

        <SingleSelectPills
          label='Tendency'
          value={data?.foot_malpositions_tendency||""}
          onChange={(val) => updateField("joint_diagnosis_or_contractures", "foot_malpositions_tendency", val)}
          options={[
            { label: "slight", value: "slight" },
            { label: "moderate", value: "moderate" },
            { label: "strong", value: "strong" },
          ]}
          allowOther
          itemsStyle={'gap-y-4 gap-x-4'}
          className="flex items-center gap-4"
        />
      </div>

      <Label htmlFor="foot_malpositions" className="">
        Toe deformities
      </Label>
      <div className="pl-4 space-y-4">
        <MultiSelectPillsExtended
            value={data?.foot_toe_deformities||[]}
            onChange={(val) => updateField("joint_diagnosis_or_contractures", "foot_toe_deformities", val)}
            options={[
              { label: " Hammer toe", value: " Hammer toe" },
              { label: "  Claw toe ", value: "  Claw toe " },
              { label: " Hallux rigidus ", value: " Hallux rigidus " },
              { label: " Hallux valgus", value: "Hallux valgus" },
            ]}
            allowOther
            inputContainerStyle="w-full "
            // className=''
            // inputStyle="w-full "
            // itemsStyle={'gap-y-4 gap-x-4'}
            // containerStyle="w-72"
        />
      </div>

       <MultiSelectPillsExtended
          label='Localisation '
          value={data?.foot_localisation||[]}
          onChange={(val) => updateField("joint_diagnosis_or_contractures", "foot_localisation", val)}
          options={[
            { label: "big toe ", value: "big toe " },
            { label: " second toe ", value: "second toe " },
            { label: "third toe ", value: "third toe " },
            { label: " fourth toe", value: " fourth toe" },
            { label: "little toe", value: "little toe" },
         
          ]}
          className="flex items-start  gap-4"
          itemsStyle={'gap-6 gap-y-4'}
        />

      <SingleSelectPills
        label='Arthrodesis'
        value={data?.foot_arthrodesis||""}
        onChange={(val) => updateField("joint_diagnosis_or_contractures", "foot_arthrodesis", val)}
        options={[
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ]}
        // allowOther
        // itemsStyle={'gap-y-4 gap-x-4'}
        className="flex items-center gap-4"
      />
        
      <InputFieldLine
        label="Joint"
        value={data?.foot_joint || ""}
        onChange={(e: any) => {
          const val = e.target.value;
          updateField("joint_diagnosis_or_contractures", "foot_joint", val);
        }}
      />

      <Label htmlFor="foot_malpositions" className="">
        Amputation
      </Label>
      <div className="pl-4 space-y-4">
        <MultiSelectPills
          // label='Foot malpositions '
          value={data?.foot_amputation||[]}
          onChange={(val: string[]) => updateField("joint_diagnosis_or_contractures", "foot_amputation", val)}
          options={[
            { label: "Toe", value: "Toe" },
            { label: "Lisfranc", value: "Lisfranc" },
            { label: "Chopart", value: "Chopart" },
            { label: " Bona-Jaeger", value: " Bona-Jaeger" },
            { label: "Sharp", value: "Sharp " },
            { label: " Sharp-Jaeger ", value: " Sharp-Jaeger  " },
            { label: "Pirogov", value: "Pirogov" },
            { label: "Syme", value: "Syme" },
 
          ]}
          // allowOther
          itemsStyle={'gap-y-4 gap-x-4'}
          // containerStyle="w-72"
        />
      </div>

      <TextareaField
        label="Comments"
        value={data?.foot_type_comments || ""}
        onChange={(e: any) =>
          updateField("joint_diagnosis_or_contractures", "foot_type_comments", e.target.value)
        }
      />

    </SectionBlock>

    
      <br/>
      <br/>

      <SectionBlock
        title="2.6.2. Ligament instability"
        className='sm:grid-cols-1 '
      >
      
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label className='text-'>Left</Label>
          <InputFieldLine
            label="Hip"
            value={data?.ligament_instability_left_hip || ""}
            onChange={(e: any) => {
              const val = e.target.value;
              updateField("joint_diagnosis_or_contractures", "ligament_instability_left_hip", val);
            }}
          />
           <InputFieldLine
            label="Knee"
            value={data?.ligament_instability_left_Knee || ""}
            onChange={(e: any) => {
              const val = e.target.value;
              updateField("joint_diagnosis_or_contractures", "ligament_instability_left_Knee", val);
            }}
          />
          <InputFieldLine
            label="Ankle"
            value={data?.ligament_instability_left_ankle || ""}
            onChange={(e: any) => {
              const val = e.target.value;
              updateField("joint_diagnosis_or_contractures", "ligament_instability_left_ankle", val);
            }}
          />
        </div>

         <div className="space-y-3">
          <Label className='text-'>Right</Label>
          <InputFieldLine
            label="Hip"
            value={data?.ligament_instability_right_hip || ""}
            onChange={(e: any) => {
              const val = e.target.value;
              updateField("joint_diagnosis_or_contractures", "ligament_instability_right_hip", val);
            }}
          />
           <InputFieldLine
            label="Knee"
            value={data?.ligament_instability_right_Knee || ""}
            onChange={(e: any) => {
              const val = e.target.value;
              updateField("joint_diagnosis_or_contractures", "ligament_instability_right_Knee", val);
            }}
          />
          <InputFieldLine
            label="Ankle"
            value={data?.ligament_instability_right_ankle || ""}
            onChange={(e: any) => {
              const val = e.target.value;
              updateField("joint_diagnosis_or_contractures", "ligament_instability_right_ankle", val);
            }}
          />
        </div>
      </div>
      <TextareaField
        label="Comments"
        value={data?.ligament_instability_comments || ""}
        onChange={(e: any) =>
          updateField("joint_diagnosis_or_contractures", "ligament_instability_comments", e.target.value)
        }
      />

    </SectionBlock>

    </>

  )
}

export default Step4