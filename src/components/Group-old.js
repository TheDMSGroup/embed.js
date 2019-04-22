import NestedComponent from 'formiojs/components/nested/NestedComponent';
import Textfield from 'formiojs/components/textfield/TextField';
import Select from 'formiojs/components/select/Select';
import _ from 'lodash';

export default class FieldsetComponent extends NestedComponent {
    static schema(...extend) {
        return NestedComponent.schema({
            label: 'Field Group',
            key: 'fieldGroup',
            type: 'fieldgroup',
            legend: '',
            components: [],
            persistent: false
        }, ...extend);
    }

    static get builderInfo() {
        return {
            title: 'Field Group',
            icon: 'fa fa-th-large',
            group: 'layout',
            documentation: 'http://help.form.io/userguide/#fieldset',
            weight: 20,
            schema: FieldsetComponent.schema()
        };
    }

    get defaultSchema() {
        return FieldsetComponent.schema();
    }

    getContainer() {
        return this.body;
    }

    get className() {
        return `form-group ${super.className}`;
    }

    build(state) {
        const classNames = {
            Textfield,
            Select
        };

        this.element = this.ce('fieldgroup', {
            id: this.id,
            class: this.className
        });
        if (this.component.legend) {
            const legend = this.ce('legend');
            legend.appendChild(this.text(this.component.legend));
            this.createTooltip(legend);
            this.setCollapseHeader(legend);
            this.element.appendChild(legend);
        }

        this.body = this.ce('div', {
            class: 'card-body'
        });

        this.containers = [];

        console.log(this);

        let classes = ['Textfield', 'Textfield'];
        let that = this;

        _.forEach(classes, function(className) {
            let xCont = that.ce('div');
            that.body.appendChild(xCont);
            that.addComponent(new classNames[className]({
                "label": "Phone",
                "key": "phone",
                "lockKey": true,
                "inputMask": "(999) 999-9999",
                "type": "textfield",
                "validate": {"required": true},
                "input": true
            }), xCont);
        });

        this.addComponents(null, null, null, state);
        this.element.appendChild(this.body);
        this.setCollapsed();
        this.attachLogic();
    }
}
