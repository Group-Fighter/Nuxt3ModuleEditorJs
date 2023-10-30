import edjsHTML from 'editorjs-html'

//  The Parser function of type "columns" is not defined.   Define your custom parser functions as:
function handlerColumnsParser (block:any) {
  return ''
}

export const useParseHtml = (config?:Object) => {
  const configParseHtml = Object.assign({}, config, { columns: handlerColumnsParser })
  const edjsParser = edjsHTML(configParseHtml)

  function parse (html:any) {
    if (typeof html === 'object' && Object.keys(html).length !== 0) {
      return edjsParser.parse(html)
    }
  }

  function parseBlock (html:any) {
    if (typeof html === 'object' && Object.keys(html).length !== 0) {
      return edjsParser.parseBlock(html)
    }
  }

  function parseStrict (html:any) {
    if (typeof html === 'object' && Object.keys(html).length !== 0) {
      return edjsParser.parseStrict(html)
    }
  }

  function validate (html:any) {
    if (typeof html === 'object' && Object.keys(html).length !== 0) {
      return edjsParser.validate(html)
    }
  }

  return {
    parse,
    parseBlock,
    parseStrict,
    validate
  }
}
