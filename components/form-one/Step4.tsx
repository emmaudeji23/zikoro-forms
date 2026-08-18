import { SectionBlock } from '../shared/SectionBlock'
import { MultiSelectPills } from '../shared/MultiSelectPills'
import { useForm } from './FormProvider'
import { InputField, InputFieldLine } from '../shared/InputField'
import { TextareaField } from '../shared/TextareaField'
import { SingleSelectPills } from '../shared/SingleSelectPills'
import { Label } from '../ui/label'

const Step4 = () => {
  const { state, updateField } = useForm()
  const data = state.data.general_diagnosis_2_1

  return (
    <>
    <SectionBlock 
      title="2.6. Joint diagnosis / contractures"
      className='sm:grid-cols-1 '
    >
      <SingleSelectPills
        label='General shape of the leg'
        value={data.volume_general_shape_of_the_leg||""}
        onChange={(val) => updateField("general_diagnosis_2_1", "volume_general_shape_of_the_leg", val)}
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
        value={data?.volume_comments || ""}
        onChange={(e: any) =>
          updateField("general_diagnosis_2_1", "volume_comments", e.target.value)
        }
      />

    </SectionBlock>

    </>

  )
}

export default Step4