# nuxt3-editorjs

[![Npm package version](https://badgen.net/npm/v/nuxt-editorjs)](https://npmjs.com/package/nuxt-editorjs)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

Nuxt 3 EditorJs for `@editorjs/editorjs`.

Inspiration from `https://github.com/wantpinow/nuxt-editorjs` and `https://github.com/ChangJoo-Park/vue-editor-js`

## Installation
- Run `git clone https://github.com/Group-Fighter/Nuxt3ModuleEditorJs.git` at module directory.

## Development

- Run `npm install` to install required dependencies.
- Run `npm run dev:prepare` to generate type stubs.
- Use `npm run dev` to start [playground](./playground) in development mode.
> [!WARNING]
> - Use `npm run prepack` to build the module. 
> - [This module cannot be built into module build yet, I don't have a solution at this time, this error message Unexpected token (105:7) in \node_modules\@editorjs\editorjs\types\index.d.ts]
> - NodeJs v18.17.1
> - Nuxt v3.8.0
> - @nuxt/module-builder latest

## Supported Plugins

<table border="0" align="center" width="100%" >
<tr border="0">
  <td width="50%" align="center">
    <ol>
      <li><a href="https://github.com/editor-js/personality">Personality</a></li>
      <li><a href="https://github.com/editor-js/header">Header</a></li>
      <li><a href="https://github.com/editor-js/nested-list">Nested List</a></li>
      <li><a href="https://github.com/editor-js/image">Image</a></li>
      <li><a href="https://github.com/editor-js/inline-code">InlineCode</a></li>
      <li><a href="https://github.com/editor-js/embed">Embed</a></li>
      <li><a href="https://github.com/editor-js/quote">Quote</a></li>
      <li><a href="https://github.com/editor-js/marker">Marker</a></li>
      <li><a href="https://github.com/editor-js/code">Code</a></li>
      <li><a href="https://github.com/editor-js/link">Link</a></li>
      <li><a href="https://github.com/editor-js/delimiter">Delimiter</a></li>
    </ol>  
  </td>

  <td width="50%" align="center">
    <ol start="14">
      <li><a href="https://github.com/editor-js/raw">Raw</a></li>
      <li><a href="https://github.com/editor-js/table">Table</a></li>
      <li><a href="https://github.com/editor-js/warning">Warning</a></li>
      <li><a href="https://github.com/editor-js/paragraph">Paragraph</a></li>
      <li><a href="https://github.com/editor-js/checklist">Checklist</a></li>
      <li><a href="https://github.com/editor-js/attaches">Attaches</a></li>
      <li><a href="https://github.com/editor-js/text-variant-tune">Text Variant Tune</a></li>
      <li><a href="https://github.com/maziyank/editorjs-change-case">Change Case</a></li>
      <li><a href="https://github.com/trinhtam/editorjs-hyperlink">Hyperlink</a></li>
      <li><a href="https://github.com/kommitters/editorjs-undo">Undo</a></li>
      <li><a href="https://github.com/flaming-cl/editorjs-text-color-plugin">Text Color</a></li>
    </ol>  
  </td>
</tr>
</table>



## Usage
- We expose a : 
  - Single `<NuxtEditorJs />` component.
  - Three backend for upload file and one backend for scrape meta data (Link Tool)

```vue
<template>
  <ClientOnly>
    <NuxtEditorJs
      v-model:modelValue="tempData"
      :config="config"
      :holder="holder"
      :on-ready="onReady"
      :on-change="onChange"
      :initialized="onInitialized"
    />
  </ClientOnly>
</template>

<script setup>
// this example to import external plugin
import List from '@editorjs/list'
// this for register id component
const holder = 'nuxt-editor-js'
//  you can use another config editorjs
const config = {
  tools: {
    list: {
      class: List,
      inlineToolbar: true,
      config: {
        defaultStyle: 'unordered'
      }
    },
    ...
  },
  ...
}
// config for onReady at this not that config
const onReady = (args) => {
  console.log('on ready')
}
// config for onChange at this not that config
const onChange = (args) => {
  console.log('Now I know that Editor\'s content changed!')
}
const data = {}
const tempData = ref(data)
// this for trigger the plugin
const onInitialized = (NuxtEditorJs) => {
  console.log(NuxtEditorJs)
}

watch(dat, (value) => {
  console.log(value)
}, { deep: true, immediate: true })

</script>
```
## Configuration
- Add the module to your `nuxt.config.ts` file and optimise with vite:

```javascript
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
  ...
  modules: ["~/module/[directory name for this module]/module"],
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
  vite: {
    optimizeDeps: {
      include: ["@editorjs/editorjs"],
    },
    // optional
    build: {
      rollupOptions: {
        output: {
          format: 'es'
        }
      }
    }
  },
  ...
});
```
- Add the setting to your `tsconfig.ts` file:

```javascript
{
  "compilerOptions": {
    "module": "ESNext",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "allowJs": true,
    "noImplicitAny": false,
    "skipLibCheck": true
  },
}
```
