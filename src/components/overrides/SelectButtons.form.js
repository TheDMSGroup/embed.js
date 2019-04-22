import baseEditForm from 'formiojs/components/base/Base.form';
import SelectEditData from 'formiojs/components/select/editForm/Select.edit.data';
import SelectEditValidation from 'formiojs/components/select/editForm/Select.edit.validation';

export default function(...extend) {
    return baseEditForm([
        {
            key: 'display',
            components: [
                {
                    weight: 106,
                    type: 'textfield',
                    input: true,
                    key: 'customClasses',
                    label: 'Button Classes',
                    defaultValue: 'btn btn-primary btn-margin-right'
                },
            ]
        },
        {
            key: 'data',
            components: SelectEditData
        },
        {
            key: 'validation',
            components: SelectEditValidation
        }
    ], ...extend);
}
