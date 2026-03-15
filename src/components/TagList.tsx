import type { Tag } from '../types/news';
import { Edit2, Trash2, GitMerge } from 'lucide-react';
import { useNNewsTranslation } from '../i18n';

export interface TagListProps {
  tags: Tag[];
  loading?: boolean;
  error?: Error | null;
  onTagClick?: (tag: Tag) => void;
  onEditClick?: (tag: Tag) => void;
  onDeleteClick?: (tag: Tag) => void;
  onMergeClick?: (tag: Tag) => void;
  showActions?: boolean;
  emptyMessage?: string;
}

export function TagList({
  tags,
  loading = false,
  error = null,
  onTagClick,
  onEditClick,
  onDeleteClick,
  onMergeClick,
  showActions = false,
  emptyMessage,
}: TagListProps) {
  const { t } = useNNewsTranslation();

  const displayEmpty = emptyMessage || t('tagList.noTags');

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500 dark:text-gray-400">{t('tagList.loadingTags')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
        <div className="text-sm text-red-800 dark:text-red-300">
          {t('tagList.errorLoading', { message: error.message })}
        </div>
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500 dark:text-gray-400">{displayEmpty}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {tags.map((tag) => (
        <div
          key={tag.tagId}
          className="group relative flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 shadow-sm hover:shadow-md transition-shadow"
        >
          <span
            className={`text-sm font-medium text-gray-900 dark:text-gray-100 ${
              onTagClick ? 'cursor-pointer hover:text-blue-600 dark:hover:text-blue-400' : ''
            }`}
            onClick={() => onTagClick?.(tag)}
          >
            #{tag.title}
          </span>

          {tag.articleCount !== undefined && (
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              {tag.articleCount}
            </span>
          )}

          {showActions && (onEditClick || onDeleteClick || onMergeClick) && (
            <div className="flex gap-1 ml-2">
              {onEditClick && (
                <button
                  onClick={() => onEditClick(tag)}
                  className="rounded p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  title={t('common.edit')}
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
              {onMergeClick && (
                <button
                  onClick={() => onMergeClick(tag)}
                  className="rounded p-1 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                  title={t('tagList.merge')}
                >
                  <GitMerge className="h-4 w-4" />
                </button>
              )}
              {onDeleteClick && (
                <button
                  onClick={() => onDeleteClick(tag)}
                  className="rounded p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  title={t('common.delete')}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
