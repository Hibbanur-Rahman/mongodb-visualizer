import express from 'express'
import { scanModels } from '../core/scanModels'
import { parseSchema } from '../core/parseSchema'

export function modelAnalyzer(options: {
  mongoose: any
}) {
  const router = express.Router()

  router.get('/api/models', (req, res) => {
    const models = scanModels(options.mongoose).map((m) => ({
      name: m.name,
      collection: m.collection,
      fields: parseSchema(m.schema)
    }))

    res.json(models)
  })

  return router
}
