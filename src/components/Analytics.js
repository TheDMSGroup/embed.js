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

    /**
     * This object holds all the lead data that gets
     * submitted to the studio API.
     * @type {Object}
     */
    leadData = {};

    constructor(form)
    {
        this.page = form.page;
        this.totalPages = form.pages.length;
        this.leadData = form.data;
    }

    /**
     * Append the event data into the lead data object on page progression
     * @returns {Object & {eventType: string, eventLabel: string, eventAction: string, eventCompleted: boolean}}
     */
    pageProgressionEvent()
    {
        const event =  {
            eventType: 'page_progression',
            eventLabel: 'P' + this.pad(this.page, 2),
            eventAction: 'P: ' + this.pad(this.page, 2) + '; T: ' + this.pad(this.totalPages, 2) + ';',
            eventCompleted: false
        };

        return Object.assign(this.leadData, event);
    }

    /**
     * Append the event data into the lead data object on form completion
     * @returns {Object & {eventType: string, eventLabel: string, eventAction: string, eventCompleted: boolean}}
     */
    formCompletionEvent()
    {
        const event = {
            eventType: 'form_completed',
            eventLabel: 'P' + this.pad(this.page, 2),
            eventAction: 'P: ' + this.pad(this.page, 2) + '; T: ' + this.pad(this.totalPages, 2) + ';',
            eventCompleted: true
        };

        return Object.assign(this.leadData, event);
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