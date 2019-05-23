import { callbackInvoker } from './callbackHandlers/OstWalletSdkCallbackManager';
import OstUnifiedEmiter from './OstUnifiedEmiter';

let eventSubscription = null;
let isEventSubscribed = false;
let cnt = 0;
const ostWalletSdkEvents = {
    subscribeEvent() {
        if ( isEventSubscribed ) {
          console.log("NOT calling OstUnifiedEmiter.addListener. all good");
          console.trace();
          return;
        }
        console.log("calling OstUnifiedEmiter.addListener: ", cnt++);
        console.trace();
        eventSubscription = OstUnifiedEmiter.addListener('onOstWalletSdkEvents', function(e) {
            callbackInvoker(e);
        });
        isEventSubscribed = true;
    },

    unsubscribeEvent() {
      console.log("calling unsubscribeEvent");
      eventSubscription && eventSubscription.remove();
      isEventSubscribed = false;
    }
};

export default ostWalletSdkEvents;
