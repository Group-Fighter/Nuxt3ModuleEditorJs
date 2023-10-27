# nuxt-editorjs
Nuxt3 components for `@editorjs/editorjs`.

## Installation

- Run `git clone https://github.com/Group-Fighter/Nuxt3ModuleEditorJs.git` at module directory.

## Development

- Run `npm` to install required dependencies.
- Run `npm run dev:prepare` to generate type stubs.
- Use `npm run dev` to start [playground](./playground) in development mode.

- Use `npm run prepack` to build the module. [This module cannot be built into module build yet, I don't have a solution at this time, this error message Unexpected token (105:7) in \node_modules\@editorjs\editorjs\types\index.d.ts]

## Usage

- We expose a single `<NuxtEditorJs />` component.
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
    EditorJsConfig: {},
    EditorJsToolsConfig: {},
    Api: {}
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
