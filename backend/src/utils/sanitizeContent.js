import xss from 'xss'

// Pure-CommonJS sanitizer (no ESM sub-deps) so it bundles cleanly on Vercel's
// serverless runtime. Allowlist matches what the WordPress migration + the
// Quill rich-text editor actually produce — nothing more. Disallowed tags are
// stripped; <script>/<style> bodies are removed entirely.
const { FilterXSS } = xss

const filter = new FilterXSS({
  whiteList: {
    p: ['class'], br: [], hr: [], div: ['class'], span: ['class'],
    h2: ['class'], h3: ['class'], h4: ['class'],
    strong: [], em: [], b: [], i: [], u: [],
    a: ['href', 'target', 'rel'],
    ul: ['class'], ol: ['class'], li: ['class'],
    blockquote: ['class'],
    figure: ['class'], figcaption: ['class'], img: ['src', 'alt', 'class'],
    table: ['class'], thead: [], tbody: [], tr: [], th: [], td: []
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style']
})

export function sanitizeContent(html) {
  return filter.process(html || '')
}
