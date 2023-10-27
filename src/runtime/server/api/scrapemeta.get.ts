import * as cheerio from 'cheerio'
import { createError, defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const body = getQuery(event)
  const url = body.url

  if (url) {
    if (isValidURL(url as string)) {
      try {
        // Fetch the web page
        const response = await fetch(url.toString())
        if (!response.ok) {
          throw new Error(`Failed to fetch the URL: ${url}`)
        }

        // Parse the HTML content using Cheerio
        const html = await response.text()
        const $ = cheerio.load(html)

        // Extract meta information
        const data = {
          success: 1,
          link: url,
          meta: {
            title: $('meta[property="og:title"]').attr('content') || $('title').text(),
            site_name: $('meta[property="og:site_name"]').attr('content') || $('meta[property="og:site"]').attr('content'),
            description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content'),
            image: {
              url: $('meta[property="og:image"]').attr('content')
            }
          }
        }

        return data
      } catch (e) {
        return {
          success: 0,
          meta: {},
          message: e.message,
          statusCode: 422,
          statusMessage: 'Unprocessable Entity'
        }
      }
    } else {
      return {
        success: 0,
        meta: {},
        message: 'Invalid Url',
        statusCode: 422,
        statusMessage: 'Unprocessable Entity'
      }
    }
  } else {
    return {
      success: 0,
      meta: {},
      message: 'Url Not Found',
      statusCode: 422,
      statusMessage: 'Unprocessable Entity'
    }
  }
})
function isValidURL (url: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

// https://reffect.co.jp/en/nuxt/nuxt3-file-upload/
// https://github.com/czbone/nuxt3-image-upload-demo/tree/main
