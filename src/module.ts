import { defineNuxtModule, createResolver, addComponentsDir, addImportsDir, addPlugin, addServerHandler, useLogger } from '@nuxt/kit'
import { defu } from 'defu'
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
    mime: [
      'image/jpg',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'image/webp',
      'image/svg+xml',
      'image/x-icon',
      'image/vnd.microsoft.icon',
      'image/vnd.adobe.photoshop'
    ] as string[],
    maxFileSize: 1000000
  },
  LinkTool: {
    basePath: '/api/meta-web'
  },
  AttachesTool: {
    basePath: '/api/attachment-file',
    imageDir: 'public/file',
    mime: [
      'application/pdf',
      'application/msword',
      'application/vnd.ms-excel',
      'application/vnd.ms-powerpoint',
      'application/xml',
      'application/json',
      'application/rtf',
      'application/zip',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ] as string[],
    maxFileSize: 1000000
  },
  PersonalityTool: {
    basePath: '/api/upload-personality-image',
    imageDir: 'public/image',
    mime: [
      'image/jpg',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'image/webp',
      'image/svg+xml',
      'image/x-icon',
      'image/vnd.microsoft.icon',
      'image/vnd.adobe.photoshop'
    ] as string[],
    maxFileSize: 1000000
  }
} as const

const defaultTools: EditorJsToolsConfig = {
  HeaderConfig: {
    isEnabled: true,
    supportInColumn: true,
    toolsConfig: {}
  },
  NestedListConfig: {
    isEnabled: true,
    supportInColumn: true,
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
    supportInColumn: true,
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
    supportInColumn: true,
    toolsConfig: {
      checklist: {
        inlineToolbar: true
      }
    }
  },
  LinkToolConfig: {
    isEnabled: true,
    supportInColumn: true,
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
    supportInColumn: true,
    toolsConfig: {}
  },
  EmbedConfig: {
    isEnabled: true,
    supportInColumn: true,
    toolsConfig: {}
  },
  QuoteConfig: {
    isEnabled: true,
    supportInColumn: true,
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
    supportInColumn: true,
    toolsConfig: {
      paragraph: {
        inlineToolbar: true
      }
    }
  },
  TableConfig: {
    isEnabled: true,
    supportInColumn: true,
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
    supportInColumn: true,
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
    supportInColumn: true,
    toolsConfig: {}
  },
  MarkerConfig: {
    isEnabled: true,
    supportInColumn: true,
    toolsConfig: {
      Marker: {
        shortcut: 'CMD+SHIFT+M'
      }
    }
  },
  ColorConfig: {
    isEnabled: true,
    supportInColumn: true,
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
          ] as string[],
          defaultColor: '#FF1300',
          type: 'text',
          customPicker: true
        }
      }
    }
  },
  ChangeCaseConfig: {
    isEnabled: true,
    supportInColumn: true,
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
    supportInColumn: true,
    toolsConfig: {
      hyperlink: {
        config: {
          shortcut: 'CMD+L',
          target: '_blank',
          rel: 'nofollow',
          availableTargets: ['_blank', '_self'] as string[],
          availableRels: ['author', 'noreferrer'] as string[],
          validate: false
        }
      }
    }
  },
  TextVariantConfig: {
    isEnabled: true,
    supportInColumn: true,
    toolsConfig: { }
  },
  CodeConfig: {
    isEnabled: true,
    supportInColumn: true,
    toolsConfig: { }
  },
  PersonalityConfig: {
    isEnabled: true,
    supportInColumn: true,
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
    supportInColumn: true,
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
    supportInColumn: true,
    toolsConfig: {
      inlineCode: {
        shortcut: 'CMD+SHIFT+M'
      }
    }
  },
  UndoConfig: {
    isEnabled: true,
    supportInColumn: true,
    toolsConfig: {
      undo: 'CMD+X',
      redo: 'CMD+ALT+C'
    }
  },
  DragDropConfig: {
    isEnabled: true,
    supportInColumn: true
  },
  ColumnsConfig: {
    isEnabled: true
  },
  AlignmentTuneToolConfig: {
    isEnabled: true,
    toolsConfig: {
      alligment: {
        config: {
          default: 'left'
        }
      }
    }
  },
  TextAlignConfig: {
    isEnabled: true,
    supportInColumn: true
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
    tunes: [] as string[]
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

    const composables = resolver.resolve('./runtime/composables')
    addImportsDir(composables)

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
