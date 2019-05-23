import { clearInstance } from './OstWalletSdkCallbackManager';
import OstDeviceRegistered from '../interacts/OstDeviceRegistered';
import OstPinAccept from '../interacts/OstPinAccept';
import OstVerifyData from '../interacts/OstVerifyData';


class OstWalletWorkFlowCallbackIntercepts {
   
    registerDevice( instance, method, data, interactuuid ) {
        let interactInstance = new OstDeviceRegistered(instance.uuid, interactuuid),
            args = [data, interactInstance];
        method.apply(instance, args); 
    }

    getPin( instance, method, data, interactuuid ) {
        let interactInstance = new OstPinAccept(instance.uuid, interactuuid),
            args = [data, interactInstance];
            method.apply(instance, args);
    }

    invalidPin( instance, method, data, interactuuid ) {
        let interactInstance = new OstPinAccept(instance.uuid, interactuuid),
            args = [data, interactInstance]
            ;
            method.apply(instance, args);
    }

    verifyData( instance, method, data , interactuuid ) {
        let interactInstance = new OstVerifyData(instance.uuid, interactuuid),
            args = [data, interactInstance];
        method.apply(instance, args);
    }

    pinValidated( instance, method, data , interactuuid ) {
        let args = [data];
        method.apply(instance, args);
    }

    requestAcknowledged( instance, method, data , interactuuid ) {
        let  args = [data];
        method.apply(instance, args);
    }

    flowComplete( instance, method, data , interactuuid ) {
        let args = [data];
        clearInstance(instance.uuid);
        method.apply(instance, args);
    }

    flowInterrupt( instance, method, data , interactuuid ) {
        let args = [data];
        clearInstance(instance.uuid);
        method.apply(instance, args);
    }
}

export default new OstWalletWorkFlowCallbackIntercepts();
