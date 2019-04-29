
package com.ost.ostwalletsdk;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

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
  public String initialize(String BASE_URL) {
    return BASE_URL;
    //return OstSdk.initialize(getReactApplicationContext(), BASE_URL);
  }

}