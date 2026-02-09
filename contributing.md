# Contributing to mongodb-models-analyzer

First of all, thank you for considering contributing 🙌  
Contributions of all kinds are welcome — code, docs, ideas, or bug reports.

---

## 🧠 Project Philosophy

- Simple developer experience
- Zero-config integration
- Clear and readable code
- Framework-agnostic core

---

## 🛠️ Tech Stack

- TypeScript
- Node.js
- Express
- Mongoose
- tsup (build tool)

---

## 🚀 Getting Started

### 1️⃣ Fork the Repository
Click the **Fork** button on GitHub.

### 2️⃣ Clone Your Fork
```bash
git clone https://github.com/<your-username>/mongodb-models-analyzer.git
cd mongodb-models-analyzer
```

### 3️⃣ Install Dependencies
```bash
npm install
```

### 4️⃣ Build the Package
```bash
npm run build
```

---

## 📂 Project Structure
```
src/
├── core/        # Model scanning & analysis logic
├── express/     # Express middleware
├── ui/          # Swagger-like UI (future)
└── index.ts     # Public API
```

---

## 🧪 Testing Locally

You can test the package using npm link:

```bash
npm link
```

In your test Express app:

```bash
npm link mongodb-models-analyzer
```

---

## 🧾 Coding Guidelines

- Use TypeScript
- Prefer pure functions in `core/`
- Avoid breaking changes without discussion
- Add comments for non-obvious logic
- Follow existing code style

---

## 🐛 Reporting Bugs

When opening an issue, please include:

- Node.js version
- Mongoose version
- Minimal reproducible example
- Expected vs actual behavior

---

## ✨ Feature Requests

Feature ideas are welcome!  
Please open an issue and describe:

- Use case
- Expected output
- Why it's useful

---

## 🔀 Pull Request Process

1. Create a feature branch
2. Make your changes
3. Run `npm run build`
4. Open a PR with a clear description
5. Reference related issues if any
