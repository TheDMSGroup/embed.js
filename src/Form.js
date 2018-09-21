import * as Formio from 'formiojs';
import URL from 'query-string';
import Component from './components';

class Form {
    /**
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
        this.setUrlParams();
        fetch(this.embedApiEndPoint, {
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
            this.setFormId(json.formId);
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
        this.form.payload['X-Authorization'] = token;
    }

    setFormId(formId)
    {
        this.form.payload['form_id'] = formId;
    }

    /**
     * Embed the form on the actual page
     * @param formJson
     */
    embedForm(formJson)
    {
        let xverify = new Component.xverify();

        this.form.instance = new Formio.Form(document.getElementById('studio'), formJson, {
            submitOnEnter: true,
            breadcrumbSettings: { clickable: false },
            buttonSettings: { showCancel: false, showPrevious: false, showNext: false },
            hooks: {
                beforeSubmit: (payload, next) => {
                    if (xverify.needsToBeValidated(payload.data)) {
                        xverify.validate(payload.data)
                            .catch(error => next(error));
                    } else {
                        next();
                    }
                }
            }
        });
        this.form.instance
        .render()
        .then((form) => {
            form.on('submit', (payload) => {
                if (this.isNotLastPage(form)) {
                    new Component.analytics(form).pageProgressionEvent();
                    this.incrementPage(form);
                    this.submitLeadData(payload.data, this.leadApiEndPoint);
                } else {
                    new Component.analytics(form).formCompletionEvent();
                    this.submitLeadData(payload.data, this.leadApiEndPoint)
                    // .then((response) => location.href = response.redirect_url);
                }
            });
            form.on('submitButton', () => {
                if (this.isNotLastPage(form)) {
                    form.nextPage();
                } else {
                    form.submit();
                }
            });
        });
    }

    incrementPage(form)
    {
        form.page = form.page + 1;
    }

    isNotLastPage(form)
    {
        return form.page !== form.pages.length;
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
     * Parse the URL params and push them into the payload
     */
    setUrlParams()
    {
        const urlParams = URL.parse(location.search);
        Object.assign(this.form.payload, urlParams);
    }

    /**
     *
     * @param parameters Lead data payload
     * @param path Path of the API endpoint to submit lead data to
     */
    submitLeadData(parameters, path)
    {
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
}
export default Form;