import FormioUtils from "formiojs/utils";

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
        return payload.hasOwnProperty('email') && payload.email !== ''
            || payload.hasOwnProperty('phone') && payload.phone !== '';
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

        return fetch(this.xverifyApiEndpoint, {
            method: 'POST',
            body: JSON.stringify(Object.assign(xverifyPayload, this.form.payload)),
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            }
        })
        .then((response) => response.json())
        .catch(error => console.error('Error:', error))
    }
}