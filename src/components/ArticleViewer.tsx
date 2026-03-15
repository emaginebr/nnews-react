import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { ArticleStatus, ContentType, type Article } from '../types/news';
import 'highlight.js/styles/github.css';
import { useNNewsTranslation } from '../i18n';

export interface ArticleViewerProps {
  article: Article;
  onBack?: () => void;
  onEdit?: (article: Article) => void;
  showActions?: boolean;
}

export function ArticleViewer({
  article,
  onBack,
  onEdit,
  showActions = false,
}: ArticleViewerProps) {
  const { t } = useNNewsTranslation();

  return (
    <>
      {/* Header Actions */}
      {(onBack || (showActions && onEdit)) && (
        <div className="mb-6 flex items-center justify-between">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {t('common.back')}
            </button>
          )}

          {showActions && onEdit && (
            <button
              onClick={() => onEdit(article)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 dark:bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              {t('common.edit')}
            </button>
          )}
        </div>
      )}

      {/* Article Header */}
      <article>
        <header className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{article.title}</h1>

          {/* Meta Information */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {article.dateAt && (
              <span className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {new Date(article.dateAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}

            {article.category && (
              <span className="rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-800 dark:text-blue-300">
                {article.category.title}
              </span>
            )}

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                article.status === ArticleStatus.Published
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                  : article.status === ArticleStatus.Draft
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  : article.status === ArticleStatus.Review
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                  : article.status === ArticleStatus.Scheduled
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                  : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
              }`}
            >
              {ArticleStatus[article.status]}
            </span>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag.tagId}
                  className="rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-1 text-sm text-gray-700 dark:text-gray-300"
                >
                  #{tag.title}
                </span>
              ))}
            </div>
          )}

          {/* Roles */}
          {article.roles && article.roles.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {article.roles.map((role) => (
                <span
                  key={role.slug}
                  className="rounded-md bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-sm text-purple-700 dark:text-purple-300"
                >
                  {role.name}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert mt-8 max-w-none">
          {article.contentType === ContentType.PlainText ? (
            <pre className="whitespace-pre-wrap font-sans">{article.content}</pre>
          ) : article.contentType === ContentType.Html ? (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {article.content}
            </ReactMarkdown>
          )}
        </div>
      </article>
    </>
  );
}
