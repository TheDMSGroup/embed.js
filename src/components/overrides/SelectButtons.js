import NestedComponent from 'formiojs/components/nested/NestedComponent';

export default class GroupComponent extends NestedComponent {
    static schema(...extend) {
        return NestedComponent.schema({
            label: 'Select Buttons',
            key: 'selectbuttons',
            type: 'selectbuttons',
            legend: '',
            components: [],
            input: false,
            persistent: false
        }, ...extend);
    }

    static get builderInfo() {
        return {
            title: 'Select Buttons',
            icon: 'fa fa-th-large',
            group: 'layout',
            documentation: 'http://help.form.io/userguide/#fieldset',
            weight: 20,
            schema: GroupComponent.schema()
        };
    }

    get defaultSchema() {
        return GroupComponent.schema();
    }

    getContainer() {
        return this.body;
    }

    get className() {
        return `form-group ${super.className}`;
    }

    build(state) {
        this.element = this.ce('fieldset', {
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

        console.log(this.component);

        if (this.component.hasOwnProperty('data') && this.component.data.hasOwnProperty('values')) {
            for (let itemIndex in this.component.data.values) {
                this.addComponent({
                    'label': this.component.data.values[itemIndex]['label'],
                    'value': this.component.data.values[itemIndex]['value'],
                    'type': 'button',
                    'customClass': this.component.customClasses,
                    //'customClass': 'btn btn-sm btn-info btn-margin-right',
                    'name': 'button[]',
                    'key': this.component.key,
                    'input': true,
                }, this.element, null, null, false, state);
            }
        }

        /*this.addComponent({
            label: "Test 1",
            type: 'textfield',
            key: 'lastName',
            input: true
        }, this.element, null, null, false, state);

        this.addComponent({
            label: "Test 2",
            type: 'textfield',
            key: 'lastName',
            input: true
        }, this.element, null, null, false, state);*/

        this.element.appendChild(this.body);

        this.setCollapsed();
        this.attachLogic();
    }
}
