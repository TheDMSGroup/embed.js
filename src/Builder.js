import Component from './components'
import FormBuilder from 'formiojs/FormBuilder';
import Dictionary from './components/Dictionary';
import Formio from 'formiojs/Formio';

export default class Builder {
    constructor(form = {}) {
        this.json = form;
        Component.override.init();
        this.dictionary = new Dictionary();
        this.createEmbedElement().then(element => this.render(element))
    }

    render(element) {
        this.dictionary.get().then(dictionary => {
            Formio.icons = 'fontawesone';
            this.builder = new FormBuilder(element, this.json, dictionary);
            this.builder.render().then(builder => {
                this.hideFormBuilderComponents();
                this.createSearchBox();
            })
        });
    }

    createEmbedElement()
    {
        return new Promise((resolve) => {
            resolve(document.currentScript.parentNode
                .insertBefore(document.createElement('div'), document.currentScript.nextSibling)
            );
        });
    }

    filterComponents(searchText) {
        this.showFormBuilderComponents(this.formBuilderComponents
            .filter(attribute => attribute.key.includes(searchText))
        );
    }

    hideFormBuilderComponents() {
        for (let formBuilderComponent in this.formBuilderComponents) {
            if (this.formBuilderComponents.hasOwnProperty(formBuilderComponent)) {
                this.formBuilderComponents[formBuilderComponent].element.style.display = 'none';
            }
        }
    }

    showFormBuilderComponents(formBuilderComponents) {
        this.hideFormBuilderComponents();
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
        search.className = 'form-control';
        search.placeholder = 'Search...';
        questions.prepend(search);
        search.oninput = (element) => this.filterComponents(element.target.value);
    }

    get formBuilderComponents() {
        return this.components.questions.components;
    }

    get components() {
        return this.builder.instance.groups;
    }

    get json() {
        this.form.display = 'wizard';
        return this.form;
    }

    set json(form) {
        this.form = form;
    }
}