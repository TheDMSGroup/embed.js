import FormioUtils from "formiojs/utils";
import forEach from "lodash/foreach";
import fetch from 'unfetch'

class Xverify
{
    constructor(form)
    {
        this.form = form;
    }

    get xverifyApiEndpoint()
    {
        return this.form.config.url + '/api/v1/lead/xverify/' + this.form.config.account;
    }

    extractFormSetting(keyName)
    {
        if (this.hasOwnProperty('form'))
            if (this.form.hasOwnProperty('wizard'))
                if (this.form.wizard.hasOwnProperty('form'))
                    if (this.form.wizard.form.hasOwnProperty(keyName))
                        return this.form.wizard.form[keyName];

        return null;
    }

    needsToBeValidated(payload)
    {
        if (this.extractFormSetting('verify_phone') && payload.hasOwnProperty('phone') && !payload.hasOwnProperty('phone_valid')) {
            return true;
        }

        if (this.extractFormSetting('verify_email') && payload.hasOwnProperty('email') && !payload.hasOwnProperty('email_valid')) {
            return true;
        }

        return false;
    }

    validate(payload)
    {
        let xverifyPayload = {};

        if (this.extractFormSetting('verify_email') && payload.hasOwnProperty('email') && payload.email !== '') {
            xverifyPayload['email'] = payload.email;
        }
        if (this.extractFormSetting('verify_phone') && payload.hasOwnProperty('phone') && payload.phone !== '') {
            xverifyPayload['phone_cell'] = payload.phone;
        }

        let remapField = { phone_cell: 'phone', email: 'email' };

        return fetch(this.xverifyApiEndpoint, {
            method: 'POST',
            body: JSON.stringify(Object.assign(xverifyPayload, this.form.payload)),
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            }
        })
        .then((response) => response.json())
        .then((results) => {
            let errors = [];
            forEach(results, (fieldResult, fieldKey) => {
               if (!fieldResult.valid) {
                   FormioUtils.getComponent(
                       this.form.wizard.instance.components,
                       remapField[fieldKey]
                   ).setCustomValidity(fieldResult.message, true);

                   errors.push(fieldResult.message);
               } else {
                   payload[remapField[fieldKey] + '_valid'] = true;
               }
            });
            if (errors.length > 0) {
                throw new Error(errors);
            }
        })
    }
}
export default Xverify;