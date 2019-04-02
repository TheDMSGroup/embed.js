import AllComponents from 'formiojs/components';
import Components from 'formiojs/components/Components';

import CustomButtonComponent from "./Button";
import ButtonForm from 'formiojs/components/button/Button.form';
import SliderForm from './Slider.form';
import SelectForm from 'formiojs/components/select/Select.form';
import CustomCheckboxComponent from './Checkbox';
import SubmitSelectComponent from './Select';
import CustomSliderComponent from './Slider';
import CustomCarModelComponent from './CarModel';
import CustomCarMakeComponent from './CarMake';
import CustomCarYearComponent from './CarYear';

const init = () => {
    AllComponents.button = CustomButtonComponent;
    AllComponents.button.editForm = ButtonForm;
    AllComponents.checkbox = CustomCheckboxComponent;
    AllComponents.select = SubmitSelectComponent;
    AllComponents.select.editForm = SelectForm;
    AllComponents.slider = CustomSliderComponent;
    AllComponents.slider.editForm = SliderForm;
    AllComponents.carModel = CustomCarModelComponent;
    AllComponents.carModel.editForm = SelectForm;
    AllComponents.carMake = CustomCarMakeComponent;
    AllComponents.carMake.editForm = SelectForm;
    AllComponents.carYear = CustomCarYearComponent;
    AllComponents.carYear.editForm = SelectForm;
    
    Components.setComponents(AllComponents);
};

export default {
    init: init
}