# Cloudflare Preview Validation

Use the persistent `helpdevops-preview` Worker only. Authenticate interactively; never commit credentials.

```powershell
$env:PUBLIC_SITE_URL="https://helpdevops-preview.<your-subdomain>.workers.dev"
npm run certify:release
npm run deploy:preview
npm run verify:preview -- --url $env:PUBLIC_SITE_URL
npm run verify:preview:browsers -- --url $env:PUBLIC_SITE_URL
```

The preview must return HTTPS, `noindex,nofollow` in HTML, `X-Robots-Tag: noindex, nofollow`, correct security headers, no placeholder canonical, working assets, correct 404 status, and browser-local Workspace/Incident Brief behavior. Do not submit preview URLs to search engines or share them publicly.
