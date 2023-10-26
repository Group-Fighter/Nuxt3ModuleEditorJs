import Undo from 'editorjs-undo'

import { type EditorJsToolsConfig, type ModuleOptions } from '../type'

export const initUndoModule = (editor: any) => {
  const config = {
    shortcuts: {
      undo: 'CMD+X',
      redo: 'CMD+ALT+C'
    }
  }
  // eslint-disable-next-line no-new
  new Undo({ editor, config })
}

// const UploadFile = (file: File): Promise<{ success: number; file: { url: string; } }> => {
//   return new Promise((resolve, reject) => {
//     const body = new FormData()
//     body.append('file', file)
//     $fetch(defaultApi.ImageTool.basePath, {
//       method: defaultApi.ImageTool.methods as any,
//       body
//     })
//       .then((response: unknown) => {
//         if (typeof response === 'object' && response !== null) {
//           // Check if the response has the expected structure
//           const { success, file } = response as { success: number; file: { url: string; } }
//           if (typeof success === 'number' && typeof file === 'object' && typeof file.url === 'string') {
//             resolve({ success, file })
//           } else {
//             reject(new Error('Invalid response'))
//           }
//         } else {
//           reject(new Error('Invalid response'))
//         }
//       })
//       .catch((error: unknown) => {
//         if (typeof error === 'object' && error !== null) {
//           reject(new Error('Upload failed'))
//         } else {
//           reject(new Error('Unknown error occurred'))
//         }
//       })
//   })
// }

// const UploadFileFromURL = (sourceUrl: string): Promise<{ success: number; file: { url: string; } }> => {
//   return new Promise((resolve, reject) => {
//     // First, download the file from the source URL
//     fetch(sourceUrl)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`Failed to download file. Status: ${response.status}`)
//         }
//         return response.blob()
//       })
//       .then((blob) => {
//         const body = new FormData()
//         body.append('file', blob)

//         // Upload the downloaded file to the destination
//         return $fetch(defaultApi.ImageTool.basePath, {
//           method: defaultApi.ImageTool.methods as any,
//           body
//         })
//       })
//       .then((response: unknown) => {
//         if (typeof response === 'object' && response !== null) {
//           // Check if the response has the expected structure
//           const { success, file } = response as { success: number; file: { url: string; } }
//           if (typeof success === 'number' && typeof file === 'object' && typeof file.url === 'string') {
//             resolve({ success, file })
//           } else {
//             reject(new Error('Invalid response'))
//           }
//         } else {
//           reject(new Error('Invalid response'))
//         }
//       })
//       .catch((error: unknown) => {
//         if (typeof error === 'object' && error !== null) {
//           reject(new Error('Upload failed'))
//         } else {
//           reject(new Error('Unknown error occurred'))
//         }
//       })
//   })
// }
