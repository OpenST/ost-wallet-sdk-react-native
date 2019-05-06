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
    
    @objc(initialize:)
    func initialize(url: String, _ callback: RCTResponseSenderBlock) -> Void {
        do {
            try print("Hello in swift");
        } catch  {
            callback(error);
        }
    }
    
}
