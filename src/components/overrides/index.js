import AllComponents from 'formiojs/components';
import Components from 'formiojs/components/Components';

import Checkbox from './Checkbox';
import Button from "./Button";

import SubmitSelectComponent from './Select';

const init = () => {
    new Checkbox(AllComponents.checkbox);
    new Button(AllComponents.button);
    AllComponents.select = SubmitSelectComponent;
    Components.setComponents(AllComponents);
};

export default {
    init: init
}