import { defu } from 'defu'
import { defineNuxtModule, createResolver, addComponentsDir, addPlugin, addServerHandler, useLogger } from '@nuxt/kit'
import { type ModuleOptions, type ApiModuleOptions, type ModuleOptionsConfig, type EditorJsToolsConfig } from './types'

enum LogLevels {
  VERBOSE = 'VERBOSE',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

const defaultApi: ApiModuleOptions = {
  ImageTool: {
    methods: 'POST',
    basePath: '/api/upload-file',
    imageDir: 'public/image',
    mime: ['image/png', 'image/jpeg', 'image/gif'],
    maxFileSize: 1000000
  },
  LinkTool: {
    basePath: '/api/meta-web'
  },
  AttachesTool: {
    basePath: '/api/attachment-file',
    imageDir: 'public/file',
    mime: ['image/png', 'image/jpeg', 'image/gif'],
    maxFileSize: 1000000
  },
  PersonalityTool: {
    basePath: '/api/upload-personality-image',
    imageDir: 'public/image',
    mime: ['image/png', 'image/jpeg', 'image/gif'],
    maxFileSize: 1000000
  }
} as const

const defaultTools: EditorJsToolsConfig = {
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
      // image: {
      //   config: {
      //     endpoints: {
      //       byFile: defaultApi.ImageTool.basePath,
      //       byUrl: defaultApi.ImageTool.basePath
      //     }
      //   }
      // }
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
          endpoint: defaultApi.PersonalityTool.basePath
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
  },
  UndoConfig: {
    isEnabled: true,
    toolsConfig: {
      undo: 'CMD+X',
      redo: 'CMD+ALT+C'
    }
  }
} as const

const defaults: ModuleOptionsConfig = {
  EditorJsConfig: {
    autofocus: true,
    defaultBlock: '',
    placeholder: 'Let`s write an awesome story!',
    minHeight: 0,
    logLevel: 'ERROR' as LogLevels,
    i18n: undefined,
    inlineToolbar: false,
    tunes: []
  },
  EditorJsToolsConfig: defaultTools,
  Api: defaultApi
} as const

const PACKAGE_NAME = 'Nuxt3EditorJS'
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: `@fighter/${PACKAGE_NAME}`,
    configKey: `${PACKAGE_NAME}`,
    compatibility: {
      bridge: false
    }
  },
  defaults,
  setup (moduleOptions, nuxt) {
    const logger = useLogger(PACKAGE_NAME)

    logger.info('Setting up Nuxt3EditorJS...')

    const options = defu(moduleOptions, defaults)
    // @ts-ignore TODO: Fix this `nuxi prepare` bug (see https://github.com/nuxt/framework/issues/8728)
    nuxt.options.runtimeConfig.public.Nuxt3EditorJS = defu(nuxt.options.runtimeConfig.public.Nuxt3EditorJS, options) as ModuleOptionsConfig

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

    const handlerUploadImage = resolver.resolve('./runtime/server/api/image.post')
    // @ts-ignore
    addServerHandler({ handler: handlerUploadImage, route: options.Api.ImageTool.basePath })

    const handlerUploadFile = resolver.resolve('./runtime/server/api/attachment.post')
    // @ts-ignore
    addServerHandler({ handler: handlerUploadFile, route: options.Api.AttachesTool.basePath })

    const handlerUploadImagePersonality = resolver.resolve('./runtime/server/api/personality.post')
    // @ts-ignore
    addServerHandler({ handler: handlerUploadImagePersonality, route: options.Api.PersonalityTool.basePath })

    const handlerScrapeMeta = resolver.resolve('./runtime/server/api/scrapemeta.get')
    // @ts-ignore
    addServerHandler({ handler: handlerScrapeMeta, route: options.Api.LinkTool.basePath })

    logger.info('Nuxt3EditorJS up setup complete')
  }
})
