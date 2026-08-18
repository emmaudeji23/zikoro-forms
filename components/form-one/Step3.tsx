import { SectionBlock } from '../shared/SectionBlock'
import { MultiSelectPills } from '../shared/MultiSelectPills'
import { useForm } from './FormProvider'
import { InputField, InputFieldLine } from '../shared/InputField'
import { TextareaField } from '../shared/TextareaField'
import { SingleSelectPills } from '../shared/SingleSelectPills'
import { Label } from '../ui/label'

const Step3 = () => {
  const { state, updateField } = useForm()
  const data = state.data?.general_diagnosis_2_1

  return (
    <>
    <SectionBlock 
      heading="2. Details on the affected side / on the appearance"
      title="2.1. General"
      className='sm:grid-cols-1'
    >
      <MultiSelectPills
        label="Cause / Underlying Disease"
        value={data?.cause_underlying_disease || []}
        onChange={(val: string[]) =>
          updateField("general_diagnosis_2_1", "cause_underlying_disease", val)
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
      <InputField
          label="If there is a lesion of the spinal cord, what is the lesion height?"
          value={data?.lesion_height || ""}
          onChange={(e) =>
            updateField("general_diagnosis_2_1", "lesion_height", e.target.value)
          }
        />

        <InputField
          label="Diagnosis since   "
          value={data?.diagnosis_since || ""}
          onChange={(e) =>
            updateField("general_diagnosis_2_1", "diagnosis_since", e.target.value)
          }
        />

        <InputField
          label="Functional limitations     "
          value={data?.functional_limitations || ""}
          onChange={(e) =>
            updateField("general_diagnosis_2_1", "functional_limitations", e.target.value)
          }
        />


        <InputField
          label="Leg length discrepancy    "
          value={data?.leg_length_discrepancy || ""}
          onChange={(e) =>
            updateField("general_diagnosis_2_1", "leg_length_discrepancy", e.target.value)
          }
        />

        <InputField
          label="History / Complaints     "
          value={data?.history_complaints || ""}
          onChange={(e) =>
            updateField("general_diagnosis_2_1", "history_complaints", e.target.value)
          }
        />

         {/* COMMENT */}
          <TextareaField
            label="Comments"
            value={data?.comments2_1 || ""}
            onChange={(e: any) =>
              updateField("general_diagnosis_2_1", "comments2_1", e.target.value)
            }
          />
    </SectionBlock>

    {/* <hr className='my-3'/> */}
    <br/>

    <SectionBlock 
      title="2.2. Pain"
      className='sm:grid-cols-1 '
    >
        <InputField
          label="  General pain in the leg - Area   "
          value={data?.general_pain_in_the_leg || ""}
          onChange={(e) =>
            updateField("general_diagnosis_2_1", "general_pain_in_the_leg", e.target.value)
          }
        />


          {/* Turn to progres bar selector */}
        {/* <InputField
          label=" How intense is the pain on a scale of 0 (none) to 10 (unbearable)?    "
          value={data?.how_intense_is_the_pain || ""}
          onChange={(e) =>
            updateField("general_diagnosis_2_1", "how_intense_is_the_pain", e.target.value)
          }
        /> */}

        <span className='italic'>How intense is the pain on a scale of 0 (none) to 10 (unbearable)? </span>
        <small>Turn to progress bar</small>
        <hr className='h-4 bg-muted-foreground w-full mb-3' />

         {/* COMMENT */}
          <TextareaField
            label="Comments"
            value={data?.comments2_1 || ""}
            onChange={(e: any) =>
              updateField("general_diagnosis_2_1", "comments2_1", e.target.value)
            }
          />
    </SectionBlock>

    <br/>
    <SectionBlock 
      title="2.3. Sensitivity"
      className='sm:grid-cols-1 '
    >

      <div className="grid grid-cols-2 gap-y-3 gap-x-6">
        <SingleSelectPills
          label="Warm / cold sensitivity "
          value={data?.warm_or_cold_sensitivity||""}
          onChange={(val) => updateField("general_diagnosis_2_1", "warm_or_cold_sensitivity", val)}
          options={[
            { label: "normal", value: "normal" },
            { label: "changed", value: "changed" },
          ]}
          // className='flex gap-6 flex-wrap sm:items-center'
          allowOther 
           
        />

        <SingleSelectPills
          label="Sharp / dull sensitivity  "
          value={data?.sharp_or_dull_sensitivity||""}
          onChange={(val) => updateField("general_diagnosis_2_1", "sharp_or_dull_sensitivity", val)}
          options={[
            { label: "normal", value: "normal" },
            { label: "changed", value: "changed" },
          ]}
          // className='flex gap-6 flex-wrap sm:items-center'
        />

        <SingleSelectPills
          label="Pressure intensity   "
          value={data?.preasure_sensitivity||""}
          onChange={(val) => updateField("general_diagnosis_2_1", "preasure_sensitivity", val)}
          options={[
            { label: "normal", value: "normal" },
            { label: "changed", value: "changed" },
          ]}
          // className='flex gap-6 flex-wrap sm:items-center'
        />


        <SingleSelectPills
          label="Pressure localisation   "
          value={data?.preasure_localisation||""}
          onChange={(val) => updateField("general_diagnosis_2_1", "preasure_localisation", val)}
          options={[
            { label: "normal", value: "normal" },
            { label: "changed", value: "changed" },
          ]}
          // className='flex gap-6 flex-wrap sm:items-center'
        />
      </div>


      <div className="space-y- flex flex-col md:flex-row gap-4 md:gap-10 justify-between items-start">
        <Label>Capability of bearing load</Label>
        <div className="flex-1 space-y-4">

            <SingleSelectPills
              value={data?.capable_of_contact||""}
              onChange={(val) => updateField("general_diagnosis_2_1", "capable_of_contact", val)}
              options={[
                { label: "  capable of contact ", value: "  capable of contact " },
                { label: " not capable of contact ", value: " not capable of contact " },
              ]}
            />

            <SingleSelectPills
              value={data?.capable_of_bearing_load||""}
              onChange={(val) => updateField("general_diagnosis_2_1", "capable_of_bearing_load", val)}
              options={[
                { label: "  capable of bearing load ", value: "  capable of bearing load " },
                { label: " not capable of bearing load ", value: " not capable of bearing load " },
              ]}
            />

            
            <SingleSelectPills
              label="If capable of bearing load, how much?  "
              value={data?.preasure_localisation||""}
              onChange={(val) => updateField("general_diagnosis_2_1", "preasure_localisation", val)}
              options={[
                { label: "fully", value: "fully" },
                { label: "high", value: "high" },
                { label: "medium", value: "medium" },
                { label: "low", value: "low" },
              ]}
            />

        </div>


      </div>


        {/* <InputField
          label="  General pain in the leg - Area   "
          value={data?.general_pain_in_the_leg || ""}
          onChange={(e) =>
            updateField("general_diagnosis_2_1", "general_pain_in_the_leg", e.target.value)
          }
        /> */}
 

         {/* COMMENT */}
          <TextareaField
            label="Comments"
            value={data?.comments2_1 || ""}
            onChange={(e: any) =>
              updateField("general_diagnosis_2_1", "comments2_1", e.target.value)
            }
          />
    </SectionBlock>

    
    <br/>
    <SectionBlock 
      title="2.4. Skin "
      className='sm:grid-cols-1 '
    >

      <div className=" flex flex-col md:flex-row gap-4 md:gap-10 justify-between items-start">
          <Label>General condition of the skin  </Label>
          <div className="flex-1 space-y-2">
              <SingleSelectPills
                value={data?.general_condition_of_the_skin||""}
                onChange={(val) => updateField("general_diagnosis_2_1", "general_condition_of_the_skin", val)}
                options={[
                  { label: "normal", value: "normal" },
                  { label: "flaky", value: "flaky" },
                  { label: "weeping", value: "weeping" },
                  { label: "dry", value: "dry" },
                  { label: "irritated", value: "irritated" },
                  { label: "inflamed", value: "inflamed" },
                ]}
                allowOther
                itemsStyle={'gap-y-3 gap-x-12'}
              />
              <InputFieldLine
                label="Area"
                name='skin_area'
                value={data?.skin_area || ""}
                onChange={(e) =>
                  updateField("general_diagnosis_2_1", "skin_area", e.target.value)
                }
                variant= "underline"
              />
          </div>
      </div>

      

      <div className="flex gap-6">
        <Label htmlFor="skin_colour" className='w-36 shrink-0 text-nowrap items-start'>
          Skin colour
        </Label>
        <div className="space-y-3">
          <SingleSelectPills
            // label='Skin colour'
            value={data?.skin_colour||""}
            onChange={(val) => updateField("general_diagnosis_2_1", "skin_colour", val)}
            options={[
              { label: "normal", value: "normal" },
              { label: "yellowish", value: "yellowish" },
              { label: "bluish", value: "bluish" },
              { label: "pale", value: "pale" },
              { label: "reddish", value: "reddish" },
            ]}
            allowOther
            itemsStyle={'gap-y-3 gap-x-12'}
          />
            
        </div>
      </div>

      <div className="flex gap-6">
        <Label htmlFor="skin_temperature" className='w-36 shrink-0 text-nowrap items-start'>
          Temperature
        </Label>
        <div className="space-y-3">
            <SingleSelectPills
              // label='Skin colour'
              value={data?.skin_temperature||""}
              onChange={(val) => updateField("general_diagnosis_2_1", "skin_temperature", val)}
              options={[
                { label: "normal", value: "normal" },
                { label: "cold", value: "cold" },
                { label: "warm", value: "warm" },
 
              ]}
              allowOther
            itemsStyle={'gap-y-3 gap-x-12'}
              // className='flex gap-6'
              
            />
            <InputFieldLine
              label="Area"
              name='skin_area'
              value={data?.skin_temperature_area || ""}
              onChange={(e) =>
                updateField("general_diagnosis_2_1", "skin_temperature_area", e.target.value)
              }
              variant= "underline"
              // className='w-44'
              // containerStyle='w-44'
            />
        </div>
      </div>

      <div className="flex gap-6">
        <Label htmlFor="skin_colour" className='w-36 shrink-0 text-nowrap items-start'>
          Soft tissue coverage 
        </Label>
        <div className="space-y-3">
            <SingleSelectPills
              // label='Skin colour'
              value={data?.skin_soft_tissue_coverage||""}
              onChange={(val) => updateField("general_diagnosis_2_1", "skin_soft_tissue_coverage", val)}
              options={[
                { label: "normal", value: "normal" },
                { label: "low", value: "low" },
                { label: "excessive", value: "excessive" },
 
              ]}
              allowOther
            itemsStyle={'gap-y-3 gap-x-12'}
              // className='flex gap-6'
              
            />
            <InputFieldLine
              label="Area"
              name='skin_soft_tissue_coverage_area'
              value={data?.skin_soft_tissue_coverage_area || ""}
              onChange={(e) =>
                updateField("general_diagnosis_2_1", "skin_soft_tissue_coverage_area", e.target.value)
              }
              variant= "underline"
              // className='w-44'
              // containerStyle='w-44'
            />
        </div>
      </div>

      <div className="flex gap-6">
        <Label htmlFor="skin_colour" className='  shrink-0 text-nowrap items-start w-36'>
          Subcutaneous tissue 
        </Label>
        <div className="space-y-3">
            <SingleSelectPills
              // label='Skin colour'
              value={data?.skin_subcataneous_tissue||""}
              onChange={(val) => updateField("general_diagnosis_2_1", "skin_subcataneous_tissue", val)}
              options={[
                { label: "normal", value: "normal" },
                { label: "tight", value: "tight" },
                { label: "soft", value: "soft" },
 
              ]}
              allowOther
              itemsStyle={'gap-y-3 gap-x-12'}
              // className='flex gap-6'
              
            />
            <InputFieldLine
              label="Area"
              name='skin_subcataneous_tissue_area'
              value={data?.skin_subcataneous_tissue_area || ""}
              onChange={(e) =>
                updateField("general_diagnosis_2_1", "skin_subcataneous_tissue_area", e.target.value)
              }
              variant= "underline"
              // className='w-44'
              // containerStyle='w-44'
            />
        </div>
      </div>

      <div className="flex gap-6">
        <SingleSelectPills
          value={data?.skin_replacement_tissue||""}
          onChange={(val) => updateField("general_diagnosis_2_1", "skin_replacement_tissue", val)}
          options={[
            { label: " Replacement tissue", value: " Replacement tissue" },
          ]}
          // itemsStyle={'gap-y-3 gap-x-12'}
          className='flex-1'
          containerStyle="w-72"
        />
        <InputFieldLine
          label="Type / Area "
          name='skin_replacement_tissue_area'
          value={data?.skin_replacement_tissue_area || ""}
          onChange={(e) =>
            updateField("general_diagnosis_2_1", "skin_replacement_tissue_area", e.target.value)
          }
        />
      </div>

      <div className="flex gap-6">
        <SingleSelectPills
          value={data?.skin_pressure_chafing_spots||""}
          onChange={(val) => updateField("general_diagnosis_2_1", "skin_pressure_chafing_spots", val)}
          options={[
            { label: "Pressure / Chafing spots ", value: "Pressure / Chafing spots " },
          ]}
          // itemsStyle={'gap-y-3 gap-x-12'}
          className='flex-1'
          containerStyle="w-72"
        />
        <InputFieldLine
          label="Type / Area "
          name='skin_pressure_chafing_spots_area'
          value={data?.skin_pressure_chafing_spots_area || ""}
          onChange={(e) =>
            updateField("general_diagnosis_2_1", "skin_pressure_chafing_spots_area", e.target.value)
          }
        />
      </div>

      <div className="flex gap-6">
        <SingleSelectPills
          value={data?.skin_edge_scarring||""}
          onChange={(val) => updateField("general_diagnosis_2_1", "skin_edge_scarring", val)}
          options={[
            { label: " Edge scarring   ", value: " Edge scarring   " },
          ]}
          // itemsStyle={'gap-y-3 gap-x-12'}
          className='flex-1'
          containerStyle="w-72"
        />
        <InputFieldLine
          label="Type / Area "
          name='skin_edge_scarring_area'
          value={data?.skin_edge_scarring_area || ""}
          onChange={(e) =>
            updateField("general_diagnosis_2_1", "skin_edge_scarring_area", e.target.value)
          }
        />
      </div>


   <div className="flex gap-6">
        <SingleSelectPills
          value={data?.skin_scars||""}
          onChange={(val) => updateField("general_diagnosis_2_1", "skin_scars", val)}
          options={[
            { label: "Scars  ", value: "Scars" },
          ]}
          // itemsStyle={'gap-y-3 gap-x-12'}
          className='flex-1'
          containerStyle="w-72"
        />
        <InputFieldLine
          label="Type / Area "
          name='skin_scars_area'
          value={data?.skin_scars_area || ""}
          onChange={(e) =>
            updateField("general_diagnosis_2_1", "skin_scars_area", e.target.value)
          }
        />
      </div>

         {/* COMMENT */}
          <TextareaField
            label="Comments"
            value={data?.skin_comments || ""}
            onChange={(e: any) =>
              updateField("general_diagnosis_2_1", "skin_comments", e.target.value)
            }
          />
    </SectionBlock>

    <br/>

    <SectionBlock 
      title="2.5. Volume "
      className='sm:grid-cols-1 '
    >
      <SingleSelectPills
        label='General shape of the leg'
        value={data?.volume_general_shape_of_the_leg||""}
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

      <div className="flex gap-x-6 gap-y-3">
        <SingleSelectPills
          value={data?.volume_fluctuations||""}
          onChange={(val) => updateField("general_diagnosis_2_1", "volume_fluctuations", val)}
          options={[
            { label: " Volume fluctuations ", value: "Volume fluctuations " },
          ]}
          itemsStyle={'gap-y-3 gap-x-4 w-auto'}
          className='w-auto'
          containerStyle='flex-1 text-nowrap'
        />

        <SingleSelectPills
          value={data?.volume_documentation_on_measurement_chart||""}
          onChange={(val) => updateField("general_diagnosis_2_1", "volume_documentation_on_measurement_chart", val)}
          options={[
            { label: "Documentation on measurement chart ", value: "Documentation on measurement chart " },
          ]}
          itemsStyle={'gap-y-3 gap-x-4'}
          containerStyle='  text-nowrap'
        />
        <SingleSelectPills
          value={data?.volume_oedema||""}
          onChange={(val) => updateField("general_diagnosis_2_1", "volume_oedema", val)}
          options={[
            { label: "Oedema ", value: "Oedema " },
          ]}
          itemsStyle={'gap-y-3 gap-x-4'}
          containerStyle='  text-nowrap'
        />
      </div>


      <SingleSelectPills
        label='Applied therapy'
        value={data?.volume_applied_therapy||""}
        onChange={(val) => updateField("general_diagnosis_2_1", "volume_applied_therapy", val)}
        options={[
          { label: " No compression therapy", value: "No compression therapy" },
          { label: "Compression stocking/element", value: "Compression stocking/element" },
          { label: "Wrapping", value: "Wrapping" },
        ]}
        allowOther
        itemsStyle={'gap-y-3 gap-x-4'}
        // containerStyle="w-72"
        className='sm:flex-col'
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

export default Step3