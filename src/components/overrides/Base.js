import BaseComponent from 'formiojs/components/base/Base';

export default class CustomBaseComponent extends BaseComponent {

    addInputSubmitListener(input)
    {
        if (!this.options.submitOnEnter) {
            return;
        }
        this.addEventListener(input, 'keypress', (event) => {
            const key = event.keyCode || event.which;
            if (key === 13) {
                event.preventDefault();
                event.stopPropagation();
                this.emit('nextButton', { data: this.data });
            }
        });
    }
}
