import BaseComponent from 'formiojs/components/base/Base';

export default class SliderComponent extends BaseComponent {
    static schema(...extend) {
        return BaseComponent.schema({
          label: 'Slider',
          key: 'slider',
          type: 'slider',
          inputType: 'range',
        }, ...extend);
      }

      static get builderInfo() {
        return {
          title: 'Slider',
          icon: 'fa fa-sliders',
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
        
        return info;
    }

    get emptyValue() {
        return '';
    }

    createInput(container) {
        const inputGroup = super.createInput(container);
        return inputGroup;
    }
}