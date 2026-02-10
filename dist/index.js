// src/express/middleware.ts
import express from "express";
import path from "path";

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
  schema.eachPath((path2, type) => {
    const fieldInfo = {
      name: path2,
      type: type.instance || "Mixed",
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
    };
    Object.keys(fieldInfo).forEach((key) => {
      if (fieldInfo[key] === void 0) {
        delete fieldInfo[key];
      }
    });
    fields.push(fieldInfo);
  });
  return fields;
}

// src/express/middleware.ts
function modelAnalyzer(options) {
  const getUiDistPath = () => {
    try {
      if (typeof __dirname !== "undefined") {
        return path.join(__dirname, "../../ui/dist");
      }
    } catch {
    }
    try {
      const moduleDir = path.dirname(new URL(import.meta.url).pathname);
      return path.join(moduleDir, "../../ui/dist");
    } catch {
    }
    return path.join(process.cwd(), "node_modules/mongodb-models-visualizer/ui/dist");
  };
  const uiDistPath = getUiDistPath();
  const router = express.Router();
  const basePath = options.path || "/mongodb-visualizer";
  const title = options.title || "MongoDB Model Visualizer";
  router.get("/api/models", (req, res) => {
    try {
      const models = scanModels(options.mongoose).map((m) => ({
        name: m.name,
        collection: m.collection,
        fields: parseSchema(m.schema)
      }));
      res.json({
        success: true,
        data: models,
        title
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
  router.get("/api/models/:modelName", (req, res) => {
    try {
      const { modelName } = req.params;
      const model = options.mongoose.model(modelName);
      if (!model) {
        return res.status(404).json({
          success: false,
          error: "Model not found"
        });
      }
      res.json({
        success: true,
        data: {
          name: modelName,
          collection: model.collection.name,
          fields: parseSchema(model.schema)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
  router.use("/assets", express.static(path.join(uiDistPath, "assets")));
  router.get("/", (req, res) => {
    res.sendFile(path.join(uiDistPath, "index.html"));
  });
  return router;
}
export {
  modelAnalyzer
};
