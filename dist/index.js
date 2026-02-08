// src/express/middleware.ts
import express from "express";

// src/core/scanModels.ts
import "mongoose";
function scanModels(mongoose) {
  return mongoose.modelNames().map((name) => {
    const model = mongoose.model(name);
    return {
      name,
      collection: model.collection.name,
      schema: model.schema
    };
  });
}

// src/core/parseSchema.ts
import "mongoose";
function parseSchema(schema) {
  const fields = [];
  schema.eachPath((path, type) => {
    fields.push({
      name: path,
      instance: type.instance,
      required: !!type.isRequired,
      enum: type.enumValues || [],
      ref: type.options?.ref
    });
  });
  return fields;
}

// src/express/middleware.ts
function modelAnalyzer(options) {
  const router = express.Router();
  router.get("/api/models", (req, res) => {
    const models = scanModels(options.mongoose).map((m) => ({
      name: m.name,
      collection: m.collection,
      fields: parseSchema(m.schema)
    }));
    res.json(models);
  });
  return router;
}
export {
  modelAnalyzer
};
