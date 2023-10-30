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
      tunes: ['textVariant', 'alligment']
    },
    EditorJsToolsConfig: {
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
              availableTargets: ['_blank', '_self'],
              availableRels: ['author', 'noreferrer'],
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
    },
    Api: defaultApi
  },
  components: [
    '~/components'
  ],
  vite: {
    optimizeDeps: {
      include: [
        '@editorjs/editorjs',
        '@editorjs/header',
        '@editorjs/image',
        '@editorjs/checklist',
        '@editorjs/link',
        '@editorjs/raw',
        '@editorjs/embed',
        '@editorjs/quote',
        '@editorjs/nested-list',
        '@editorjs/paragraph',
        '@editorjs/table',
        '@editorjs/attaches',
        '@editorjs/delimiter',
        '@editorjs/marker',
        'editorjs-change-case',
        'editorjs-hyperlink',
        '@editorjs/text-variant-tune',
        '@editorjs/code',
        '@editorjs/personality',
        '@editorjs/warning',
        '@editorjs/inline-code',
        'editorjs-text-color-plugin',
        'editorjs-undo',
        'editorjs-drag-drop',
        'editorjs-text-alignment-blocktune',
        '@canburaks/text-align-editorjs'
      ]
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
