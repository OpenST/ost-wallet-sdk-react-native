import { clearInstance , instantiateOstError } from './OstWalletSdkCallbackManager';
import OstDeviceRegistered from '../interacts/OstDeviceRegistered';
import OstPinAccept from '../interacts/OstPinAccept';
import OstVerifyData from '../interacts/OstVerifyData';

const ostWorkflowContextKey = "ostWorkflowContext",
      ostContextEntityKey   = "ostContextEntity",
      ostErrorKey   = "ostError",
      userIdKey     = "userId"
;

class OstWalletWorkFlowCallbackIntercepts {
   
    registerDevice( instance, method, data, interactuuid ) {
        let interactInstance = new OstDeviceRegistered(instance.uuid, interactuuid),
            apiParams = data['apiParams'],
            args = [apiParams, interactInstance];
        instance && method.apply(instance, args);
    }

    getPin( instance, method, data, interactuuid ) {
        let interactInstance = new OstPinAccept(instance.uuid, interactuuid),
            ostWorkflowContext = data[ostWorkflowContextKey],
            userId = data[userIdKey],
            args = [ostWorkflowContext, userId , interactInstance];
        instance && method.apply(instance, args);
    }

    invalidPin( instance, method, data, interactuuid ) {
        let interactInstance = new OstPinAccept(instance.uuid, interactuuid),
            ostWorkflowContext = data[ostWorkflowContextKey],
            userId = data[userIdKey],
            args = [ostWorkflowContext, userId , interactInstance];
        instance && method.apply(instance, args);
    }

    verifyData( instance, method, data , interactuuid ) {
        let interactInstance = new OstVerifyData(instance.uuid, interactuuid),
            ostWorkflowContext = data[ostWorkflowContextKey],
            ostContextEntity = data[ostContextEntityKey],
            args = [ostWorkflowContext, ostContextEntity , interactInstance];
        instance && method.apply(instance, args);
    }

    pinValidated( instance, method, data , interactuuid ) {
        let ostWorkflowContext = data[ostWorkflowContextKey],
            userId = data[userIdKey],
            args = [ostWorkflowContext , userId];
        instance && method.apply(instance, args);
    }

    requestAcknowledged( instance, method, data , interactuuid ) {
        let ostWorkflowContext = data[ostWorkflowContextKey],
            ostContextEntity = data[ostContextEntityKey],
            args = [ostWorkflowContext , ostContextEntity];
        instance && method.apply(instance, args);
    }

    flowComplete( instance, method, data , interactuuid ) {
        let ostWorkflowContext = data[ostWorkflowContextKey],
            ostContextEntity = data[ostContextEntityKey],
            args = [ostWorkflowContext , ostContextEntity ];
        clearInstance(instance.uuid);
        instance && method.apply(instance, args);
    }

    flowInterrupt( instance, method, data , interactuuid ) {
        let ostWorkflowContext = data[ostWorkflowContextKey],
            ostError = instantiateOstError ( data[ostErrorKey] ) ,
            args = [ostWorkflowContext, ostError ];
        clearInstance(instance.uuid);
        instance && method.apply(instance, args);
    }
}

export default new OstWalletWorkFlowCallbackIntercepts();
