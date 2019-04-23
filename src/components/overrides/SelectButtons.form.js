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
            components: [{
                type: 'datagrid',
                input: true,
                label: 'Data Source Values',
                key: 'data.values',
                tooltip: 'Values to use as the data source. Labels are shown in the select field. Values are the corresponding values saved with the submission.',
                weight: 10,
                reorder: true,
                components: [{
                    label: 'Label',
                    key: 'label',
                    input: true,
                    type: 'textfield'
                }, {
                    label: 'Value',
                    key: 'value',
                    input: true,
                    type: 'textfield',
                    allowCalculateOverride: true,
                    calculateValue: {
                        _camelCase: [{
                            var: 'row.label'
                        }]
                    }
                }],
                conditional: {
                    json: {
                        '===': [{
                            var: 'data.dataSrc'
                        }, 'values']
                    }
                }
            },{
                type: 'textarea',
                input: true,
                key: 'data.custom',
                label: 'Custom Values',
                editor: 'ace',
                rows: 10,
                weight: 14,
                placeholder: "values = data['mykey'];",
                tooltip: 'Write custom code to return the value options. The form data object is available.',
                conditional: {
                    json: {
                        '===': [{
                            var: 'data.dataSrc'
                        }, 'custom']
                    }
                }
            }, {
                type: 'checkbox',
                input: true,
                weight: 21,
                key: 'reference',
                label: 'Save as reference',
                tooltip: 'Using this option will save this field as a reference and link its value to the value of the origin record.',
                conditional: {
                    json: {
                        '===': [{
                            var: 'data.dataSrc'
                        }, 'resource']
                    }
                }
            }]
        },
        {
            key: 'validation',
            components: SelectEditValidation
        }
    ], ...extend);
}
