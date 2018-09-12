import Form from "./Form";

class Embed
{
    form = {};

    /**
     * Config example
     * {
     *   account: 'DMS',
     *   targetId: 1
     * }
     * @param config
     */
    constructor(config)
    {
        this.form = new Form(config);
    }

    // embed(config)
    // {
    //     console.log(config);
    //     this.form = new Form(config.targetId);
    // }
}
export default Embed;