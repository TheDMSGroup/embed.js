export default class Analytics
{
    /**
     * Append the event data into the lead data object on page progression
     * @returns {Object & {eventType: string, eventLabel: string, eventAction: string, eventCompleted: boolean}}
     */
    pageProgressionEvent(form)
    {
        const event = {
            eventType: 'page_progression',
            eventLabel: 'P' + this.pad(form.customCurrentPage, 2),
            eventAction: 'P: ' + this.pad(form.customCurrentPage, 2) + '; T: ' + this.pad(form.pages.length, 2) + ';',
            eventCompleted: false
        };

        form.data = { ...form.data, ...event };
    }

    /**
     * Append the event data into the lead data object on form completion
     * @returns {Object & {eventType: string, eventLabel: string, eventAction: string, eventCompleted: boolean}}
     */
    formCompletionEvent(form)
    {
        const event = {
            eventType: 'form_completed',
            eventLabel: 'P' + this.pad(form.customCurrentPage, 2),
            eventAction: 'P: ' + this.pad(form.customCurrentPage, 2) + '; T: ' + this.pad(form.pages.length, 2) + ';',
            eventCompleted: true
        };
        form.data = { ...form.data, ...event };
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
    trackerData() {
            let result = {},
            keys = [
                'adSenseId', 'clientId', 'clientIdTime',
                'location', 'name', 'screenColors',
                'screenResolution', 'trackingId', 'userId',
                'viewportSize'
            ];

            ga(() => {
                let trackers = window.ga.getAll();
                for (let t in trackers) {
                    result[t] = {};
                    if (
                        trackers.hasOwnProperty(t) &&
                        typeof trackers[t] === 'object' &&
                        typeof trackers[t].get === 'function'
                    ) {
                        for (let k in keys) {
                            result[t][keys[k]] = trackers[t].get(keys[k]);                
                        }
                    }
                }
            });

        return result;
    }
}