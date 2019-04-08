import SelectComponent from 'formiojs/components/select/Select';

export default class CarMakeComponent extends SelectComponent {
    static schema(...extend) {
        return SelectComponent.schema({
            type: 'select',
            label: 'Car Make',
            key: 'car_make',
            lockKey: true,
            data: {
                values: [],
                json: '',
                url: location.origin + "/api/v1/resource/cars/makes/{{ data.car_year }}",
                resource: '',
                custom: ''
            },
            limit: 100,
            dataSrc: 'url',
            valueProperty: 'name',
            placeholder: 'Select Make',
            disableLimit: true,
            refreshOn: 'car_year',
            selectValues: 'data',
            clearOnRefresh: true,
            validate: { required: true },
            filter: '',
            searchEnabled: false,
            searchField: '',
            minSearch: 0,
            readOnlyValue: false,
            authenticate: false,
            template: '<span>{{ item.name }}</span>',
            selectFields: '',
            searchThreshold: 0.3,
            fuseOptions: {},
            customOptions: { shouldSort: true }
        }, ...extend);
    }

    static get builderInfo() {
        return {
            title: 'Car Make',
            group: 'basic',
            icon: 'fa fa-car',
            weight: 70,
            documentation: 'http://help.form.io/userguide/#select',
            schema: CarMakeComponent.schema()
        };
    }
}
