package com.ostwalletrnsdk;

import android.graphics.Bitmap;
import android.util.Base64;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.ost.walletsdk.OstSdk;
import com.ost.walletsdk.ecKeyInteracts.UserPassphrase;
import com.ost.walletsdk.utils.CommonUtils;
import com.ost.walletsdk.workflows.OstWorkflowContext;
import com.ost.walletsdk.workflows.errors.OstError;
import com.ostwalletrnsdk.errors.OstRNError;
import com.ostwalletrnsdk.errors.OstRNErrors;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;

public class OstWalletRnSdkModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public OstWalletRnSdkModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "OstWalletSdk";
  }

  @ReactMethod
  public void initialize(
    String BASE_URL,
    Callback errorCallback
  ) {
    try{
      OstSdk.initialize(getReactApplicationContext(), BASE_URL);
    } catch(Throwable e){
      errorCallback.invoke( Utils.getError( e ) );
    }
  }

  @ReactMethod
  public void setupDevice(
    String userId ,
    String tokenId ,
    String uuid) {
    OstWorkflowContext context = new OstWorkflowContext(OstWorkflowContext.WORKFLOW_TYPE.SETUP_DEVICE);
    OstWorkFlowCallbackImpl workFlowCallback = new OstWorkFlowCallbackImpl( uuid, this.reactContext, context );
    OstSdk.setupDevice(userId, tokenId, workFlowCallback  );
  }


  @ReactMethod
  public void activateUser(String userId, String pin, String passphrasePrefix,
                           String expiresAfterInSecs, String spendingLimit, String uuid ){
      UserPassphrase userPassPhrase = null;
      OstWorkflowContext context = new OstWorkflowContext(OstWorkflowContext.WORKFLOW_TYPE.ACTIVATE_USER);
      OstWorkFlowCallbackImpl workFlowCallback = new OstWorkFlowCallbackImpl( uuid, this.reactContext, context );
      try{
         userPassPhrase = new UserPassphrase(userId, pin, passphrasePrefix) ;
      } catch(OstError e){
        workFlowCallback.flowInterrupt( context , e );
        return;
      }

      long expiresAfterInSecsLong =  Long.valueOf(expiresAfterInSecs);
      OstSdk.activateUser(userPassPhrase, expiresAfterInSecsLong, spendingLimit, workFlowCallback );
  }

  @ReactMethod
  public void addSession(String userId, String expiresAfterInSecs, String spendingLimit, String uuid ){
    OstWorkflowContext context = new OstWorkflowContext(OstWorkflowContext.WORKFLOW_TYPE.SETUP_DEVICE);
    OstWorkFlowCallbackImpl workFlowCallback = new OstWorkFlowCallbackImpl( uuid, this.reactContext, context );

    long expiresAfterInSecsLong =  Long.valueOf(expiresAfterInSecs);
    OstSdk.addSession(userId, spendingLimit , expiresAfterInSecsLong, workFlowCallback );
  }

  @ReactMethod
  public void executeTransaction(String userId,
                                 String tokenHolderAddresses,
                                 String amounts,
                                 String ruleName,
                                 String meta,
                                 String uuid ){

    List<String> listAddresses = null ;
    List<String> listAmounts = null ;
    Map<String, Object> mapMeta =null;
    OstWorkflowContext context = new OstWorkflowContext(OstWorkflowContext.WORKFLOW_TYPE.EXECUTE_TRANSACTION);
    OstWorkFlowCallbackImpl workFlowCallback = new OstWorkFlowCallbackImpl( uuid, this.reactContext, context );
    try {
      JSONArray jsonArrayAddresses = new JSONArray(tokenHolderAddresses);
      listAddresses = new CommonUtils().jsonArrayToList(jsonArrayAddresses);
    }catch (JSONException e ) {
      workFlowCallback.flowInterrupt(context , new OstRNError("rn_ownsm_et_1", OstRNErrors.ErrorCode.INVALID_JSON_ARRAY, uuid));
      return;
    }

    try{
      JSONArray jsonArrayAmounts = new JSONArray( amounts ) ;
      listAmounts = new CommonUtils().jsonArrayToList(jsonArrayAmounts);
    } catch(JSONException e){
      workFlowCallback.flowInterrupt(context , new OstRNError("rn_ownsm_et_2", OstRNErrors.ErrorCode.INVALID_JSON_ARRAY, uuid));
      return;
    }

    try {
      JSONObject metaObj = new JSONObject(meta);
      //TODO
    } catch (JSONException e) {
      workFlowCallback.flowInterrupt(context , new OstRNError("rn_ownsm_et_3", OstRNErrors.ErrorCode.INVALID_JSON_STRING, uuid));
      return;
    }

    OstSdk.executeTransaction(userId, listAddresses, listAmounts, ruleName, mapMeta, workFlowCallback);

  }

  @ReactMethod
  public void getDeviceMnemonics(String userId, String uuid ){
    OstWorkflowContext context = new OstWorkflowContext(OstWorkflowContext.WORKFLOW_TYPE.GET_DEVICE_MNEMONICS);
    OstWorkFlowCallbackImpl workFlowCallback = new OstWorkFlowCallbackImpl( uuid, this.reactContext, context );
    OstSdk.getDeviceMnemonics(userId,  workFlowCallback);
  }

  @ReactMethod
    public void authorizeCurrentDeviceWithMnemonics(String userId , String mnemonics , String uuid  ){
      byte[] byteArrayMnemonics = mnemonics.getBytes();
      OstWorkflowContext context = new OstWorkflowContext(OstWorkflowContext.WORKFLOW_TYPE.AUTHORIZE_DEVICE_WITH_MNEMONICS);
      OstWorkFlowCallbackImpl workFlowCallback = new OstWorkFlowCallbackImpl( uuid, this.reactContext, context );
      OstSdk.authorizeCurrentDeviceWithMnemonics(userId , byteArrayMnemonics ,workFlowCallback ) ;
  }

  @ReactMethod
  public void getAddDeviceQRCode(String userId ,Callback successCallback ,  Callback errorCallback ){
    try {
      Bitmap bitmap = OstSdk.getAddDeviceQRCode( userId );
      ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
      bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
      byte[] byteArray = byteArrayOutputStream .toByteArray();
      String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
      successCallback.invoke( encoded );
    }catch ( Throwable e ){
      errorCallback.invoke( Utils.getError( e ) );
    }
  }

  @ReactMethod
  public void performQRAction( String userId ,  String data , String uuid  ){
    OstWorkflowContext context = new OstWorkflowContext(OstWorkflowContext.WORKFLOW_TYPE.PERFORM_QR_ACTION);
    OstWorkFlowCallbackImpl workFlowCallback = new OstWorkFlowCallbackImpl( uuid, this.reactContext, context );
    try {
      OstSdk.performQRAction( userId , data ,workFlowCallback) ;
    }catch (JSONException e ){
      workFlowCallback.flowInterrupt( context ,  new OstRNError("rn_ownsm_pqra_1" , OstRNErrors.ErrorCode.INVALID_JSON_STRING ,  uuid ));
    }

  }

  @ReactMethod
  public void resetPin( String userId, String appSalt, String currentPin, String newPin , String uuid ){
    UserPassphrase currentPassphrase = null ;
    UserPassphrase newPassphrase = null ;
    OstWorkflowContext context = new OstWorkflowContext(OstWorkflowContext.WORKFLOW_TYPE.RESET_PIN);
    OstWorkFlowCallbackImpl workFlowCallback = new OstWorkFlowCallbackImpl( uuid, this.reactContext, context );
    try{
      currentPassphrase = new UserPassphrase(userId, currentPin, appSalt) ;
      newPassphrase = new UserPassphrase(userId, newPin, appSalt) ;
    }catch ( OstError e ){
      workFlowCallback.flowInterrupt( context , e);
      return;
    }
    OstSdk.resetPin(userId, currentPassphrase, newPassphrase, workFlowCallback );
  }

  @ReactMethod
  public void initiateDeviceRecovery( String userId, String pin , String appSalt , String deviceAddressToRecover,
                                      String uuid  ){
    UserPassphrase passphrase = null ;
    OstWorkflowContext context = new OstWorkflowContext(OstWorkflowContext.WORKFLOW_TYPE.INITIATE_DEVICE_RECOVERY);
    OstWorkFlowCallbackImpl workFlowCallback = new OstWorkFlowCallbackImpl( uuid, this.reactContext, context );

    try{
      passphrase = new UserPassphrase(userId, pin, appSalt) ;
    }catch (OstError e ){
      workFlowCallback.flowInterrupt( context , e);
      return;
    }
    OstSdk.initiateDeviceRecovery(userId, passphrase, deviceAddressToRecover, workFlowCallback );
  }

  @ReactMethod
  public void abortDeviceRecovery(String userId, String pin , String appSalt , String uuid  ){
    UserPassphrase passphrase = null ;
    OstWorkflowContext context = new OstWorkflowContext(OstWorkflowContext.WORKFLOW_TYPE.ABORT_DEVICE_RECOVERY);
    OstWorkFlowCallbackImpl workFlowCallback = new OstWorkFlowCallbackImpl( uuid, this.reactContext, context );
    try{
      passphrase = new UserPassphrase(userId, pin, appSalt) ;
    }catch (OstError e ){
      workFlowCallback.flowInterrupt( context ,  e);
      return;
    }

      OstSdk.abortDeviceRecovery(userId, passphrase, workFlowCallback );

  }

  @ReactMethod
  public void logoutAllSessions(String userId , String uuid ){
    OstWorkflowContext context = new OstWorkflowContext(OstWorkflowContext.WORKFLOW_TYPE.LOGOUT_ALL_SESSIONS);
    OstWorkFlowCallbackImpl workFlowCallback = new OstWorkFlowCallbackImpl( uuid, this.reactContext, context );
    OstSdk.logoutAllSessions(userId, workFlowCallback );
  }


}
