import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ChartRenderer from './ChartRenderer';

const ResponseDisplay = ({ response }) => {
  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const content = String(children).replace(/\n$/, '');
      
      // Handle chart blocks
      if (match && match[1] === 'chart' && !inline) {
        try {
          const chartConfig = JSON.parse(content.trim());
          return <ChartRenderer config={chartConfig} />;
        } catch (e) {
          console.error('Invalid chart config:', e);
          // Fall through to render as code if not valid JSON
        }
      }
      
      return !inline && match ? (
        <SyntaxHighlighter
          style={tomorrow}
          language={match[1]}
          PreTag="div"
          className="rounded-lg overflow-hidden"
          {...props}
        >
          {content}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
          {children}
        </code>
      );
    },
    // Handle images (charts from API)
    img({ src, alt }) {
      return (
        <div className="my-4">
          <img 
            src={src} 
            alt={alt || 'Analysis Chart'} 
            className="w-full rounded-lg shadow-md border border-gray-200"
            style={{ maxHeight: '500px', objectFit: 'contain' }}
            onError={(e) => {
              console.error('Failed to load image:', src);
              e.target.style.display = 'none';
            }}
          />
        </div>
      );
    },
    // Style headers
    h2: ({children}) => (
      <h2 className="text-xl font-bold text-gray-800 mt-4 mb-2">{children}</h2>
    ),
    h3: ({children}) => (
      <h3 className="text-lg font-semibold text-gray-700 mt-3 mb-2">{children}</h3>
    ),
    h4: ({children}) => (
      <h4 className="text-md font-medium text-gray-600 mt-2 mb-1">{children}</h4>
    ),
    // Style lists
    ul: ({children}) => (
      <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
    ),
    li: ({children}) => (
      <li className="text-gray-700">{children}</li>
    ),
    // Style paragraphs
    p: ({children}) => (
      <p className="text-gray-700 my-2">{children}</p>
    ),
    // Style emphasis
    em: ({children}) => (
      <em className="text-gray-600 text-sm">{children}</em>
    )
  };

  return (
    <div className="response-display">
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown components={components}>
          {response.content || response.markdown || ''}
        </ReactMarkdown>
      </div>
      
      {/* Display description if it's different from content */}
      {response.description && 
       response.description !== response.content && 
       !response.content?.includes(response.description) && (
        <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 text-sm text-gray-700">
          {response.description}
        </div>
      )}
    </div>
  );
};

export default ResponseDisplay;