import EditorJS from '../src/module'

export default defineNuxtConfig({
  // @ts-expect-error See https://github.com/nuxt/framework/issues/8931
  modules: [EditorJS],
  Nuxt3EditorJS: {
    EditorJsConfig: {
      autofocus: true,
      defaultBlock: 'paragraph',
      placeholder: 'Let`s write an awesome story!',
      minHeight: 300,
      logLevel: 'ERROR',
      i18n: undefined,
      inlineToolbar: ['link', 'marker', 'bold', 'italic'],
      tunes: ['textVariant']
    },
    // EditorJsToolsConfig: {},
    Api: {
      ImageTool: {
        methods: 'POST',
        basePath: '/api/upload-file',
        imageDir: './playground/public/file',
        mime: ['image/png', 'image/jpeg', 'image/gif'],
        maxFileSize: 1000000
      }
    }
  },
  components: [
    '~/components'
  ],
  vite: {
    optimizeDeps: {
      include: ['@editorjs/editorjs']
    },
    build: {
      rollupOptions: {
        output: {
          format: 'es' // Use ES modules
        }
      }
    }
  }
})
