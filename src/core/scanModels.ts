import { Mongoose } from 'mongoose'

export function scanModels(mongoose: Mongoose) {
  return mongoose.modelNames().map((name) => {
    const model = mongoose.model(name)
    return {
      name,
      collection: model.collection.name,
      schema: model.schema
    }
  })
}
