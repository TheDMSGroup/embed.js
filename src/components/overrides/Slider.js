import BaseComponent from 'formiojs/components/base/Base';
import isNumber from 'lodash/isNumber';

export default class SliderComponent extends BaseComponent {
    static schema(...extend) {
        return BaseComponent.schema({
          label: 'Slider',
          key: 'slider',
          type: 'slider',
          inputType: 'range',
          sliderType: 'currency',
          min: 10,
          max: 20,
          step: 1
        }, ...extend);
      }

      static get builderInfo() {
        return {
          title: 'Slider',
          icon: 'fa fa-ellipsis-h',
          group: 'basic',
          weight: 0,
          schema: SliderComponent.schema()
        };
      }

    get defaultSchema() {
        return SliderComponent.schema();
    }

    elementInfo() {
        const info = super.elementInfo();
        info.type = 'input';
        info.attr.class = 'custom-range';
        info.attr.min = this.component.min;
        info.attr.max = this.component.max;
        info.attr.step = this.component.step;
        info.attr.value = (Number(this.defaultValue) || Number(this.defaultValue) === 0) ? Number(this.defaultValue) : (Number(this.component.max) + Number(this.component.min)) / 2;
        return info;
    }

    get emptyValue() {
        return '';
    }

    createInput(container) {
        this.sliderElement = super.createInput(container);
        return this.sliderElement;
    }

    createLabel(container) {
        const isLabelHidden = this.labelIsHidden();
        let className = 'control-label';
        let style = '';
        if (isLabelHidden) {
            this.addClass(container, 'formio-component-label-hidden');
            className += ' control-label--hidden';
        }
    
        if (this.hasInput && this.component.validate && this.component.validate.required) {
        className += ' field-required';
        }

        this.labelElement = this.ce('label', { class: className, style });

        if (!isLabelHidden) {
            if (this.info.attr.id) {
                this.labelElement.setAttribute('for', this.info.attr.id);
            }
            this.labelElement.appendChild(this.text(this.component.label));
            this.createTooltip(this.labelElement);
        }
        container.appendChild(this.labelElement);
    }

    build() {
        this.hasError = false;
        this.createElement();
        let output = this.ce('div', { class: 'slider-output display-4 text-center' });
        let labelContainer = this.ce('div', { class: 'mb-4' })
        let minLabel = this.ce('div', { class: 'float-left' });
        let maxLabel = this.ce('div', { class: 'float-right' });
        this.createLabel(this.element);
        this.element.appendChild(output);
        this.createInput(this.element);

        maxLabel.innerHTML = this.determineFormat(this.component.max);
        minLabel.innerHTML = this.determineFormat(this.component.min);
        labelContainer.appendChild(minLabel);
        labelContainer.appendChild(maxLabel);

        this.element.appendChild(labelContainer);

        output.innerHTML = this.getOutputText();

        this.sliderElement.oninput = () => {
            output.innerHTML = this.getOutputText();
        };

    }

    getOutputText() {

        if (Number(this.dataValue) !== Number(this.sliderElement.value)) {
            this.sliderElement.value = this.dataValue;
        }

        if (Number(this.sliderElement.value) === 0) {
            return `${this.determineFormat(this.sliderElement.value)}`;
        } else {
            return `${this.determineFormat(this.sliderElement.value - this.component.step)} - ${this.determineFormat(this.sliderElement.value)}`;
        }
    }

    determineFormat(value) {

        switch (this.component.sliderType) {
            case 'number': 
                return Number(value).toLocaleString('en-US');
            case 'currency':
                return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD' }).split('.')[0];
            case 'percent':
                return Number(value).toLocaleString("en-US", { style: 'decimal', minimumFractionDigits: 2 }) + '%';
        }

    }
}