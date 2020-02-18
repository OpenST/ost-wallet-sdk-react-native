class Pagination {
   
    /**
     * @param {*} modelFetch 
     * @param {*} callbacks 
     * NOTE params were added later m ideally it should be second parameter to the constructor
     * but can risk it now to change the signature everywhere
     */
    constructor(modelFetch, callbacks) {
      this.modelFetch = modelFetch ; 
      this.callbacks =  callbacks || {};
      this.refreshing =  false ; 
      this.loadingNext =  false ; 
    }

    initPagination() {
      this.refresh(this.modelFetch);
    }

    refresh(modelFetch) {
      if (this.refreshing) return;
      if (modelFetch) {
        this.modelFetch = modelFetch;
      } else {
        this.modelFetch = this.modelFetch && this.modelFetch.clone();
      }
      if(!this.modelFetch) return;
      this.beforeRefresh();
      this.modelFetch
        .refresh()
        .then((res) => {
          this.onRefresh(res);
        })
        .catch((error) => {
          this.onRefreshError(error);
        });
    };

    beforeRefresh() {
      this.refreshing = true ;  
      this.callbacks.beforeRefresh && this.callbacks.beforeRefresh();
    }

    onRefresh(res) {
      this.refreshing = false ; 
      this.callbacks.onRefresh && this.callbacks.onRefresh( res );
    }

    onRefreshError(error) {
      this.refreshing = false ; 
      this.callbacks.onRefreshError && this.callbacks.onRefreshError(error);
    }

    /**
     * getNext monitors for 4 different checkpoints
     * 1. It wont call next page if allready fetching data of previous page
     * 2. Wont next page when pull to refresh is done
     * 3. Will stop pagination if next page payload is not present
     */
    getNext(){
      if (
        this.loadingNext ||
        this.refreshing ||
        !this.modelFetch.hasNextPage 
      )
        return;
      this.beforeNext();
      this.modelFetch
        .fetch()
        .then((res) => {
          this.onNext(res);
        })
        .catch((error) => {
          this.onNextError(error);
        });
    };

    beforeNext() {
      this.loadingNext =  true ;  
      this.callbacks.beforeNext && this.callbacks.beforeNext();
    }

    onNext(res) {
        this.loadingNext =  false ; 
        this.callbacks.onNext && this.callbacks.onNext( res );
    }

    onNextError(error) {
      this.loadingNext =  false ;  
      this.callbacks.onNextError && this.callbacks.onNextError(error);
    }

    getResults(){
      return this.modelFetch.getAllResults();
    }

  };


export default Pagination ;