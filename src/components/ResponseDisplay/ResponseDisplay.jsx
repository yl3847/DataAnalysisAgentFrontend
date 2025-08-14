import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ResponseDisplay = ({ response }) => {
  const chartRefs = useRef({});

  const parseChartData = (chartString) => {
    try {
      const parsed = JSON.parse(chartString);
      const { type, data } = parsed;
      
      if (type === 'bar') {
        return {
          type: 'bar',
          data: {
            labels: data.map(d => d.category || d.label || d.x),
            datasets: [{
              label: 'Value',
              data: data.map(d => d.value || d.y),
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false }
            }
          }
        };
      } else if (type === 'line') {
        return {
          type: 'line',
          data: {
            labels: data.map(d => d.month || d.label || d.x),
            datasets: [{
              label: 'Rate',
              data: data.map(d => d.rate || d.value || d.y),
              borderColor: 'rgba(147, 51, 234, 1)',
              backgroundColor: 'rgba(147, 51, 234, 0.1)',
              tension: 0.3
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false }
            }
          }
        };
      }
      return null;
    } catch (e) {
      console.error('Error parsing chart data:', e);
      return null;
    }
  };

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const content = String(children).replace(/\n$/, '');
      
      // Check if this is a chart block
      if (match && match[1] === 'chart') {
        const chartData = parseChartData(content);
        if (chartData) {
          const chartId = `chart-${Date.now()}`;
          
          setTimeout(() => {
            if (chartRefs.current[chartId]) {
              const ctx = chartRefs.current[chartId].getContext('2d');
              
              if (chartData.type === 'bar') {
                new Bar(ctx, { data: chartData.data, options: chartData.options });
              } else if (chartData.type === 'line') {
                new Line(ctx, { data: chartData.data, options: chartData.options });
              }
            }
          }, 100);
          
          return (
            <div className="my-4">
              <canvas 
                ref={el => chartRefs.current[chartId] = el}
                className="w-full"
                style={{ maxHeight: '300px' }}
              />
            </div>
          );
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
    // Handle images (including graph URLs from API)
    img({ src, alt }) {
      return (
        <div className="my-4">
          <img 
            src={src} 
            alt={alt || 'Analysis Chart'} 
            className="w-full rounded-lg shadow-sm"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
            onError={(e) => {
              console.error('Failed to load image:', src);
              e.target.style.display = 'none';
            }}
          />
        </div>
      );
    }
  };

  return (
    <div className="response-display">
      {response.description && (
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 text-sm text-gray-700">
          {response.description}
        </div>
      )}
      
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown components={components}>
          {response.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ResponseDisplay;