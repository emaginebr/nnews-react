import { useState, useEffect, useCallback } from 'react';
import { RichTextEditor } from './RichTextEditor';
import { ArticleStatus } from '../types/news';
import type { Article, ArticleInput, ArticleUpdate, Category } from '../types/news';
import { useNNews } from '../contexts/NNewsContext';
import { useNNewsTranslation } from '../i18n';

export interface RoleOption {
    roleId: number;
    slug: string;
    name: string;
}

export interface ArticleEditorProps {
    article?: Article | null;
    categories?: Category[];
    availableRoles?: RoleOption[];
    onFetchRoles?: () => Promise<RoleOption[]>;
    onSave: (article: ArticleInput | ArticleUpdate) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export function ArticleEditor({
    article,
    categories = [],
    availableRoles,
    onFetchRoles,
    onSave,
    onCancel,
    loading = false,
}: ArticleEditorProps) {
    const { articleApi } = useNNews();
    const { t } = useNNewsTranslation();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageName, setImageName] = useState('');
    const [imagePreview, setImagePreview] = useState<string>('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [status, setStatus] = useState<ArticleStatus>(ArticleStatus.Draft);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [dateAt, setDateAt] = useState<string>('');
    const [tagList, setTagList] = useState<string>('');
    const [visibleToAll, setVisibleToAll] = useState(true);
    const [selectedRoleSlugs, setSelectedRoleSlugs] = useState<Set<string>>(new Set());
    const [fetchedRoles, setFetchedRoles] = useState<RoleOption[]>([]);
    const [rolesLoading, setRolesLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (article) {
            setTitle(article.title);
            setContent(article.content);
            setImageName(article.imageName || '');
            console.log('imageName:', article.imageName);
            if (article.imageName) {
                setImagePreview(article.imageName);
            }
            setStatus(article.status);
            setCategoryId(article.categoryId || null);
            setDateAt(article.dateAt ? new Date(article.dateAt).toISOString().slice(0, 16) : '');
            setTagList(article.tags?.map((t) => t.title).join(', ') || '');
            if (article.roles && article.roles.length > 0) {
                setVisibleToAll(false);
                setSelectedRoleSlugs(new Set(article.roles.map((r) => r.slug)));
            } else {
                setVisibleToAll(true);
                setSelectedRoleSlugs(new Set());
            }
        }
    }, [article]);

    const displayRoles = availableRoles || fetchedRoles;

    useEffect(() => {
        if (availableRoles && availableRoles.length > 0) return;
        if (!onFetchRoles) return;

        let cancelled = false;
        setRolesLoading(true);
        onFetchRoles()
            .then((roles) => {
                if (!cancelled) {
                    setFetchedRoles(roles);
                }
            })
            .catch((err) => {
                console.warn('Failed to fetch roles:', err);
            })
            .finally(() => {
                if (!cancelled) setRolesLoading(false);
            });
        return () => { cancelled = true; };
    }, [availableRoles, onFetchRoles]);

    const handleVisibleToAllChange = useCallback((checked: boolean) => {
        setVisibleToAll(checked);
        if (checked) {
            setSelectedRoleSlugs(new Set());
        }
    }, []);

    const handleRoleToggle = useCallback((slug: string) => {
        setSelectedRoleSlugs((prev) => {
            const next = new Set(prev);
            if (next.has(slug)) {
                next.delete(slug);
            } else {
                next.add(slug);
            }
            return next;
        });
    }, []);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) {
            newErrors.title = t('validation.titleRequired');
        }

        if (!content.trim()) {
            newErrors.content = t('validation.contentRequired');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const roles = visibleToAll ? [] : Array.from(selectedRoleSlugs);

        const articleData = {
            title: title.trim(),
            content: content.trim(),
            imageName: imageName || undefined,
            status,
            categoryId: categoryId || undefined,
            dateAt: dateAt || undefined,
            tagList: tagList.trim() || undefined,
            roles: roles.length > 0 ? roles : undefined,
        };

        if (article) {
            await onSave({ articleId: article.articleId, ...articleData } as ArticleUpdate);
        } else {
            await onSave(articleData as ArticleInput);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setErrors({ ...errors, image: t('validation.imageFileType') });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors({ ...errors, image: t('validation.imageSizeLimit') });
            return;
        }

        setErrors({ ...errors, image: '' });

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload image
        try {
            setUploadingImage(true);
            const imageUrl = await articleApi.uploadImage(file);
            setImageName(imageUrl);
            setErrors({ ...errors, image: '' });
        } catch (error) {
            console.error('Error uploading image:', error);
            setErrors({ ...errors, image: t('validation.imageUploadFailed') });
        } finally {
            setUploadingImage(false);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview('');
        setImageName('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Two Column Layout: Left (2/3) and Right (1/3) */}
            <div className="grid grid-cols-3 gap-4">
                {/* Left Column - 2/3 */}
                <div className="col-span-2 p-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('common.titleRequired')}
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`w-full rounded-md border ${errors.title ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                                } px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                            placeholder={t('articleEditor.enterTitle')}
                        />
                        {errors.title && <p className="text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
                    </div>

                    {/* Publication Date */}
                    <div className="space-y-2">
                        <label htmlFor="dateAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('articleEditor.publicationDate')}
                        </label>
                        <input
                            id="dateAt"
                            type="datetime-local"
                            value={dateAt}
                            onChange={(e) => setDateAt(e.target.value)}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('articleEditor.category')}
                        </label>
                        <select
                            id="category"
                            value={categoryId || ''}
                            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">{t('common.noCategory')}</option>
                            {categories.map((cat) => (
                                <option key={cat.categoryId} value={cat.categoryId}>
                                    {cat.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('articleEditor.status')}
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(Number(e.target.value) as ArticleStatus)}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value={ArticleStatus.Draft}>{t('articleEditor.statusDraft')}</option>
                            <option value={ArticleStatus.Published}>{t('articleEditor.statusPublished')}</option>
                            <option value={ArticleStatus.Archived}>{t('articleEditor.statusArchived')}</option>
                            <option value={ArticleStatus.Scheduled}>{t('articleEditor.statusScheduled')}</option>
                            <option value={ArticleStatus.Review}>{t('articleEditor.statusReview')}</option>
                        </select>
                    </div>
                </div>

                {/* Right Column - 1/3 */}
                <div className="col-span-1">
                    {/* Featured Image */}
                    <div className="space-y-2">
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('articleEditor.featuredImage')}
                        </label>
                        
                        {imagePreview ? (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-[250px] object-cover rounded-md border border-gray-300 dark:border-gray-600"
                                    style={{ height: '250px' }}
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 rounded-full bg-red-600 p-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    disabled={uploadingImage}
                                    style={{ top: '2px', right: '2px' }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                {uploadingImage && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                                        <span className="text-white text-sm">{t('articleEditor.uploading')}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={uploadingImage}
                                    className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer bg-white dark:bg-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        )}
                        
                        {errors.image && <p className="text-sm text-red-600 dark:text-red-400">{errors.image}</p>}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t('articleEditor.imageHint')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content - Full Width */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('articleEditor.contentLabel')}
                </label>
                <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder={t('articleEditor.contentPlaceholder')}
                    error={errors.content}
                />
                {errors.content && <p className="text-sm text-red-600 dark:text-red-400">{errors.content}</p>}
            </div>

            {/* Tags */}
            <div className="space-y-2">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('articleEditor.tags')}
                </label>
                <input
                    id="tags"
                    type="text"
                    value={tagList}
                    onChange={(e) => setTagList(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder={t('articleEditor.tagsPlaceholder')}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('articleEditor.tagsHint')}
                </p>
            </div>

            {/* Visibilidade / Roles */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('articleEditor.visibility')}
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={visibleToAll}
                        onChange={(e) => handleVisibleToAllChange(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {t('articleEditor.visibleToAll')}
                    </span>
                </label>

                {!visibleToAll && (
                    <div className="ml-6 space-y-2">
                        {rolesLoading ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t('articleEditor.loadingRoles')}
                            </p>
                        ) : displayRoles.length > 0 ? (
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t('articleEditor.selectRolesHint')}
                                </p>
                                {displayRoles.map((role) => (
                                    <label
                                        key={role.slug}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedRoleSlugs.has(role.slug)}
                                            onChange={() => handleRoleToggle(role.slug)}
                                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {role.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t('articleEditor.noRolesAvailable')}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="rounded-md border border-gray-300 dark:border-gray-600 px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                    {t('common.cancel')}
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? t('common.saving') : article ? t('articleEditor.updateArticle') : t('articleEditor.createArticle')}
                </button>
            </div>
        </form>
    );
}
