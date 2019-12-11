import OstWalletSdkUI from '../OstWalletSdkUI'

export default class OstThemeConfigHelper {
  constructor(){
    this.getThemeConfig()
      .then((themeConfig) => {
        this.themeConfig = themeConfig
      })
  }

  async getThemeConfig() {
    return new Promise((resolve, reject) => {
      OstWalletSdkUI.getThemeConfig((themeConfig) => {
        resolve(themeConfig)
      })
    });
  }

  getH1Color() {
    return this.themeConfig.h1.color
  }

  getH1Size() {
    return this.themeConfig.h1.size
  }

  getH4Color() {
    return this.themeConfig.h4.color
  }

  getH4Size() {
    return this.themeConfig.h4.size
  }
}

