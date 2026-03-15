import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArticles, useCategories, ArticleList, AIArticleGenerator, ConfirmModal, ArticleStatus, type Article } from 'nnews-react';
import { Plus, ChevronLeft, ChevronRight, Sparkles, Filter, X } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: String(ArticleStatus.Draft), label: 'Draft' },
  { value: String(ArticleStatus.Published), label: 'Published' },
  { value: String(ArticleStatus.Archived), label: 'Archived' },
  { value: String(ArticleStatus.Scheduled), label: 'Scheduled' },
  { value: String(ArticleStatus.Review), label: 'Review' },
];

export function ArticleListPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiMode, setAIMode] = useState<'create' | 'update'>('create');
  const [selectedArticleId, setSelectedArticleId] = useState<number | undefined>();
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [filterCategoryId, setFilterCategoryId] = useState<number | undefined>();
  const [filterStatus, setFilterStatus] = useState<number | undefined>();

  const ITEMS_PER_PAGE = 10;

  const {
    articles,
    loading,
    error,
    fetchArticles,
    deleteArticle,
  } = useArticles();

  const { categories, fetchCategories } = useCategories();

  useEffect(() => {
    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchArticles({
      page: currentPage,
      pageSize: ITEMS_PER_PAGE,
      categoryId: filterCategoryId,
      status: filterStatus,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterCategoryId, filterStatus]);

  const handleCategoryChange = (value: string) => {
    setFilterCategoryId(value ? Number(value) : undefined);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setFilterStatus(value !== '' ? Number(value) : undefined);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilterCategoryId(undefined);
    setFilterStatus(undefined);
    setCurrentPage(1);
  };

  const hasActiveFilters = filterCategoryId !== undefined || filterStatus !== undefined;

  const handleEditClick = (article: Article) => {
    navigate(`/articles/edit/${article.articleId}`);
  };

  const handleAIClick = (article: Article) => {
    setAIMode('update');
    setSelectedArticleId(article.articleId);
    setShowAIModal(true);
  };

  const handleArticleClick = (article: Article) => {
    navigate(`/articles/edit/${article.articleId}`);
  };

  const handleDeleteClick = (article: Article) => {
    setArticleToDelete(article);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteArticle(articleToDelete.articleId);
      toast.success('Article deleted successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete article.');
    } finally {
      setDeleteLoading(false);
      setArticleToDelete(null);
    }
  };

  const handleNewArticle = () => {
    navigate('/articles/new');
  };

  const handleNewArticleWithAI = () => {
    setAIMode('create');
    setSelectedArticleId(undefined);
    setShowAIModal(true);
  };

  const handleAISuccess = (article: Article) => {
    toast.success(`Article ${aiMode === 'create' ? 'created' : 'updated'} successfully with AI!`);
    setShowAIModal(false);
    fetchArticles({ page: currentPage, pageSize: ITEMS_PER_PAGE, categoryId: filterCategoryId, status: filterStatus });
    navigate(`/articles/edit/${article.articleId}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = articles?.totalPages || 0;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Articles</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your articles
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleNewArticleWithAI}
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Sparkles className="h-4 w-4" />
            Create with AI
          </button>
          <button
            onClick={handleNewArticle}
            className="flex items-center gap-2 rounded-xl bg-secondary border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Article
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />

        <select
          value={filterCategoryId ?? ''}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="rounded-lg border border-border bg-secondary text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.title}
            </option>
          ))}
        </select>

        <select
          value={filterStatus ?? ''}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded-lg border border-border bg-secondary text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-4">
          <p className="text-sm text-red-400">
            Error: {error.message}
          </p>
        </div>
      )}

      <ArticleList
        articles={articles}
        loading={loading}
        error={error}
        onArticleClick={handleArticleClick}
        onEditClick={handleEditClick}
        onAIClick={handleAIClick}
        onDeleteClick={handleDeleteClick}
        showActions={true}
        emptyMessage="No articles found. Create your first article!"
      />

      {articles && articles.totalCount > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages} ({articles.totalCount} total)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!articles.hasPrevious}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!articles.hasNext}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <AIArticleGenerator
        mode={aiMode}
        articleId={selectedArticleId}
        isOpen={showAIModal}
        onSuccess={handleAISuccess}
        onClose={() => setShowAIModal(false)}
      />

      <ConfirmModal
        open={!!articleToDelete}
        onOpenChange={(open) => { if (!open) setArticleToDelete(null); }}
        onConfirm={handleConfirmDelete}
        title="Delete Article"
        description={`Are you sure you want to delete "${articleToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
