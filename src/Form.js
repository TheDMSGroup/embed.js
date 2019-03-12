import Formio from 'formiojs/Wizard';
import URL from 'query-string';
import Component from './components';
import fetch from 'unfetch';
import _merge from 'lodash/merge';
import store from 'store2';
import isEmpty from 'lodash/isEmpty';

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
        this.form.instance = new Formio(document.getElementById('studio'), {
            submitOnEnter: true,
            breadcrumbSettings: { clickable: false },
            buttonSettings: { showCancel: false, showPrevious: false, showNext: false },
            noAlerts: true,
            namespace: 'studio'
        });
        if (store.has('crm.uuid')) {
            this.uuid = store.get('crm.uuid');
        }
        if (store.has('crm.formid')) {
            this.formId = store.get('crm.formid');
        }
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
            document.getElementById('studio').classList.add('ll');
            this.authToken = json.token;
            store.set('crm.uuid', json.leadId);
            store.set('crm.formid', json.formId)
            this.uuid = json.leadId;
            this.formId = json.formId;
            this.externalCss = json.inline_css;

            if (json.hasOwnProperty('error')) {
                throw new Error(json.error);
            }

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
        this.form.payload['meta_title'] = document.getElementsByTagName('title')[0].innerText || '';
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

    set gaTrackerData(data)
    {
        this.form.instance.data = {...this.form.instance.data, ...{
            ga: data
        }};
    }

    get gaTrackerData() {
        return this.form.instance.data.ga || null;
    }

    /**
     * Embed the form on the actual page
     * @param formJson
     */
    embedForm(formJson)
    {
        const formInstance = this.form.instance;
        formInstance.form = formJson;

        const analytics = new Component.analytics();
        const jornaya = new Component.jornaya(formInstance);

        const history = new Component.history(formInstance);

        if (!this.checkConfigSwitch('ignoreHistory')) {
            history.initialize();

            formInstance.submission = {
                data: _merge(history.storeFormData, this.form.payload)
            };
        } else {
            formInstance.submission = {
                data: this.form.payload
            }
        }

        formInstance.ready.then(() => {
            formInstance.on('formLoad', () => {
                this.gaTrackerData = analytics.trackerData();
                formInstance.customCurrentPage = formInstance.page;
            });

            formInstance.on('render', () => {
                jornaya.attachJornayaIdToTCPA();
            });

            formInstance.on('next', (payload) => {
                if (isEmpty(this.gaTrackerData)) {
                    this.gaTrackerData = analytics.trackerData();
                }

                analytics.pageProgressionEvent(formInstance);
                jornaya.attachJornayaIdToTCPA();

                if (!this.checkConfigSwitch('ignoreHistory')) {
                    history.pageProgression().updateState();
                }

                this.submitLeadData(payload.data, this.leadApiEndPoint);
            });

            formInstance.on('submitDone', (payload) => {
                analytics.formCompletionEvent(formInstance);
                jornaya.attachJornayaIdToTCPA();

                if (!this.checkConfigSwitch('ignoreHistory')) {
                    history.updateState();
                }

                this.submitLeadData(payload.data, this.leadApiEndPoint)
                .then((response) => this.handleRedirect(response));
            });

            formInstance.on('nextButton', (payload) => this.triggerFieldEvent().then(() => this.nextPage(payload)));
        });
    }

    handleRedirect(form) {
        if (form.use_html_redirect) {
            let embedElement = document.getElementById('studio');
            embedElement.innerHTML = form.html || "Thank you for your submission.";
        } else if (form.redirect_url) {
            location.href = form.redirect_url;
        }

        store.clearAll();
    }

    /**
     * Override native form.io nextPage method in order to emit the "submit" event and validate specific fields
     * with xverify
     * @returns {*}
     */
    nextPage(payload) {
        let form = this.form.instance;
        form.data = { ...form.data, ...payload.data };
        let xverify = new Component.xverify(this.form);
        if (form.checkValidity(form.data, true)) {
            form.checkData(form.data, {
                noValidate: true
            });

            const goToNextPage = () => {
                form.beforeNext().then(() => {
                    form.setPage(form.getNextPage(form.data, form.page)).catch((error) => {});
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
        _merge(this.form.payload, urlParams);
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
            body: JSON.stringify(parameters),
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            }
        })
        .then((response) => response.json())
        .catch(error => console.error('Error:', error))
    }

    /**
     * This method is used for forcing input events to be triggered whenever we submit the form
     *
     * @param form
     * @returns {Promise}
     */
    triggerFieldEvent()
    {
        let form = this.form.instance;

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

    checkConfigSwitch(name)
    {
        return (this.form.config.hasOwnProperty(name) && this.form.config[name]);
    }
}
export default Form;
