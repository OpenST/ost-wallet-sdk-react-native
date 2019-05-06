//
//  OstWalletRnSdk.swift
//  OstWalletRnSdk
//
//  Created by Ashutosh Lodhi on 06/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

@objc(OstWalletRnSdk)
class OstWalletRnSdk: NSObject {
    
    @objc func initialize(_ url: String, callback: RCTResponseSenderBlock) -> Void {
        print("Hello in swift", url);
        callback(["Hello in swift"]);
    }
    
    
}


