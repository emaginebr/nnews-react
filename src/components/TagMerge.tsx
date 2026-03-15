import React, { useState, useEffect } from 'react';
import type { Tag } from '../types/news';
import { useNNewsTranslation } from '../i18n';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalClose,
} from './ui/Modal';

export interface TagMergeProps {
  sourceTag: Tag;
  availableTags: Tag[];
  isOpen: boolean;
  onClose: () => void;
  onMerge: (sourceId: number, targetId: number) => Promise<void>;
  loading?: boolean;
}

export function TagMerge({
  sourceTag,
  availableTags,
  isOpen,
  onClose,
  onMerge,
  loading = false,
}: TagMergeProps) {
  const { t } = useNNewsTranslation();
  const [targetTagId, setTargetTagId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectableTags = availableTags.filter(
    (tag) => tag.tagId !== sourceTag.tagId
  );

  useEffect(() => {
    if (!isOpen) {
      setTargetTagId(null);
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!targetTagId) {
      newErrors.targetTag = t('validation.targetTagRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !targetTagId) return;

    try {
      await onMerge(sourceTag.tagId || 0, targetTagId);
      onClose();
    } catch (error) {
      console.error('Failed to merge tags:', error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle>{t('tagMerge.title')}</ModalTitle>
          <ModalDescription>
            <span
              dangerouslySetInnerHTML={{
                __html: t('tagMerge.description', { tag: sourceTag.title }),
              }}
            />
          </ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="space-y-4">
              {/* Source Tag (Read-only) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('tagMerge.sourceTag')}
                </label>
                <div className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2.5">
                  <span className="font-medium text-gray-900 dark:text-gray-100">#{sourceTag.title}</span>
                  {sourceTag.slug && (
                    <span className="ml-2 text-xs font-mono text-gray-500 dark:text-gray-400">
                      ({sourceTag.slug})
                    </span>
                  )}
                </div>
              </div>

              {/* Target Tag Selection */}
              <div className="space-y-2">
                <label htmlFor="merge-target" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('tagMerge.targetTag')}
                </label>
                <select
                  id="merge-target"
                  value={targetTagId || ''}
                  onChange={(e) => setTargetTagId(Number(e.target.value))}
                  className={`w-full rounded-lg border ${
                    errors.targetTag ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } px-4 py-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400`}
                >
                  <option value="">{t('tagMerge.selectTarget')}</option>
                  {selectableTags.map((tag) => (
                    <option key={tag.tagId} value={tag.tagId}>
                      #{tag.title} {tag.slug ? `(${tag.slug})` : ''}
                    </option>
                  ))}
                </select>
                {errors.targetTag && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.targetTag}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('tagMerge.targetHint')}
                </p>
              </div>

              {selectableTags.length === 0 && (
                <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    {t('tagMerge.noTagsAvailable')}
                  </p>
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
              disabled={loading || selectableTags.length === 0}
              className="rounded-lg bg-blue-600 dark:bg-blue-500 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? t('tagMerge.merging') : t('tagMerge.mergeTags')}
            </button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
