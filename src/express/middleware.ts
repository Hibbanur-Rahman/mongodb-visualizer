import express, { type IRouter } from 'express'
import path from 'path'
import type { Mongoose } from 'mongoose'
import { scanModels } from '../core/scanModels'
import { parseSchema } from '../core/parseSchema'

export function modelAnalyzer(options: {
  mongoose: Mongoose
  path?: string
  title?: string
}) {
  // Compute __dirname inside the function to avoid ESM/CJS conflicts
  const getUiDistPath = () => {
    // Fallback
    return path.join(process.cwd(), 'node_modules/mongodb-models-visualizer/dist/ui')
  }

  const uiDistPath = getUiDistPath()
  const router: IRouter = express.Router()
  const title = options?.title || 'MongoDB Model Visualizer'

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
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred'
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
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      })
    }
  });

  // API endpoint to get actual data from a collection
  router.get('/api/models/:modelName/data', async (req, res) => {
    try {
      const { modelName } = req.params
      const { limit = 50, skip = 0, sort = '-_id' } = req.query

      const model = options.mongoose.model(modelName)

      if (!model) {
        return res.status(404).json({
          success: false,
          error: 'Model not found'
        })
      }

      // Parse limit and skip as numbers
      const limitNum = Math.min(Number(limit) || 50, 100) // Max 100 records
      const skipNum = Number(skip) || 0

      // Fetch data with pagination
      const data = await model.find()
        .limit(limitNum)
        .skip(skipNum)
        .sort(sort as string)
        .lean()
        .exec()

      // Get total count
      const totalCount = await model.countDocuments().exec()

      res.json({
        success: true,
        data: {
          records: data,
          pagination: {
            total: totalCount,
            limit: limitNum,
            skip: skipNum,
            hasMore: (skipNum + limitNum) < totalCount
          }
        }
      })
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      })
    }
  });

  // Serve all static files from the dist folder
  router.use(express.static(uiDistPath))

  // Serve index.html for the root route
  router.get('/', (req, res) => {
    res.sendFile(path.join(uiDistPath, 'index.html'))
  })

  return router
}
