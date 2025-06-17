export const parseMarkdown = (text: string): string => {
  // Simple markdown parsing for bold and italic
  let parsed = text;
  
  // Bold **text**
  parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic *text*
  parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Code `text`
  parsed = parsed.replace(/`(.*?)`/g, '<code class="bg-gray-800 px-1 rounded">$1</code>');
  
  return parsed;
};

export const stripMarkdown = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1');
};