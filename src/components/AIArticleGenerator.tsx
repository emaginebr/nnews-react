import { useState } from 'react';
import type { Article, AIArticleRequest } from '../types/news';
import { useNNews } from '../contexts/NNewsContext';
import { useNNewsTranslation } from '../i18n';

export interface AIArticleGeneratorProps {
    mode: 'create' | 'update';
    articleId?: number;
    isOpen: boolean;
    onSuccess: (article: Article) => void;
    onClose: () => void;
}

export function AIArticleGenerator({
    mode,
    articleId,
    isOpen,
    onSuccess,
    onClose,
}: AIArticleGeneratorProps) {
    const { articleApi } = useNNews();
    const { t } = useNNewsTranslation();
    const [prompt, setPrompt] = useState('');
    const [generateImage, setGenerateImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<string>('');

    const validatePrompt = (): boolean => {
        if (!prompt.trim()) {
            setError(t('validation.promptRequired'));
            return false;
        }
        if (prompt.trim().length < 10) {
            setError(t('validation.promptMinLength'));
            return false;
        }
        if (prompt.length > 2000) {
            setError(t('validation.promptMaxLength'));
            return false;
        }
        return true;
    };

    const handleGenerate = async () => {
        if (!validatePrompt()) {
            return;
        }

        if (mode === 'update' && !articleId) {
            setError(t('validation.articleIdRequired'));
            return;
        }

        setLoading(true);
        setError(null);
        setProgress(mode === 'create' ? t('aiGenerator.creatingWithAI') : t('aiGenerator.updatingWithAI'));

        try {
            const request: AIArticleRequest = {
                ...(mode === 'update' && articleId && { articleId }),
                prompt: prompt.trim(),
                generateImage,
            };

            if (generateImage) {
                setProgress(t('aiGenerator.generatingContentImage'));
            }

            let result: Article;
            if (mode === 'create') {
                result = await articleApi.createArticleWithAI(request);
            } else {
                result = await articleApi.updateArticleWithAI(request);
            }

            setProgress('');
            onSuccess(result);

            // Reset form on success
            setPrompt('');
            setGenerateImage(false);
            onClose();
        } catch (err: any) {
            console.error('Error generating article with AI:', err);
            setError(err.message || t('aiGenerator.generationFailed'));
            setProgress('');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setPrompt('');
            setGenerateImage(false);
            setError(null);
            onClose();
        }
    };

    const promptPlaceholder = mode === 'create'
        ? t('aiGenerator.createPlaceholder')
        : t('aiGenerator.updatePlaceholder');

    const getTextareaClassName = () => {
        const baseClasses = 'w-full rounded-md border px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';
        const borderClass = error && !prompt.trim() ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600';
        return `${baseClasses} ${borderClass}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity"
                    onClick={handleClose}
                ></div>

                {/* Modal */}
                <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                    <div className="bg-white dark:bg-gray-800 px-6 pb-4 pt-5">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100" id="modal-title">
                                        {mode === 'create' ? t('aiGenerator.createTitle') : t('aiGenerator.updateTitle')}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {mode === 'create'
                                            ? t('aiGenerator.createDescription')
                                            : t('aiGenerator.updateDescription')}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loading}
                                className="rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 disabled:opacity-50"
                            >
                                <span className="sr-only">{t('common.close')}</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('aiGenerator.descriptionLabel')}
                                </label>
                                <textarea
                                    id="prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    rows={6}
                                    disabled={loading}
                                    className={getTextareaClassName()}
                                    placeholder={promptPlaceholder}
                                    minLength={10}
                                    maxLength={2000}
                                />
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {t('aiGenerator.characterCount', { count: prompt.length })}
                                    </p>
                                    {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={generateImage}
                                        onChange={(e) => setGenerateImage(e.target.checked)}
                                        disabled={loading}
                                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t('aiGenerator.generateImage')}
                                    </span>
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                                    {t('aiGenerator.generateImageHint')}
                                </p>
                            </div>

                            {loading && progress && (
                                <div className="rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 p-4">
                                    <div className="flex items-center gap-3">
                                        <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">{progress}</p>
                                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                                {t('common.pleaseWait')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="rounded-md border border-gray-300 dark:border-gray-600 px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={loading || prompt.trim().length < 10}
                            className="rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>{t('aiGenerator.generating')}</span>
                                </>
                            ) : (
                                <>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span>{mode === 'create' ? t('aiGenerator.createWithAI') : t('aiGenerator.updateWithAI')}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
