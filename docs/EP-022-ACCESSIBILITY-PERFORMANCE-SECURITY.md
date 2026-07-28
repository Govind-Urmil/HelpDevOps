# EP-022 accessibility, performance, and security evidence

Automated and browser checks cover homepage, search/zero results, investigations, issue guides, tools, Workspace, trust, 404, reduced motion, import errors, keyboard navigation, focus restoration, 200% reflow, narrow widths, labels, announcements, and serious axe violations.

The trust panel uses a labelled aside, native disclosure, structured terms, descriptive links, and no colour-only meaning. Issue pages use one H1, ordered headings, lists, text risk guidance, and overflow-safe commands.

EP-022 adds no client framework, remote font, analytics script, image dependency, or animation library. Issue pages are static and search adds a bounded fifteen-record dataset. The hero retains reduced-motion and offscreen pausing. Actual Lighthouse and budget results are recorded in the validation evidence.

The security-header generator produces route-specific CSP hashes and cache policy. Validation covers CSP, production HSTS behavior, content-type, referrer, permissions, frame protection, inline-script compatibility, HTML caching, and immutable assets. Change headers centrally, rebuild, inspect `_headers`, run tests, verify on preview, and retain the previous Cloudflare version for rollback.
