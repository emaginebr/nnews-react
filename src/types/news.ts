// ============================================================================
// Core Enums
// ============================================================================

export enum ArticleStatus {
  Draft = 0,
  Published = 1,
  Archived = 2,
  Scheduled = 3,
  Review = 4,
}

export enum ContentType {
  PlainText = 1,
  Html = 2,
  MarkDown = 3,
}

// ============================================================================
// Core Interfaces
// ============================================================================

export interface Role {
  slug: string;
  name: string;
}

export interface Tag {
  tagId?: number;
  title: string;
  slug?: string;
  articleCount?: number;
}

export interface Category {
  categoryId: number;
  parentId?: number;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
  articleCount?: number;
}

export interface Article {
  articleId: number;
  categoryId?: number;
  authorId?: number;
  title: string;
  content: string;
  imageName?: string;
  imageUrl?: string;
  status: ArticleStatus;
  contentType?: ContentType;
  dateAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  category?: Category;
  tags?: Tag[];
  roles?: Role[];
}

// ============================================================================
// Input/Update Interfaces
// ============================================================================

export interface TagInput {
  title: string;
  slug?: string;
}

export interface TagUpdate extends TagInput {
  tagId: number;
  id?: number;
}

export interface CategoryInput {
  title: string;
  parentId?: number;
}

export interface CategoryUpdate extends CategoryInput {
  categoryId: number;
}

export interface ArticleInput {
  title: string;
  content: string;
  imageName?: string;
  status: ArticleStatus;
  contentType?: ContentType;
  categoryId?: number;
  dateAt?: string | Date;
  tagList?: string;
  roles?: string[];
}

export interface ArticleUpdate extends ArticleInput {
  articleId: number;
}

export interface AIArticleRequest {
  articleId?: number;
  prompt: string;
  generateImage?: boolean;
}

// ============================================================================
// Pagination
// ============================================================================

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// ============================================================================
// Theme Configuration
// ============================================================================

export type NNewsThemeMode = 'light' | 'dark' | 'system';

export interface NNewsTheme {
  mode?: NNewsThemeMode;
  classNames?: {
    root?: string;
    card?: string;
    table?: string;
    modal?: string;
    button?: string;
    input?: string;
  };
}

// ============================================================================
// API Configuration
// ============================================================================

export interface NNewsConfig {
  apiUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  onError?: (error: Error) => void;
  enableCache?: boolean;
  cacheTimeout?: number;
}

export interface NewsApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// ============================================================================
// API Endpoints
// ============================================================================

export const NEWS_API_ENDPOINTS = {
  // Articles
  ARTICLES: '/Article',
  LIST_BY_CATEGORY: '/Article/ListByCategory',
  LIST_BY_ROLES: '/Article/ListByRoles',
  LIST_BY_TAG: '/Article/ListByTag',
  SEARCH: '/Article/Search',
  ARTICLE_BY_ID: (id: number) => `/Article/${id}`,
  INSERT_WITH_AI: '/Article/insertWithAI',
  UPDATE_WITH_AI: '/Article/updateWithAI',

  // Categories
  CATEGORIES: '/Category',
  LIST_BY_PARENT: '/Category/listByParent',
  CATEGORY_BY_ID: (id: number) => `/Category/${id}`,

  // Tags
  TAGS: '/Tag',
  TAGS_LIST_BY_ROLES: '/Tag/ListByRoles',
  TAG_BY_ID: (id: number) => `/Tag/${id}`,
  TAG_MERGE: (sourceId: number, targetId: number) => `/Tag/merge/${sourceId}/${targetId}`,

  // Image
  IMAGE_UPLOAD: '/Image/uploadImage',
} as const;

// ============================================================================
// Context Types
// ============================================================================

export interface NNewsContextValue {
  config: NNewsConfig;
  isLoading: boolean;
  error: Error | null;
  setError: (error: Error | null) => void;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface ArticleListProps {
  categoryId?: number;
  status?: ArticleStatus;
  page?: number;
  pageSize?: number;
  onEdit?: (article: Article) => void;
  onDelete?: (articleId: number) => void;
  onView?: (article: Article) => void;
  showCreateButton?: boolean;
  className?: string;
}

export interface ArticleEditorProps {
  articleId?: number;
  initialData?: Partial<ArticleInput>;
  onSave?: (article: Article) => void;
  onCancel?: () => void;
  showPreview?: boolean;
  enableAutoSave?: boolean;
  className?: string;
}

export interface ArticleViewerProps {
  articleId?: number;
  article?: Article;
  onEdit?: (article: Article) => void;
  onBack?: () => void;
  showMetadata?: boolean;
  className?: string;
}

export interface CategoryListProps {
  onEdit?: (category: Category) => void;
  onDelete?: (categoryId: number) => void;
  showCreateButton?: boolean;
  className?: string;
}

export interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
  onSave?: (category: Category) => void;
}

export interface TagListProps {
  onEdit?: (tag: Tag) => void;
  onDelete?: (tagId: number) => void;
  onMerge?: (sourceId: number, targetId: number) => void;
  showCreateButton?: boolean;
  className?: string;
}

export interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag?: Tag;
  onSave?: (tag: Tag) => void;
}

// ============================================================================
// Search and Filter Types
// ============================================================================

export interface ArticleSearchParams {
  categoryId?: number;
  status?: ArticleStatus;
  tags?: number[];
  roles?: string[];
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

export interface CategoryFilterParams {
  roles?: string[];
  parentId?: number;
  searchTerm?: string;
}

export interface TagSearchParams {
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}
