import Form from "./Form";
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
        this.form = new Form(config);
        this.createEmbedElement(config.element);
    }

    /**
     * Create the embed element where we will inject our Formio instance
     * @param scriptElement
     */
    createEmbedElement(scriptElement)
    {
        if (typeof scriptElement === 'undefined') {
            let scripts = document.getElementsByTagName('script');
            scriptElement = scripts[scripts.length - 1];
        }

        let element = document.createElement('div');
        element.id = 'studio';
        this.addSpinner(element);
        scriptElement.parentNode.insertBefore(element, scriptElement.nextSibling);
    }

    addSpinner(element)
    {
        element.className += 'loader';
    }
}
export default Embed;