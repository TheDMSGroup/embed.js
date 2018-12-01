import Formio from 'formiojs/Form';
import URL from 'query-string';
import Component from './components';
import fetch from 'unfetch';

import 'formiojs/dist/formio.form.min.css';

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
        Component.override.init();
        this.form.config = config;
        this.setUrl();
        this.setPageTitle();
        this.getFormJson();
    }

    /**
     * Query the studio API to retrieve the JSON of the form that is linked to the target
     */
    getFormJson()
    {
        this.setUrlParams();
        let embedApiUrl = this.formId ? this.embedFormApiEndPoint : this.embedApiEndPoint;

        fetch(embedApiUrl, {
            method: 'POST',
            body: JSON.stringify(this.form.payload),
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            }
        })
        .then((response) => response.json())
        .catch(error => console.error('Error:', error))
        .then((json) => {
            // Always force the form to render a wizard
            json.display = 'wizard';
            this.removeSpinner();
            document.getElementById('studio').classList.add('ll');
            this.authToken = json.token;
            this.formId = json.formId;
            this.uuid = json.leadId;
            this.externalCss = json.inline_css;
            this.embedForm(json);
        });
    }

    /**
     * Set the URL of the page that the form is being loaded on
     */
    setUrl()
    {
        this.form.payload.pageURL = this.form.payload['current_url'] = location.href;
    }

    setPageTitle()
    {
        this.form.payload['meta_title'] = document.getElementsByTagName('title')[0].innerText;
    }

    set authToken(token)
    {
        this.form.payload['X-Authorization'] = token;
    }

    set formId(formId)
    {
        this.form.payload['form_id'] = formId;
    }

    set uuid(uuid)
    {
        this.form.payload.uuid = uuid;
    }

    set externalCss(css)
    {
        let style = document.createElement('style');
        style.innerHTML = css;
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    set gaTrackerData(ga)
    {
        this.form.payload.ga = ga;
    }

    /**
     * Embed the form on the actual page
     * @param formJson
     */
    embedForm(formJson)
    {
        new Formio(document.getElementById('studio'), formJson, {
            submitOnEnter: true,
            breadcrumbSettings: { clickable: false },
            buttonSettings: { showCancel: false, showPrevious: false, showNext: false },
            noAlerts: true,
            namespace: 'studio'
        })
        .render()
        .then((form) => {
            this.form.instance = form;
            form.customCurrentPage = 0;

            new Component.trustedForm(form);
            let analytics = new Component.analytics();
            let jornaya = new Component.jornaya(form);
            let history = new Component.history(form);
            jornaya.attachJornayaIdToTCPA();
            this.gaTrackerData = analytics.trackerData;

            history.initialize();

            form.on('next', (payload) => {
                analytics.pageProgressionEvent(form);
                jornaya.attachJornayaIdToTCPA();
                history.pageProgression().updateState();
                this.submitLeadData(payload.data, this.leadApiEndPoint);
            });

            form.on('submitDone', (payload) => {
                analytics.formCompletionEvent(form);
                jornaya.attachJornayaIdToTCPA();
                history.updateState();
                this.submitLeadData(payload.data, this.leadApiEndPoint)
                .then((response) => location.href = response.redirect_url);
            });

            form.on('nextButton', () => this.triggerFieldEvent(form).then(() => this.nextPage(form)));
        })
    }

    /**
     * Override native form.io nextPage method in order to emit the "submit" event and validate specific fields
     * with xverify
     * @param form
     * @returns {*}
     */
    nextPage(form) {
        let xverify = new Component.xverify(this.form);

        if (form.checkValidity(form.data, true)) {
            form.checkData(form.data, {
                noValidate: true
            });

            const goToNextPage = () => {
                form.beforeNext().then(() => {
                    form.setPage(form.getNextPage(form.data, form.page));
                    form.customCurrentPage++;
                    if (this.isNotLastPage(form)) {
                        form.emit('next', { data: form.data });
                    } else {
                        form.emit('submitDone', { data: form.data });
                    }
                });
            };

            if (xverify.needsToBeValidated(form.data)) {
                xverify.validate(form.data)
                    .then(() => {
                        goToNextPage();
                    });
            } else {
                goToNextPage();
            }
        }
        else {
            return Promise.reject(form.showErrors(null, true));
        }
    }

    /**
     * @param form
     * @returns {boolean}
     */
    isNotLastPage(form)
    {
        return form.customCurrentPage !== (form.pages.length ? form.pages.length : 1);
    }

    /**
     * @returns {string}
     */
    get embedTargetApiEndPoint()
    {
        return this.endpointBase + '/api/v1/embed/target/' + this.form.config.account + '/' + this.targetId;
    }

    /**
     * @returns {string}
     */
    get embedFormApiEndPoint()
    {
        return this.endpointBase + '/api/v1/embed/form/' + this.form.config.account + '/' + this.formId;
    }

    /**
     * Determine which API endpoint to load Form Data from
     * @returns {*}
     */
    get embedApiEndPoint()
    {
        if (this.hasOwnProperty('form') && this.form.hasOwnProperty('config')) {
            if (this.form.config.hasOwnProperty('form') && this.formId > 0) {
                return this.embedFormApiEndPoint;
            } else if (this.form.config.hasOwnProperty('target') && this.targetId) {
                return this.embedTargetApiEndPoint;
            }
        }

        throw new Error('Invalid configuration: missing formId OR targetId');
    }

    /**
     * @returns {string}
     */
    get leadApiEndPoint()
    {
        return this.endpointBase + '/api/v1/lead/' + this.form.config.account;
    }

    /**
     * @returns {integer}
     */
    get formId()
    {
        return this.form.config.form;
    }

    /**
     * @returns {integer}
     */
    get targetId()
    {
        return this.form.config.target;
    }

    /**
     * @returns {string}
     */
    get endpointBase()
    {
        return this.form.config.url;
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

    /**
     * Hide Spinner UI Element
     */
    removeSpinner()
    {
        let element = document.getElementById('studio');
        element.classList.remove('loader');
    }

    /**
     * This method is used for forcing input events to be triggered whenever we submit the form
     *
     * @param form
     * @returns {Promise}
     */
    triggerFieldEvent(form)
    {
        return new Promise(resolve => {
            FormioUtils.eachComponent(form.components, (component) => {
                if (component.key && component.key.includes('phone') && !component.key.includes('consent')) {
                    const phoneNumber = component.getValue();
                    if (phoneNumber && phoneNumber[0] === '+' && phoneNumber.length === 12) {
                        component.setValue(phoneNumber.slice(2, phoneNumber.length));
                    }
                    component.setInputMask(component.inputs[0]);
                }
                component.updateValue();
            });
            resolve();
        });
    }
}
export default Form;