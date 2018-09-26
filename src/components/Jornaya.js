import getScript from 'get-js';

class Jornaya
{
    constructor(form)
    {
        this.data = form.data;
        if (form.wizard.lidstatic_script) {
            this.jornayaScript = form.wizard.lidstatic_script;
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
}
export default Jornaya;