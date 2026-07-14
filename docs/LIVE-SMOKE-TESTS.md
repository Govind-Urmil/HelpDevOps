# Live Smoke Tests

`npm run verify:preview -- --url <https-url>` performs HTTP-level checks. `npm run verify:preview:browsers -- --url <https-url>` runs the small hosted-origin Playwright suite. These checks supplement, not replace, full local certification.

Expected background traffic is same-origin HTML, JS, CSS, images, sitemap, robots and other static assets. Any API, telemetry, analytics, remote-analysis or unexpected third-party request is a blocker.
