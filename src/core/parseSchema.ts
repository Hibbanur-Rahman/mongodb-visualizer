import { Schema } from 'mongoose'

export function parseSchema(schema: Schema) {
  const fields: any[] = []

  schema.eachPath((path, type: any) => {
    const fieldInfo: any = {
      name: path,
      type: type.instance || 'Mixed',
      required: !!type.isRequired,
      unique: !!type.options?.unique,
      index: !!type.options?.index,
      default: type.options?.default,
      enum: type.enumValues || [],
      ref: type.options?.ref,
      min: type.options?.min,
      max: type.options?.max,
      minlength: type.options?.minlength,
      maxlength: type.options?.maxlength,
      match: type.options?.match?.toString(),
      lowercase: type.options?.lowercase,
      uppercase: type.options?.uppercase,
      trim: type.options?.trim,
      isArray: Array.isArray(type.options?.type)
    }

    // Clean up undefined values
    Object.keys(fieldInfo).forEach(key => {
      if (fieldInfo[key] === undefined) {
        delete fieldInfo[key]
      }
    })

    fields.push(fieldInfo)
  })

  return fields
}
