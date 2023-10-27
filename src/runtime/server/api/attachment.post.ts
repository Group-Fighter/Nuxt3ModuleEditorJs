import fs from 'fs'
import multer, { diskStorage } from 'multer'
import { callNodeListener, createError, defineEventHandler, getRequestProtocol, getRequestHost, type NodeMiddleware } from 'h3'
import { type ApiAttachesToolOptions } from '../../../types'
import { GenerateRandomString, cleanURL } from '../../utils'
// @ts-ignore
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig().public.Nuxt3EditorJS.Api.AttachesTool as ApiAttachesToolOptions

const storage = diskStorage({
  // Tentukan tempat menyimpan file
  destination: function (req, file, cb) {
    fs.mkdirSync(config.imageDir, { recursive: true })
    cb(null, config.imageDir)
  },
  // Tentukan nama file (pertahankan nama file asli)
  filename: function (req, file, cb) {
    // Generate a unique filename, e.g., using a UUID or timestamp
    const uniqueFileName = `${Date.now()}_${GenerateRandomString(20)}`
    cb(null, uniqueFileName)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: config.maxFileSize
  },

  fileFilter (req, file, cb) {
    // Create a regular expression pattern from allowedMimes
    const mimePattern = config.mime.map((mime) => {
      const mimeParts = mime.split('/')
      const mimeType = mimeParts[1].replace(/\./g, '\\.')
      return mimeType
    }).join('|')

    // Now you can use mimePattern in your validation
    const mimeRegex = new RegExp(`\\.(${mimePattern})$`, 'i')

    // validation with extention
    if (!file.originalname.match(mimeRegex)) {
      return cb(new Error('Please upload a valid image file'))
    }
    // validation with mime
    if (!config.mime.includes(file.mimetype)) {
      return cb(new Error('MIME tidak valid'))
    }
    cb(null, true)
  }
})

export default defineEventHandler(async (event) => {
  const host = getRequestProtocol(event) + '://' + getRequestHost(event)
  try {
    await callNodeListener(upload.single('file') as NodeMiddleware, event.node.req, event.node.res)
    // If the upload was successful, you can construct the URL and return it
    // @ts-ignore
    const uploadedFile = event.node.req.file

    const imageUrl = `${host}/${config.imageDir}/${uploadedFile.filename}` // Adjust this URL construction based on your server configuration
    return { success: 1, file: { url: cleanURL(imageUrl) } }
  } catch (e) {
    return {
      success: 0,
      meta: {},
      message: 'Invalid Url',
      statusCode: 422,
      statusMessage: 'Unprocessable Entity'
    }
  }
})
