import { screen } from 'electron'
import Config from './Config'

export default class GuiConfig extends Config {
  constructor() {
    super()
  }
  public getFilename(): string {
    return 'gui'
  }

  protected getDefaultObject(): yuki.Config.Gui {
    const displaySize = screen.getPrimaryDisplay().size
    const mainWindowWidthRatio = 0.75
    const mainWindowHeightRatio = 0.8
    const translatorWindowWidthRatio = 0.65
    const translatorWindowHeightRatio = 0.25
    return {
      translatorWindow: {
        bounds: {
          width: Math.trunc(displaySize.width * translatorWindowWidthRatio),
          height: Math.trunc(displaySize.height * translatorWindowHeightRatio * 2),
          x: Math.trunc(
            displaySize.width * ((1 - translatorWindowWidthRatio) / 2)
          ),
          y: Math.trunc(displaySize.height * 0.05)
        },
        originalText: {
          fontSize: 1.5,
          color: '#FFFFFF'
        },
        translationText: {
          fontSize: 1.5,
          color: '#FFFFFF',
          margin: 0.7
        },
        mecabReading: {
          fontSize: 0.6,
        },
        mecabText: {
          fontSize: 1.5,
          fontPadding: 0.1
        },
        sizes: {
          '/translate': {
            x: Math.trunc(displaySize.width * ((1 - mainWindowWidthRatio) / 2)),
            y: Math.trunc(displaySize.height * ((1 - mainWindowHeightRatio) / 2)), width: Math.trunc(displaySize.width * translatorWindowWidthRatio * 1.25),
            height: Math.trunc(displaySize.height * translatorWindowHeightRatio * 1.25),
          },
          '/hook': {
            x: Math.trunc(displaySize.width * ((1 - mainWindowWidthRatio) / 2)),
            y: Math.trunc(displaySize.height * ((1 - mainWindowHeightRatio) / 2)), width: Math.trunc(displaySize.width * translatorWindowWidthRatio),
            height: Math.trunc(displaySize.height * translatorWindowHeightRatio * 2),
          },
          '/setting': {
            x: Math.trunc(displaySize.width * ((1 - mainWindowWidthRatio) / 2)),
            y: Math.trunc(displaySize.height * ((1 - mainWindowHeightRatio) / 2)), width: Math.trunc(displaySize.width * translatorWindowWidthRatio),
            height: Math.trunc(displaySize.height * translatorWindowHeightRatio * 2.5),
          },
        },
        background: '#000000BD',
        renderMode: 'transparent',
      }
    }
  }
}
