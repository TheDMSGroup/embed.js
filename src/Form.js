import * as Formio from 'formiojs';
import URL from 'query-string';

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
            this.embedForm(json);
            this.setAuthToken(json.token);
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
        this.form.payload['X-Authorization'] = token;
    }

    /**
     * Embed the form on the actual page
     * @param formJson
     */
    embedForm(formJson)
    {
        this.form.instance = new Formio.Form(document.getElementById('studio'), formJson);
        this.form.instance.render()
            .then((form) => {
                form.on('nextPage', (payload) => this.submitLead(payload));
                form.on('render', this.submitLead(URL.parse(location.search)));
            });
    }

    submitLead(payload)
    {
        console.log(this.form.instance);
        let url = this.form.config.url + '/api/v1/embed/target/' + this.form.config.account + '/' + this.form.config.targetId;
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(Object.assign(payload, this.form.payload)),
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            }
        })
        .then((response) => response.json())
        .catch(error => console.error('Error:', error))
    }
}
export default Form;