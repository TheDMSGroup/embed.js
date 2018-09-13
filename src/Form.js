import * as Formio from 'formiojs';

class Form {
    /**
     * The form wrapper
     * @var {Object}
     */
    form = {
        instance: {},
        config: {}
    };

    constructor(config) {
        this.form.config = config;
        this.setUrl();
        this.getFormJson();
    }

    getFormJson()
    {
        let url = this.form.config.url + '/api/v1/embed/target/' + this.form.config.account + '/' + this.form.config.targetId;
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(this.form.config),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .catch(error => console.error('Error:', error))
        .then((response) => this.embedForm(response));
    }

    setUrl()
    {
        this.form.config.pageURL = window.location.href;
    }

    embedForm(formJson)
    {
        this.form.instance = new Formio.Form(document.getElementById('studio'), formJson);
        this.form.instance.render();
    }
}
export default Form;