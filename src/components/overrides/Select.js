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
            let lastInputIndex = null, myIndex = null;
            console.log(this);
            for (let xIndex in this.parent.components) {
                if (inputTypes.includes(this.parent.components[xIndex].type)) lastInputIndex = xIndex;
                if (myId == this.parent.components[xIndex].id) myIndex = xIndex;
            }
            if (myIndex == (this.parent.components.length - 1) || myIndex == lastInputIndex) {
                this.emit('nextButton', { data: this.data });
            }
        });
    }
}