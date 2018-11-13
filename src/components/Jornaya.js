import getScript from 'get-js';
import forEach from 'lodash/foreach';

class Jornaya
{
    constructor(form)
    {
        this.data = form.data;
        if (form.hasOwnProperty('schema') && form.schema.hasOwnProperty('lidstatic_script')) {
            this.jornayaScript = form.schema.lidstatic_script;
        }
    }

    set jornayaScript(scriptUrl)
    {
        getScript(scriptUrl).then(() => this.jornayaToken = window.LeadiD.token);
    }

    set jornayaToken(token)
    {
        if (token !== 'undefined') {
            this.data['jornaya_leadid'] = token;
        }
    }

    attachJornayaIdToTCPA()
    {
        let allFields = document.getElementsByTagName('input');
        forEach(allFields, (field) => {
           if (field.type === 'checkbox' && field.name.includes('phone')) {
               field.id = 'leadid_tcpa_disclosure';
           }
        });
    }
}
export default Jornaya;