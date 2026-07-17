import sanitizeHtml from 'sanitize-html'

// Allowlist matches what the WordPress migration + the Quill rich-text editor
// in the content-writer portal actually produce — nothing more.
const OPTIONS = {
  allowedTags: [
    'p', 'br', 'hr', 'div', 'span',
    'h2', 'h3', 'h4',
    'strong', 'em', 'a',
    'ul', 'ol', 'li',
    'figure', 'figcaption', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td'
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'class'],
    '*': ['class']
  },
  allowedSchemes: ['http', 'https', 'mailto']
}

export function sanitizeContent(html) {
  return sanitizeHtml(html || '', OPTIONS)
}
