import { Schema, SchemaType } from 'mongoose'

interface FieldInfo {
  name: string
  type: string
  required: boolean
  unique?: boolean
  index?: boolean
  default?: unknown
  enum?: unknown[]
  ref?: string
  min?: number
  max?: number
  minlength?: number
  maxlength?: number
  match?: string
  lowercase?: boolean
  uppercase?: boolean
  trim?: boolean
  isArray?: boolean
}

export function parseSchema(schema: Schema) {
  const fields: FieldInfo[] = []

  schema.eachPath((path, type: SchemaType) => {
    const fieldInfo: Partial<FieldInfo> = {
      name: path,
      type: type.instance || 'Mixed',
      required: !!type.isRequired,
      unique: !!type.options?.unique,
      index: !!type.options?.index,
      default: type.options?.default,
      enum: type.options?.enum || [],
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
      if (fieldInfo[key as keyof FieldInfo] === undefined) {
        delete fieldInfo[key as keyof FieldInfo]
      }
    })

    fields.push(fieldInfo as FieldInfo)
  })

  return fields
}
