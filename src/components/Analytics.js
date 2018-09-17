export default class Analytics
{
    /**
     * Current Page
     * @type {number}
     */
    page = 0;

    /**
     * Total pages
     * @type {number}
     */
    totalPages = 0;

    constructor(form)
    {
        this.page = form.page;
        this.totalPages = form.pages.length;
    }

    /**
     * The event that gets fired on form progression.
     * @param payload
     * @returns {Object}
     */
    setPageProgressionEvent(payload)
    {
        const event =  {
            eventType: 'page_progression',
            eventLabel: 'P' + this.pad(this.page, 2),
            eventAction: 'P: ' + this.pad(this.page, 2) + '; T: ' + this.pad(this.totalPages, 2) + ';',
            eventCompleted: false
        };

        return Object.assign(payload, event);
    }

    setFormCompletionEvent(payload)
    {
        const event = {
            eventType: 'form_completed',
            eventLabel: 'P' + this.pad(this.page, 2),
            eventAction: 'P: ' + this.pad(this.page, 2) + '; T: ' + this.pad(this.totalPages, 2) + ';',
            eventCompleted: true
        };

        return Object.assign(payload, event);
    }

    /**
     * Function that allows to output integers with leading zeros in
     * JavaScript.
     * @param num
     * @param size
     * @returns {string}
     */
    pad(num, size) {
        let s = num + '';
        while (s.length < size) {
            s = '0' + s;
        }
        return s;
    }
}