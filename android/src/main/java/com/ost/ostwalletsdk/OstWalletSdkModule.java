
package com.ost.ostwalletsdk;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import com.ost.walletsdk.OstSdk;

public class OstWalletSdkModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public OstWalletSdkModule(ReactApplicationContext reactContext) {
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
      errorCallback.invoke(e.getMessage());
    }
  }

}