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
     *   targetId: 1
     * }
     * @param config
     */
    constructor(config)
    {
        this.config = config;
        this.createEmbedElement();
        this.form = new Form(this.config);
    }

    /**
     * Create the embed element where we will inject our Formio instance
     */
    createEmbedElement()
    {
        let scripts = document.getElementsByTagName('script');
        let currentScriptElement = scripts[scripts.length - 1];
        let scriptElement = currentScriptElement.previousElementSibling;
        this.endpointBase = this.url || this.getScriptSource(scriptElement);
        let element = document.createElement('div');
        element.id = 'studio';
        this.addSpinner(element);
        currentScriptElement.parentNode.insertBefore(element, currentScriptElement.nextSibling);
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