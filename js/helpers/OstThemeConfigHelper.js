import OstWalletSdkUI from '../OstWalletSdkUI'

class OstThemeConfigHelper {
  constructor(){
    this.themeConfig = {}
    this.updateConfig()
  }

  updateConfig() {
    this.getThemeConfig()
      .then((themeConfig) => {
        this.themeConfig = themeConfig
      })
  }

  getThemeConfig() {
    return new Promise((resolve, reject) => {
      OstWalletSdkUI.getThemeConfig((themeConfig) => {
        resolve(themeConfig)
      })
    });
  }

  getTextAlignment(alignment) {
    if (alignment.toLowerCase() === 'left') {
      return 'flex-start'
    }

    if (alignment.toLowerCase() === 'center') {
      return 'center'
    }

    if (alignment.toLowerCase() === 'right') {
      return 'flex-end'
    }
  }

  getC1Config() {
    let c1Config = this.themeConfig.c1
    return {color: c1Config.color,
      fontSize: c1Config.size,
      alignSelf: this.getTextAlignment(c1Config.alignment),
        fontFamily: c1Config.font}
  }

  getC2Config() {
    let c2Config = this.themeConfig.c2;
    return {color: c2Config.color,
      fontSize: c2Config.size,
      alignSelf: this.getTextAlignment(c2Config.alignment),
        fontFamily: c2Config.font}
  }

  getBorderBottomColor() {
    return {
      borderBottomColor: this.themeConfig.cell_separator.color
    }
  }



}


export default new OstThemeConfigHelper()