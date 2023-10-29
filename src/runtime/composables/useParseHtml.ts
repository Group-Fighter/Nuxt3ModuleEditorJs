import edjsHTML from 'editorjs-html'

export const useParseHtml = (config?:Object) => {
  const edjsParser = edjsHTML(config)

  function parse (html:any) {
    return edjsParser.parse(html)
  }

  function parseBlock (html:any) {
    return edjsParser.parseBlock(html)
  }

  function parseStrict (html:any) {
    return edjsParser.parseStrict(html)
  }

  function validate (html:any) {
    return edjsParser.validate(html)
  }

  return {
    parse,
    parseBlock,
    parseStrict,
    validate
  }
}
