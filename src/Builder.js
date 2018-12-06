import Component from './components'
import FormBuilder from 'formiojs/FormBuilder';
import Dictionary from './components/Dictionary';

export default class Builder {
    constructor() {
        Component.override.init();
        this.dictionary = new Dictionary();
        this.createEmbedElement()
        .then(element => this.render(element))
    }

    get components() {
        return this.builder.instance.groups;
    }

    render(element) {
        this.dictionary.get()
        .then(dictionary => {
            this.builder = new FormBuilder(element, this.getJson(), dictionary);
            this.builder.render().then(builder => {
                this.createSearchBox();
            })
        });

    }

    /**
     * Create the embed element where we will inject our Formio instance
     */
    createEmbedElement()
    {
        return new Promise((resolve) => {
            const script = document.currentScript;
            let element = document.createElement('div');
            element.id = 'studio';
            script.parentNode.insertBefore(element, script.nextSibling);
            resolve(element);
        });
    }

    getJson() {
        return { display: "wizard" };
    }

    /**
     * Find the engage field component in the dom tree and return the result.
     *
     * @param searchText
     * @returns {*}
     */
    findComponent(searchText) {
        let formBuilderComponents = this.getFormBuilderComponents();
        let filteredFormBuilderComponents = formBuilderComponents.filter(attribute => attribute.key.includes(searchText));

        if (searchText.length >= 1) {
            this.hideFormBuilderComponents(formBuilderComponents);
        }

        if (searchText.length === 0) {
            this.showFormBuilderComponents(formBuilderComponents)
        }

        return filteredFormBuilderComponents;
    }

    hideFormBuilderComponents(formBuilderComponents) {
        for (let formBuilderComponent in formBuilderComponents) {
            if (formBuilderComponents.hasOwnProperty(formBuilderComponent)) {
                formBuilderComponents[formBuilderComponent].element.style.display = 'none';
            }
        }
    }

    showFormBuilderComponents(formBuilderComponents) {
        for (let formBuilderComponent in formBuilderComponents) {
            if (formBuilderComponents.hasOwnProperty(formBuilderComponent)) {
                formBuilderComponents[formBuilderComponent].element.style.display = 'block';
            }
        }
    }

    createSearchBox() {
        let questions = this.components.questions.panel.firstChild;
        let search = document.createElement('input');
        search.type = 'text';
        search.id = 'findComponent';
        search.className = 'form-control';
        search.placeholder = 'Search...';
        questions.prepend(search);
        
        // By default hide all the components
        this.hideFormBuilderComponents(this.getFormBuilderComponents());

        search.oninput = (event) => {
            let result = this.findComponent(event.target.value);
            this.showFormBuilderComponents(result);
        };
    }

    /**
     * Return all the Engage components
     */
    getFormBuilderComponents() {
        return this.components.questions.components;
    }
}