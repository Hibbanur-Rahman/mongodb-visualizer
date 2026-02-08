import { Schema } from 'mongoose'

export function parseSchema(schema: Schema) {
  const fields: any[] = []

  schema.eachPath((path, type: any) => {
    fields.push({
      name: path,
      instance: type.instance,
      required: !!type.isRequired,
      enum: type.enumValues || [],
      ref: type.options?.ref
    })
  })

  return fields
}
