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
  const router = import_express.default.Router();
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  modelAnalyzer
});
