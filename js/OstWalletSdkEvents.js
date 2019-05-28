import { callbackInvoker } from './callbackHandlers/OstWalletSdkCallbackManager';
import OstUnifiedEmiter from './OstUnifiedEmiter';

let eventSubscription = null;
let isEventSubscribed = false;

const ostWalletSdkEvents = {

    /**
     * Subscribe event
     * function to call on component mount 
     * @public:
     */

    subscribeEvent() {
        if ( isEventSubscribed ) {
          return;
        }
        eventSubscription = OstUnifiedEmiter.addListener('onOstWalletSdkEvents', function(e) {
            callbackInvoker(e);
        });
        isEventSubscribed = true;
    },

     /**
      * Unsubscribe event
      * function to call on component un-mount 
      */
    unsubscribeEvent() {
      eventSubscription && eventSubscription.remove();
      isEventSubscribed = false;
    }

};

export default ostWalletSdkEvents;
