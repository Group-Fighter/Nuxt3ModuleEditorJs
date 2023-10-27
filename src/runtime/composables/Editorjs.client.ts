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
import { type EditorJsToolsConfig, type ModuleOptions } from '../../types'
import { initUndoModule, DefaultTool } from '../utils'
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
