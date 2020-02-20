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
    let h1Config = this.themeConfig.h1
    return {
          color: h1Config.color,
          fontSize: h1Config.size,
          alignSelf: this.getTextAlignment(h1Config.alignment),
          fontFamily: h1Config.font
        }
  }

  getH2Config() {
    let h2Config = this.themeConfig.h2
    return {
            color: h2Config.color,
            fontSize: h2Config.size,
            alignSelf: this.getTextAlignment(h2Config.alignment),
            fontFamily: h2Config.font
          }
  }
  
  getH3Config() {
    let h3Config = this.themeConfig.h3
    return {
            color: h3Config.color,
            fontSize: h3Config.size,
            alignSelf: this.getTextAlignment(h3Config.alignment),
            fontFamily: h3Config.font
            }
  }

  getH4Config() {
    let h4Config = this.themeConfig.h4
    return {
            color: h4Config.color,
            fontSize: h4Config.size,
            alignSelf: this.getTextAlignment(h4Config.alignment),
            fontFamily: h4Config.font
          }
  }

  getC1Config() {
    let c1Config = this.themeConfig.c1
    return {
            color: c1Config.color,
            fontSize: c1Config.size,
            alignSelf: this.getTextAlignment(c1Config.alignment),
            fontFamily: c1Config.font
          }
  }

  getC2Config() {
    let c2Config = this.themeConfig.c2;
    return {
            color: c2Config.color,
            fontSize: c2Config.size,
            alignSelf: this.getTextAlignment(c2Config.alignment),
            fontFamily: c2Config.font
          }
  }

  getB1Config() {
    let b1Config = this.themeConfig.b1;
    return {
            color: b1Config.color,
            fontSize: b1Config.size,
            backgroundColor: b1Config.background_color,
            fontFamily: b1Config.font
          }
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

  getNativeSelectConfig() {
    let nsConfig = this.themeConfig.native_select;
    return {
      color: nsConfig.color,
      fontSize: nsConfig.size,
      alignSelf: this.getTextAlignment(nsConfig.alignment),
      fontFamily: nsConfig.font,
      borderRadius: nsConfig.border_radius
    }
  }

  getTextFieldConfig() {
    let tfConfig = this.themeConfig.native_select;
    return {
      color: tfConfig.color,
      fontSize: tfConfig.size,
      fontFamily: tfConfig.font,
      borderRadius: tfConfig.border_radius,
      backgroundColor: tfConfig.background_color,
      placeHolder: {
        color: tfConfig.placeholder.color,
        fontSize: tfConfig.placeholder.size,
        alignSelf: this.getTextAlignment(tfConfig.placeholder.alignment),
        fontFamily: tfConfig.placeholder.font
      }
    }
  }
}

export default new OstThemeConfigHelper()