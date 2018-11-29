import SelectComponent from 'formiojs/components/checkbox/Checkbox';

export default class CustomCheckboxComponent extends SelectComponent {

    /**
     * Override the native createLabel method in the checkBox component to allow HTML to be rendered in the checkbox label.
     */
    createLabel(container, input)
    {
            const isLabelHidden = this.labelIsHidden();
            let className = 'control-label form-check-label';
            if (this.component.input
                && !this.options.inputsOnly
                && this.component.validate
                && this.component.validate.required) {
                className += ' field-required';
            }

            this.labelElement = this.ce('label', {
                class: className
            });
            this.addShortcut();

            const labelOnTheTopOrOnTheLeft = this.labelOnTheTopOrLeft();
            if (!isLabelHidden) {
                // Create the SPAN around the textNode for better style hooks
                this.labelSpan = this.ce('span');

                if (this.info.attr.id) {
                    this.labelElement.setAttribute('for', this.info.attr.id);
                }
            }
            if (!isLabelHidden && labelOnTheTopOrOnTheLeft) {
                this.setInputLabelStyle(this.labelElement);
                this.setInputStyle(input);
                this.labelSpan.innerHTML = this.component.label;
                this.labelElement.appendChild(this.labelSpan);
            }
            this.addInput(input, this.labelElement);
            if (!isLabelHidden && !labelOnTheTopOrOnTheLeft) {
                this.setInputLabelStyle(this.labelElement);
                this.setInputStyle(input);
                this.labelSpan.innerHTML = this.addShortcutToLabel();
                this.labelElement.appendChild(this.labelSpan);
            }
            this.createTooltip(this.labelElement);
            container.appendChild(this.labelElement);
        };
    }

}