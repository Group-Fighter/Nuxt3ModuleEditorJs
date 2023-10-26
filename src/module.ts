import { defu } from 'defu'
import { defineNuxtModule, createResolver, addComponentsDir, addPlugin, addServerHandler, useLogger } from '@nuxt/kit'
import { type ModuleOptions, type ApiModuleOptions } from './type.d'

const defaultApi = {
  ImageTool: {
    methods: 'POST',
    basePath: '/api/upload-file',
    imageDir: 'public/file',
    mime: ['image/png', 'image/jpeg', 'image/gif'],
    maxFileSize: 1000000
  },
  LinkTool: {
    basePath: '/api/meta-web'
  },
  AttachesTool: {
    basePath: '/api/upload-file'
  },
  PersonalityTool: {
    basePath: '/api/upload-file'
  }
}

const defaultTools = {
  HeaderConfig: {
    isEnabled: true,
    toolsConfig: {}
  },
  NestedListConfig: {
    isEnabled: true,
    toolsConfig: {
      nestedlist: {
        inlineToolbar: true,
        config: {
          defaultStyle: 'unordered'
        }
      }
    }
  },
  ImageConfig: {
    isEnabled: true,
    toolsConfig: {
      image: {
        config: {
          endpoints: {
            byFile: defaultApi.ImageTool.basePath,
            byUrl: defaultApi.ImageTool.basePath
          }
        }
      }
    }
  },
  ChecklistConfig: {
    isEnabled: true,
    toolsConfig: {
      checklist: {
        inlineToolbar: true
      }
    }
  },
  LinkToolConfig: {
    isEnabled: true,
    toolsConfig: {
      linkTool: {
        config: {
          endpoint: defaultApi.LinkTool.basePath
        }
      }
    }
  },
  RawConfig: {
    isEnabled: true,
    toolsConfig: {}
  },
  EmbedConfig: {
    isEnabled: true,
    toolsConfig: {}
  },
  QuoteConfig: {
    isEnabled: true,
    toolsConfig: {
      quote: {
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
    isEnabled: true,
    toolsConfig: {
      paragraph: {
        inlineToolbar: true
      }
    }
  },
  TableConfig: {
    isEnabled: true,
    toolsConfig: {
      table: {
        inlineToolbar: true,
        config: {
          rows: 2,
          cols: 3
        }
      }
    }
  },
  AttachesConfig: {
    isEnabled: true,
    toolsConfig: {
      attaches: {
        config: {
          endpoint: defaultApi.AttachesTool.basePath
        }
      }
    }
  },
  DelimiterConfig: {
    isEnabled: true,
    toolsConfig: {}
  },
  MarkerConfig: {
    isEnabled: true,
    toolsConfig: {
      Marker: {
        shortcut: 'CMD+SHIFT+M'
      }
    }
  },
  ColorConfig: {
    isEnabled: true,
    toolsConfig: {
      Color: {
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
    isEnabled: true,
    toolsConfig: {
      changeCase: {
        config: {
          showLocaleOption: true,
          locale: 'tr'
        }
      }
    }
  },
  HyperlinkConfig: {
    isEnabled: true,
    toolsConfig: {
      hyperlink: {
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
    isEnabled: true,
    toolsConfig: { }
  },
  CodeConfig: {
    isEnabled: true,
    toolsConfig: { }
  },
  PersonalityConfig: {
    isEnabled: true,
    toolsConfig: {
      personality: {
        config: {
          endpoint: 'http://localhost:8008/uploadFile'
        }
      }
    }
  },
  WarningConfig: {
    isEnabled: true,
    toolsConfig: {
      warning: {
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
    isEnabled: true,
    toolsConfig: {
      inlineCode: {
        shortcut: 'CMD+SHIFT+M'
      }
    }
  }
}

const defaults: ModuleOptions = {
  EditorJsConfig: {
    autofocus: true,
    defaultBlock: 'paragraph',
    placeholder: 'Let`s write an awesome story!',
    minHeight: 300,
    logLevel: undefined,
    i18n: undefined,
    inlineToolbar: ['link', 'marker', 'bold', 'italic'],
    tunes: ['textVariant']
  },
  EditorJsToolsConfig: defaultTools,
  Api: defaultApi
} as const

const PACKAGE_NAME = 'Nuxt3EditorJS'
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: `${PACKAGE_NAME}`,
    configKey: `${PACKAGE_NAME}`
  },
  defaults,
  setup (moduleOptions, nuxt) {
    const logger = useLogger(PACKAGE_NAME)

    logger.info('Setting up editorjs...')
    // 2. Set public and private runtime configuration
    const options = defu(moduleOptions, defaults)

    // @ts-ignore TODO: Fix this `nuxi prepare` bug (see https://github.com/nuxt/framework/issues/8728)
    nuxt.options.runtimeConfig.public.Nuxt3EditorJS =
      options as ModuleOptions

    const resolver = createResolver(import.meta.url)
    addPlugin({
      src: resolver.resolve('./runtime/plugin.client'),
      mode: 'client'
    })
    const componentsDir = resolver.resolve('./runtime/components')
    addComponentsDir({
      path: componentsDir
    })
    const cssDir = resolver.resolve('./runtime/assets/css/editor.css')
    nuxt.options.css.push(cssDir)

    const handlerUploadFile = resolver.resolve('./runtime/server/api/upload.post')
    // @ts-ignore
    addServerHandler({ handler: handlerUploadFile, route: options.Api.ImageTool.basePath })

    const handlerScrapeMeta = resolver.resolve('./runtime/server/api/scrapemeta.post')
    // @ts-ignore
    addServerHandler({ handler: handlerScrapeMeta, route: options.Api.LinkTool.basePath })
  }
})
