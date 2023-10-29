import edjsHTML from 'editorjs-html'
import { ref } from 'vue'

export const useParseHtml = (config?:Object) => {
  const edjsParser = edjsHTML(config)
  const html = ref([])

  function parse (html) {
    html.value = edjsParser.parse(html)
  }

  function parseBlock (html) {
    html.value = edjsParser.parseBlock(html)
  }

  function parseStrict (html) {
    html.value = edjsParser.parseStrict(html)
  }

  function validate (html) {
    html.value = edjsParser.validate(html)
  }

  function result () {
    return html.value
  }

  function resultString () {
    return html.value.join('')
  }

  return {
    parse,
    parseBlock,
    parseStrict,
    validate,
    result,
    resultString
  }
}
