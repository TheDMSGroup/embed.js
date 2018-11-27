import SelectComponent from 'formiojs/components/select/Select';

export default class SubmitSelectComponent extends SelectComponent {

    /*
     *   Custom Select Component Submits Page / Next Page if it completes page/form
     */

    addInput(input, container) {
        super.addInput(input, container);
        this.addEventListener(input, 'change', () => {
            const inputTypes = ['checkbox', 'phoneNumber', 'textfield', 'textarea', 'datetime', 'number', 'email', 'select', 'selectboxes', 'signature', 'time', 'file', 'day', 'address', 'password', 'radio', 'currency'];
            const myId = this.id;
            let lastInputIndex = 0, myIndex = 0;
            for (let xIndex in this.root.components) {
                if (inputTypes.includes(this.root.components[xIndex].type)) lastInputIndex = xIndex;
                if (myId == this.root.components[xIndex].id) myIndex = xIndex;
            }
            if (myIndex == (this.root.components.length - 1) || myIndex == lastInputIndex) {
                this.root.nextPage();
            }
        });
    }
}