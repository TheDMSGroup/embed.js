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
                let labelCleaned = this.toTitleCase(this.removeCategoryFrom(label));

                customCategories['questions'].components.push(
                    customComponents[key] = {
                        "title": labelCleaned,
                        "key": key,
                        "icon": "fa fa-terminal",
                        "schema": {
                            "label": labelCleaned,
                            "customKey": key,
                            "type": this.determineType(type),
                            "key": key,
                            "validate": {"required": true},
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
                            "label": "First name",
                            "key": "firstname",
                            "customKey": "firstname",
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
                            "label": "Lastname",
                            "key": "lastname",
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
                            "customKey": "email",
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
                            "customKey": "phone",
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
                            "customKey": "address1",
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
                            "customKey": "zipcode",
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
                    "selectboxes": true
                }
            }
        }
    }

    determineType(type) {
        switch (type) {
            case 'text':
                return 'textfield';
                break;
            case 'boolean':
                return 'checkbox';
                break;
            case 'tel':
                return 'phoneNumber';
                break;
            case 'textarea':
                return 'htmlelement';
                break;
            case 'date':
                return 'datetime';
                break;
            case 'number':
            case 'email':
            case 'select':
            case 'selectboxes':
            case 'signature':
            case 'time':
            case 'file':
            case 'day':
            case 'address':
            case 'password':
            case 'radio':
            case 'currency':
                return type;
                break;
            default:
                return 'textfield';
                break;
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