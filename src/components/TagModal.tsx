import React, { useState, useEffect } from 'react';
import type { Tag, TagInput, TagUpdate } from '../types/news';
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

export interface TagModalProps {
  tag?: Tag | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (tag: TagInput | TagUpdate) => Promise<void>;
  loading?: boolean;
}

export function TagModal({
  tag,
  isOpen,
  onClose,
  onSave,
  loading = false,
}: TagModalProps) {
  const { t } = useNNewsTranslation();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (tag) {
      setTitle(tag.title);
      setSlug(tag.slug || '');
    } else {
      resetForm();
    }
  }, [tag, isOpen]);

  const resetForm = () => {
    setTitle('');
    setSlug('');
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

    const tagData = {
      title: title.trim(),
      slug: slug.trim() || undefined,
    };

    try {
      if (tag) {
        await onSave({ tagId: tag.tagId, ...tagData } as TagUpdate);
      } else {
        await onSave(tagData as TagInput);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save tag:', error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle>
            {tag ? t('tagModal.editTag') : t('tagModal.createTag')}
          </ModalTitle>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="tag-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('common.titleRequired')}
                </label>
                <input
                  id="tag-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full rounded-lg border ${
                    errors.title ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } px-4 py-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                  placeholder={t('tagModal.enterTitle')}
                />
                {errors.title && <p className="text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="tag-slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('common.slug')}
                </label>
                <input
                  id="tag-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder={t('tagModal.slugPlaceholder')}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('tagModal.slugHint')}
                </p>
              </div>
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
              {loading ? t('common.saving') : tag ? t('common.update') : t('common.create')}
            </button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
