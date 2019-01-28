import baseEditForm from 'formiojs/components/base/Base.form';
import TextFieldEditData from 'formiojs/components/textfield/editForm/TextField.edit.data';
import TextFieldEditValidation from 'formiojs/components/textfield/editForm/TextField.edit.validation';

export default function(...extend) {
  return baseEditForm([
    {
      key: 'display',
      components: [
        {
          type: 'select',
          label: 'Slider Type',
          key: 'sliderType',
          weight: 105,
          placeholder: 'Slider Type',
          tooltip: '',
          data: {
            values: [
              {
                value: 'currency',
                label: 'Currency'
              },
              {
                value: 'percent',
                label: 'Percent'
              },{
                value: 'number',
                label: 'Number'
              }
            ]
          },
          defaultValue: 'currency',
          input: true      
        },
        {
          weight: 106,
          type: 'textfield',
          input: true,
          key: 'min',
          label: 'Minimum Range'
        },
        {
          weight: 107,
          type: 'textfield',
          input: true,
          key: 'max',
          label: 'Maximum Range'
        },
        {
          weight: 108,
          type: 'textfield',
          input: true,
          key: 'step',
          label: 'Step'
        },
      ]
    },
    {
      key: 'data',
      components: TextFieldEditData
    },
    {
      key: 'validation',
      components: TextFieldEditValidation
    }
  ]);
}