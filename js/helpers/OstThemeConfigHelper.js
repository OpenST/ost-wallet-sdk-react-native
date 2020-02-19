import OstWalletSdkUI from '../OstWalletSdkUI'

class OstThemeConfigHelper {
  constructor(){
    this.themeConfig = {}
    this.updateConfig()
  }

  getThemeConfig() {
    return this.themeConfig;
  }

  updateConfig() {
    this._getThemeConfig()
      .then((themeConfig) => {
        this.themeConfig = themeConfig
      })
  }

  _getThemeConfig() {
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
  
  getH1Config() {
    let c1Config = this.themeConfig.h1
    return {color: c1Config.color,
      fontSize: c1Config.size,
      alignSelf: this.getTextAlignment(c1Config.alignment),
        fontFamily: c1Config.font}
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

  getLinkConfig() {
    let cl1Config = this.themeConfig.link;
    return {
      color: cl1Config.color,
      fontSize: cl1Config.size,
      alignSelf: this.getTextAlignment(cl1Config.alignment),
      fontFamily: cl1Config.font
    }
  }

  getStatusConfig() {
    let st1Config = this.themeConfig.status;
    return {
      color: st1Config.color,
      fontSize: st1Config.size,
      alignSelf: this.getTextAlignment(st1Config.alignment),
      fontFamily: st1Config.font
    }
  }

  getBorderBottomColor() {
    return {
      borderBottomColor: this.themeConfig.cell_separator.color
    }
  }

  getNavigationHeaderConfig() {
    let config = this.themeConfig.navigation_bar;
    let headerConfig = this.themeConfig.navigation_bar_header;
    return {
      headerStyle: {
        backgroundColor: config.tint_color
      },
      headerTintColor: headerConfig.tint_color
    }
  }
}

export default new OstThemeConfigHelper()