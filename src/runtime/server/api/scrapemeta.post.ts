import fs from 'fs'
import * as cheerio from 'cheerio'
import { createError, defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    // Fetch the web page
    const response = await fetch(body.url)
    if (!response.ok) {
      throw new Error(`Failed to fetch the URL: ${body.url}`)
    }

    // Parse the HTML content using Cheerio
    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract meta information
    const data = {
      success: 1,
      link: body.url,
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
    return createError({
      message: e.message,
      statusCode: 422,
      statusMessage: 'Unprocessable Entity'
    })
  }
})

function cleanURL (url: string): string {
  // Remove "./playground"
  url = url.replace('/./playground', '')
  url = url.replace(/\/\.\//, '/')

  // Remove "public" or "assets"
  url = url.replace(/\/(public|assets)\//, '/')

  // Remove any leading and trailing slashes
  url = url.replace(/^\/+|\/+$/g, '')

  return url
}

// https://reffect.co.jp/en/nuxt/nuxt3-file-upload/
// https://github.com/czbone/nuxt3-image-upload-demo/tree/main
