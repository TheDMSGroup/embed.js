import Form from "./Form";
import 'url-polyfill';
import 'dom-previous-element-sibling';
import './style.css';

class Embed
{
    form = {};

    /**
     * Config example
     * {
     *   account: 'DMS',
     *   target: 1
     * }
     * @param config
     */
    constructor(config)
    {
        this.defaultDomain = 'https://studio.dmsengage.com';
        this.config = config;
        this.createEmbedElement();
        new Form(this.config);

    }

    /**
     * Create the embed element where we will inject our Formio instance
     */
    createEmbedElement()
    {
        let script = this.getCurrentScript();
        let element = this.buildFormContainer();

        this.endpointBase = this.getApiDomain(script);
        this.getTargetNode(script).insertBefore(element, script.nextSibling);

        return element;
    }

    /**
     * Build the DOM node that contains the Form.
     *
     * @returns {HTMLElement}
     */
    buildFormContainer() {
        let element = document.createElement('div');
        element.id = 'studio';

        return element;
    }

    /**
     * Find the DOM node that contains the embed script.
     *
     * @param script
     * @returns {*}
     */
    getTargetNode(script) {

        if (script) {

            return script.parentNode;
        } else {

            let allScripts = this.getAllScripts();

            for (let key in allScripts) {
                if (allScripts[key].innerHTML && (
                    allScripts[key].innerHTML.includes('crm.embed') ||
                    allScripts[key].getAttribute('studio')
                )) {
                    return allScripts[key].parentNode;
                }
            }
        }

        let divs = document.getElementsByName('div');

        return divs[divs.length - 1];
    }

    /**
     * Choose the API Domain to use.
     *
     * @param script
     * @returns {*|string}
     */
    getApiDomain(script)
    {
        return this.url || (script ? this.getScriptSource(script.previousSibling) : this.defaultDomain);
    }

    /**
     * Attempt to find the Script Tag DOM Node.
     *
     * @returns {*}
     */
    getCurrentScript()
    {
        if (document.currentScript) {
            return document.currentScript;
        }

        let scripts = this.getAllScripts();

        // Provide a fallback if our script was loaded asynchronously
        for (let key in scripts) {
            if (scripts[key].src && scripts[key].src.includes('/forms/dist/v2.js')) {
                return scripts[key];
            }
        }

        return false;
    }

    /**
     * Extract the API domain from the parent script tag's source.
     *
     * @param script
     * @returns {string}
     */
    getScriptSource(script)
    {
        return new URL(script.src).origin;
    }

    /**
     * Grab all script tags on the page.
     *
     * @returns {HTMLCollectionOf<Element>}
     */
    getAllScripts() {
        return document.getElementsByTagName('script');
    }

    /**
     * Getter: URL from the embed script's configuration.
     *
     * @returns {*}
     */
    get url()
    {
        return this.config.url;
    }

    /**
     * Setter: API Domain.
     *
     * @param url
     */
    set endpointBase(url)
    {
        this.config.url = url;
    }

}

export default Embed;
