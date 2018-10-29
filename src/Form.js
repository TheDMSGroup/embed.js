import * as Formio from 'formiojs';
import URL from 'query-string';
import Component from './components';
import fetch from 'unfetch'

class Form {
    /**
     * @var {Object}
     */
    form = {
        wizard: {},
        config: {},
        payload: {},
    };

    constructor(config) {
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
        this.form.wizard = new Formio.Form(document.getElementById('studio'), formJson, {
            submitOnEnter: true,
            breadcrumbSettings: { clickable: false },
            buttonSettings: { showCancel: false, showPrevious: false, showNext: false },
            noAlerts: true
        });
        this.form.wizard
        .render()
        .then((form) => {
            this.removeSpinner();
            new Component.trustedForm(form);
            let analytics = new Component.analytics();
            let jornaya = new Component.jornaya(form);
            jornaya.attachJornayaIdToTCPA();
            this.gaTrackerData = analytics.trackerData;
            form.customCurrentPage = 0;

            form.on('submit', (payload) => {
                if (this.isNotLastPage(form)) {
                    analytics.pageProgressionEvent(form);
                    jornaya.attachJornayaIdToTCPA();
                    this.submitLeadData(payload.data, this.leadApiEndPoint);
                } else {
                    analytics.formCompletionEvent(form);
                    jornaya.attachJornayaIdToTCPA();
                    this.submitLeadData(payload.data, this.leadApiEndPoint)
                    .then((response) => location.href = response.redirect_url);
                }
            });
            // Remove all listeners on the submitButton event since this event will try to submit the form ahead of time.
            form.on('render', () => form.events.removeAllListeners('formio.submitButton'));
            // This seems to be the only way to latch onto the submitButton event after removing all the listeners from it.
            form.events.onAny((event) => {
                if (event.includes('submitButton')) {
                    if (this.isNotLastPage(form)) {
                        this.nextPage(form);
                    }
                }
            });
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
                    form.emit('submit', { page: form.page, data: form.data });
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

    isNotLastPage(form)
    {
        return form.customCurrentPage !== form.pages.length;
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

    removeSpinner()
    {
        let element = document.getElementById('studio');
        element.classList.remove('loader');
    }
}
export default Form;