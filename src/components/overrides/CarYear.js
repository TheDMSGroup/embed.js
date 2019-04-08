import SelectComponent from 'formiojs/components/select/Select';

export default class CarYearComponent extends SelectComponent {
    static schema(...extend) {
        return SelectComponent.schema({
            type: 'select',
            label: 'Car Year',
            key: 'car_year',
            lockKey: true,
            data: {
                values: this.carYearValues,
                json: '',
                url: '',
                resource: '',
                custom: ''
            },
            limit: 100,
            placeholder: 'Select Year',
            validate: { required: true },
            dataSrc: 'values',
            valueProperty: '',
            selectValues: '',
            filter: '',
            searchEnabled: false,
            searchField: '',
            minSearch: 0,
            readOnlyValue: false,
            authenticate: false,
            template: '<span>{{ item.label }}</span>',
            selectFields: '',
            searchThreshold: 0.3,
            fuseOptions: {},
            customOptions: {},

        }, ...extend);
    }

    static get builderInfo() {
        return {
            title: 'Car Year',
            group: 'basic',
            icon: 'fa fa-car',
            weight: 70,
            documentation: 'http://help.form.io/userguide/#select',
            schema: CarYearComponent.schema()
        };
    }
    
    static get carYearValues() {
        let currrentYear = new Date().getFullYear();
        let years = [];
        for (let year = currrentYear; year >= 2002; year--) {
            years.push({label: year, value: year})
        }
        return years;
    }
}
