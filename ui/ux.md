PROJECT: CertiChain / VeriChain — Decentralized Certificate Validation System

ROLE:
Act as a senior frontend engineer, UI/UX designer, design systems
architect, and accessibility specialist.

Your task is to RECREATE THE PROVIDED REFERENCE IMAGE as a working,
responsive React website.

The reference image is the source of truth for the visual design.
Do not merely create a website inspired by it. Reproduce its layout,
proportions, spacing, typography, colors, illustrations, borders,
components, and visual hierarchy as accurately as possible.

The final result must look like a carefully designed enterprise
blockchain research product, not a generic AI-generated landing page.

==================================================
1. FIRST: INSPECT THE EXISTING PROJECT
==================================================

Before writing any code:

1. Inspect the complete project structure.
2. Read package.json and identify the existing framework, dependencies,
   routing system, CSS approach, and build commands.
3. Identify existing pages, reusable components, APIs, authentication,
   smart-contract integrations, and application state.
4. Inspect existing CSS and identify conflicting styles.
5. Identify unused components, duplicate styles, dead code, and
   unnecessary dependencies.
6. Determine how the existing certificate issuance, verification,
   blockchain, IPFS, and wallet functionality works.
7. Run the existing application and inspect its current appearance.

IMPORTANT:
- Preserve the existing application architecture.
- Do not replace working functionality with mock implementations.
- Do not create an entirely new project when the current one can be
  improved.
- Do not remove working functionality merely to simplify the UI.
- Avoid unnecessary package installations.
- Do not make changes to the smart contracts or backend unless
  genuinely necessary for the frontend integration.
- Create a brief implementation plan before editing files.

==================================================
2. TECHNOLOGY STACK
==================================================

Use the existing framework and tooling wherever possible.

Preferred frontend stack:

- React
- TypeScript, if compatible with the existing project
- Vite, if already used
- Tailwind CSS or the existing CSS architecture
- CSS Grid and Flexbox for layout
- Lucide React for interface icons
- Framer Motion or Motion for subtle interface animations
- React Router if the application requires client-side routing
- Recharts only if genuine analytical charts are required

Use open-source dependencies with appropriate licenses.

Potential resources:

- Lucide React: https://lucide.dev/
- Radix UI: https://www.radix-ui.com/
- shadcn/ui: https://ui.shadcn.com/
- Tailwind CSS: https://tailwindcss.com/
- Motion: https://motion.dev/
- Google Fonts: https://fonts.google.com/
- React: https://react.dev/

Use these resources selectively.

Do not install every library listed above.

Do not use a component library if its default styles prevent accurate
reproduction of the reference.

Avoid introducing a second CSS framework or multiple competing
animation libraries.

==================================================
3. DESIGN DIRECTION
==================================================

Recreate the reference image's visual identity.

Design style:

- Institutional and enterprise-oriented
- Editorial typography
- Cryptographic infrastructure aesthetic
- Academic and governmental credibility
- Restrained luxury
- Technical precision
- Minimalist but information-rich
- Research-grade presentation

The website should resemble a mature enterprise security platform
rather than a startup template.

COLOR PALETTE:

Use the following palette as the initial design system:

Primary background:       #F5F3EB
Secondary background:     #EDEAE0
Primary text:             #102322
Secondary text:           #53605B
Primary green:            #124B40
Deep forest green:        #103D35
Copper accent:            #B65F3D
Muted copper:             #D5B49A
Border:                   #D5D0C3
Subtle technical lines:   #C9C9BC
White:                    #FFFFFF

Dark CTA background:      #103F36

Use these colors consistently.

Do not introduce random gradients or additional accent colors.

Avoid the conventional AI landing page combination of black backgrounds,
electric cyan, purple gradients, glowing cards, and oversized blur
effects.

The reference image uses a warm architectural palette, deep green,
muted copper, and precise technical detailing.

Preserve that identity throughout the entire website.

==================================================
4. TYPOGRAPHY SYSTEM
==================================================

Typography is essential to reproducing the reference.

Use a sophisticated editorial serif font for major headings.

Suggested combination:

Headings: Newsreader or DM Serif Display
Body:     Inter or IBM Plex Sans
Technical labels: IBM Plex Mono

Use Google Fonts where appropriate.

Typography requirements:

- Large editorial hero heading.
- Strong contrast between heading and body text.
- Carefully controlled line height.
- Tight but readable headline spacing.
- Restrained uppercase section labels.
- Monospaced technical status indicators.
- Clear hierarchy between headings, descriptions, metadata,
  navigation, and buttons.

Avoid using the same font style and weight for every element.

Do not use excessively bold text throughout the interface.

Do not create arbitrary font sizes independently in every component.
Establish reusable typography tokens.

==================================================
5. EXACT PAGE STRUCTURE
==================================================

Reproduce the reference image's page structure in this order.

SECTION A — TOP SYSTEM STATUS BAR

Create a thin, full-width dark green status bar.

Include:

- Small copper status indicator.
- "CONSENSUS LEDGER ACTIVE"
- "EVM Smart Contract"
- "IPFS Cryptographic Archival"
- Right-aligned network latency indicator.
- Version and enterprise environment label.

Styling:

- Compact height.
- Small monospaced or technical typography.
- Thin bottom border.
- Precisely aligned elements.
- Minimal visual noise.

Use real system or application state wherever available.

Do not display fabricated live network latency or claim a blockchain
connection is active unless the application can verify that state.

SECTION B — MAIN NAVIGATION

Create a horizontal navigation header.

Left side:
- Geometric, outline-based blockchain logo.
- Product name: VeriChain.
- Small ENTERPRISE label.
- Subtitle: Decentralized Credential Infrastructure.

Center:
- Overview
- Registry Ledger
- Issue Credential
- Verify Credential

Right:
- Network status.
- Network switching control.
- Wallet/network identifier.
- Wallet connection control.

Requirements:

- Reproduce the alignment and spacing of the reference.
- Use consistent icon sizes.
- Keep navigation compact and professional.
- Use a thin divider below the header.
- Highlight the active route with a restrained green underline.
- Provide accessible labels for icon-only buttons.
- Make the navigation functional, not decorative.

If the application already uses another product name, preserve the
existing name in the functional application and use VeriChain only
where appropriate to match the reference design.

SECTION C — HERO SECTION

Create a spacious two-column hero.

LEFT COLUMN:

Small uppercase eyebrow:
"ENTERPRISE CRYPTOGRAPHIC TRUST INFRASTRUCTURE"

Primary headline:

"Decentralized Certificate
Validation & Registry"

Use an editorial serif font with large, carefully controlled line
breaks.

Keep the heading dominant without allowing it to overwhelm the page.

Supporting paragraph:

"An authoritative cryptographic platform for issuing, permanently
anchoring, and instantaneously verifying academic degrees,
professional credentials, and institutional accreditations on the
Ethereum blockchain."

Use readable line lengths and muted body text.

Primary button:
"Issue New Credential"

Secondary button:
"Verify a Certificate"

Text link:
"Access Registry Ledger →"

Buttons must have proper hover, focus, active, loading, and disabled
states.

Connect them to the existing routes or functional workflows.

RIGHT COLUMN:

Create a detailed technical illustration of the certificate
verification architecture.

The illustration should include:

1. A framed academic certificate.
2. Institution and credential metadata.
3. A subtle document seal.
4. A QR-code-like visual.
5. A three-dimensional Ethereum-inspired geometric symbol.
6. Fine architectural construction lines.
7. A connected verification pipeline.
8. Small technical nodes representing issuance, hashing, IPFS
   storage, blockchain anchoring, and verification.

The illustration must feel like a technical architectural drawing,
not a generic stock illustration.

Use original SVG artwork, CSS, or a properly licensed open-source
illustration.

Prefer SVG for precise, scalable line work.

Do not use emoji, random Unicode symbols, or placeholder rectangles.

Do not use a real person's private information in the certificate
illustration. Use clearly fictional sample data.

If actual certificate data is not available, treat the illustration
as an explicitly illustrative sample rather than a real issued
credential.

Keep the artwork within the hero's visual boundaries.

On smaller screens, reposition the artwork beneath the primary
content without causing horizontal overflow.

SECTION D — SECURITY CAPABILITIES STRIP

Below the hero, create a single horizontal four-column capability strip.

Each column contains:

1. A restrained line icon.
2. A small uppercase technical category.
3. A prominent technical capability.
4. A concise supporting description.

CARD 1

Category: INTEGRITY STANDARD
Title: SHA-256 Hashing
Description: Bitwise cryptographic uniqueness.

CARD 2

Category: ARCHIVAL SECURITY
Title: AES-256 IPFS
Description: Encrypted distributed archival.

CARD 3

Category: CONSENSUS ENGINE
Title: EVM Smart Contracts
Description: Immutable on-chain state machine.

CARD 4

Category: ANALYSIS ENGINE
Title: Multi-Layer Audit
Description: Binary, OCR & pHash telemetry.

Visual requirements:

- Fine vertical separators.
- Warm neutral background.
- Consistent icon alignment.
- Generous internal spacing.
- Minimal borders.
- No excessive shadows.
- No oversized rounded cards.

On mobile, convert the strip into a clean two-column layout or
a vertically stacked list.

SECTION E — CORE ARCHITECTURE

Add a new section with an editorial heading.

Eyebrow:
"CORE ARCHITECTURE"

Heading:
"Three Pillars of Cryptographic Verification"

Supporting text:

"The platform eliminates fraudulent degree mills and altered
certifications through an automated multi-stage pipeline
guaranteeing data provenance, confidentiality, and tamper-resistance."

Include a subtle architectural line illustration on the right.

The illustration should suggest institutional trust, verification,
and permanence.

Do not let decorative artwork interfere with readable text.

Below the heading, create three horizontally aligned feature cards.

CARD 1

Number: 01

Title:
"Multi-Layer Integrity Validation"

Description:
"Combines raw binary SHA-256 digest comparison with Tesseract OCR
semantic text extraction and perceptual visual hash (pHash) analysis
to detect both file edits and visual tampering."

Technical tag:
"RFC 3161 TIMESTAMPING STANDARD"

CARD 2

Number: 02

Title:
"Encrypted Decentralized Archival"

Description:
"Private recipient metadata and document payloads are encrypted
with AES-256-CBC prior to distributed pinning across the
InterPlanetary File System (IPFS), safeguarding privacy."

Technical tag:
"AES-256 + IPFS CID CONTENT ADDRESSING"

CARD 3

Number: 03

Title:
"Immutable Governance & Audit"

Description:
"Authorized public key registries anchor issuances to the blockchain.
Authorized institutions maintain full lifecycle governance,
including verifiable on-chain revocation and reinstatements."

Technical tag:
"ROLE-BASED ACCESS CONTROL (RBAC)"

DESIGN REQUIREMENTS:

- Thin neutral borders.
- Small copper number markers.
- Deep green outline icons.
- Serif card headings.
- Restrained supporting typography.
- Consistent card heights.
- Precise internal spacing.
- Minimal hover movement.

Avoid the typical three-card AI landing page with giant glowing icons
and rounded floating containers.

TECHNICAL ACCURACY REQUIREMENT:

Treat the descriptions above as product claims that must be verified
against the existing implementation.

Do not claim that OCR, pHash, timestamping, AES encryption, revocation,
or reinstatement is implemented unless the code and configuration
confirm it.

If a feature is planned but not implemented, distinguish it from
currently available functionality.

Do not misrepresent the system's security guarantees.

SECTION F — CREDENTIAL ISSUANCE & VERIFICATION WORKFLOW

Create a full-width section separated by a thin horizontal divider.

Eyebrow:
"PROCEDURAL PROTOCOL"

Heading:
"Credential Issuance & Verification Workflow"

Supporting text:

"Four continuous checkpoints ensuring end-to-end mathematical trust
from issuance to employer validation."

Create four horizontally aligned workflow stages.

STAGE 01

Title: Document Ingestion

Description:
"Authorized institutional issuer attaches the official credential
and files in verified student and course metadata."

STAGE 02

Title: Cryptographic Hashing

Description:
"Computes binary SHA-256 digest, extracts OCR semantic content,
calculates perceptual visual hash, and encrypts payload."

STAGE 03

Title: Blockchain Calldata Anchor

Description:
"Smart contract records the cryptographic hashes, IPFS reference
CID, and issuer public key permanently on Ethereum."

STAGE 04

Title: Zero-Trust Public Audit

Description:
"Employers or verification agencies upload a certificate or query
by hash to receive an instant authenticity and revocation result."

VISUAL DESIGN:

- Four connected workflow stages.
- Thin horizontal connecting lines.
- Circular line-art icons.
- Copper step numbers.
- Clear progression from left to right.
- Compact explanatory text.
- Balanced spacing.

For mobile, convert the horizontal timeline into a vertical timeline.

Do not use animated progress indicators that falsely imply an
operation is running.

SECTION G — FINAL CALL TO ACTION

Create a full-width deep forest-green banner.

Eyebrow:
"PRODUCTION READY PROTOCOL"

Heading:
"Ready to anchor or verify credentials on-chain?"

Description:
"Access the public zero-trust verification portal or connect your
administrative institutional wallet."

Buttons:

1. Verify Credential
2. Issue Credential →

Visual design:

- Deep forest-green background.
- Cream-colored text.
- Copper primary action.
- Thin outlined secondary action.
- Restrained geometric line patterns.
- Strong contrast.
- No neon glow.
- No excessive gradients.

Use CSS or SVG for subtle background detailing.

Buttons must navigate to real application workflows.

Do not label the system production-ready unless its implementation
and deployment status support that claim.

SECTION H — FOOTER

Create a slim footer beneath the CTA.

Left:
"VeriChain Enterprise"
"Decentralized Credential Registry System"

Right:
"Compliant with EVM Smart Contract Specifications"
"Verifiable Credentials Principles"

Keep the footer understated, aligned, and separated by a thin border.

Verify any standards-compliance claims before displaying them.

==================================================
6. VISUAL FIDELITY REQUIREMENTS
==================================================

Treat the reference image as the design specification.

Match the following characteristics:

- Overall page width and section proportions.
- Navigation height.
- Hero spacing.
- Headline scale and line breaks.
- Hero illustration placement.
- Feature strip proportions.
- Section spacing.
- Card widths and heights.
- Border thickness.
- Typography hierarchy.
- Icon size and stroke weight.
- Workflow alignment.
- CTA height and contrast.
- Footer proportions.

Use a centered content container with a maximum width of approximately
1440px, adjusted to the reference image's proportions.

Use fluid horizontal padding.

Do not stretch text or illustrations disproportionately.

Use a consistent spacing scale, for example:

4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 80px.

Create reusable CSS variables for:

- Colors.
- Typography.
- Spacing.
- Container widths.
- Border colors.
- Shadows.
- Border radii.
- Transitions.

Use restrained radii. Prefer square or slightly rounded corners over
the oversized pill-shaped components common in generic templates.

Avoid excessive shadows.

Avoid glassmorphism.

Avoid excessive gradients.

Avoid floating decorative blobs.

Avoid random animated particles.

Avoid unnecessary background video.

Avoid emoji.

Avoid default template-style icon cards.

Avoid adding sections that are not present in the reference image
unless they are necessary for the actual application's functionality.

==================================================
7. RESPONSIVE DESIGN
==================================================

The design must work at:

- 1920px desktop.
- 1440px desktop.
- 1280px laptop.
- 1024px tablet landscape.
- 768px tablet portrait.
- 390px mobile.
- 360px mobile.

Requirements:

- No horizontal overflow.
- No clipped headings.
- No overlapping illustrations.
- No broken navigation.
- No buttons extending beyond the viewport.
- No unreadable technical labels.
- No inconsistent card widths.
- No accidental layout shifts.

At desktop widths, preserve the two-column hero and horizontal
feature layouts.

At tablet widths, adjust typography, spacing, and grid proportions.

At mobile widths:

- Stack the hero columns.
- Keep the primary CTA prominent.
- Reflow the capability strip.
- Stack architecture cards.
- Convert the workflow into a vertical timeline.
- Adapt navigation without removing important functionality.
- Ensure wallet controls remain accessible.
- Maintain the editorial design identity.

Use CSS breakpoints based on actual layout needs rather than
blindly applying default framework breakpoints.

==================================================
8. FUNCTIONAL UI/UX REQUIREMENTS
==================================================

This is an actual certificate validation application, not a static
marketing website.

Preserve and integrate existing application functionality.

ISSUE CREDENTIAL:

- Connect to the existing issuance workflow.
- Validate required form fields.
- Display meaningful validation errors.
- Show transaction progress when a real transaction is running.
- Handle wallet rejection.
- Handle transaction failure.
- Display transaction results only after receiving actual results.

VERIFY CREDENTIAL:

- Integrate with the existing verification implementation.
- Support the actual input methods provided by the application.
- Display loading, success, invalid, revoked, and error states where
  the backend or smart contract can distinguish those outcomes.
- Clearly differentiate technical failure from an invalid certificate.
- Show useful verification evidence when available.

REGISTRY LEDGER:

- Display actual available registry records.
- Support loading, empty, error, and populated states.
- Provide accessible table controls.
- Avoid inventing certificate records.

WALLET:

- Preserve the existing MetaMask or wallet integration.
- Reflect actual wallet connection state.
- Reflect the actual selected network.
- Provide a useful network-switching experience.
- Handle unavailable providers and rejected requests.

GENERAL:

- Use semantic HTML.
- Add keyboard navigation.
- Provide visible focus indicators.
- Add accessible names to icon-only buttons.
- Ensure sufficient color contrast.
- Respect reduced-motion preferences.
- Avoid inaccessible hover-only interactions.
- Add appropriate loading and error states.
- Prevent repeated submissions while an operation is in progress.

Never simulate successful blockchain transactions.

Never display fabricated transaction hashes.

Never treat a visual animation as proof of a successful operation.

==================================================
9. COMPONENT ARCHITECTURE
==================================================

Create maintainable, reusable components.

Suggested structure, adapted to the existing project:

src/
  components/
    layout/
      StatusBar.tsx
      Navbar.tsx
      Footer.tsx

    hero/
      HeroSection.tsx
      CertificateIllustration.tsx
      VerificationArchitecture.tsx

    capabilities/
      CapabilityStrip.tsx
      CapabilityItem.tsx

    architecture/
      ArchitectureSection.tsx
      ArchitectureCard.tsx

    workflow/
      WorkflowSection.tsx
      WorkflowStep.tsx

    cta/
      FinalCTA.tsx

    ui/
      Button.tsx
      IconButton.tsx
      StatusBadge.tsx
      SectionLabel.tsx

  pages/
    OverviewPage.tsx

  styles/
    tokens.css
    globals.css

Do not create duplicate components if equivalent components already
exist.

Keep business logic out of purely presentational components.

Keep blockchain and API logic in the existing service or hook layer.

Use TypeScript interfaces for reusable component props where
TypeScript is available.

Do not create a large monolithic component containing the entire
website.

==================================================
10. ORIGINAL TECHNICAL ILLUSTRATIONS
==================================================

The reference image's illustrations are important to visual fidelity.

Create original, precise SVG illustrations for:

- The geometric blockchain logo.
- The certificate with a document seal and QR-code-like graphic.
- The blockchain and IPFS verification architecture.
- The institutional architecture drawing.
- Workflow icons.
- Subtle CTA background linework.

SVG requirements:

- Consistent stroke widths.
- Carefully aligned geometry.
- Limited colors.
- Responsive scaling.
- Appropriate accessible labels.
- No excessive gradients.
- No unnecessary animation.

Use CSS for simple geometric effects.

Use SVG for precise technical diagrams.

Use a raster illustration only if vector recreation would be
substantially inferior and the image is appropriately licensed.

Do not hotlink random images from the internet.

Do not download copyrighted illustrations without permission.

Do not use generated images as a substitute for functional interface
components.

The goal is to create a coherent, maintainable visual system.

==================================================
11. PERFORMANCE AND CODE QUALITY
==================================================

Requirements:

- Preserve existing working code.
- Remove confirmed dead code safely.
- Remove unused imports.
- Avoid duplicate CSS rules.
- Avoid unnecessary dependencies.
- Avoid oversized image assets.
- Optimize SVG assets.
- Lazy-load nonessential below-the-fold images where appropriate.
- Avoid layout shifts.
- Avoid excessive client-side JavaScript.
- Avoid unnecessary component re-renders.
- Avoid console errors.
- Avoid broken routes.
- Avoid introducing security vulnerabilities.

Do not delete code simply because it is not referenced by the homepage.
Check whether it is used by routing, dynamic imports, configuration,
tests, or other application workflows before removing it.

Do not disable TypeScript, linting, or existing checks to make the
build pass.

==================================================
12. IMPLEMENTATION AND VISUAL VALIDATION
==================================================

Do not stop after generating the initial code.

Follow this process:

STEP 1:
Inspect the existing codebase and identify the actual application
entry point.

STEP 2:
Implement the design using reusable React components.

STEP 3:
Start the development server using the existing project scripts.

STEP 4:
Open the page in a browser and capture a screenshot.

STEP 5:
Compare the screenshot against the supplied reference image.

STEP 6:
Identify visual differences in:

- Container width.
- Header height.
- Hero proportions.
- Typography.
- Illustration placement.
- Section spacing.
- Card dimensions.
- Colors.
- Borders.
- Alignment.
- Footer height.

STEP 7:
Correct the differences and capture another screenshot.

STEP 8:
Repeat until the result is visually close to the reference.

STEP 9:
Test the page at desktop, tablet, and mobile viewport sizes.

STEP 10:
Test all major navigation links and primary actions.

STEP 11:
Run the project's existing lint, type-check, and build commands.

STEP 12:
Resolve all errors introduced by the implementation.

If browser automation is already available, use Playwright or the
existing browser-testing setup to capture screenshots and test
interactions.

Do not claim that visual comparisons or tests passed unless they
were actually performed.

==================================================
13. FINAL ACCEPTANCE CRITERIA
==================================================

The task is complete only when:

1. The rendered website closely matches the reference image.
2. All major sections appear in the correct order.
3. The color palette is consistent.
4. The typography hierarchy is accurate.
5. The certificate illustration is carefully implemented.
6. The page looks professional at desktop and mobile sizes.
7. No horizontal overflow exists at supported viewports.
8. Existing blockchain and API functionality remains intact.
9. All primary buttons lead to meaningful actions.
10. Loading, error, and success states are handled appropriately.
11. No fabricated security or transaction claims are introduced.
12. No avoidable dead code or duplicate styles remain.
13. The project builds successfully.
14. Existing linting and type checks pass, where configured.

Do not stop at a superficially similar first draft.

Prioritize visual fidelity, technical accuracy, accessibility,
maintainability, and functional completeness.

FINAL OUTPUT:

After implementation, provide a concise report containing:

- Components created or updated.
- Existing functionality preserved.
- Dependencies added, if any.
- Dead code removed, with justification.
- Responsive behavior implemented.
- Tests actually executed and their results.
- Remaining limitations or unimplemented functionality.

Begin by inspecting the existing project before modifying anything.