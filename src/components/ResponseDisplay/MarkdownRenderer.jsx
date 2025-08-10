import React, { useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChartRenderer from './ChartRenderer';

const MarkdownRenderer = ({ content = '' }) => {
  const copyToClipboard = useCallback((text) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }, []);

  const components = {
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold mb-4 mt-6 text-gray-900">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-semibold mb-3 mt-5 text-gray-800">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-800">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 ml-4 text-gray-700">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 ml-4 text-gray-700">{children}</ol>
    ),
    li: ({ children }) => <li className="mb-1">{children}</li>,

    code: ({ inline, className, children = [] }) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const codeString = Array.isArray(children) ? children.join('') : String(children);

      // Render chart blocks fenced as ```chart
      if (language === 'chart' && !inline) {
        try {
          const chartConfig = JSON.parse(codeString.trim());
          return <ChartRenderer config={chartConfig} />;
        } catch (e) {
          console.error('Invalid chart config:', e);
          // Fall through to render as code if not valid JSON
        }
      }

      if (!inline) {
        return (
          <div className="relative group">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
              <code className="text-sm font-mono">{codeString}</code>
            </pre>
            {language && (
              <span className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                {language}
              </span>
            )}
            <button
              type="button"
              onClick={() => copyToClipboard(codeString)}
              className="absolute top-2 right-12 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-300 bg-gray-800 px-2 py-1 rounded hover:bg-gray-700"
            >
              Copy
            </button>
          </div>
        );
      }

      return (
        <code className="bg-gray-100 text-red-600 px-2 py-1 rounded text-sm font-mono">
          {codeString}
        </code>
      );
    },

    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border-collapse border border-gray-300">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
    th: ({ children }) => (
      <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-gray-300 px-4 py-2 text-gray-700">{children}</td>
    ),

    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600">
        {children}
      </blockquote>
    ),

    // ✅ Fixed: proper opening <a> tag
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        {children}
      </a>
    ),

    hr: () => <hr className="my-6 border-gray-300" />,
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  };

  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
