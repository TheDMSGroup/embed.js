import AllComponents from 'formiojs/components';
import Components from 'formiojs/components/Components';

import Button from "./Button";

import CustomCheckboxComponent from './Checkbox';
import SubmitSelectComponent from './Select';

const init = () => {
    new Button(AllComponents.button);
    AllComponents.checkbox = CustomCheckboxComponent;
    AllComponents.select = SubmitSelectComponent;
    Components.setComponents(AllComponents);
};

export default {
    init: init
}