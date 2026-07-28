# EP-021 final remediation implementation report

## Product cleanup

- Removed the discontinued `/preflight/` route, metadata, capability token, navigation, validation routes, and product-specific tests.
- Removed public release labels from the global footer while retaining version data in package and internal release metadata.
- Removed the global correction-template placement and retained the working feature contextually on Workspace.
- Removed the large rotating investigation demo and all of its scenario state, labels, and timer behavior.

## Brand identity

The HelpDevOps mark is an original branching evidence path: amber observation enters a teal decision checkpoint, muted irrelevant branches remain visible, and a green route terminates in recovery. `BrandMark.astro` is the reusable header/footer implementation. `favicon.svg` and `brand-social.svg` use the same geometry without remote assets or fonts.

## Hero animation

`HeroNetwork.astro` is a decorative inline SVG. CSS controls a calm 12-second Observe → Investigate → Verify → Recover sequence. The component pauses CSS and SVG animation when offscreen, when the document is hidden, and under reduced motion. Reduced motion presents a complete static path.

Desktop receives the full network at lower contrast than the hero copy. Tablet reduces opacity and peripheral nodes. Below 768px the network becomes a label-free path with a maximum five-rem visual height; the 360px breakpoint reduces it to 4.5rem and stacks the CTAs.

## Maintenance

- Keep shared logo geometry synchronized across `BrandMark.astro`, `favicon.svg`, `brand-social.svg`, and the safe route in `HeroNetwork.astro`.
- Preserve `aria-hidden="true"` and `focusable="false"` because the network is decorative.
- Keep motion in CSS and avoid JavaScript render loops.
- Public layouts must not display `site.ep` or `site.version`; those fields remain internal release metadata.
- The correction template belongs only on contextual workflow surfaces, not in `BaseLayout` or `SiteFooter`.
