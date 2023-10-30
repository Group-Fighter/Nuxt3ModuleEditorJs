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
import DragDrop from 'editorjs-drag-drop'
import editorjsColumns from '@calumk/editorjs-columns'
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune'
import TextAlign from '@canburaks/text-align-editorjs'

import EditorJS, { type ToolConstructable, type ToolSettings, type EditorConfig } from '@editorjs/editorjs'
import { type EditorJsToolsConfig, type ModuleOptions } from '../types'

export const initClassModule = (editor: any, configModule: ModuleOptions) => {
  if (configModule.EditorJsToolsConfig.UndoConfig?.isEnabled) {
    const config = {
      shortcuts: {
        undo: configModule.EditorJsToolsConfig.UndoConfig?.toolsConfig.undo,
        redo: configModule.EditorJsToolsConfig.UndoConfig?.toolsConfig.redo
      }
    }
    // eslint-disable-next-line no-new
    new Undo({ editor, config })
  }
  if (configModule.EditorJsToolsConfig.DragDropConfig?.isEnabled) {
    // eslint-disable-next-line no-new
    new DragDrop(editor)
  }
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
      supportInColumn: configModule.EditorJsToolsConfig?.HeaderConfig?.supportInColumn as boolean,
      toolsConfig: {
        header: Header
      }
    },
    NestedListConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.NestedListConfig?.isEnabled as boolean,
      supportInColumn: configModule.EditorJsToolsConfig?.NestedListConfig?.supportInColumn as boolean,
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
      supportInColumn: configModule.EditorJsToolsConfig?.ImageConfig?.supportInColumn as boolean,
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
      supportInColumn: configModule.EditorJsToolsConfig?.ChecklistConfig?.supportInColumn as boolean,
      toolsConfig: {
        checklist: {
          class: Checklist,
          inlineToolbar: configModule.EditorJsToolsConfig?.ChecklistConfig?.toolsConfig.checklist?.inlineToolbar as boolean
        }
      }
    },
    LinkToolConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.LinkToolConfig?.isEnabled as boolean,
      supportInColumn: configModule.EditorJsToolsConfig?.LinkToolConfig?.supportInColumn as boolean,
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
      supportInColumn: configModule.EditorJsToolsConfig?.RawConfig?.supportInColumn as boolean,
      toolsConfig: {
        raw: RawTool
      }
    },
    EmbedConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.EmbedConfig?.isEnabled as boolean,
      supportInColumn: configModule.EditorJsToolsConfig?.EmbedConfig?.supportInColumn as boolean,
      toolsConfig: {
        embed: Embed
      }
    },
    QuoteConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.QuoteConfig?.isEnabled as boolean,
      supportInColumn: configModule.EditorJsToolsConfig?.QuoteConfig?.supportInColumn as boolean,
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
      supportInColumn: configModule.EditorJsToolsConfig?.ParagraphConfig?.supportInColumn as boolean,
      toolsConfig: {
        paragraph: {
          class: Paragraph,
          inlineToolbar: configModule.EditorJsToolsConfig?.ParagraphConfig?.toolsConfig.paragraph?.inlineToolbar as boolean
        }
      }
    },
    TableConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.TableConfig?.isEnabled as boolean,
      supportInColumn: configModule.EditorJsToolsConfig?.TableConfig?.supportInColumn as boolean,
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
      supportInColumn: configModule.EditorJsToolsConfig?.AttachesConfig?.supportInColumn as boolean,
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
      supportInColumn: configModule.EditorJsToolsConfig?.DelimiterConfig?.supportInColumn as boolean,
      toolsConfig: {
        delimiter: Delimiter
      }
    },
    MarkerConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.MarkerConfig?.isEnabled as boolean,
      supportInColumn: configModule.EditorJsToolsConfig?.MarkerConfig?.supportInColumn as boolean,
      toolsConfig: {
        Marker: {
          class: Marker,
          shortcut: configModule.EditorJsToolsConfig?.MarkerConfig?.toolsConfig.Marker?.shortcut as string
        }
      }
    },
    ColorConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.ColorConfig?.isEnabled as boolean,
      supportInColumn: configModule.EditorJsToolsConfig?.ColorConfig?.supportInColumn as boolean,
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
      supportInColumn: configModule.EditorJsToolsConfig?.ChangeCaseConfig?.supportInColumn as boolean,
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
      supportInColumn: configModule.EditorJsToolsConfig?.HyperlinkConfig?.supportInColumn as boolean,
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
      supportInColumn: configModule.EditorJsToolsConfig?.TextVariantConfig?.supportInColumn as boolean,
      toolsConfig: {
        textVariant: TextVariantTune
      }
    },
    CodeConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.CodeConfig?.isEnabled as boolean,
      supportInColumn: configModule.EditorJsToolsConfig?.CodeConfig?.supportInColumn as boolean,
      toolsConfig: {
        code: CodeTool
      }
    },
    PersonalityConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.PersonalityConfig?.isEnabled as boolean,
      supportInColumn: configModule.EditorJsToolsConfig?.PersonalityConfig?.supportInColumn as boolean,
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
      supportInColumn: configModule.EditorJsToolsConfig?.WarningConfig?.supportInColumn as boolean,
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
      supportInColumn: configModule.EditorJsToolsConfig?.InlineCodeConfig?.supportInColumn as boolean,
      toolsConfig: {
        inlineCode: {
          class: InlineCode,
          shortcut: configModule.EditorJsToolsConfig?.InlineCodeConfig?.toolsConfig.inlineCode?.shortcut as string
        }
      }
    },
    AlignmentTuneToolConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.AlignmentTuneToolConfig?.isEnabled as boolean,
      toolsConfig: {
        alligment: {
          class: AlignmentTuneTool,
          config: {
            default: configModule.EditorJsToolsConfig?.AlignmentTuneToolConfig?.toolsConfig?.alligment?.config.default as string
          }
        }
      }
    },
    TextAlignConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.TextAlignConfig?.isEnabled as boolean,
      supportInColumn: configModule.EditorJsToolsConfig?.TextAlignConfig?.supportInColumn as boolean,
      toolsConfig: {
        textAlign: TextAlign
      }
    }
  }
  const ColumnsConfig: EditorJsToolsConfig = {
    ColumnsConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.ColumnsConfig?.isEnabled as boolean,
      toolsConfig: {
        columns: {
          class: editorjsColumns,
          config: {
            tools: composeToolsInColumns(defaultTools),
            // @ts-ignore
            EditorJsLibrary: EditorJS // Pass the library instance to the columns instance.
          }
        }
      }
    }
  }

  const result = Object.assign({}, defaultTools, ColumnsConfig)

  return result
}

export const registerTools = (config: Record<string, any>): Record<string, ToolConstructable | ToolSettings> => {
  const result: Record<string, ToolConstructable | ToolSettings> = {}

  for (const toolName in config) {
    const toolConfig = config[toolName]

    if (typeof toolConfig === 'object') {
      const { class: toolClass, ...settings } = toolConfig
      result[toolName] = { class: toolClass, ...settings }
    } else {
      result[toolName] = toolConfig
    }
  }

  return result
}

export const composeTools = (config: EditorJsToolsConfig): Record<string, ToolConstructable | ToolSettings> => {
  let result: Record<string, ToolConstructable | ToolSettings> = {}
  let temp: Record<string, ToolConstructable | ToolSettings> = {}
  for (const toolName in config) {
    // @ts-ignore
    const toolConfig = config[toolName]

    if (toolConfig.isEnabled) {
      temp = registerTools(toolConfig.toolsConfig)
      result = Object.assign({}, result, temp)
    }
  }

  return result
}

export const composeToolsInColumns = (config: EditorJsToolsConfig): Record<string, ToolConstructable | ToolSettings> => {
  let result: Record<string, ToolConstructable | ToolSettings> = {}
  let temp: Record<string, ToolConstructable | ToolSettings> = {}
  for (const toolName in config) {
    // @ts-ignore
    const toolConfig = config[toolName]

    if (toolConfig.isEnabled && 'supportInColumn' in toolConfig && toolConfig.supportInColumn) {
      temp = registerTools(toolConfig.toolsConfig)
      result = Object.assign({}, result, temp)
    }
  }

  return result
}

export const composeTunes = (configTools: EditorJsToolsConfig, configModule:ModuleOptions, config: EditorConfig): string[] => {
  const result: string[] = []
  const { tunes } = config
  const tune = tunes as string[] ?? configModule.EditorJsConfig.tunes as string[]

  for (const toolNameConfig in configTools) {
    // @ts-ignore
    const toolConfig = configTools[toolNameConfig]
    if (toolConfig.isEnabled) {
      for (const toolName in toolConfig.toolsConfig) {
        if (tune.includes(toolName)) {
          result.push(toolName)
        }
      }
    }
  }
  return result
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

export const cleanURL = (url: string): string => {
  // Remove "./playground"
  url = url.replace('/./playground', '')
  url = url.replace(/\/\.\//, '/')

  // Remove "public" or "assets"
  url = url.replace(/\/(public|assets)\//, '/')

  // Remove any leading and trailing slashes
  url = url.replace(/^\/+|\/+$/g, '')

  return url
}
