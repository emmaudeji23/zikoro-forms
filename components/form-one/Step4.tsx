import { SectionBlock } from '../shared/SectionBlock'
import { MultiSelectPills } from '../shared/MultiSelectPills'
import { useForm } from './FormProvider'
import { InputField, InputFieldLine } from '../shared/InputField'
import { TextareaField } from '../shared/TextareaField'
import { SingleSelectPills } from '../shared/SingleSelectPills'
import { Label } from '../ui/label'

const Step4 = () => {
  const { state, updateField } = useForm()
  const data = state.data.joint_diagnosis_or_contractures 


  return (
    <>
    <h4 className="">2.6. Joint diagnosis / contractures </h4>
    <SectionBlock 
      title=" Foot malpositions"
      className='sm:grid-cols-1 '
    >
      <MultiSelectPills
        label='General shape of the leg'
        value={data.foot_malpositions||""}
        onChange={(val:string[]) => updateField("joint_diagnosis_or_contractures", "foot_malpositions", val)}
        options={[
          { label: " normal", value: "normal" },
          { label: "muscular", value: "muscular" },
          { label: "hypotrophic", value: "hypotrophic" },
          { label: "bulky", value: "bulky" },
        ]}
        allowOther
        itemsStyle={'gap-y-3 gap-x-4'}
        // containerStyle="w-72"
      />

      <TextareaField
        label="Comments"
        value={data?.foot || ""}
        onChange={(e: any) =>
          updateField("general_diagnosis_2_1", "volume_comments", e.target.value)
        }
      />

    </SectionBlock>

    </>

  )
}

export default Step4