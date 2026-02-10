import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { scanModels } from '../core/scanModels'
import { parseSchema } from '../core/parseSchema'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function modelAnalyzer(options: {
  mongoose: any
  path?: string
  title?: string
}) {
  const router = express.Router()
  const basePath = options.path || '/mongodb-visualizer'
  const title = options.title || 'MongoDB Model Visualizer'

  // API endpoint to get all models
  router.get('/api/models', (req, res) => {
    try {
      const models = scanModels(options.mongoose).map((m) => ({
        name: m.name,
        collection: m.collection,
        fields: parseSchema(m.schema)
      }))

      res.json({ 
        success: true,
        data: models,
        title: title 
      })
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      })
    }
  })

  // API endpoint to get single model details
  router.get('/api/models/:modelName', (req, res) => {
    try {
      const { modelName } = req.params
      const model = options.mongoose.model(modelName)
      
      if (!model) {
        return res.status(404).json({ 
          success: false, 
          error: 'Model not found' 
        })
      }

      res.json({
        success: true,
        data: {
          name: modelName,
          collection: model.collection.name,
          fields: parseSchema(model.schema)
        }
      })
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      })
    }
  })

  // Serve the React UI
  const uiDistPath = path.join(__dirname, '../../ui/dist')
  router.use('/assets', express.static(path.join(uiDistPath, 'assets')))
  
  router.get('/', (req, res) => {
    res.sendFile(path.join(uiDistPath, 'index.html'))
  })

  return router
}
