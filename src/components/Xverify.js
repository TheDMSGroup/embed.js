import FormioUtils from "formiojs/utils";

class Xverify
{

    constructor(authToken)
    {
        this._authToken = authToken;
    }

    set authToken(token) {

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
        let xverifyErrors = [];

        if (payload.hasOwnProperty('email') && payload.email !== '') {
            xverifyPayload['email'] = payload.email;
        }
        if (payload.hasOwnProperty('phone') && payload.phone !== '') {
            xverifyPayload['phone_cell'] = payload.phone;
        }

        return fetch(path, {
            method: 'POST',
            body: JSON.stringify(Object.assign(parameters, this.form.payload)),
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            }
        })
            .then((response) => response.json())
            .catch(error => console.error('Error:', error))
    }





        return this.submitLeadData(xverifyPayload, this.xverifyApiEndpoint)
            .then((results) => {
                results.forEach((result) => {
                    if (result.valid === 0) {
                        console.log(result);
                    }
                });


                for (let index in response) {
                    if (response[index].valid === 0) {
                        let errorComponent = Formio.Utils.getComponent(this.form.instance.instance.wizard.components, index);
                        xverifyErrors.push({
                            component: errorComponent,
                            message: response[index].message.toString()
                        });
                    }
                }
                if (Object.keys(xverifyErrors).length > 0) {
                    Promise.reject(xverifyErrors);
                }
            });
    }

}