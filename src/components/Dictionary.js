import fetch from 'unfetch';
import merge from 'lodash/merge';

export default class Dictionary {
    /**
     * Get the Engage dictionary
     */
    get() {
        return fetch(location.origin + '/api/v1/dictionary')
        .catch(error => console.error(error))
        .then(response => response.json())
        .then(json => this.createCustomComponent(json))
        .then(dictionary => this.buildOptions(dictionary))
    }

    createCustomComponent(dictionaryData) {
        let customCategories = {
            "questions": {
                "title": "Questions",
                "weight": 0,
                "default": true,
                "components": []
            }
        };
        let customComponents = {};

        for (let dictionaryField in dictionaryData) {
            if (dictionaryData[dictionaryField].group !== 'enhancement' && dictionaryData[dictionaryField].group !== 'system') {
                let key = dictionaryData[dictionaryField].attribute_alias;
                let label = dictionaryData[dictionaryField].attribute_label;
                let type = dictionaryData[dictionaryField].type;
                let properties = JSON.parse(dictionaryData[dictionaryField].properties);
                let labelCleaned = this.toTitleCase(this.removeCategoryFrom(label));
                
                customComponents[key] = { 
                    schema: { 
                        data: {} 
                    }    
                };

                if (this.determineType(type) === 'select') {
                    let values = [];
                    Object.keys(properties.list).forEach((key) => {
                        if (typeof properties.list[key] === 'object') {
                            values.push(properties.list[key])
                        }
                    });

                    customComponents[key].schema.data = {
                        values: values,
                        valueProperty: "value",
                        dataSrc: "values"
                    };
                }
                
                customCategories['questions'].components.push(
                    customComponents[key] = {
                        title: labelCleaned,
                        key: key,
                        icon: "fa fa-terminal",
                        schema: {
                            ...customComponents[key].schema,
                            label: labelCleaned,
                            lockKey: true,
                            type: this.determineType(type),
                            key: key,
                            validate: { required: true }
                        }
                    }
                );
            }
        }

        merge(customCategories, this.getCustomBasicComponents);

        return customCategories;
    }

    get getCustomBasicComponents() {
        return {
            "basic": false,
            "advanced": false,
            "data": false,
            "elements": {
                "title": "Elements",
                "weight": 5,
                "components": {
                    "firstname": {
                        "icon": "fa fa-terminal",
                        "title": "First Name",
                        "key": "firstname",
                        "schema": {
                            "label": "First Name",
                            "key": "firstname",
                            "lockKey": true,
                            "type": "textfield",
                            "validate": {"required": true},
                            "input": true
                        }
                    },
                    "lastname": {
                        "icon": "fa fa-terminal",
                        "title": "Last Name",
                        "key": "lastname",
                        "schema": {
                            "label": "Last Name",
                            "key": "lastname",
                            "lockKey": true,
                            "customKey": "lastname",
                            "type": "textfield",
                            "validate": {"required": true},
                            "input": true
                        }
                    },
                    "email": {
                        "icon": "fa fa-terminal",
                        "title": "Email Address",
                        "key": "email",
                        "schema": {
                            "label": "Email",
                            "key": "email",
                            "lockKey": true,
                            "type": "email",
                            "validate": {"required": true},
                            "input": true
                        }
                    },
                    "phone": {
                        "icon": "fa fa-terminal",
                        "title": "Phone",
                        "key": "phone",
                        "schema": {
                            "label": "Phone",
                            "key": "phone",
                            "lockKey": true,
                            "inputMask": "(999) 999-9999",
                            "type": "textfield",
                            "validate": {"required": true},
                            "input": true
                        }
                    },
                    "address": {
                        "icon": "fa fa-terminal",
                        "title": "Address",
                        "key": "address1",
                        "schema": {
                            "label": "Address",
                            "key": "address1",
                            "lockKey": true,
                            "type": "textfield",
                            "validate": {"required": true},
                            "input": true
                        }
                    },
                    "zipcode": {
                        "icon": "fa fa-terminal",
                        "title": "Zip Code",
                        "key": "zipcode",
                        "schema": {
                            "label": "Zip Code",
                            "key": "zipcode",
                            "lockKey": true,
                            "inputMask": "99999",
                            "type": "textfield",
                            "validate": {"required": true},
                            "input": true
                        }
                    },
                    "htmlelement": true,
                    "button": true,
                    "hidden": true,
                    "select": true,
                    "selectboxes": true,
                    "slider": true
                }
            }
        }
    }

    determineType(type) {
        switch (type) {
            case 'text':
                return 'textfield';
            case 'boolean':
                return 'checkbox';
            case 'tel':
                return 'phoneNumber';
            case 'textarea':
                return 'htmlelement';
            case 'date':
                return 'datetime';
            case 'selectboxes':
                return 'select';
            case 'number':
            case 'email':
            case 'select':
            case 'signature':
            case 'time':
            case 'file':
            case 'day':
            case 'address':
            case 'password':
            case 'radio':
            case 'currency':
                return type;
            default:
                return 'textfield';
        }
    }

    buildOptions(customComponents) {
        return {
            builder: customComponents,
            editForm: {
                textfield: [
                    {
                        key: 'api',
                        ignore: true
                    }
                ]
            }
        }
    }

    removeCategoryFrom(label) {
        label = label.split(':');
        if (label.length > 1) {
            return label[1].trim();
        } else {
            label = label[0].split(' - ');

            if (label.length > 1) {
                return label[1].trim();
            }
        }

        return label[0].trim();
    }

    /* https://stackoverflow.com/a/4878800 */
    toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
}