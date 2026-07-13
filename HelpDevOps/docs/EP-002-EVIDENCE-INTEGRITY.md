# EP-002 Evidence Integrity Record

**Owner:** Govind  
**Source archive:** `HelpDevOps-v0.2.0-EP002-FINAL-CANDIDATE.zip`  
**Source SHA-256:** `4079179EAEA2C0B91011A72176EB6C37351F045CCA302A371791807BA35E3EC3`  
**Status:** Approval candidate evidence only; EP-002 is not self-approved.

## Source-state integrity

The source archive checksum was verified before clean extraction. The application was built once from that extracted source. Screenshots, Edge interaction records, Playwright reports, and the Lighthouse report were regenerated from that same workspace and build during approval review. Raw generated reports and screenshots are intentionally excluded from the Git commit package under the repository release-workflow policy. This document preserves the concise verification record. No application source, feature, architecture, dependency, or product scope changed during the evidence pass.

## Visual and interaction evidence

- Desktop homepage review showed the graphite/obsidian surface system, emerald primary action, restrained cyan labels, current navigation, and current Universal Input.
- A 720x450 effective viewport, equivalent to 200% reflow from a 1440x900 reference viewport, showed the current navigation and keyboard focus ring.
- Microsoft Edge 150.0.4078.65 on Windows x64: ten routes had no horizontal overflow or clipped header/main/footer/dialog landmarks and no console errors.
- Search opened by keyboard, focused its input, closed with Escape, and returned focus to the trigger.
- At the 200%-equivalent viewport, the search dialog fit both viewport axes and focus returned after close.
- Universal Input displayed the truthful notice: “No claim or validation has been performed.”
- Mobile homepage behavior, navigation, search, focus, reflow, accessibility, and truthful language were exercised by the mobile Playwright project.

## Current automated browser reports

- Chromium: 12 passed.
- Firefox: 12 passed.
- WebKit: 12 passed.
- Mobile (Pixel 7): 11 passed; 1 intentional skip for the desktop-only primary-navigation assertion.
- Total: 47 passed, 1 intentional skip, 0 failed.
- Axe coverage reported no serious accessibility violations.
- Raw Playwright reports were reviewed during approval and are intentionally not tracked in Git.

## Current Lighthouse report

- Performance: 99
- Accessibility: 100
- Best Practices: 100
- SEO: 100
- The raw Lighthouse JSON was reviewed during approval and is intentionally not tracked in Git.

Lighthouse completed and wrote the current report. On Windows, Chrome Launcher subsequently emitted an EPERM warning while deleting its temporary profile; this cleanup warning did not invalidate the report.

## Scope confirmation

No backend, database, authentication, deployment, commit, push, EP-003 work, new feature, or self-approval occurred.
