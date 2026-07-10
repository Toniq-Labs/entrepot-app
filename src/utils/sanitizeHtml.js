import DOMPurify from 'dompurify';

/**
 * Sanitize an untrusted HTML string before rendering it via dangerouslySetInnerHTML. Collection
 * metadata (blurb, descriptions) is served from the backend API and controlled by collection
 * creators, so it must be treated as untrusted to prevent stored XSS.
 *
 * We allow a small set of formatting tags plus links. Links are forced to open in a new tab with
 * noopener/noreferrer via the hook below.
 */
const ALLOWED_TAGS = [
    'a',
    'b',
    'br',
    'div',
    'em',
    'i',
    'li',
    'ol',
    'p',
    'span',
    'strong',
    'u',
    'ul',
];
const ALLOWED_ATTR = [
    'href',
    'target',
    'rel',
];

// Ensure any anchors that survive sanitization can't be used for reverse
// tabnabbing and can't carry javascript:/data: URIs (DOMPurify already strips
// dangerous protocols, this just hardens the rel/target).
if (typeof DOMPurify.addHook === 'function') {
    DOMPurify.addHook('afterSanitizeAttributes', node => {
        if (node.tagName === 'A' && node.getAttribute('href')) {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener noreferrer nofollow');
        }
    });
}

export function sanitizeHtml(dirty) {
    if (!dirty) return '';
    return DOMPurify.sanitize(String(dirty), {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        ALLOW_DATA_ATTR: false,
    });
}
