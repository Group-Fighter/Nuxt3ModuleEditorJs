// @ts-ignore
import { defineNuxtPlugin } from '#app'
import { NuxtEditorJs } from './components/Editorjs.client'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('NuxtEditorJs', NuxtEditorJs)
})
