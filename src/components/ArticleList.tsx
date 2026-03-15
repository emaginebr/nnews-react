import { ArticleStatus, type Article, type PagedResult } from '../types/news';
import { useNNewsTranslation } from '../i18n';

export interface ArticleListProps {
  articles: PagedResult<Article> | null;
  loading?: boolean;
  error?: Error | null;
  onArticleClick?: (article: Article) => void;
  onEditClick?: (article: Article) => void;
  onAIClick?: (article: Article) => void;
  onDeleteClick?: (article: Article) => void;
  showActions?: boolean;
  emptyMessage?: string;
}

export function ArticleList({
  articles,
  loading = false,
  error = null,
  onArticleClick,
  onEditClick,
  onAIClick,
  onDeleteClick,
  showActions = false,
  emptyMessage,
}: ArticleListProps) {
  const { t } = useNNewsTranslation();

  const displayEmpty = emptyMessage || t('articleList.noArticles');

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">{t('articleList.loadingArticles')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-800">
          {t('articleList.errorLoading', { message: error.message })}
        </div>
      </div>
    );
  }

  if (!articles || articles.items.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">{displayEmpty}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        {articles.items.map((article) => (
          <div
            key={article.articleId}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
          >
            {/* Featured Image */}
            <div
              className={`w-full h-[250px] bg-gray-200 dark:bg-gray-700 overflow-hidden ${
                onArticleClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onArticleClick?.(article)}
            >
              {(article.imageUrl || article.imageName) ? (
                <img
                  src={article.imageUrl || article.imageName}
                  alt={article.title}
                  className="w-full h-[250px] object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-300 dark:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex-1">
                <h3
                  className={`text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 ${
                    onArticleClick ? 'cursor-pointer hover:text-blue-600 dark:hover:text-blue-400' : ''
                  }`}
                  onClick={() => onArticleClick?.(article)}
                >
                  {article.title}
                </h3>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  {article.dateAt && (
                    <span className="flex items-center gap-1">
                      <svg
                        className="h-4 w-4"
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
                      {new Date(article.dateAt).toLocaleDateString()}
                    </span>
                  )}

                  {article.category && (
                    <span className="rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-xs font-medium text-blue-800 dark:text-blue-200">
                      {article.category.title}
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      article.status === ArticleStatus.Published
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : article.status === ArticleStatus.Draft
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        : article.status === ArticleStatus.Review
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        : article.status === ArticleStatus.Scheduled
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                        : 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                    }`}
                  >
                    {ArticleStatus[article.status]}
                  </span>
                </div>

                {article.tags && article.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.tagId}
                        className="rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs text-gray-700 dark:text-gray-300"
                      >
                        #{tag.title}
                      </span>
                    ))}
                    {article.tags.length > 3 && (
                      <span className="rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs text-gray-700 dark:text-gray-300">
                        +{article.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {article.roles && article.roles.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {article.roles.slice(0, 2).map((role) => (
                      <span
                        key={role.slug}
                        className="rounded-md bg-purple-100 dark:bg-purple-900 px-2 py-1 text-xs text-purple-700 dark:text-purple-200"
                      >
                        {role.name}
                      </span>
                    ))}
                    {article.roles.length > 2 && (
                      <span className="rounded-md bg-purple-100 dark:bg-purple-900 px-2 py-1 text-xs text-purple-700 dark:text-purple-200">
                        +{article.roles.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {showActions && (onEditClick || onAIClick || onDeleteClick) && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 justify-end">
                  {onAIClick && (
                    <button
                      onClick={() => onAIClick(article)}
                      className="rounded p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      title={t('articleList.aiEdit')}
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
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </button>
                  )}
                  {onEditClick && (
                    <button
                      onClick={() => onEditClick(article)}
                      className="rounded p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title={t('common.edit')}
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
                    </button>
                  )}
                  {onDeleteClick && (
                    <button
                      onClick={() => onDeleteClick(article)}
                      className="rounded p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title={t('common.delete')}
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {articles.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {t('articleList.showingArticles', {
              count: articles.items.length,
              total: articles.totalCount,
              page: articles.page,
              totalPages: articles.totalPages,
            })}
          </div>
        </div>
      )}
    </div>
  );
}
