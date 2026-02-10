"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  modelAnalyzer: () => modelAnalyzer
});
module.exports = __toCommonJS(index_exports);

// src/express/middleware.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);

// src/core/scanModels.ts
var import_mongoose = require("mongoose");
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
var import_mongoose2 = require("mongoose");
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
var import_meta = {};
function modelAnalyzer(options) {
  const getUiDistPath = () => {
    try {
      if (typeof __dirname !== "undefined") {
        return import_path.default.join(__dirname, "../../ui/dist");
      }
    } catch {
    }
    try {
      const moduleDir = import_path.default.dirname(new URL(import_meta.url).pathname);
      return import_path.default.join(moduleDir, "../../ui/dist");
    } catch {
    }
    return import_path.default.join(process.cwd(), "node_modules/mongodb-models-visualizer/ui/dist");
  };
  const uiDistPath = getUiDistPath();
  const router = import_express.default.Router();
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
        error: error instanceof Error ? error.message : "An error occurred"
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
        error: error instanceof Error ? error.message : "An error occurred"
      });
    }
  });
  router.use("/assets", import_express.default.static(import_path.default.join(uiDistPath, "assets")));
  router.get("/", (req, res) => {
    res.sendFile(import_path.default.join(uiDistPath, "index.html"));
  });
  return router;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  modelAnalyzer
});
