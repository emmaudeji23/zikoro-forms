import React from 'react'
import { SectionBlock } from '../shared/SectionBlock'
import { MultiSelectPills } from '../shared/MultiSelectPills'
import { useForm } from './FormProvider'

const Step3 = () => {
  const { state, updateField } = useForm()
  const data = state.data.health

  return (
    <SectionBlock 
      heading="2. Details on the affected side / on the appearance"
      title="2.1. General"
    >
      <MultiSelectPills
        label="Cause / Underlying Disease"
        value={data.conditions || []}
        onChange={(val: string[]) =>
          updateField("health", "conditions", val)
        }
        options={[
          { label: "Apoplexy", value: "apoplexy" },
          { label: "Cerebral palsy (ICP)", value: "cerebral_palsy" },
          { label: "Multiple Sclerosis", value: "multiple_sclerosis" },
          { label: "Paraplegia", value: "paraplegia" },
          { label: "Poliomyelitis", value: "poliomyelitis" },
          { label: "Spinal disc herniation", value: "spinal_disc_herniation" },
          { label: "Trauma", value: "trauma" },
          { label: "Spina Bifida", value: "spina_bifida" },
          { label: "Muscular atrophy / Muscular dystrophy", value: "muscular_atrophy_dystrophy" },
        ]}
      />
    </SectionBlock>
  )
}

export default Step3