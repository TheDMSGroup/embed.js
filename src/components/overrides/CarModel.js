import SelectComponent from 'formiojs/components/select/Select';

export default class CarModelComponent extends SelectComponent {
    static schema(...extend) {
        return SelectComponent.schema({
            type: 'select',
            label: 'Car Model',
            key: 'car_model',
            lockKey: true,
            placeholder: 'Select Model',
            data: {
                values: [],
                json: '',
                url: location.origin + "/api/v1/resource/cars/models/{{ data.car_make }}/{{ data.car_year }}",
                resource: '',
                custom: ''
            },
            limit: 100,
            dataSrc: 'url',
            valueProperty: 'name',
            selectValues: 'data',
            filter: '',
            searchEnabled: false,
            searchField: '',
            minSearch: 0,
            disableLimit: true,
            refreshOn: 'car_make',
            clearOnRefresh: true,
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
            title: 'Car Model',
            group: 'basic',
            icon: 'fa fa-car',
            weight: 70,
            documentation: 'http://help.form.io/userguide/#select',
            schema: CarModelComponent.schema()
        };
    }
}
