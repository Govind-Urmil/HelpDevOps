# Privacy-respecting launch measurement decision

| Service | Position | Measures | Privacy and operations |
|---|---|---|---|
| Google Search Console | Recommended | Index coverage, queries, impressions, clicks, crawl issues | No runtime analytics script required. Owner verification and sitemap submission required. |
| Bing Webmaster Tools | Recommended | Bing indexing, queries, crawl and sitemap status | No product evidence should be sent. Owner verification required. |
| Cloudflare aggregate metrics | Acceptable after review | Requests, status, bandwidth and caching | Use aggregate infrastructure data; never attach evidence, Workspace content or search text. |
| Cloudflare Web Analytics | Deferred by default | Page views and performance | Requires jurisdiction/privacy review and documentation update before activation. |
| Product analytics/session replay | Prohibited at launch | Detailed interactions | Could expose operational evidence or private workflows and conflicts with the product promise. |

No analytics is activated by EP-022.
