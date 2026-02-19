import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import { useNNewsTranslation } from '../i18n';

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  minHeight?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  label,
  error,
  minHeight = '400px',
}: MarkdownEditorProps) {
  const { t } = useNNewsTranslation();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const displayPlaceholder = placeholder || t('markdownEditor.placeholder');

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'edit'
                ? 'border-b-2 border-blue-600 bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            {t('markdownEditor.editTab')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'preview'
                ? 'border-b-2 border-blue-600 bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            {t('markdownEditor.previewTab')}
          </button>
        </div>

        {/* Content Area */}
        <div style={{ minHeight }}>
          {activeTab === 'edit' ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={displayPlaceholder}
              className="h-full w-full resize-none border-0 p-4 font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0"
              style={{ minHeight }}
            />
          ) : (
            <div className="prose dark:prose-invert max-w-none p-4 text-gray-900 dark:text-gray-100">
              {value ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {value}
                </ReactMarkdown>
              ) : (
                <div className="text-gray-400 dark:text-gray-500">{t('markdownEditor.nothingToPreview')}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {/* Markdown Help */}
      <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-3 text-xs text-gray-600 dark:text-gray-400">
        <p className="font-medium">{t('markdownEditor.syntaxHelp')}</p>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <div>
            <strong># Heading 1</strong> - {t('markdownEditor.heading1')}
          </div>
          <div>
            <strong>## Heading 2</strong> - {t('markdownEditor.heading2')}
          </div>
          <div>
            <strong>**bold text**</strong> - {t('markdownEditor.bold')}
          </div>
          <div>
            <strong>*italic text*</strong> - {t('markdownEditor.italic')}
          </div>
          <div>
            <strong>[link](url)</strong> - {t('markdownEditor.link')}
          </div>
          <div>
            <strong>![alt](image.jpg)</strong> - {t('markdownEditor.image')}
          </div>
          <div>
            <strong>- item</strong> - {t('markdownEditor.bulletList')}
          </div>
          <div>
            <strong>1. item</strong> - {t('markdownEditor.numberedList')}
          </div>
          <div>
            <strong>`code`</strong> - {t('markdownEditor.inlineCode')}
          </div>
          <div>
            <strong>```language```</strong> - {t('markdownEditor.codeBlock')}
          </div>
        </div>
      </div>
    </div>
  );
}
