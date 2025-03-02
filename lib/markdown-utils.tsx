import React from 'react';

/**
 * Simple Markdown to HTML converter
 * This is a basic implementation that handles common Markdown syntax
 */
export function renderMarkdown(markdown: string): string {
  if (!markdown) return '';

  // Convert headers
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Convert bold and italic
  html = html
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>');

  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>');

  // Convert code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // Convert inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>');

  // Convert lists
  html = html.replace(/^\s*\n\* (.*)/gm, '<ul>\n<li>$1</li>');
  html = html.replace(/^\s*\n- (.*)/gm, '<ul>\n<li>$1</li>');
  html = html.replace(/^\s*\n\d+\. (.*)/gm, '<ol>\n<li>$1</li>');
  html = html.replace(/<\/ul>\s*\n<ul>/g, '');
  html = html.replace(/<\/ol>\s*\n<ol>/g, '');
  html = html.replace(/^\* (.*)/gm, '<ul>\n<li>$1</li>\n</ul>');
  html = html.replace(/^- (.*)/gm, '<ul>\n<li>$1</li>\n</ul>');
  html = html.replace(/^\d+\. (.*)/gm, '<ol>\n<li>$1</li>\n</ol>');

  // Convert paragraphs
  html = html.replace(/^\s*(\n)?(.+)/gm, function(m) {
    return /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>' + m + '</p>';
  });
  
  // Clean up extra paragraphs
  html = html.replace(/<p><\/p>/g, '');
  
  // Convert line breaks
  html = html.replace(/\n/g, '<br />');

  return html;
}

/**
 * React component to render Markdown content
 */
export function MarkdownContent({ content }: { content: string }) {
  return (
    <div 
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
} 