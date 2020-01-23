/**
 * 
 * This is a wrapper export. 
 * OstWalletSettings - Singleton instance of OstWalletSettingsClass.
 * OstWalletSettingsComponent - react native component.
 * WalletSettingsConfig - Default Sdk Config.
 * 
 */

import OstWalletSettings from "./OstWalletSettings";
import OstWalletSettingsComponent from "./SettingsComponent";
import WalletSettingsConfig from "./ost-wallet-settings-config";

const OstWalletSettingsDefaultConfig = JSON.parse(JSON.stringify(WalletSettingsConfig));

export {
  OstWalletSettings,
  OstWalletSettingsComponent,
  OstWalletSettingsDefaultConfig
};