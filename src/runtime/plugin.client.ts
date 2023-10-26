// @ts-ignore
import { defineNuxtPlugin } from '#app'
import { NuxtEditorJs } from './composables/Editorjs.client'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('NuxtEditorJs', NuxtEditorJs)
})
