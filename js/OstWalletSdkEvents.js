/*
 Copyright © 2019 OST.com Inc
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 */
 
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
