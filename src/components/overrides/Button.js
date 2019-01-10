import BaseComponent from 'formiojs/components/base/Base';

export default class CustomButtonComponent extends BaseComponent {
    static schema(...extend) {
        return BaseComponent.schema({
            type: 'button',
            label: 'Submit',
            key: 'submit',
            size: 'md',
            leftIcon: '',
            rightIcon: '',
            block: false,
            action: 'submit',
            persistent: false,
            disableOnInvalid: false,
            theme: 'default',
            dataGridLabel: true
        }, ...extend);
    }

    static get builderInfo() {
        return {
            title: 'Button',
            group: 'basic',
            icon: 'fa fa-stop',
            weight: 110,
            schema: CustomButtonComponent.schema()
        };
    }

    get defaultSchema() {
        return CustomButtonComponent.schema();
    }

    createLabel() {}

    createInput(container) {
        this.buttonElement = super.createInput(container);
        return this.buttonElement;
    }

    elementInfo() {
        const info = super.elementInfo();
        info.type = 'button';
        info.attr.type = (['submit', 'saveState'].includes(this.component.action)) ? 'submit' : 'button';
        this.component.theme = this.component.theme || 'default';
        info.attr.class = `btn btn-${this.component.theme}`;
        if (this.component.size) {
            info.attr.class += ` btn-${this.component.size}`;
        }
        if (this.component.block) {
            info.attr.class += ' btn-block';
        }
        if (this.component.customClass) {
            info.attr.class += ` ${this.component.customClass}`;
        }
        return info;
    }

    set loading(loading) {
        this.setLoading(this.buttonElement, loading);
    }

    build() {
        if (this.viewOnly || this.options.hideButtons) {
            this.component.hidden = true;
        }

        this.hasError = false;
        this.createElement();
        this.createInput(this.element);
        this.addShortcut(this.buttonElement);

        if (this.component.leftIcon) {
            this.buttonElement.appendChild(this.ce('span', {
                class: this.component.leftIcon
            }));
            this.buttonElement.appendChild(this.text(' '));
        }

        if (!this.labelIsHidden()) {
            this.labelElement = this.text(this.addShortcutToLabel());
            this.buttonElement.appendChild(this.labelElement);
            this.createTooltip(this.buttonElement, null, this.iconClass('question-sign'));
        }
        if (this.component.rightIcon) {
            this.buttonElement.appendChild(this.text(' '));
            this.buttonElement.appendChild(this.ce('span', {
                class: this.component.rightIcon
            }));
        }

        let onChange = null;
        let onError = null;
        if (this.component.action === 'submit') {
            const message = this.ce('div');
            this.on('nextButton', () => {
                this.loading = true;
                this.disabled = true;
            }, true);
            this.on('submitDone', () => {
                this.loading = false;
                this.disabled = false;
                this.empty(message);
                this.addClass(this.buttonElement, 'btn-success submit-success');
                this.removeClass(this.buttonElement, 'btn-danger submit-fail');
                this.addClass(message, 'has-success');
                this.removeClass(message, 'has-error');
                this.append(message);
            }, true);
            onChange = (value, isValid) => {
                this.removeClass(this.buttonElement, 'btn-success submit-success');
                this.removeClass(this.buttonElement, 'btn-danger submit-fail');
                if (isValid && this.hasError) {
                    this.hasError = false;
                    this.empty(message);
                    this.removeChild(message);
                    this.removeClass(message, 'has-success');
                    this.removeClass(message, 'has-error');
                }
            };
            onError = () => {
                this.hasError = true;
                this.removeClass(this.buttonElement, 'btn-success submit-success');
                this.addClass(this.buttonElement, 'btn-danger submit-fail');
                this.empty(message);
                this.removeClass(message, 'has-success');
                this.addClass(message, 'has-error');
                this.append(message);
            };
        }

        if (this.component.action === 'url') {
            this.on('requestButton', () => {
                this.loading = true;
                this.disabled = true;
            }, true);
            this.on('requestDone', () => {
                this.loading = false;
                this.disabled = false;
            }, true);
        }

        this.on('change', (value) => {
            this.loading = false;
            const isValid = this.root ? this.root.isValid(value.data, true) : value.isValid;
            this.disabled = this.options.readOnly || (this.component.disableOnInvalid && !isValid);
            if (onChange) {
                onChange(value, isValid);
            }
        }, true);

        this.on('error', () => {
            this.loading = false;
            if (onError) {
                onError();
            }
        }, true);

        this.addEventListener(this.buttonElement, 'click', (event) => {
            if (this.component.action !== 'submit' && this.component.showValidations) {
                this.emit('checkValidity', this.data);
            }
            switch (this.component.action) {
                case 'saveState':
                case 'submit':
                    event.preventDefault();
                    event.stopPropagation();
                    this.setValue(this.component.label);
                    this.emit('nextButton', {
                        data: this.data
                    });
                    break;
                case 'event':
                    this.emit(this.interpolate(this.component.event), this.data);
                    this.events.emit(this.interpolate(this.component.event), this.data);
                    this.emit('customEvent', {
                        type: this.interpolate(this.component.event),
                        component: this.component,
                        data: this.data,
                        event: event
                    });
                    break;
                case 'custom':
                    {
                        // Get the FormioForm at the root of this component's tree
                        const form = this.getRoot();
                        // Get the form's flattened schema components
                        const flattened = flattenComponents(form.component.components, true);
                        // Create object containing the corresponding HTML element components
                        const components = {};
                        _.each(flattened, (component, key) => {
                            const element = form.getComponent(key);
                            if (element) {
                                components[key] = element;
                            }
                        });

                        this.evaluate(this.component.custom, {
                            form,
                            flattened,
                            components
                        });
                        break;
                    }
                case 'url':
                    this.emit('requestButton');
                    this.emit('requestUrl', {
                        url: this.component.url,
                        headers: this.component.headers
                    });
                    break;
                case 'reset':
                    this.emit('resetForm');
                    break;
                case 'delete':
                    this.emit('deleteSubmission');
                    break;
                case 'oauth':
                    if (this.root === this) {
                        console.warn('You must add the OAuth button to a form for it to function properly');
                        return;
                    }

                    // Display Alert if OAuth config is missing
                    if (!this.component.oauth) {
                        this.root.setAlert('danger', 'You must assign this button to an OAuth action before it will work.');
                        break;
                    }

                    // Display Alert if oAuth has an error is missing
                    if (this.component.oauth.error) {
                        this.root.setAlert('danger', `The Following Error Has Occured${this.component.oauth.error}`);
                        break;
                    }

                    this.openOauth(this.component.oauth);

                    break;
            }
        });

        if (this.shouldDisable) {
            this.disabled = true;
        }

        function getUrlParameter(name) {
            name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
            const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
            const results = regex.exec(location.search);
            if (!results) {
                return results;
            }
            return decodeURIComponent(results[1].replace(/\+/g, ' '));
        }

        // If this is an OpenID Provider initiated login, perform the click event immediately
        if ((this.component.action === 'oauth') && this.component.oauth && this.component.oauth.authURI) {
            const iss = getUrlParameter('iss');
            if (iss && (this.component.oauth.authURI.indexOf(iss) === 0)) {
                this.openOauth();
            }
        }

        this.autofocus();
        this.attachLogic();
    }

    addInputSubmitListener(input) {
        if (!this.options.submitOnEnter) {
            return;
        }
        this.addEventListener(input, 'keypress', (event) => {
            const key = event.keyCode || event.which;
            if (key === 13) {
                event.preventDefault();
                event.stopPropagation();
                this.emit('nextButton', {
                    data: this.data
                });
            }
        });
    }

    setValue(value, flags) {
        flags = this.getFlags.apply(this, arguments);
        super.dataValue = value;
        return this.updateValue(flags);
    }

    getValue() {
        return this.dataValue;
    }
}