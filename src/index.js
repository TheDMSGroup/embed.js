import Embed from './Embed';
import Builder from './Builder';

const embed = (options) => new Embed(options);
const builder = (payload) => new Builder(payload);

export { embed, builder }
