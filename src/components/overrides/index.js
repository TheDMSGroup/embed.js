import AllComponents from 'formiojs/components';
import Components from 'formiojs/components/Components';

import Checkbox from './Checkbox';
import Button from "./Button";

const init = () => {
    new Checkbox(AllComponents.checkbox);
    new Button(AllComponents.button);
    Components.setComponents(AllComponents);
};

export default {
    init: init
}