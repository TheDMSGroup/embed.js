class TrustedForm
{
    /**
     * TrustedForm constructor
     * @param form
     */
    constructor(form)
    {
        this.payload = form.data;
        if (form.hasOwnProperty('schema') && form.schema.hasOwnProperty('trustedform_script')) {
            this.trustedForm = form.schema.trustedform_script;
        }
    }

    /**
     * Execute the trusted form script on the page
     * @param script
     */
    set trustedForm(script)
    {
        let parser = new DOMParser();
        script = parser.parseFromString(script, 'text/html');
        eval(script.getElementsByTagName('script')[0].innerHTML);
        window.trustedFormCertUrlCallback = (url) => this.certificateUrl = url;
    }

    /**
     * Inject the trusted form certificate url into the form payload
     * @param url
     */
    set certificateUrl(url)
    {
        this.payload['trustedform_cert_url'] = url;
    }
}
export default TrustedForm;