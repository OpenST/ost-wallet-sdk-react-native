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
    
    @objc(addEvent:)
    func addEvent(name: String) -> Void {
        print("Hello I am in swift");
    }
    
}
