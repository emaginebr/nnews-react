import { useState, useEffect } from 'react';
import { TagList, TagModal, TagMerge, ConfirmModal, useTags } from 'nnews-react';
import type { Tag, TagInput, TagUpdate } from 'nnews-react';
import { toast } from 'sonner';
import { Card, CardContent } from '../components/ui/Card';

type ModalMode = 'create' | 'edit' | null;

export default function TagsPage() {
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [tagToMerge, setTagToMerge] = useState<Tag | null>(null);

  const {
    tags,
    loading,
    error,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    mergeTags,
  } = useTags();

  useEffect(() => {
    fetchTags();
  }, []);

  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedTag(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleSave = async (tagData: TagInput | TagUpdate) => {
    try {
      if (modalMode === 'create') {
        await createTag(tagData as TagInput);
        toast.success('Tag created successfully!');
      } else if (modalMode === 'edit' && selectedTag) {
        await updateTag({ ...tagData, tagId: selectedTag.tagId } as TagUpdate);
        toast.success('Tag updated successfully!');
      }
      handleCloseModal();
      await fetchTags();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save tag');
      throw err;
    }
  };

  const handleDelete = (tag: Tag) => {
    setTagToDelete(tag);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!tagToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteTag(tagToDelete.tagId || 0);
      toast.success('Tag deleted successfully!');
      await fetchTags();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete tag');
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
      setTagToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalMode(null);
    setSelectedTag(null);
  };

  const handleMerge = (tag: Tag) => {
    setTagToMerge(tag);
    setMergeModalOpen(true);
  };

  const confirmMerge = async (sourceId: number, targetId: number) => {
    try {
      await mergeTags(sourceId, targetId);
      toast.success('Tags merged successfully!');
      await fetchTags();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to merge tags');
      throw err;
    } finally {
      setMergeModalOpen(false);
      setTagToMerge(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Manage Tags</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create and manage tags for organizing articles
        </p>
      </div>

      <Card className="pt-5">
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleCreate}
              className="rounded-xl bg-secondary border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              New Tag
            </button>
          </div>

          <TagList
            tags={tags}
            loading={loading}
            error={error}
            onEditClick={handleEdit}
            onDeleteClick={handleDelete}
            onMergeClick={handleMerge}
            showActions={true}
            emptyMessage="No tags found. Create your first tag!"
          />
        </CardContent>
      </Card>

      {/* Tag Create/Edit Modal - self-contained with Radix overlay */}
      <TagModal
        tag={selectedTag}
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
            setTagToDelete(null);
          }
        }}
        onConfirm={confirmDelete}
        title="Delete Tag"
        description={`Are you sure you want to delete "${tagToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleteLoading}
      />

      {/* Merge Modal - self-contained with Radix overlay */}
      {tagToMerge && (
        <TagMerge
          sourceTag={tagToMerge}
          availableTags={tags}
          isOpen={mergeModalOpen}
          onClose={() => {
            setMergeModalOpen(false);
            setTagToMerge(null);
          }}
          onMerge={confirmMerge}
          loading={loading}
        />
      )}
    </div>
  );
}
