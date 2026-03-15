import { useState, useEffect, useMemo } from 'react';
import { CategoryList, CategoryModal, ConfirmModal, useCategories } from 'nnews-react';
import type { Category, CategoryInput, CategoryUpdate } from 'nnews-react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '../components/ui/Card';

type ModalMode = 'create' | 'edit' | null;

const ITEMS_PER_PAGE = 10;

export default function CategoryPage() {
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const searchLower = searchTerm.toLowerCase();
    return categories.filter((category) =>
      category.title.toLowerCase().includes(searchLower)
    );
  }, [categories, searchTerm]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCategories.slice(startIndex, endIndex);
  }, [filteredCategories, currentPage]);

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleSave = async (categoryData: CategoryInput | CategoryUpdate) => {
    try {
      if (modalMode === 'create') {
        await createCategory(categoryData as CategoryInput);
        toast.success('Category created successfully!');
      } else if (modalMode === 'edit' && selectedCategory) {
        await updateCategory({
          ...categoryData,
          categoryId: selectedCategory.categoryId,
        } as CategoryUpdate);
        toast.success('Category updated successfully!');
      }
      handleCloseModal();
      await fetchCategories();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save category');
      throw err;
    }
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteCategory(categoryToDelete.categoryId || 0);
      toast.success('Category deleted successfully!');
      await fetchCategories();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalMode(null);
    setSelectedCategory(null);
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Manage Categories</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create and manage categories for organizing articles
        </p>
      </div>

      <Card className="pt-5">
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-secondary text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
              />
            </div>
            <button
              onClick={handleCreate}
              className="rounded-xl bg-secondary border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors whitespace-nowrap"
            >
              New Category
            </button>
          </div>

          {searchTerm && (
            <div className="text-xs text-muted-foreground">
              Found {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
            </div>
          )}

          <CategoryList
            categories={paginatedCategories}
            loading={loading}
            error={error}
            onEditClick={handleEdit}
            onDeleteClick={handleDelete}
            showActions={true}
            emptyMessage={searchTerm ? 'No categories match your search' : 'No categories found. Create your first category!'}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="text-xs text-muted-foreground">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredCategories.length)} of{' '}
                {filteredCategories.length} categories
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-muted-foreground">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Create/Edit Modal - self-contained with Radix overlay */}
      <CategoryModal
        category={selectedCategory}
        categories={categories}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteConfirmOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteConfirmOpen(false);
            setCategoryToDelete(null);
          }
        }}
        onConfirm={confirmDelete}
        title="Delete Category"
        description={`Are you sure you want to delete "${categoryToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
