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

    needsToBeValidated(payload)
    {
        if (payload.hasOwnProperty('phone') && !payload.hasOwnProperty('phone_valid')) {
            return true;
        }

        if (payload.hasOwnProperty('email') && !payload.hasOwnProperty('email_valid')) {
            return true;
        }
    }

    validate(payload)
    {
        let xverifyPayload = {};

        if (payload.hasOwnProperty('email') && payload.email !== '') {
            xverifyPayload['email'] = payload.email;
        }
        if (payload.hasOwnProperty('phone') && payload.phone !== '') {
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
            forEach(results, (fieldResult, fieldKey) => {
               if (!fieldResult.valid) {
                   FormioUtils.getComponent(
                       this.form.wizard.instance.components,
                       remapField[fieldKey]
                   )
                   .setCustomValidity(fieldResult.message, true);

                   throw new Error(fieldResult.message);
               } else {
                   payload[remapField[fieldKey] + '_valid'] = true;
               }
            });
        })
    }
}
export default Xverify;