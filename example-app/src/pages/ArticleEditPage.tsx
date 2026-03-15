import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useArticles, useCategories, ArticleEditor, AIArticleGenerator, type ArticleInput, type ArticleUpdate, type Article } from 'nnews-react';
import { useNAuth } from 'nauth-react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import 'react-quill-new/dist/quill.snow.css';

export function ArticleEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== 'new' && id !== undefined;
  const [showAIModal, setShowAIModal] = useState(false);

  const {
    articles,
    loading: articleLoading,
    createArticle,
    updateArticle,
    fetchArticles,
  } = useArticles();

  const { categories, fetchCategories } = useCategories();
  const { fetchRoles } = useNAuth();

  const handleFetchRoles = async () => {
    const roles = await fetchRoles();
    return roles.map((role) => ({
      roleId: role.roleId,
      slug: role.slug,
      name: role.name,
    }));
  };

  const [currentArticle, setCurrentArticle] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();

    if (isEditing) {
      fetchArticles({ page: 1, pageSize: 100 });
    }
  }, []);

  useEffect(() => {
    if (isEditing && articles) {
      const article = articles.items.find(
        (a) => a.articleId === Number(id)
      );
      if (article) {
        setCurrentArticle(article);
      }
    }
  }, [isEditing, id, articles]);

  const handleAISuccess = (article: Article) => {
    toast.success(`Article ${isEditing ? 'updated' : 'created'} successfully with AI!`);
    setShowAIModal(false);
    if (isEditing) {
      fetchArticles({ page: 1, pageSize: 100 });
    } else {
      navigate(`/articles/edit/${article.articleId}`);
    }
  };

  const handleSave = async (articleData: ArticleInput | ArticleUpdate) => {
    setSaving(true);
    try {
      if (isEditing && currentArticle) {
        await updateArticle({
          ...articleData,
          articleId: currentArticle.articleId
        } as ArticleUpdate);
        toast.success('Article updated successfully');
      } else {
        await createArticle(articleData as ArticleInput);
        toast.success('Article created successfully');
      }
      navigate('/articles');
    } catch (error) {
      toast.error(isEditing ? 'Failed to update article' : 'Failed to create article');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/articles');
  };

  const handleBack = () => {
    navigate('/articles');
  };

  if (isEditing && articleLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading article...</div>
        </div>
      </div>
    );
  }

  if (isEditing && !currentArticle && !articleLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
          <p className="text-sm text-red-400">
            Article not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Articles
        </button>

        {isEditing && (
          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Sparkles className="h-4 w-4" />
            Edit with AI
          </button>
        )}
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          {isEditing ? 'Edit Article' : 'New Article'}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isEditing
            ? 'Update the article information below'
            : 'Fill in the information to create a new article'}
        </p>
      </div>

      <div className="rounded-xl bg-card border border-border p-6">
        <ArticleEditor
          article={currentArticle}
          categories={categories || []}
          onFetchRoles={handleFetchRoles}
          onSave={handleSave}
          onCancel={handleCancel}
          loading={saving}
        />
      </div>

      <AIArticleGenerator
        mode={isEditing ? 'update' : 'create'}
        articleId={currentArticle?.articleId}
        isOpen={showAIModal}
        onSuccess={handleAISuccess}
        onClose={() => setShowAIModal(false)}
      />
    </div>
  );
}
