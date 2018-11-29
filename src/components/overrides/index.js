import AllComponents from 'formiojs/components';
import Components from 'formiojs/components/Components';

import CustomButtonComponent from "./Button";
import CustomCheckboxComponent from './Checkbox';
import SubmitSelectComponent from './Select';
import CustomBaseComponent from "./Base";

const init = () => {

    AllComponents.base = CustomBaseComponent;
    AllComponents.button = CustomButtonComponent;
    AllComponents.checkbox = CustomCheckboxComponent;
    AllComponents.select = SubmitSelectComponent;

    Components.setComponents(AllComponents);

};

export default {
    init: init
}
