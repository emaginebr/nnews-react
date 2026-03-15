import React, { useState, useEffect } from 'react';
import type { Category, CategoryInput, CategoryUpdate } from '../types/news';
import { useNNewsTranslation } from '../i18n';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalClose,
} from './ui/Modal';

export interface CategoryModalProps {
  category?: Category | null;
  categories?: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: CategoryInput | CategoryUpdate) => Promise<void>;
  loading?: boolean;
}

export function CategoryModal({
  category,
  categories = [],
  isOpen,
  onClose,
  onSave,
  loading = false,
}: CategoryModalProps) {
  const { t } = useNNewsTranslation();
  const [title, setTitle] = useState('');
  const [parentId, setParentId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category) {
      setTitle(category.title);
      setParentId(category.parentId || null);
    } else {
      resetForm();
    }
  }, [category, isOpen]);

  const resetForm = () => {
    setTitle('');
    setParentId(null);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = t('validation.titleRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const categoryData = {
      title: title.trim(),
      parentId: parentId || undefined,
    };

    try {
      if (category) {
        await onSave({ categoryId: category.categoryId, ...categoryData } as CategoryUpdate);
      } else {
        await onSave(categoryData as CategoryInput);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const availableParents = categories.filter((c) => c.categoryId !== category?.categoryId);

  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {category ? t('categoryModal.editCategory') : t('categoryModal.createCategory')}
          </ModalTitle>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="cat-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('common.titleRequired')}
                </label>
                <input
                  id="cat-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full rounded-lg border ${
                    errors.title ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } px-4 py-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                  placeholder={t('categoryModal.enterTitle')}
                />
                {errors.title && <p className="text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
              </div>

              {availableParents.length > 0 && (
                <div className="space-y-2">
                  <label htmlFor="cat-parent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('categoryModal.parentCategory')}
                  </label>
                  <select
                    id="cat-parent"
                    value={parentId || ''}
                    onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    <option value="">{t('categoryModal.noneTopLevel')}</option>
                    {availableParents.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </ModalBody>

          <ModalFooter>
            <ModalClose asChild>
              <button
                type="button"
                disabled={loading}
                className="rounded-lg border border-gray-300 dark:border-gray-600 px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                {t('common.cancel')}
              </button>
            </ModalClose>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 dark:bg-blue-500 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {loading ? t('common.saving') : category ? t('common.update') : t('common.create')}
            </button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
