/**
 * URL helpers for rendering untrusted URLs that come from backend collection metadata (social
 * links, banner images). These guard against `javascript:`, `data:` and other non-http(s) schemes,
 * and against breaking out of a CSS `url('...')` context.
 */

/**
 * Return the URL only if it is a safe http(s) (or protocol-relative) URL, otherwise undefined. Use
 * for href/src attributes.
 */
export function safeHttpUrl(url) {
    if (!url || typeof url !== 'string') return undefined;
    const trimmed = url.trim();
    if (trimmed.startsWith('//')) return trimmed; // protocol-relative
    try {
        const parsed = new URL(trimmed, window.location.origin);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            return trimmed;
        }
    } catch (e) {
        return undefined;
    }
    return undefined;
}

/**
 * Return a value safe to embed inside a CSS `url('...')` expression. Only allows http(s) URLs and
 * strips characters that could terminate the url()/quote context (quotes, parentheses, backslashes,
 * whitespace/newlines). Returns '' when the input is unsafe so the caller renders no background.
 */
export function cssUrl(url) {
    const safe = safeHttpUrl(url);
    if (!safe) return '';
    return safe.replace(/["'()\\\s]/g, encodeURIComponent);
}
