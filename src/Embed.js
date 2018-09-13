import Form from "./Form";

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
        let element = document.createElement('div');
        element.id = 'studio';
        scriptElement.parentNode.insertBefore(element, scriptElement.nextSibling);

    }
}
export default Embed;