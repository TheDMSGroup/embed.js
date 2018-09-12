import Formio from 'formiojs';

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
        this.getFormJson();
    }

    getFormJson()
    {
        let url = this.form.config.url + '/api/v1/embed/target/' + this.form.config.account + '/' + this.form.config.targetId;

        fetch(url, {
            method: 'POST',
        }).then(res => res.json())
            .then(response => console.log('Success:', JSON.stringify(response)))
            .catch(error => console.error('Error:', error));
    }
}

export default Form;