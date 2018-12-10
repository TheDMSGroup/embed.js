import Embed from './Embed';
import Builder from './Builder';

const embed = (options) => new Embed(options);
const builder = (formId) => new Builder(formId);

export { embed, builder }