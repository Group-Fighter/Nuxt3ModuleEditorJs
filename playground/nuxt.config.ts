import { defineNuxtConfig } from 'nuxt/config'
import EditorJS from '../src/module'

const defaultApi = {
  ImageTool: {
    basePath: '/api/upload-file',
    imageDir: './playground/public/imagetool',
    mime: ['image/png', 'image/jpeg', 'image/gif'],
    maxFileSize: 1000000
  },
  LinkTool: {
    basePath: '/api/meta-web'
  },
  AttachesTool: {
    basePath: '/api/attachment-file',
    imageDir: './playground/public/attachmenttool',
    mime: ['image/png', 'image/jpeg', 'image/gif'],
    maxFileSize: 1000000
  },
  PersonalityTool: {
    basePath: '/api/upload-personality-image',
    imageDir: './playground/public/personalitytool',
    mime: ['image/png', 'image/jpeg', 'image/gif'],
    maxFileSize: 1000000
  }
}

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
      inlineToolbar: ['bold', 'italic', 'underline'],
      tunes: ['textVariant']
    },
    EditorJsToolsConfig: {
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
      }
    },
    Api: defaultApi
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
