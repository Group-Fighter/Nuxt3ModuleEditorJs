# nuxt3-editorjs

[![Npm package version](https://badgen.net/npm/v/nuxt-editorjs)](https://npmjs.com/package/nuxt-editorjs)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

Nuxt 3 EditorJs for `@editorjs/editorjs`.

Inspiration from `https://github.com/wantpinow/nuxt-editorjs` and `https://github.com/ChangJoo-Park/vue-editor-js`

## Installation
- Run `npm i nuxt3-editorjs` to install from NPM.

## Development

- Run `npm install` to install required dependencies.
- Run `npm run dev:prepare` to generate type stubs.
- Use `npm run dev` to start [playground](./playground) in development mode.
- Use `npm run prepack` to build the module. 

## Supported Plugins

<table border="0" align="center" width="100%" >
<tr border="0">
  <td width="50%" align="left">
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
      <li><a href="https://github.com/editor-js/raw">Raw</a></li>
      <li><a href="https://github.com/kommitters/editorjs-drag-drop">Drag Drop</a></li>
      <li><a href="https://github.com/editor-js/table">Table</a></li>
    </ol>  
  </td>

  <td width="50%" align="left">
    <ol start="15">
      <li><a href="https://github.com/editor-js/warning">Warning</a></li>
      <li><a href="https://github.com/editor-js/paragraph">Paragraph</a></li>
      <li><a href="https://github.com/editor-js/checklist">Checklist</a></li>
      <li><a href="https://github.com/editor-js/attaches">Attaches</a></li>
      <li><a href="https://github.com/editor-js/text-variant-tune">Text Variant Tune</a></li>
      <li><a href="https://github.com/maziyank/editorjs-change-case">Change Case</a></li>
      <li><a href="https://github.com/trinhtam/editorjs-hyperlink">Hyperlink</a></li>
      <li><a href="https://github.com/kommitters/editorjs-undo">Undo</a></li>
      <li><a href="https://github.com/flaming-cl/editorjs-text-color-plugin">Text Color</a></li>
      <li><a href="https://github.com/pavittarx/editorjs-html">Parse HTML</a></li>
      <li><a href="https://github.com/calumk/editorjs-columns">Columns</a></li>
      <li><a href="https://github.com/canburaks/text-align-editorjs">Text Align</a></li>
      <li><a href="https://github.com/kaaaaaaaaaaai/editorjs-alignment-blocktune">Text Alignment tune</a></li>
    </ol>  
  </td>
</tr>
</table>



## Usage
- We expose an : 
  - One `<NuxtEditorJs />` component.
  - Three backend for upload file and one backend for scrape meta data (Link Tool)
  - One Composables `const { parse, parseBlock, parseStrict, validate } = useParseHtml(configParseHtml)` to parseHtml

```vue
<template>
  <div class="editor-page">
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
  </div>
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

// https://github.com/pavittarx/editorjs-html/tree/master#extend-for-custom-blocks
function customParser (block) {
  return `<custom-tag> ${block.data.text} </custom-tag>`
}
const configParseHtml = {
  custom: customParser
}
// https://github.com/pavittarx/editorjs-html
const { parse, parseBlock, parseStrict, validate } = useParseHtml(configParseHtml)

watch(tempData, (value) => {
  console.log(value)
   // using custom parse
  console.log(parse(value).join(''))
}, { deep: true, immediate: true })

</script>

<style css>
.editor-page{
  margin-left: 70px;
}
.editorjs-wrapper{
  border: 1px solid #eee;
  border-radius: 5px;
  padding:0px;
  margin-bottom: 10px;
  box-shadow: 0 6px 18px #e8edfa80;
}

.ce-editorjsColumns_col{
  border: 1px solid #eee;
  border-radius: 5px;
  gap: 10px;
  padding-top:10px;
}

.ce-editorjsColumns_col:focus-within{
  box-shadow: 0 6px 18px #e8edfa80;
}

</style>

```
## Configuration
- Add the module to your `nuxt.config.ts` file and optimise with vite:

```javascript
const defaultApi = {
  ImageTool: {
    basePath: '/api/upload-file',
    imageDir: './playground/public/imagetool',
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
    ],
    maxFileSize: 1000000
  },
  LinkTool: {
    basePath: '/api/meta-web'
  },
  AttachesTool: {
    basePath: '/api/attachment-file',
    imageDir: './playground/public/attachmenttool',
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
    ],
    maxFileSize: 1000000
  },
  PersonalityTool: {
    basePath: '/api/upload-personality-image',
    imageDir: './playground/public/personalitytool',
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
    ],
    maxFileSize: 1000000
  }
}

export default defineNuxtConfig({
  ...
  modules: ["nuxt3-editorjs"],
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
        '@calumk/editorjs-columns',
        'editorjs-text-alignment-blocktune',
        '@canburaks/text-align-editorjs',
        'editorjs-html'
        ],
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
// optional
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
