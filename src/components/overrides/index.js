import AllComponents from 'formiojs/components';
import Components from 'formiojs/components/Components';

import CustomButtonComponent from "./Button";
import CustomCheckboxComponent from './Checkbox';
import SubmitSelectComponent from './Select';

const init = () => {
    AllComponents.button = CustomButtonComponent;
    AllComponents.checkbox = CustomCheckboxComponent;
    AllComponents.select = SubmitSelectComponent;
    Components.setComponents(AllComponents);
};

export default {
    init: init
}