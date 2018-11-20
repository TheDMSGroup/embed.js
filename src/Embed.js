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
        this.config = config;
        this.createEmbedElement().then((element) => {
            this.addSpinner(element);
            new Form(this.config)
        });
    }

    /**
     * Create the embed element where we will inject our Formio instance
     */
    createEmbedElement()
    {
        return new Promise((resolve) => {
            this.getCurrentScript().then((script) => {
                this.endpointBase = this.url || this.getScriptSource(script.previousElementSibling);
                let element = document.createElement('div');
                element.id = 'studio';
                script.parentNode.insertBefore(element, script.nextSibling);
                resolve(element);
            });
        });
    }

    getCurrentScript()
    {
        return new Promise((resolve) => {
            if (document.currentScript) {
                resolve(document.currentScript);
            }
            let scripts = document.getElementsByTagName('script');
            // Provide a fallback if our script was loaded asynchronously
            for (let key in scripts) {
                scripts[key].src && scripts[key].src.includes('/forms/dist/v2.js') && resolve(scripts[key]);
            }
            // Final fallback
            resolve(scripts[scripts.length - 1]);
        });
    }

    addSpinner(element)
    {
        element.className += 'loader';
    }

    getScriptSource(script)
    {
        return new URL(script.src).origin;
    }

    get url()
    {
        return this.config.url;
    }

    set endpointBase(url)
    {
        this.config.url = url;
    }

}
export default Embed;