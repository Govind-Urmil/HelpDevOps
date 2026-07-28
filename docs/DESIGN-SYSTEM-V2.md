# HelpDevOps Design System V2 — Obsidian Signal

**Version:** 2.0  
**Status:** Approved design and maintainability standard  
**Project:** HelpDevOps  
**Owner:** Govind  
**Implementation:** ChatGPT Work  

## 1. Purpose

This document defines the final visual, interaction, comfort, accessibility, and maintainability direction for HelpDevOps.

The approved identity is:

> **Obsidian Signal**

HelpDevOps must feel modern, futuristic, premium, technical, calm, and comfortable for long work sessions.

The desired reaction is not “Nice website.” It is:

> “This feels like a serious DevOps command center. I want to keep it open while I work.”

Awe must come from usefulness, precision, speed, trust, continuity, and polish—not excessive effects or fake sophistication.

## 2. Design North Star

The site should combine:

- Near-black graphite foundations
- Restrained emerald signals
- Subtle cyan depth
- Signature Universal Input
- Calm technical surfaces
- Minimal motion
- Strong readability
- Long-session comfort
- Truthful product communication

Avoid:

- Blue-and-white SaaS styling
- Neon overload
- Cyberpunk clichés
- Matrix effects
- Excessive glow
- Giant marketing typography
- Heavy animation
- Fake terminal output
- Fake metrics
- Fake intelligence
- Excessive glassmorphism
- Full-page terminal styling

## 3. Visual Identity

Obsidian Signal blends:

- **70% Obsidian Operations**
  - near-black surfaces
  - muted emerald
  - calm premium feel
  - best for long sessions

- **20% Neon Command Center**
  - brighter green only for key actions, active states, focus, and success

- **10% Aurora DevOps**
  - restrained cyan atmospheric depth, mainly in the hero and major discovery surfaces

The product must look futuristic without becoming tiring.

## 4. Color System

```text
Deep Background      #030A08
Primary Surface      #07110E
Elevated Surface     #0A1713
Card Surface         #0C1C17

Primary Accent       #00E887
Bright Accent        #36FF9F
Secondary Accent     #00C8D7

Primary Text         #F0F7F4
Secondary Text       #8FA69C
Muted Text           #60766C

Soft Border          rgba(0, 232, 135, 0.16)
Strong Border        rgba(0, 232, 135, 0.32)
Neutral Border       rgba(143, 166, 156, 0.20)

Success              #00E887
Information          #00C8D7
Warning              #F4C95D
Error                #FF5C6C
```

### Rules

- Emerald = brand, primary action, active state, success, focus
- Cyan = information, detection, secondary depth
- Amber = warning, incomplete coverage, caution
- Coral-red = error, dangerous action, failure
- Neutral graphite = most work surfaces
- Never use color alone to communicate meaning
- Avoid pure black and pure white as dominant long-session colors
- The Universal Input may use the strongest accent treatment
- Dense work pages must use reduced glow

## 5. Two Visual Intensity Zones

### Discovery Mode

Used for:

- Homepage
- Product introduction
- Workspace introduction
- Investigation introduction
- Major category pages

Characteristics:

- Slightly stronger atmospheric depth
- More expressive hierarchy
- Subtle technical grid
- Signature Universal Input
- Controlled cyan glow

### Work Mode

Used for:

- Tools
- Editors
- YAML
- JSON
- Bash
- Jenkinsfiles
- Dockerfiles
- Logs
- Diffs
- Validation results
- Investigation results

Characteristics:

- Minimal glow
- Neutral graphite
- Higher information density
- Strong readability
- Functional color only
- Stable layout
- No distracting effects

The homepage may impress. The workspace must remain comfortable.

## 6. Signature Universal Input

The Universal Input is the most recognizable HelpDevOps element.

Future purpose:

- Search
- Detection
- Tool routing
- Troubleshooting
- Reference discovery
- Investigation entry

Recommended presentation:

```text
> Paste a configuration, error, command, IP, token, or DevOps topic...
```

Supporting status:

```text
● Local processing active
```

Rules:

- Dominates the hero
- Uses a dark neutral surface
- Uses a restrained emerald edge
- May use slight cyan depth
- Shows keyboard shortcut
- Works with keyboard and touch
- Remains readable at 200% zoom
- Never implies unavailable detection
- Preview behavior must be clearly labeled

## 7. Signal Language

Use subtle product markers such as:

```text
// DEVOPS COMMAND CENTER
// LOCAL PROCESSING
// INVESTIGATION
// DETECTED INPUT
// COVERAGE
// NEXT ACTION
```

Supporting visual language:

- Small status dots
- Thin connector lines
- Evidence markers
- Terminal prompts
- Numbered panels
- Compact state labels
- Minimal metadata

The site must not look like a Hollywood hacker dashboard.

## 8. Typography

Use system fonts only.

Interface stack:

```css
font-family:
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

Do not remotely load Inter.

Code stack:

```css
font-family:
  ui-monospace,
  SFMono-Regular,
  Menlo,
  Monaco,
  Consolas,
  monospace;
```

Rules:

- Body text remains highly readable
- Monospace is for code, commands, metadata, and signal labels
- Do not use monospace for all text
- Avoid oversized headings
- Keep reading widths compact
- Dense tools prioritize clarity over drama

## 9. Spacing and Layout

Spacing scale:

```text
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px
```

Widths:

```text
Primary container: 1180px max
Reading content:   760px max
Workspace:         1000–1180px
```

Radii:

```text
Small controls:      8px
Buttons and inputs: 10px
Cards and panels:   14px
Major feature area: 18px
```

Avoid arbitrary spacing and excessive bubble-like rounding.

## 10. Surface System

Use clear levels:

```text
Level 0 — page background
Level 1 — section surface
Level 2 — card/panel
Level 3 — focused workspace surface
Level 4 — overlay/dialog
```

Each level should use:

- Subtle luminance difference
- Restrained border
- Minimal shadow
- No unnecessary glow

Tool pages must prioritize:

1. Input
2. Action
3. Result
4. Explanation
5. Coverage
6. Next step

## 11. Navigation

Desktop:

```text
HelpDevOps | Troubleshoot | Tools | Interpret | Workspace | Search
```

Mobile:

```text
[HelpDevOps] [Search] [Menu]
```

About, Privacy, and Terms belong in the footer.

Requirements:

- Correct `aria-expanded`
- Escape closes
- Outside click closes when appropriate
- Focus returns to trigger
- No keyboard trap
- Body scroll managed correctly
- Visible current-page state
- Semantic navigation
- Use `aria-current="page"`

## 12. Components

### Structural

- SiteHeader
- DesktopNav
- MobileNav
- SiteFooter
- PageHeader
- Section
- Container

### UI

- Button
- LinkButton
- Card
- Badge
- Alert
- CodeBlock
- TerminalPreview
- EmptyState
- StatusLabel
- Breadcrumbs

### Discovery

- UniversalInput
- SearchTrigger
- SearchDialog
- SearchInput
- SearchResult
- CategoryCard

### Results

- ResultSummary
- ReasonPanel
- ActionPanel
- CoveragePanel
- LimitationsPanel
- RelatedActions
- WhySuggestion

### Product

- HeroNetwork
- TrustGrid
- ProductStatus
- PrivacyPulse
- SessionDockShell

### SEO

- SEOHead
- StructuredData
- OpenGraphMeta

Do not create meaningless wrapper components. Create a component when it enforces reuse, behavior, accessibility, visual consistency, product contracts, or scalability.

## 13. Buttons and Inputs

Primary actions:

- Emerald fill or strong emerald edge
- High contrast
- Minimal glow
- One dominant primary action per area

Secondary actions:

- Neutral or muted emerald surface

Destructive actions:

- Coral-red
- Explicit wording
- No ambiguous icon-only controls

Required button states:

- Default
- Hover
- Focus-visible
- Active
- Disabled
- Loading only when real async behavior exists

Inputs require:

- Visible label
- Clear focus state
- Helpful text
- Nearby error messaging
- No placeholder-only labeling

## 14. Code and Editor Surfaces

For YAML, JSON, Bash, Jenkinsfile, Dockerfile, logs, and diffs:

- Work Mode only
- No atmospheric glow behind code
- Monospace
- Comfortable line height
- Clear selection
- Large enough click/touch area
- Strong focus treatment
- Preserve input locally only where approved
- Avoid excessive syntax saturation

## 15. Result Design

Use the HelpDevOps Result Contract:

1. What happened?
2. Why?
3. What can I do?
4. What was checked?
5. What was not checked?
6. What next?

Status colors:

- Success = emerald
- Detection/info = cyan
- Warning = amber
- Error = coral-red

Do not show arbitrary confidence percentages.

Prefer:

```text
Checked:
✓ Syntax
✓ Required fields

Not checked:
○ Runtime state
○ External services
```

## 16. Cards and Density

Do not place everything inside rounded cards.

Use cards only when they improve grouping, interaction, hierarchy, or reuse.

Prefer alternatives where useful:

- Dividers
- Tables
- Panels
- List groups
- Command surfaces
- Code blocks
- Status rows
- Compact sections

Discovery pages may use more cards. Work Mode should use fewer.

## 17. Motion

Allowed:

- 120–180ms transitions
- Small hover illumination
- Focus transitions
- Result appearance
- State-change feedback
- Small opacity or transform

Forbidden:

- Looping ambient animation
- Particle fields
- Matrix rain
- Animated gradients
- Parallax
- Cursor trails
- Pulsing neon everywhere
- Fake loading animation
- Motion required to understand content

Must honor:

```css
@media (prefers-reduced-motion: reduce)
```

## 18. Long-Session Comfort

Requirements:

- Low-glare graphite surfaces
- No pure black everywhere
- No pure white body text everywhere
- Controlled accent use
- Minimal glow
- Comfortable line height
- Calm code surfaces
- Stable layout
- No persistent animated background
- No excessive visual noise
- Clear hierarchy
- Strong readability

The design must prioritize sustained productivity over short-lived visual shock.

## 19. Mobile Design

Mobile must be intentionally designed, not simply stacked.

Requirements:

- Universal Input remains dominant
- Secondary visuals simplify
- Dense desktop sections reorganize
- One-column work surfaces
- No horizontal overflow
- Touch-friendly targets
- Session Dock collapses
- Navigation stays accessible
- Code areas scroll intentionally
- Investigation diagrams simplify
- Decorative elements never reduce usability

Breakpoints:

```text
Small:       < 640px
Medium:      640–899px
Large:       900–1199px
Wide:        ≥ 1200px
```

## 20. Accessibility

Target WCAG 2.2 AA.

Requirements:

- Semantic HTML
- Skip-to-content link
- Visible focus
- Logical tab order
- No keyboard traps
- Correct dialog focus
- Focus not hidden under sticky header
- 200% zoom support
- Reflow without horizontal scrolling
- Reduced-motion support
- No color-only status
- Correct `aria-current`
- Correct `aria-expanded`
- Real buttons and links
- No clickable `div`

Aim for approximately 44×44px primary mobile targets where practical.

## 21. Performance

Budgets:

```text
Initial client JavaScript: ≤ 40 KB compressed
Initial CSS:               ≤ 35 KB compressed
Homepage transfer:         ≤ 250 KB excluding optional social image
Third-party scripts:       0
External font requests:    0
Homepage requests:         ≤ 15
```

Do not add heavy libraries for glow, animation, icons, backgrounds, or theming.

## 22. Truthful UI

Never display:

- Fake tool counts
- Fake usage numbers
- Fake users
- Fake testimonials
- Fake AI
- Fake detection
- Fake validation
- Fake session data
- Fake product capability
- Fake release status

Unavailable product concepts must not appear in global navigation.

Quick Tools and Recent Sessions may show only real data.

## 23. Resource-Driven Maintainability

This is a mandatory architecture requirement.

HelpDevOps must be sophisticated for users but simple for Govind to understand and maintain.

Routine updates should require changing resource files, not application code.

Target model:

```text
Application code
        ↓
Shared resource layer
        ↓
Tools, references, rules, versions, metadata
```

Recommended structure:

```text
src/
├── resources/
│   ├── kubernetes/
│   │   ├── versions.json
│   │   ├── api-resources.json
│   │   ├── deprecated-fields.json
│   │   ├── references.json
│   │   └── metadata.json
│   ├── docker/
│   ├── jenkins/
│   ├── git/
│   ├── bash/
│   ├── cron/
│   ├── terraform/
│   ├── linux/
│   ├── networking/
│   └── common/
```

Resource files must be:

- Human-readable
- Versioned
- Schema-validated
- Centralized
- Documented
- Easy to replace
- Easy to roll back
- Separate from UI code
- Separate from business logic where practical

Ideal Kubernetes update flow:

1. Download or prepare updated official data.
2. Replace or add files under `resources/kubernetes/`.
3. Update version metadata.
4. Run validation and build.
5. Publish.

No component rewrite. No architecture change. No duplicated rule changes.

## 24. Resource Maintenance Documentation

Create and maintain:

```text
docs/RESOURCE-MAINTENANCE-GUIDE.md
```

It must explain:

- Where resources live
- File formats
- Schemas
- How to update each domain
- How to add a new version
- How to deprecate old data
- How to validate updates
- How to roll back
- Which files are safe to edit
- Which changes require code
- How to verify the site after updates

Primary goal:

> Most routine updates = resource update, not code change.

When code changes are genuinely required, documentation must explain why.

## 25. Architecture Simplicity

The repository must remain understandable without ChatGPT Work for routine updates.

Requirements:

- Clear folder names
- Minimal indirection
- Central configuration
- Resource documentation
- No hidden magic
- No unnecessary abstraction
- No duplicate rules
- Predictable commands
- Easy local preview
- Easy rollback
- Easy full-snapshot recovery

## 26. Future Domains

The design and resource architecture must support:

- Cron jobs
- Git
- Bash scripting
- Jenkins
- YAML
- JSON
- Docker
- Kubernetes
- Terraform
- Linux
- Networking
- CI/CD
- Cloud
- Investigation network

Examples:

### Cron
- Builder
- Validation
- Explanation
- Next-run preview
- Common schedules
- Jenkins trigger integration

### Git
- Command helper
- Undo/recovery
- Conventional commits
- `.gitignore`
- Branch/reset/revert
- Error troubleshooting

### Bash
- Script inspection
- Quoting guidance
- Variable handling
- Exit codes
- Pipelines
- Common errors
- Jenkins integration

### Jenkins
- Jenkinsfile helper
- Declarative pipeline checking
- Stage/snippet generation
- Cron triggers
- Pipeline troubleshooting
- Docker/Kubernetes references

## 27. Forbidden Patterns

Do not use:

- Blue-and-white SaaS styling
- Excessive glow
- Green everywhere
- Full-page terminal UI
- Cyberpunk clichés
- Giant headlines
- Over-rounded UI
- Decorative fake output
- Heavy 3D
- WebGL
- Unreadable monospace body
- Persistent animation
- Fake dashboards
- Fake metrics
- Excessive gradients
- Excessive glassmorphism

## 28. Visual QA Checklist

Verify:

- Homepage feels distinctive
- Work pages feel calm
- Universal Input is visually dominant
- Glow is restrained
- Green is not overused
- Cyan remains secondary
- Functional colors are consistent
- No fake data
- No clutter
- No horizontal overflow
- 200% zoom works
- Focus is visible
- Mobile is intentional
- Reduced motion works
- Editors remain comfortable
- Cards are not overused
- Hierarchy is clear
- Long-session comfort is acceptable

## 29. Acceptance Criteria

The design is accepted only if:

1. Obsidian Signal is consistent.
2. Homepage creates a strong first impression.
3. Work surfaces remain comfortable for hours.
4. Universal Input is the signature element.
5. No fake data exists.
6. Accent use is restrained.
7. Functional colors are consistent.
8. Mobile design is intentional.
9. Accessibility passes.
10. Performance budgets pass.
11. No third-party visual runtime dependency is added.
12. Resource-driven maintainability is documented.
13. Routine updates do not require UI rewrites.
14. Govind can understand and maintain the site.
15. The site feels futuristic without becoming tiring.
16. The owner feels proud every time the site opens.

## 30. Final Design Statement

HelpDevOps should feel like:

> A premium, futuristic DevOps command center built for serious daily engineering work.

It should be visually memorable on first visit, comfortable after hours of use, easy to maintain, stable for years, and honest about its limits.

The final identity is:

> **Obsidian Signal — calm graphite surfaces, emerald signals, restrained cyan depth, signature Universal Input, minimal motion, and long-session engineering comfort.**
