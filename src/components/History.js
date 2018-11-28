import { createBrowserHistory } from 'history';
import store from 'store2';

/**
 * Handle browser history navigation
 */
export default class History {

    /**
     * History class constructor
     * @param {object} form 
     */
    constructor(form)
    {
        this.form = form;
        this.store = store.namespace('crm');
        this.instance = createBrowserHistory();
    }

    /**
     * Get the last page that was set to localStorage
     */
    get storeLastPage()
    {
        return this.store.get('form_session').page || 0;
    }

    /**
     * Natural pages start at 1 instead of 0
     */
    get storeNaturalLastPage() 
    {
        return this.storeLastPage + 1;
    }

    /**
     * Get the current page of the form
     */
    get currentPage()
    {
        return this.form.page;
    }

    /**
     * Natural pages start at 1 instead of 0
     */
    get currentNaturalPage()
    {
        return this.currentPage + 1;
    }

    /**
     * Get the page number from the history URL hash
     */
    get currentHashedPage() 
    {
        return parseInt(location.hash.slice(5, location.hash.length));
    }

    /**
     * Get the next page of the form
     */
    get nextPage()
    {
        return this.form.getNextPage(false, this.currentPage);
    }
    
    /**
     * Get the data from the formio data object
     */
    get formData()
    {
        return this.form.data;
    }

    /**
     * Get the data that was set to localStorage
     */
    get storeFormData()
    {
        return this.store.get('form_session').data || {};
    }

    /**
     * Get the last page that was set to localStorage
     */
    set storagePage(page)
    {
        this.store.set('form_session', { page: page, data: this.formData })
    }

    
    /**
     * Determines the hash that the page is supposed to have on initial form initialization.
     */
    initialize()
    {
        if (!this.storeFormData) {
            this.updateState();
        }
        
        if (this.currentHashedPage <= this.storeNaturalLastPage) {
            this.instance.push({ 
                hash: 'page' + this.storeNaturalLastPage,
                search: location.search
            });
            this.form.customCurrentPage = this.storeLastPage;
            this.form.setPage(this.storeLastPage);
        } else if (this.currentHashedPage !== this.currentPage) {
            this.instance.push({ 
                hash: 'page' + this.currentNaturalPage,
                search: location.search
            });
            this.form.customCurrentPage = this.currentPage;
        }
        Object.assign(this.formData, this.storeFormData);
        this.form.render();

        this.listen();
    }
    
    pageProgression()
    {
        this.instance.push({ hash: 'page' + this.nextPage });

        return this;
    }

    listen()
    {
        this.instance.listen(() => {
            let currentPage = 0;
            if (this.currentNaturalPage > this.currentHashedPage) {
                currentPage = this.currentPage - 1;
            } else {
                currentPage = this.currentPage + 1;
            }
            
            this.form.setPage(currentPage);
            this.storagePage = currentPage;
            this.form.customCurrentPage = this.currentPage;
        });
    }

    updateState()
    {        
        this.store.set('form_session', { page: this.currentPage, data: this.form.data });
    }
    
}