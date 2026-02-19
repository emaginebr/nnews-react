import type { Category } from '../types/news';
import { Edit2, Trash2 } from 'lucide-react';
import { useNNewsTranslation } from '../i18n';

export interface CategoryListProps {
  categories: Category[];
  loading?: boolean;
  error?: Error | null;
  onCategoryClick?: (category: Category) => void;
  onEditClick?: (category: Category) => void;
  onDeleteClick?: (category: Category) => void;
  showActions?: boolean;
  emptyMessage?: string;
}

export function CategoryList({
  categories,
  loading = false,
  error = null,
  onCategoryClick,
  onEditClick,
  onDeleteClick,
  showActions = false,
  emptyMessage,
}: CategoryListProps) {
  const { t } = useNNewsTranslation();

  const displayEmpty = emptyMessage || t('categoryList.noCategories');

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">{t('categoryList.loadingCategories')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-800">
          {t('categoryList.errorLoading', { message: error.message })}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">{displayEmpty}</div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[40%]">
              {t('common.title')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[20%]">
              {t('categoryList.articles')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[25%]">
              {t('categoryList.parent')}
            </th>
            {showActions && (
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[15%]">
                {t('common.actions')}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {categories.map((category) => (
            <tr key={category.categoryId} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                <div
                  className={onCategoryClick ? 'cursor-pointer hover:text-blue-600 dark:hover:text-blue-400' : ''}
                  onClick={() => onCategoryClick?.(category)}
                >
                  {category.title}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {category.articleCount || 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {category.parentId ? t('categoryList.parentId', { id: category.parentId }) : '-'}
              </td>
              {showActions && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex justify-end gap-2">
                    {onEditClick && (
                      <button
                        onClick={() => onEditClick(category)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        title={t('common.edit')}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    )}
                    {onDeleteClick && (
                      <button
                        onClick={() => onDeleteClick(category)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        title={t('common.delete')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
