
![npm](https://img.shields.io/npm/v/mongodb-models-visualizer)
![npm downloads](https://img.shields.io/npm/dw/mongodb-models-visualizer)
![license](https://img.shields.io/npm/l/mongodb-models-visualizer)
![node](https://img.shields.io/node/v/mongodb-models-visualizer)
![typescript](https://img.shields.io/badge/TypeScript-Ready-blue)
![GitHub stars](https://img.shields.io/github/stars/hibbanur-rahman/mongodb-visualizer?style=social)

# mongodb-visualizer

🚀 **Swagger-like Analyzer for MongoDB (Mongoose) Models**

Automatically analyze, visualize, and document your MongoDB models in a Node.js + Express application.

---

## ✨ What is mongodb-visualizer?

`mongodb-visualizer` is a developer tool that introspects your **Mongoose models** and provides:

- List of all registered models
- Schema fields with types & validations
- Model relationships (`ref`)
- Collection names
- Optional sample documents
- Swagger-like web UI
- JSON APIs for documentation & automation

Think of it as **Swagger, but for MongoDB schemas**.

---

## 🔧 Supported Stack

- Node.js ≥ 16
- Express ≥ 4
- Mongoose ≥ 6

---

## 📦 Installation

```bash
npm install mongodb-visualizer
```

or

```bash
yarn add mongodb-visualizer
```

## 🚀 Quick Start

### 1️⃣ Setup Express & Mongoose

```javascript
import express from 'express'
import mongoose from 'mongoose'
import { modelAnalyzer } from 'mongodb-visualizer'

const app = express()

mongoose.connect(process.env.MONGO_URI)
```

### 2️⃣ Mount the Analyzer Middleware

```javascript
app.use(
  '/models-analyzer',
  modelAnalyzer({
    mongoose
  })
)
```

### 3️⃣ Start the Server

```javascript
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
```

### 4️⃣ Open in Browser 🎉

Navigate to `http://localhost:3000/models-analyzer`

## 📊 API Endpoints

### 🔹 Get all models

```
GET /models-analyzer/api/models
```

**Example Response:**

```json
[
  {
    "name": "User",
    "collection": "users",
    "fields": [
      {
        "name": "email",
        "instance": "String",
        "required": true,
        "enum": [],
        "ref": null
      }
    ]
  }
]
```

### 🔹 Get a single model

```
GET /models-analyzer/api/models/:modelName
```

## ⚙️ Configuration Options

```javascript
modelAnalyzer({
  mongoose,          // required
  sampleDocs: true,  // optional (default: false)
  auth: false        // optional (default: false)
})
```

| Option | Type | Description |
|--------|------|-------------|
| mongoose | Object | Mongoose instance |
| sampleDocs | Boolean | Include sample documents |
| auth | Boolean | Enable auth middleware |

## ## 🔐 Security (Recommended for Production)

Do NOT expose this endpoint publicly without authentication.

**Example using basic auth:**

```javascript
import basicAuth from 'express-basic-auth'

app.use(
  '/models-analyzer',
  basicAuth({
    users: { admin: 'password' },
    challenge: true
  }),
  modelAnalyzer({ mongoose })
)
```

## 🧠 How It Works

1. Scans all registered Mongoose models
2. Extracts schema metadata
3. Parses fields, types, refs, and indexes
4. Builds structured JSON output
5. Serves data via API & UI

## 🗺️ Roadmap

### ✅ v0.1 (Current)

- Model scanner
- Schema parser
- JSON APIs

### 🚀 v0.2

- Swagger-like UI
- Relationship graph
- Index analyzer

### 🧠 v1.0

- Performance suggestions
- Migration hints
- CLI support
- Fastify & NestJS adapters

## 🤝 Contributing

Contributions are welcome!

```bash
git clone https://github.com/Hibbanur-Rahman/mongodb-visualizer.git
cd mongodb-visualizer
npm install
npm run build
```

Feel free to open issues or pull requests 🚀

## 📄 License

MIT License © 2026

## ❤️ Why This Tool?

- MongoDB has no built-in schema visualization
- Helps onboarding new developers
- Great for documentation & debugging
- Inspired by Swagger & Prisma Studio

---

**Next steps you can take:**
- Add npm badges
- Write a CONTRIBUTING.md
- Create a docs website
- Prepare a demo GIF

Let me know what's next! 🚀
