import SelectComponent from 'formiojs/components/select/Select';

export default class CarMakeComponent extends SelectComponent {
    static schema(...extend) {
        return SelectComponent.schema({
            type: 'select',
            label: 'Car Make',
            key: 'car_make',
            lockKey: true,
            data: {
                values: this.carMakeValues,
                json: '',
                url: '',
                resource: '',
                custom: ''
            },
            limit: 100,
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
    
    static get carMakeValues() {
        return [
            {
                "label": "Acura",
                "value": "acura"
            },
            {
                "label": "Am General",
                "value": "amGeneral"
            },
            {
                "label": "Audi",
                "value": "audi"
            },
            {
                "label": "BMW",
                "value": "bmw"
            },
            {
                "label": "Buick",
                "value": "buick"
            },
            {
                "label": "Cadillac",
                "value": "cadillac"
            },
            {
                "label": "Chevrolet",
                "value": "chevrolet"
            },
            {
                "label": "Chrysler",
                "value": "chrysler"
            },
            {
                "label": "Daewoo",
                "value": "daewoo"
            },
            {
                "label": "Daihatsu",
                "value": "daihatsu"
            },
            {
                "label": "Dodge",
                "value": "dodge"
            },
            {
                "label": "Eagle",
                "value": "eagle"
            },
            {
                "label": "Ferrari",
                "value": "ferrari"
            },
            {
                "label": "Fiat",
                "value": "fiat"
            },
            {
                "label": "Fisker",
                "value": "fisker"
            },
            {
                "label": "Ford",
                "value": "ford"
            },
            {
                "label": "GMC",
                "value": "gmc"
            },
            {
                "label": "Geo",
                "value": "geo"
            },
            {
                "label": "Honda",
                "value": "honda"
            },
            {
                "label": "Hummer",
                "value": "hummer"
            },
            {
                "label": "Hyundai",
                "value": "hyundai"
            },
            {
                "label": "Infiniti",
                "value": "infiniti"
            },
            {
                "label": "International",
                "value": "international"
            },
            {
                "label": "Isuzu",
                "value": "isuzu"
            },
            {
                "label": "Jaguar",
                "value": "jaguar"
            },
            {
                "label": "Jeep",
                "value": "jeep"
            },
            {
                "label": "Kia",
                "value": "kia"
            },
            {
                "label": "Lamborghini",
                "value": "lamborghini"
            },
            {
                "label": "Land Rover",
                "value": "landRover"
            },
            {
                "label": "Lexus",
                "value": "lexus"
            },
            {
                "label": "Lincoln",
                "value": "lincoln"
            },
            {
                "label": "MINI",
                "value": "mini"
            },
            {
                "label": "Mazda",
                "value": "mazda"
            },
            {
                "label": "Mercedes-Benz",
                "value": "mercedesBenz"
            },
            {
                "label": "Mercury",
                "value": "mercury"
            },
            {
                "label": "Mitsubishi",
                "value": "mitsubishi"
            },
            {
                "label": "Nissan",
                "value": "nissan"
            },
            {
                "label": "Oldsmobile",
                "value": "oldsmobile"
            },
            {
                "label": "Plymouth",
                "value": "plymouth"
            },
            {
                "label": "Pontiac",
                "value": "pontiac"
            },
            {
                "label": "Porsche",
                "value": "porsche"
            },
            {
                "label": "RAM",
                "value": "ram"
            },
            {
                "label": "Saab",
                "value": "saab"
            },
            {
                "label": "Saleen",
                "value": "saleen"
            },
            {
                "label": "Saturn",
                "value": "saturn"
            },
            {
                "label": "Scion",
                "value": "scion"
            },
            {
                "label": "Smart",
                "value": "smart"
            },
            {
                "label": "Spyker",
                "value": "spyker"
            },
            {
                "label": "Sterling",
                "value": "sterling"
            },
            {
                "label": "Subaru",
                "value": "subaru"
            },
            {
                "label": "Suzuki",
                "value": "suzuki"
            },
            {
                "label": "Tesla",
                "value": "tesla"
            },
            {
                "label": "Toyota",
                "value": "toyota"
            },
            {
                "label": "Volkswagen",
                "value": "volkswagen"
            },
            {
                "label": "Volvo",
                "value": "volvo"
            },
            {
                "label": "Yugo",
                "value": "yugo"
            }
        ];
    }
}
