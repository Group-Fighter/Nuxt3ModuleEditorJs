import {
  reactive,
  onMounted,
  defineComponent,
  h,
  computed,
  defineEmits,
  watch,
  type PropType
} from 'vue'
// @ts-ignore
import EditorJS, { type API, type BlockMutationEvent, type EditorConfig, type OutputData, type ToolConstructable, type ToolSettings, type OutputBlockData } from '@editorjs/editorjs'
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
import * as AttachesTool from '@editorjs/attaches'
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
import { type EditorJsToolsConfig, type ModuleOptions } from '../../types'
// import { initUndoModule, DefaultTool } from '../utils'
// @ts-ignore
import { useRuntimeConfig } from '#imports'

const holder = 'nuxt-editor-js'

export const NuxtEditorJs = defineComponent({
  name: 'NuxtEditorJs',
  props: {
    holder: {
      type: String,
      default: () => holder,
      required: true
    },
    config: {
      type: Object as PropType<EditorConfig>,
      default: () => ({} as EditorConfig),
      required: false
    },
    onChange: {
      type: Function as PropType<() => void>,
      default: () => {},
      required: false
    },
    onReady: {
      type: Function as PropType<() => void>,
      default: () => {},
      required: false
    },
    initialized: {
      type: Function as PropType<() => void>,
      default: () => {},
      required: false
    },
    modelValue: {
      type: Object as PropType<OutputData>,
      default: () => ({
        time: 0,
        blocks: [] as OutputBlockData[],
        version: ''
      } as OutputData),
      required: false
    }
  },
  emits: [
    'update:modelValue'
  ],
  setup: (props, context) => {
    const configModule = useRuntimeConfig().public.Nuxt3EditorJS as ModuleOptions

    const defaultTools = DefaultTool(configModule)
    const state = reactive<{ editor: EditorJS | null }>({
      editor: null
    })

    function initEditor (props: any) {
      destroyEditor()
      initGlobalConfig(configModule, props.config)
      initFunctEditorConfig(props)
      setContent(props.config, props.modelValue)

      const initTools = composeTools(defaultTools)
      let customTools = {}
      if (props.config.tools) {
        customTools = registerTools(props.config.tools)
      }
      props.config.tools = Object.assign({}, initTools, customTools)

      state.editor = new EditorJS({
        holder: props.holder || holder,
        ...props.config
      })

      // Check if props.initialized is a function before calling it
      if (typeof props.initialized === 'function') {
        props.initialized(state.editor)
      }
    }

    function destroyEditor () {
      if (state.editor) {
        state.editor.destroy()
        state.editor = null
      }
    }

    function initFunctEditorConfig (props: any) {
      removeFunctEditorConfig(props)
      props.config.onChange = (api: API, event: BlockMutationEvent | BlockMutationEvent[]) => {
        api.saver.save().then((data) => {
          context.emit('update:modelValue', data)
        })
        props.onChange?.(api, event)
      }

      props.config.onReady = () => {
        props.onReady?.()
        initUndoModule(state.editor, configModule)
      }
    }

    function initGlobalConfig (configModule:ModuleOptions, config: EditorConfig) {
      const { autofocus, defaultBlock, placeholder, minHeight, logLevel, i18n, inlineToolbar, tunes } = config

      config.autofocus = autofocus ?? configModule.EditorJsConfig.autofocus
      config.defaultBlock = defaultBlock ?? configModule.EditorJsConfig.defaultBlock
      config.placeholder = placeholder ?? configModule.EditorJsConfig.placeholder
      config.minHeight = minHeight ?? configModule.EditorJsConfig.minHeight
      config.logLevel = logLevel ?? configModule.EditorJsConfig.logLevel
      config.i18n = i18n ?? configModule.EditorJsConfig.i18n
      // config.inlineToolbar = inlineToolbar ?? configModule.EditorJsConfig.inlineToolbar
      // config.tunes = tunes ?? configModule.EditorJsConfig.tunes
    }

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
      let temp: Record<string, ToolConstructable | ToolSettings> = {}
      for (const toolName in config) {
        const toolConfig = config[toolName]

        if (toolConfig.isEnabled) {
          temp = registerTools(toolConfig.toolsConfig)
          result = Object.assign({}, result, temp)
        }
      }

      return result
    }

    function removeFunctEditorConfig (props: any) {
      delete props.config.onReady
      delete props.config.onChange
    }

    function setContent (config: EditorConfig, modelValue: OutputData) {
      if (modelValue) {
        config.data = modelValue as OutputData
      }
    }

    onMounted(() => initEditor(props))
    return { props, state }
  },
  render () {
    return [
      h('div', { id: this.$props.holder })
    ]
  }
})

const DefaultTool = (configModule:ModuleOptions) => {
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

const initUndoModule = (editor: any, configModule: ModuleOptions) => {
  const config = {
    shortcuts: {
      undo: configModule.EditorJsToolsConfig.UndoConfig?.toolsConfig.undo,
      redo: configModule.EditorJsToolsConfig.UndoConfig?.toolsConfig.redo
    }
  }
  // eslint-disable-next-line no-new
  new Undo({ editor, config })
}
