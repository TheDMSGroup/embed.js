import * as Formio from 'formiojs';
import URL from 'query-string';
import Component from './components';

class Form {
    /**
     * The form wrapper
     * @var {Object}
     */
    form = {
        instance: {},
        config: {},
        payload: {},
    };

    authToken = '';

    constructor(config) {
        this.form.config = config;
        this.setUrl();
        this.getFormJson();
    }

    /**
     * Query the studio API to retrieve the JSON of the form that is linked to the target
     */
    getFormJson()
    {
        let url = this.form.config.url + '/api/v1/embed/target/' + this.form.config.account + '/' + this.form.config.targetId;
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(this.form.payload),
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            }
        })
        .then((response) => response.json())
        .catch(error => console.error('Error:', error))
        .then((json) => {
            this.setAuthToken(json.token);
            this.embedForm(json);
        });
    }

    /**
     * Set the URL of the page that the form is being loaded on
     */
    setUrl()
    {
        this.form.payload.pageURL = location.href;
    }

    setAuthToken(token)
    {
        this.authToken = token;
    }

    /**
     * Embed the form on the actual page
     * @param formJson
     */
    embedForm(formJson)
    {
        this.form.instance = new Formio.Form(document.getElementById('studio'), formJson);
        this.form.instance
        .render()
        .then((form) => {
            form.on('nextPage', (payload) => {
                Component.analytics(form).setPageProgressionEvent(payload.submission.data);
                this.submitLeadData(payload.submission.data, this.leadApiEndPoint);
            });
            form.on('submit', (payload) => {
                Component.analytics(form)
                    .setFormCompletionEvent(payload.submission.data);
                this.submitLeadData(payload.submission.data, this.leadApiEndPoint);
            });
            // form.on('render', () => {
            //     const urlParams = URL.parse(location.search);
            //     this.submitLeadData(urlParams, this.embedApiEndPoint);
            // });
        });
    }

    get embedApiEndPoint()
    {
        return this.form.config.url + '/api/v1/embed/target/' + this.form.config.account + '/' + this.form.config.targetId;
    }

    get leadApiEndPoint()
    {
        return this.form.config.url + '/api/v1/lead/' + this.form.config.account;
    }

    /**
     *
     * @param parameters Lead data payload
     * @param path Path of the API endpoint to submit lead data to
     */
    submitLeadData(parameters, path)
    {
        fetch(path, {
            method: 'POST',
            body: JSON.stringify(Object.assign(parameters, this.form.payload)),
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'X-Authorization': this.authToken
            }
        })
        .catch(error => console.error('Error:', error))
    }
}
export default Form;