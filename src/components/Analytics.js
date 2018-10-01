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

    /**
     * Get the Google Analytics tracker data if available,
     * given keys that we wish to populate offline.
     *
     * Supports unlimited trackers on the same page.
     *
     * @returns {{trackingId, userId, clientId...}}
     */
    get trackerData() {
        let result = {},
        keys = [
            'adSenseId', 'clientId', 'clientIdTime',
            'location', 'name', 'screenColors',
            'screenResolution', 'trackingId', 'userId',
            'viewportSize'
        ];

        if (typeof window.ga === 'function' &&
            typeof window.ga.getAll === 'function') {
            let trackers = window.ga.getAll();
            for (let t in trackers) {
                if (
                    trackers.hasOwnProperty(t) &&
                    typeof trackers[t] === 'object' &&
                    typeof trackers[t].get === 'function') {
                    result[t] = {};
                    try {
                        for (let k in keys) {
                            if (keys.hasOwnProperty(k)) {
                                // if (k === 'location') {
                                // @todo - append/merge aggregated GET params to ensure realtime accuracy if they do not cause secondary sessions.
                                // }
                                result[t][keys[k]] = trackers[t].get(keys[k]);
                            }
                        }
                    } catch (e) {}
                }
            }
        }
        return result;
    }
}