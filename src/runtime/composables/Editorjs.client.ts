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
// plugin
import ColorPlugin from 'editorjs-text-color-plugin'

import {
  reactive,
  onMounted,
  defineComponent,
  h
} from 'vue'
import EditorJS, { type EditorConfig, type OutputData, type ToolConstructable, type ToolSettings } from '@editorjs/editorjs'
import { type EditorJsToolsConfig, type ModuleOptions } from '../../type'
import { initUndoModule } from '../optionTools'
// @ts-ignore
import { useRuntimeConfig } from '#imports'
const holder = 'nuxt-editor-js'

export const NuxtEditorJs = defineComponent({
  name: 'NuxtEditorJs',
  inheritAttrs: false,
  props: {
    holder: {
      type: String,
      default: () => holder,
      required: true
    },
    config: {
      type: Object as () => EditorConfig,
      default: () => ({}),
      required: false
    },
    initialized: {
      type: Function, // Use 'Function' as the prop type
      default: () => {},
      required: false
    }
  },
  setup: (props, context) => {
    const configModule = useRuntimeConfig().public.Nuxt3EditorJS as ModuleOptions
    const defaultTools = DefaultTool(configModule)
    const state = reactive<{ editor: EditorJS | null }>({
      editor: null
    })

    function initEditor (props: { holder: string; config: EditorConfig; initialized: Function }) {
      destroyEditor()
      const initTools = composeTools(defaultTools)

      let customTools = {}
      if (props.config.tools) {
        customTools = registerTools(props.config.tools)
      }
      props.config.tools = Object.assign({}, initTools, customTools)

      const customOnReady = props.config.onReady
      props.config.onReady = () => {
        if (typeof customOnReady === 'function') {
          customOnReady() // Call the existing onReady function if it exists
        }
        initUndoModule(state.editor)
      }

      // register ready function
      state.editor = new EditorJS({
        holder: props.holder || holder,
        ...props.config
      })

      // Check if props.initialized is a function before calling it
      // if (typeof props.initialized === 'function') {
      props.initialized(state.editor)
      // }
    }

    function destroyEditor () {
      if (state.editor) {
        state.editor.destroy()
        state.editor = null
      }
    }

    onMounted(() => initEditor(props))

    function registerTools (config: Record<string, any>): Record<string, ToolConstructable | ToolSettings> {
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

    function composeTools (config: EditorJsToolsConfig): Record<string, ToolConstructable | ToolSettings> {
      let result: Record<string, ToolConstructable | ToolSettings> = {}
      let temp = {}
      for (const toolName in config) {
        const toolConfig = config[toolName]

        if (toolConfig.isEnabled) {
          temp = registerTools(toolConfig.toolsConfig)
          result = Object.assign({}, result, temp)
        }
      }

      return result
    }

    return { props, state }
  },
  render () {
    return [
      h('div', { id: this.$props.holder, ...this.$attrs })
    ]
  }
})

const UploadFile = (file: File, configModule:ModuleOptions): Promise<{ success: number; file: { url: string; } }> => {
  return new Promise((resolve, reject) => {
    const body = new FormData()
    body.append('file', file)
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

const UploadFileFromURL = (sourceUrl: string, configModule:ModuleOptions): Promise<{ success: number; file: { url: string; } }> => {
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

function DefaultTool (configModule:ModuleOptions) {
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
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
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
                // your ajax request for uploading
                return UploadFileFromURL(url, configModule)
              }
            }
            // endpoints: {
            //   byFile: configModule.Api?.ImageTool?.basePath as string,
            //   byUrl: configModule.Api?.ImageTool?.basePath as string
            // }
          }
        }
      }
    },
    ChecklistConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.ChecklistConfig?.isEnabled as boolean,
      toolsConfig: {
        checklist: {
          class: Checklist,
          inlineToolbar: true
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
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+O',
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: "Quote's author"
          }
        }
      }
    },
    ParagraphConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.ParagraphConfig?.isEnabled as boolean,
      toolsConfig: {
        paragraph: {
          class: Paragraph,
          inlineToolbar: true
        }
      }
    },
    TableConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.TableConfig?.isEnabled as boolean,
      toolsConfig: {
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3
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
            // uploader: {
            //   uploadByFile (file) {
            //     return UploadFile(file)
            //   }
            // }
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
          shortcut: 'CMD+SHIFT+M'
        }
      }
    },
    ColorConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.ColorConfig?.isEnabled as boolean,
      toolsConfig: {
        Color: {
          class: ColorPlugin,
          config: {
            colorCollections: [
              '#EC7878',
              '#9C27B0',
              '#673AB7',
              '#3F51B5',
              '#0070FF',
              '#03A9F4',
              '#00BCD4',
              '#4CAF50',
              '#8BC34A',
              '#CDDC39',
              '#FFF'
            ],
            defaultColor: '#FF1300',
            type: 'text',
            customPicker: true
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
            showLocaleOption: true,
            locale: 'tr'
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
            shortcut: 'CMD+L',
            target: '_blank',
            rel: 'nofollow',
            availableTargets: ['_blank', '_self'],
            availableRels: ['author', 'noreferrer'],
            validate: false
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
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+W',
          config: {
            titlePlaceholder: 'Title',
            messagePlaceholder: 'Message'
          }
        }
      }
    },
    InlineCodeConfig: {
      isEnabled: configModule.EditorJsToolsConfig?.InlineCodeConfig?.isEnabled as boolean,
      toolsConfig: {
        inlineCode: {
          class: InlineCode,
          shortcut: 'CMD+SHIFT+M'
        }
      }
    }
  }

  return defaultTools
}
