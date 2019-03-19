import Prep from './Prep';
import Embed from './Embed';
import Builder from './Builder';

const prep = () => new Prep();
prep();

const embed = (options) => new Embed(options);
const builder = (payload) => new Builder(payload);

export { prep, embed, builder }
