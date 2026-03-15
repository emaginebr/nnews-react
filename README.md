# nnews-react - React Component Library for NNews CMS

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![npm version](https://img.shields.io/npm/v/nnews-react.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

## Overview

**nnews-react** is a React component library (npm package) for the NNews content management system. It provides ready-made components, hooks, API services, context providers, and a theming system that consuming applications integrate via `NNewsProvider`. Includes AI-powered article generation with ChatGPT and DALL-E 3.

Built with **TypeScript**, **Tailwind CSS**, **Radix UI**, and **i18next** for internationalization (English and Portuguese).

The `example-app/` directory contains a full working application demonstrating library usage in dark mode.

---

## 🚀 Features

### Content Management
- 📝 **Article Management** — Full CRUD with rich text (Quill), Markdown, and plain text editors
- 🤖 **AI-Powered Content** — Create and update articles with ChatGPT, generate images with DALL-E 3
- 📂 **Hierarchical Categories** — Parent-child category system with full CRUD
- 🏷️ **Tag System** — Flexible tagging with merge functionality
- 🔍 **Search & Filters** — Search articles by keyword, filter by category, status, tag, or roles
- 📄 **Pagination** — Built-in `PagedResult<T>` pattern with `hasNext`/`hasPrevious`
- 🖼️ **Image Upload** — Featured image upload with preview and placeholder fallback

### Architecture
- 🎨 **Theme System** — Configurable `light`/`dark`/`system` mode via `NNewsConfig.theme`
- 🌍 **Internationalization** — i18next with `nnews` namespace, EN/PT built-in, extensible
- 🏢 **Multi-tenancy** — `X-Tenant-Id` header injection via Axios interceptor
- 🔐 **Role-based Access** — Content visibility control per role
- 📦 **Tree-shakeable** — ESM + CJS dual output, import only what you need
- ♿ **Accessible** — Radix UI primitives with focus trapping, keyboard navigation, ARIA
- 📱 **Responsive** — Mobile-first Tailwind CSS design

### UI System
- 🪟 **Normalized Modals** — All modals use a single Radix-based `Modal` component
- ✅ **ConfirmModal** — Reusable confirmation dialog with danger/warning/default variants
- 🧩 **UI Primitives** — Button, Input, Label, Avatar, Modal components

---

## 🛠️ Technologies Used

### Core
- **React 18+** — UI framework (peer dependency)
- **TypeScript 5** — Type safety
- **Vite** — Build tooling with SWC plugin

### Styling & UI
- **Tailwind CSS** — Utility-first CSS with class-based dark mode
- **Radix UI** — Accessible Dialog, Dropdown, Select, Tabs, Toast primitives
- **class-variance-authority** — Component variant system
- **lucide-react** — Icon library

### Editors
- **react-quill-new** — WYSIWYG rich text editor (HTML)
- **react-markdown** + **remark-gfm** + **rehype-highlight** — Markdown rendering with syntax highlighting

### State & Data
- **Axios** — HTTP client with interceptors
- **react-hook-form** + **Zod** — Form handling and validation
- **i18next** + **react-i18next** — Internationalization

### Testing
- **Vitest** — Unit test runner with coverage

---

## 📁 Project Structure

```
nnews-react/
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # Primitives (Button, Input, Modal, ConfirmModal, etc.)
│   │   ├── ArticleList.tsx  # Article grid with image placeholders
│   │   ├── ArticleEditor.tsx # Multi-format article editor
│   │   ├── ArticleViewer.tsx # Article display (Markdown/HTML/Plain)
│   │   ├── AIArticleGenerator.tsx # AI content generation modal
│   │   ├── CategoryList.tsx # Category table
│   │   ├── CategoryModal.tsx # Category create/edit modal
│   │   ├── TagList.tsx      # Tag chips with actions
│   │   ├── TagModal.tsx     # Tag create/edit modal
│   │   ├── TagMerge.tsx     # Tag merge modal
│   │   ├── RichTextEditor.tsx # Quill WYSIWYG editor
│   │   └── MarkdownEditor.tsx # Markdown editor with preview
│   ├── contexts/            # NNewsContext (provider, config, Axios setup)
│   ├── hooks/               # useArticles, useCategories, useTags
│   ├── services/            # ArticleAPI, CategoryAPI, TagAPI
│   ├── types/               # TypeScript types, enums, theme config
│   ├── i18n/                # i18next setup, EN/PT translations
│   ├── utils/               # cn(), validators
│   ├── styles/              # Tailwind CSS base styles
│   └── index.ts             # Public API exports
├── example-app/             # Full demo application (dark mode)
├── docs/                    # Additional documentation
├── dist/                    # Build output (ESM + CJS + types + CSS)
└── package.json
```

---

## ⚙️ Installation

```bash
npm install nnews-react
```

**Peer dependencies:**

```bash
npm install react react-dom react-router-dom nauth-react
```

**Tailwind CSS setup:**

```bash
npm install -D tailwindcss postcss autoprefixer tailwindcss-animate
```

```javascript
// tailwind.config.js
export default {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/nnews-react/dist/**/*.{js,mjs}',
  ],
  plugins: [require('tailwindcss-animate')],
};
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 📖 Quick Start

### 1. Setup Provider

```tsx
import { NNewsProvider } from 'nnews-react';
import 'nnews-react/styles';

function App() {
  return (
    <NNewsProvider
      config={{
        apiUrl: import.meta.env.VITE_NNEWS_API_URL,
        tenantId: import.meta.env.VITE_TENANT_ID,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        language: 'en',        // 'en' | 'pt'
        theme: {
          mode: 'dark',        // 'light' | 'dark' | 'system'
        },
      }}
    >
      <YourApp />
    </NNewsProvider>
  );
}
```

### 2. Use Components

```tsx
import {
  ArticleList,
  ArticleEditor,
  ArticleViewer,
  AIArticleGenerator,
  CategoryList,
  CategoryModal,
  TagList,
  TagModal,
  TagMerge,
  ConfirmModal,
  useArticles,
  useCategories,
  useTags,
} from 'nnews-react';
```

### 3. Fetch and Display Articles

```tsx
function ArticlesPage() {
  const { articles, loading, fetchArticles, deleteArticle } = useArticles();

  useEffect(() => {
    fetchArticles({ page: 1, pageSize: 10, status: 1 }); // Published only
  }, []);

  return (
    <ArticleList
      articles={articles}
      loading={loading}
      onArticleClick={(article) => navigate(`/articles/${article.articleId}`)}
      onEditClick={(article) => navigate(`/articles/edit/${article.articleId}`)}
      onDeleteClick={(article) => setArticleToDelete(article)}
      showActions
    />
  );
}
```

---

## 🔧 NNewsProvider Configuration

```tsx
interface NNewsConfig {
  apiUrl: string;                              // Required — NNews API base URL
  tenantId?: string;                           // Multi-tenant ID (X-Tenant-Id header)
  apiClient?: AxiosInstance;                   // Custom Axios instance
  headers?: Record<string, string>;            // Dynamic headers (e.g., Authorization)
  language?: string;                           // 'en' | 'pt' (default: 'en')
  translations?: Record<string, Record<string, unknown>>; // Custom translations
  theme?: {
    mode?: 'light' | 'dark' | 'system';       // Theme mode (default: 'system')
    classNames?: {                             // CSS class overrides
      root?: string;
      card?: string;
      table?: string;
      modal?: string;
      button?: string;
      input?: string;
    };
  };
}
```

The provider creates an Axios instance with request interceptors that inject `Authorization` and `X-Tenant-Id` headers dynamically. It also wraps children in a themed container with the `dark` class when appropriate.

---

## 📚 Hooks API

### useArticles

```tsx
const {
  articles,         // PagedResult<Article> | null
  loading,          // boolean
  error,            // Error | null
  fetchArticles,    // (params?: ArticleSearchParams) => Promise<void>
  getArticleById,   // (id: number) => Promise<Article>
  createArticle,    // (article: ArticleInput) => Promise<Article>
  updateArticle,    // (article: ArticleUpdate) => Promise<Article>
  deleteArticle,    // (id: number) => Promise<void>
  refresh,          // () => Promise<void>
} = useArticles();

// ArticleSearchParams supports:
// categoryId, status, roles, tags, searchTerm, page, pageSize
```

### useCategories

```tsx
const {
  categories,       // Category[]
  loading,
  error,
  fetchCategories,  // (params?: CategoryFilterParams) => Promise<void>
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  refresh,
} = useCategories();
```

### useTags

```tsx
const {
  tags,             // Tag[]
  loading,
  error,
  fetchTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  mergeTags,        // (sourceId: number, targetId: number) => Promise<void>
  refresh,
} = useTags();
```

---

## 🔌 API Services

The library exposes class-based API clients that can be used directly:

```tsx
import { ArticleAPI, CategoryAPI, TagAPI } from 'nnews-react';
import axios from 'axios';

const client = axios.create({ baseURL: 'https://your-api.com' });
const articleApi = new ArticleAPI(client);

// Article endpoints
await articleApi.listArticles(categoryId?, status?, page, pageSize);
await articleApi.listByCategory(categoryId, page, pageSize);
await articleApi.listByRoles(page, pageSize);
await articleApi.listByTag(tagSlug, page, pageSize);
await articleApi.search(keyword, page, pageSize);
await articleApi.getArticleById(id);
await articleApi.createArticle(data);
await articleApi.updateArticle(data);
await articleApi.deleteArticle(id);
await articleApi.uploadImage(file);
await articleApi.createArticleWithAI(request);
await articleApi.updateArticleWithAI(request);

// Category endpoints
const categoryApi = new CategoryAPI(client);
await categoryApi.listCategories();
await categoryApi.listByParent(roles?, parentId?);
await categoryApi.getCategoryById(id);
await categoryApi.createCategory(data);
await categoryApi.updateCategory(data);
await categoryApi.deleteCategory(id);

// Tag endpoints
const tagApi = new TagAPI(client);
await tagApi.listTags();
await tagApi.listByRoles();
await tagApi.getTagById(id);
await tagApi.createTag(data);
await tagApi.updateTag(data);
await tagApi.deleteTag(id);
await tagApi.mergeTags(sourceId, targetId);
```

---

## 🪟 Modal System

All modals use a single normalized `Modal` component built on Radix UI Dialog:

```tsx
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  ModalTitle, ModalDescription, ModalClose,
  ConfirmModal,
} from 'nnews-react';

// Confirmation dialog
<ConfirmModal
  open={isOpen}
  onOpenChange={setIsOpen}
  onConfirm={handleDelete}
  title="Delete Article"
  description="This action cannot be undone."
  confirmLabel="Delete"
  variant="danger"    // 'danger' | 'warning' | 'default'
  loading={isDeleting}
/>

// Custom modal
<Modal open={isOpen} onOpenChange={setIsOpen}>
  <ModalContent className="max-w-2xl">
    <ModalHeader>
      <ModalTitle>Edit Item</ModalTitle>
      <ModalDescription>Fill in the details below.</ModalDescription>
    </ModalHeader>
    <ModalBody>
      {/* Your form content */}
    </ModalBody>
    <ModalFooter>
      <ModalClose asChild>
        <button>Cancel</button>
      </ModalClose>
      <button onClick={handleSave}>Save</button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

---

## 🌍 Internationalization

Built-in translations for English and Portuguese. Extend with custom translations:

```tsx
<NNewsProvider
  config={{
    apiUrl: '...',
    language: 'pt',
    translations: {
      en: { custom_key: 'Custom value' },
      pt: { custom_key: 'Valor customizado' },
    },
  }}
>
```

---

## 🔒 TypeScript Types

```tsx
import type {
  Article, ArticleInput, ArticleUpdate, AIArticleRequest,
  Category, CategoryInput, CategoryUpdate,
  Tag, TagInput, TagUpdate,
  PagedResult, Role,
  NNewsConfig, NNewsTheme, NNewsThemeMode,
  ArticleSearchParams, CategoryFilterParams, TagSearchParams,
} from 'nnews-react';

import { ArticleStatus, ContentType } from 'nnews-react';
// ArticleStatus: Draft(0), Published(1), Archived(2), Scheduled(3), Review(4)
// ContentType: PlainText(1), Html(2), MarkDown(3)
```

---

## ⚙️ Environment Variables (Example App)

```bash
cp example-app/.env.example example-app/.env
```

```bash
VITE_API_URL=http://localhost:5007        # NAuth backend URL
VITE_NNEWS_API_URL=http://localhost:5008  # NNews backend URL
VITE_TENANT_ID=my-tenant                  # Tenant identifier
```

---

## 🧪 Testing

```bash
npm test                # Run tests once
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report (text, JSON, HTML)
```

---

## 🔧 Development

```bash
# Library (root)
npm install             # Install dependencies
npm run dev             # Vite dev server
npm run build           # Type-check + Vite build (outputs to dist/)
npm run lint            # ESLint
npm run type-check      # tsc --noEmit

# Example App (example-app/)
cd example-app
npm install
npm run dev             # Start dev server
npm run build           # Production build
```

### Build Output

The library outputs both ESM and CJS with TypeScript declarations:

| File | Description |
|------|-------------|
| `dist/index.js` | ES Module bundle |
| `dist/index.cjs` | CommonJS bundle |
| `dist/index.d.ts` | TypeScript declarations |
| `dist/style.css` | Bundled CSS styles |

---

## 🔄 CI/CD

### GitHub Actions

- **version-tag.yml** — Semantic versioning with GitVersion on push to `main`
- **npm-publish.yml** — Publishes to NPM on tag creation
- **create-release.yml** — GitHub release creation

---

## 📖 Additional Documentation

| Document | Description |
|----------|-------------|
| [AI Features Guide](docs/AI_FEATURES_GUIDE.md) | ChatGPT and DALL-E 3 integration details |
| [Changelog](docs/CHANGELOG.md) | Version history and changes |
| [Role API Documentation](docs/ROLE_API_DOCUMENTATION.md) | Role management API reference |
| [Testing Guide](docs/TESTING_GUIDE.md) | Testing patterns and conventions |
| [Update Summary](docs/UPDATE_SUMMARY.md) | Recent update summary |
| [User API Documentation](docs/USER_API_DOCUMENTATION.md) | User management API reference |

---

## 📦 Publishing

```bash
npm run build
npm publish --access public
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 👨‍💻 Author

Developed by **[Rodrigo Landim](https://github.com/landim32)**

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/landim32/NNews.React/issues)
- **NPM**: [nnews-react](https://www.npmjs.com/package/nnews-react)

---

**⭐ If you find this project useful, please consider giving it a star!**
