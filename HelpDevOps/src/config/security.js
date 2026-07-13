export const securityPolicy = Object.freeze({
  contentSecurityPolicy: Object.freeze({
    "default-src": ["'self'"],
    "base-uri": ["'self'"],
    "object-src": ["'none'"],
    "frame-ancestors": ["'none'"],
    "form-action": ["'self'"],
    "script-src": ["'self'"],
    "style-src": ["'self'"],
    "img-src": ["'self'", 'data:'],
    "font-src": ["'self'"],
    "connect-src": ["'self'"],
    "upgrade-insecure-requests": []
  }),
  headers: Object.freeze({
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  }),
  hsts: Object.freeze({
    enabled: false,
    value: 'max-age=31536000',
    includeSubDomains: false,
    reason: 'Enable only after the production HTTPS domain and subdomain policy are approved.'
  })
});
