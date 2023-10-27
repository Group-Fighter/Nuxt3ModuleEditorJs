import Header from '@editorjs/header'
import ImageTool from '@editorjs/image'
import Checklist from '@editorjs/checklist'
import LinkTool from '@editorjs/link'
import RawTool from '@editorjs/raw'
import Embed from '@editorjs/embed'
import Quote from '@editorjs/quote'
import NestedList from '@editorjs/nested-list'
import Paragraph from '@editorjs/paragraph'
import Table from '@editorjs/table'
import AttachesTool from '@editorjs/attaches'
import Delimiter from '@editorjs/delimiter'
import Marker from '@editorjs/marker'
import ChangeCase from 'editorjs-change-case'
import Hyperlink from 'editorjs-hyperlink'
import TextVariantTune from '@editorjs/text-variant-tune'
import CodeTool from '@editorjs/code'
import Personality from '@editorjs/personality'
import Warning from '@editorjs/warning'
import InlineCode from '@editorjs/inline-code'
import ColorPlugin from 'editorjs-text-color-plugin'
import Undo from 'editorjs-undo'
import { type EditorJsToolsConfig, type ModuleOptions } from '../types'

export const initUndoModule = (editor: any, configModule: ModuleOptions) => {
  const config = {
    shortcuts: {
      undo: configModule.EditorJsToolsConfig.UndoConfig?.toolsConfig.undo,
      redo: configModule.EditorJsToolsConfig.UndoConfig?.toolsConfig.redo
    }
  }
  // eslint-disable-next-line no-new
  new Undo({ editor, config })
}

export const UploadFile = (file: File, configModule:ModuleOptions): Promise<{ success: number; file: { url: string; } }> => {
  return new Promise((resolve, reject) => {
    const body = new FormData()
    body.append('file', file)
    // @ts-ignore
    $fetch(configModule.Api?.ImageTool?.basePath as string, {
      method: configModule.Api?.ImageTool?.methods as any,
      body
    })
      .then((response: unknown) => {
        if (typeof response === 'object' && response !== null) {
          // Check if the response has the expected structure
          const { success, file } = response as { success: number; file: { url: string; } }
          if (typeof success === 'number' && typeof file === 'object' && typeof file.url === 'string') {
            resolve({ success, file })
          } else {
            reject(new Error('Invalid response'))
          }
        } else {
          reject(new Error('Invalid response'))
        }
      })
      .catch((error: unknown) => {
        if (typeof error === 'object' && error !== null) {
          reject(new Error('Upload failed'))
        } else {
          reject(new Error('Unknown error occurred'))
        }
      })
  })
}

export const UploadFileFromURL = (sourceUrl: string, configModule:ModuleOptions): Promise<{ success: number; file: { url: string; } }> => {
  return new Promise((resolve, reject) => {
    // First, download the file from the source URL
    fetch(sourceUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to download file. Status: ${response.status}`)
        }
        return response.blob()
      })
      .then((blob) => {
        const body = new FormData()
        body.append('file', blob)

        // Upload the downloaded file to the destination
        // @ts-ignore
        return $fetch(configModule.Api?.ImageTool?.basePath as string, {
          method: configModule.Api?.ImageTool?.methods as any,
          body
        })
      })
      .then((response: unknown) => {
        if (typeof response === 'object' && response !== null) {
          // Check if the response has the expected structure
          const { success, file } = response as { success: number; file: { url: string; } }
          if (typeof success === 'number' && typeof file === 'object' && typeof file.url === 'string') {
            resolve({ success, file })
          } else {
            reject(new Error('Invalid response'))
          }
        } else {
          reject(new Error('Invalid response'))
        }
      })
      .catch((error: unknown) => {
        if (typeof error === 'object' && error !== null) {
          reject(new Error('Upload failed'))
        } else {
          reject(new Error('Unknown error occurred'))
        }
      })
  })
}

export const DefaultTool = (configModule:ModuleOptions) => {
  const defaultTools: EditorJsToolsConfig = {
    HeaderConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.HeaderConfig?.isEnabled as boolean,
      toolsConfig: {
        header: Header
      }
    },
    NestedListConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.NestedListConfig?.isEnabled as boolean,
      toolsConfig: {
        nestedlist: {
          class: NestedList,
          inlineToolbar: configModule.EditorJsToolsConfig?.NestedListConfig?.toolsConfig.nestedlist?.inlineToolbar as boolean,
          config: {
            defaultStyle: configModule.EditorJsToolsConfig?.NestedListConfig?.toolsConfig.nestedlist?.config.defaultStyle as string
          }
        }
      }
    },
    ImageConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.ImageConfig?.isEnabled as boolean,
      toolsConfig: {
        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile (file) {
                return UploadFile(file, configModule)
              },
              uploadByUrl (url) {
                return UploadFileFromURL(url, configModule)
              }
            }
          }
        }
      }
    },
    ChecklistConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.ChecklistConfig?.isEnabled as boolean,
      toolsConfig: {
        checklist: {
          class: Checklist,
          inlineToolbar: configModule.EditorJsToolsConfig?.ChecklistConfig?.toolsConfig.checklist?.inlineToolbar as boolean
        }
      }
    },
    LinkToolConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.LinkToolConfig?.isEnabled as boolean,
      toolsConfig: {
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: configModule.Api?.LinkTool?.basePath as string
          }
        }
      }
    },
    RawConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.RawConfig?.isEnabled as boolean,
      toolsConfig: {
        raw: RawTool
      }
    },
    EmbedConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.EmbedConfig?.isEnabled as boolean,
      toolsConfig: {
        embed: Embed
      }
    },
    QuoteConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.QuoteConfig?.isEnabled as boolean,
      toolsConfig: {
        quote: {
          class: Quote,
          inlineToolbar: configModule.EditorJsToolsConfig?.QuoteConfig?.toolsConfig.quote?.inlineToolbar as boolean,
          shortcut: configModule.EditorJsToolsConfig?.QuoteConfig?.toolsConfig.quote?.shortcut as string,
          config: {
            quotePlaceholder: configModule.EditorJsToolsConfig?.QuoteConfig?.toolsConfig.quote?.config.quotePlaceholder as string,
            captionPlaceholder: configModule.EditorJsToolsConfig?.QuoteConfig?.toolsConfig.quote?.config.captionPlaceholder as string
          }
        }
      }
    },
    ParagraphConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.ParagraphConfig?.isEnabled as boolean,
      toolsConfig: {
        paragraph: {
          class: Paragraph,
          inlineToolbar: configModule.EditorJsToolsConfig?.ParagraphConfig?.toolsConfig.paragraph?.inlineToolbar as boolean
        }
      }
    },
    TableConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.TableConfig?.isEnabled as boolean,
      toolsConfig: {
        table: {
          class: Table,
          inlineToolbar: configModule.EditorJsToolsConfig?.TableConfig?.toolsConfig.table?.inlineToolbar as boolean,
          config: {
            rows: configModule.EditorJsToolsConfig?.TableConfig?.toolsConfig.table?.config.rows as number,
            cols: configModule.EditorJsToolsConfig?.TableConfig?.toolsConfig.table?.config.cols as number
          }
        }
      }
    },
    AttachesConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.AttachesConfig?.isEnabled as boolean,
      toolsConfig: {
        attaches: {
          class: AttachesTool,
          config: {
            endpoint: configModule.Api?.AttachesTool?.basePath as string
          }
        }
      }
    },
    DelimiterConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.DelimiterConfig?.isEnabled as boolean,
      toolsConfig: {
        delimiter: Delimiter
      }
    },
    MarkerConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.MarkerConfig?.isEnabled as boolean,
      toolsConfig: {
        Marker: {
          class: Marker,
          shortcut: configModule.EditorJsToolsConfig?.MarkerConfig?.toolsConfig.Marker?.shortcut as string
        }
      }
    },
    ColorConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.ColorConfig?.isEnabled as boolean,
      toolsConfig: {
        Color: {
          class: ColorPlugin,
          config: {
            colorCollections: configModule.EditorJsToolsConfig?.ColorConfig?.toolsConfig.Color?.config.colorCollections as [],
            defaultColor: configModule.EditorJsToolsConfig?.ColorConfig?.toolsConfig.Color?.config.defaultColor as string,
            type: configModule.EditorJsToolsConfig?.ColorConfig?.toolsConfig.Color?.config.type as string,
            customPicker: configModule.EditorJsToolsConfig?.ColorConfig?.toolsConfig.Color?.config.customPicker as boolean
          }
        }
      }
    },
    ChangeCaseConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.ChangeCaseConfig?.isEnabled as boolean,
      toolsConfig: {
        changeCase: {
          class: ChangeCase,
          config: {
            showLocaleOption: configModule.EditorJsToolsConfig?.ChangeCaseConfig?.toolsConfig.changeCase?.config.showLocaleOption as boolean,
            locale: configModule.EditorJsToolsConfig?.ChangeCaseConfig?.toolsConfig.changeCase?.config.locale as string
          }
        }
      }
    },
    HyperlinkConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.HyperlinkConfig?.isEnabled as boolean,
      toolsConfig: {
        hyperlink: {
          class: Hyperlink,
          config: {
            shortcut: configModule.EditorJsToolsConfig?.HyperlinkConfig?.toolsConfig.hyperlink?.config.shortcut as string,
            target: configModule.EditorJsToolsConfig?.HyperlinkConfig?.toolsConfig.hyperlink?.config.target as string,
            rel: configModule.EditorJsToolsConfig?.HyperlinkConfig?.toolsConfig.hyperlink?.config.rel as string,
            availableTargets: configModule.EditorJsToolsConfig?.HyperlinkConfig?.toolsConfig.hyperlink?.config.availableTargets as [],
            availableRels: configModule.EditorJsToolsConfig?.HyperlinkConfig?.toolsConfig.hyperlink?.config.availableRels as [],
            validate: configModule.EditorJsToolsConfig?.HyperlinkConfig?.toolsConfig.hyperlink?.config.validate as boolean
          }
        }
      }
    },
    TextVariantConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.TextVariantConfig?.isEnabled as boolean,
      toolsConfig: {
        textVariant: TextVariantTune
      }
    },
    CodeConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.CodeConfig?.isEnabled as boolean,
      toolsConfig: {
        code: CodeTool
      }
    },
    PersonalityConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.PersonalityConfig?.isEnabled as boolean,
      toolsConfig: {
        personality: {
          class: Personality,
          config: {
            endpoint: configModule.Api?.PersonalityTool?.basePath as string
          }
        }
      }
    },
    WarningConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.WarningConfig?.isEnabled as boolean,
      toolsConfig: {
        warning: {
          class: Warning,
          inlineToolbar: configModule.EditorJsToolsConfig?.WarningConfig?.toolsConfig.warning?.inlineToolbar as boolean,
          shortcut: configModule.EditorJsToolsConfig?.WarningConfig?.toolsConfig.warning?.shortcut as string,
          config: {
            titlePlaceholder: configModule.EditorJsToolsConfig?.WarningConfig?.toolsConfig.warning?.config.titlePlaceholder as string,
            messagePlaceholder: configModule.EditorJsToolsConfig?.WarningConfig?.toolsConfig.warning?.config.messagePlaceholder as string
          }
        }
      }
    },
    InlineCodeConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.InlineCodeConfig?.isEnabled as boolean,
      toolsConfig: {
        inlineCode: {
          class: InlineCode,
          shortcut: configModule.EditorJsToolsConfig?.InlineCodeConfig?.toolsConfig.inlineCode?.shortcut as string
        }
      }
    }
  }

  return defaultTools
}

export const GenerateRandomString = (length:number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}
