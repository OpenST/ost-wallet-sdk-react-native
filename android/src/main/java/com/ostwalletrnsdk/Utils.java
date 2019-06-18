/*
 Copyright © 2019 OST.com Inc

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0
 */

package com.ostwalletrnsdk;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.ost.walletsdk.ecKeyInteracts.UserPassphrase;
import com.ost.walletsdk.workflows.errors.OstError;
import com.ost.walletsdk.workflows.errors.OstErrors;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

public class Utils {


    /*
    * getError should only used for errorCallbacks directly invoked.
    * Don't user for workflow callback.
    */

    public static String getError(Object error, String internalErrorCode ){
        String jsonError = null ;
        if( error instanceof OstError){
            return  ((OstError) error).toJSONObject().toString();
        }
        JSONObject err = new JSONObject();

        try {
            err.putOpt(OstError.OstJSONErrorKeys.ERROR_MESSAGE, ((Throwable)error).getMessage());
        } catch (Throwable e) {
            //Ignore.
        }

        try {
            err.putOpt(OstError.OstJSONErrorKeys.INTERNAL_ERROR_CODE, internalErrorCode);
        } catch (Throwable e) {
            //Ignore.
        }

        try {
            err.putOpt(OstError.OstJSONErrorKeys.ERROR_CODE, OstErrors.ErrorCode.UNCAUGHT_EXCEPTION_HANDELED);
        } catch (Throwable e) {
            //Ignore.
        }

        try {
            err.putOpt(OstError.OstJSONErrorKeys.IS_API_ERROR, 0);
        } catch (Throwable e) {
            //Ignore.
        }

        return err.toString();
    }


    public static void cleanPassPhrase( UserPassphrase passphrase ){
        if( null != passphrase ){
            passphrase.wipe();
        }
    }

    public static WritableMap convertJsonToMap(JSONObject jsonObject) throws JSONException {
        WritableMap map = new WritableNativeMap();

        Iterator<String> iterator = jsonObject.keys();
        while (iterator.hasNext()) {
            String key = iterator.next();
            Object value = jsonObject.get(key);
            if (value instanceof JSONObject) {
                map.putMap(key, convertJsonToMap((JSONObject) value));
            } else if (value instanceof  JSONArray) {
                map.putArray(key, convertJsonToArray((JSONArray) value));
            } else if (value instanceof  Boolean) {
                map.putBoolean(key, (Boolean) value);
            } else if (value instanceof  Integer) {
                map.putInt(key, (Integer) value);
            } else if (value instanceof  Double) {
                map.putDouble(key, (Double) value);
            } else if (value instanceof String)  {
                map.putString(key, (String) value);
            } else {
                map.putString(key, value.toString());
            }
        }
        return map;
    }

    public static WritableArray convertJsonToArray(JSONArray jsonArray) throws JSONException {
        WritableArray array = new WritableNativeArray();

        for (int i = 0; i < jsonArray.length(); i++) {
            Object value = jsonArray.get(i);
            if (value instanceof JSONObject) {
                array.pushMap(convertJsonToMap((JSONObject) value));
            } else if (value instanceof  JSONArray) {
                array.pushArray(convertJsonToArray((JSONArray) value));
            } else if (value instanceof  Boolean) {
                array.pushBoolean((Boolean) value);
            } else if (value instanceof  Integer) {
                array.pushInt((Integer) value);
            } else if (value instanceof  Double) {
                array.pushDouble((Double) value);
            } else if (value instanceof String)  {
                array.pushString((String) value);
            } else {
                array.pushString(value.toString());
            }
        }
        return array;
    }

    public static JSONObject convertMapToJson(ReadableMap readableMap) throws JSONException {
        JSONObject object = new JSONObject();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (readableMap.getType(key)) {
                case Null:
                    object.put(key, JSONObject.NULL);
                    break;
                case Boolean:
                    object.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    object.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    object.put(key, readableMap.getString(key));
                    break;
                case Map:
                    object.put(key, convertMapToJson(readableMap.getMap(key)));
                    break;
                case Array:
                    object.put(key, convertArrayToJson(readableMap.getArray(key)));
                    break;
            }
        }
        return object;
    }

    public static JSONArray convertArrayToJson(ReadableArray readableArray) throws JSONException {
        JSONArray array = new JSONArray();
        for (int i = 0; i < readableArray.size(); i++) {
            switch (readableArray.getType(i)) {
                case Null:
                    break;
                case Boolean:
                    array.put(readableArray.getBoolean(i));
                    break;
                case Number:
                    array.put(readableArray.getDouble(i));
                    break;
                case String:
                    array.put(readableArray.getString(i));
                    break;
                case Map:
                    array.put(convertMapToJson(readableArray.getMap(i)));
                    break;
                case Array:
                    array.put(convertArrayToJson(readableArray.getArray(i)));
                    break;
            }
        }
        return array;
    }
}
