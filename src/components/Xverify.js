import FormioUtils from "formiojs/utils";
import forEach from "lodash/foreach";
import fetch from 'unfetch'

class Xverify
{
    phoneField = '';

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
            if (this.form.hasOwnProperty('instance'))
                if (this.form.instance.hasOwnProperty('wizard'))
                    if (this.form.instance.wizard.hasOwnProperty(keyName))
                        return this.form.instance.wizard[keyName];

        return null;
    }

    needsToBeValidated(payload)
    {
        if (this.findPhone(payload) && !payload.hasOwnProperty(this.phoneField + '_valid')) {
            return true;
        }

        if (payload.hasOwnProperty('email') && !payload.hasOwnProperty('email_valid')) {
            return true;
        }

        return false;
    }

    /**
     * Find the phone number in the payload
     *
     * @param payload
     */
    findPhone(payload)
    {
         return Object.keys(payload)
            .filter(field => field.includes('phone') && !field.includes('consent') && !field.includes('valid'))
            .reduce((obj, key) => {
                this.phoneField = key;
                obj[key] = payload[key];
                return obj;
            }, {});
    }

    validate(payload)
    {
        let xverifyPayload = {};

        if (this.extractFormSetting('verify_email') === null) {
            xverifyPayload['email'] = payload.email;
        }
        if (this.extractFormSetting('verify_phone') === null) {
            xverifyPayload['phone'] = Object.values(this.findPhone(payload)).toString();
        }

        if (this.extractFormSetting('verify_email') && payload.hasOwnProperty('email')) {
            xverifyPayload['email'] = payload.email;
        }
        if (this.extractFormSetting('verify_phone') && this.findPhone(payload)) {
            xverifyPayload['phone'] = Object.values(this.findPhone(payload)).toString();
            // Support legacy phone_cell field
            xverifyPayload['phone_cell'] = Object.values(this.findPhone(payload)).toString();
        }

        return fetch(this.xverifyApiEndpoint, {
            method: 'POST',
            body: JSON.stringify({...xverifyPayload, ...this.form.payload}),
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            }
        })
        .then((response) => response.json())
        .then((results) => {
            let errors = [];
            forEach(results, (fieldResult) => {
               if (!fieldResult.valid) {
                   FormioUtils.getComponent(
                       this.form.instance.components,
                       this.phoneField
                   ).setCustomValidity(fieldResult.message, true);

                   errors.push(fieldResult.message);
               } else {
                   payload[this.phoneField + '_valid'] = true;
               }
            });
            if (errors.length > 0) {
                throw new Error(errors);
            }
        })
    }
}
export default Xverify;