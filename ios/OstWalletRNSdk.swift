//
//  OstWalletRnSdk.swift
//  OstWalletRnSdk
//
//  Created by Ashutosh Lodhi on 05/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

@objc(OstWalletRnSdk)
class OstWalletRnSdk: NSObject {

   @objc(addEvent:)
   func addEvent(url: String) -> Void {
    print("Base url:" , url)
   }
    
}
