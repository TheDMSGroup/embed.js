import AllComponents from 'formiojs/components';
import Components from 'formiojs/components/Components';

import CustomButtonComponent from "./Button";
import ButtonForm from 'formiojs/components/button/Button.form';
import SliderForm from './Slider.form';
import CustomCheckboxComponent from './Checkbox';
import SubmitSelectComponent from './Select';
import CustomSliderComponent from './Slider';

const init = () => {
    AllComponents.button = CustomButtonComponent;
    AllComponents.button.editForm = ButtonForm;
    AllComponents.checkbox = CustomCheckboxComponent;
    AllComponents.select = SubmitSelectComponent;
    AllComponents.slider = CustomSliderComponent;
    AllComponents.slider.editForm = SliderForm;
    Components.setComponents(AllComponents);
};

export default {
    init: init
}