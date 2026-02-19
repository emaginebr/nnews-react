import { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNNewsTranslation } from '../i18n';

export interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
}

export function RichTextEditor({
    value,
    onChange,
    placeholder,
    error,
}: RichTextEditorProps) {
    const { t } = useNNewsTranslation();
    const quillRef = useRef<ReactQuill>(null);

    const displayPlaceholder = placeholder || t('richTextEditor.placeholder');

    const modules = useMemo(
        () => ({
            toolbar: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ color: [] }, { background: [] }],
                [{ align: [] }],
                ['link', 'image', 'video'],
                ['blockquote', 'code-block'],
                ['clean'],
            ],
        }),
        []
    );

    const formats = useMemo(
        () => [
            'header',
            'bold',
            'italic',
            'underline',
            'strike',
            'list',
            'bullet',
            'color',
            'background',
            'align',
            'link',
            'image',
            'video',
            'blockquote',
            'code-block',
        ],
        []
    );

    return (
        <div className={`quill-editor-wrapper rounded-md border ${error ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`}>
            <style>
                {`
                    /* Dark mode styles for Quill editor */
                    .dark .quill-editor-wrapper .ql-toolbar {
                        background-color: rgb(17 24 39);
                        border-color: rgb(75 85 99);
                    }

                    .dark .quill-editor-wrapper .ql-toolbar .ql-stroke {
                        stroke: rgb(209 213 219);
                    }

                    .dark .quill-editor-wrapper .ql-toolbar .ql-fill {
                        fill: rgb(209 213 219);
                    }

                    .dark .quill-editor-wrapper .ql-toolbar .ql-picker-label {
                        color: rgb(209 213 219);
                    }

                    .dark .quill-editor-wrapper .ql-toolbar button:hover,
                    .dark .quill-editor-wrapper .ql-toolbar button.ql-active {
                        background-color: rgb(55 65 81);
                    }

                    .dark .quill-editor-wrapper .ql-toolbar button:hover .ql-stroke,
                    .dark .quill-editor-wrapper .ql-toolbar button.ql-active .ql-stroke {
                        stroke: rgb(96 165 250);
                    }

                    .dark .quill-editor-wrapper .ql-toolbar button:hover .ql-fill,
                    .dark .quill-editor-wrapper .ql-toolbar button.ql-active .ql-fill {
                        fill: rgb(96 165 250);
                    }

                    .dark .quill-editor-wrapper .ql-container {
                        background-color: rgb(17 24 39);
                        border-color: rgb(75 85 99);
                        color: rgb(243 244 246);
                    }

                    .dark .quill-editor-wrapper .ql-editor.ql-blank::before {
                        color: rgb(107 114 128);
                    }

                    .dark .quill-editor-wrapper .ql-editor {
                        color: rgb(243 244 246);
                    }

                    .dark .quill-editor-wrapper .ql-picker-options {
                        background-color: rgb(31 41 55);
                        border-color: rgb(75 85 99);
                    }

                    .dark .quill-editor-wrapper .ql-picker-item {
                        color: rgb(209 213 219);
                    }

                    .dark .quill-editor-wrapper .ql-picker-item:hover {
                        background-color: rgb(55 65 81);
                        color: rgb(96 165 250);
                    }

                    .dark .quill-editor-wrapper .ql-tooltip {
                        background-color: rgb(31 41 55);
                        border-color: rgb(75 85 99);
                        color: rgb(243 244 246);
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
                    }

                    .dark .quill-editor-wrapper .ql-tooltip input {
                        background-color: rgb(17 24 39);
                        border-color: rgb(75 85 99);
                        color: rgb(243 244 246);
                    }

                    .dark .quill-editor-wrapper .ql-tooltip input::placeholder {
                        color: rgb(107 114 128);
                    }

                    .dark .quill-editor-wrapper .ql-toolbar .ql-picker-label:hover,
                    .dark .quill-editor-wrapper .ql-toolbar .ql-picker-label.ql-active {
                        color: rgb(96 165 250);
                    }
                `}
            </style>
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={onChange}
                placeholder={displayPlaceholder}
                modules={modules}
                formats={formats}
                className="min-h-[400px]"
            />
        </div>
    );
}
