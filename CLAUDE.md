# Project Instructions

## Stack
- Current implementation is vanilla HTML, CSS, and JavaScript
  (`index.html`, `styles.css`, `script.js`).
- The project will transition to Next.js 15, React 19, TypeScript, Tailwind CSS,
  Supabase, Prisma, and PostgreSQL as it grows. Do not introduce those
  technologies until explicitly requested.

## Code Style
- Prefer functional React components.
- Use TypeScript strictly.
- Avoid `any`.
- Keep components under 200 lines where possible.
- Use server components by default.
- Use Conventional Commits.

## Folder Structure
- Current: `index.html`, `styles.css`, `script.js`.
- Planned after transition:
  - `src/app/`
  - `src/components/`
  - `src/lib/`
  - `src/hooks/`
  - `src/types/`

## Git
- feat:
- fix:
- docs:
- refactor:
- chore:

## AI Assistant Guidelines
- Explain complex changes before making them.
- Preserve existing architecture.
- Do not introduce unnecessary dependencies.
- Run lint before suggesting completion.

## Project Rules
### Stack and Structure
- This project uses vanilla HTML, CSS, and JavaScript.
- Do not introduce React, Next.js, TypeScript, or external frameworks unless
  explicitly requested.
- Keep the implementation aligned with the existing file structure:
  - `index.html`
  - `styles.css`
  - `script.js`

### Validation
- All validators must return `null` when validation passes and a string error
  message when validation fails.
- Never use fallback expressions like `condition || "error message"` for
  validation results because valid boolean values may incorrectly render as
  errors.
- Required field validation should trigger after the user leaves the field
  (blur), not immediately on page load.

### Accessibility
- Every validation error must be connected to its input using:
  - `aria-invalid`
  - `aria-describedby`
- Use semantic HTML elements before adding custom behavior.
- Success messages should use `role="status"` for screen reader announcements.
- Maintain keyboard accessibility and include a skip link.
- Respect `prefers-reduced-motion` for animations.

### Form Behavior
- The category dropdown controls available options in the dependent type
  dropdown.
- When category changes:
  - update available type options
  - reset the type selection
  - clear any previous type validation error
- Optional fields (name and email) should not block submission.
- Required fields are category, type, and message.

### Testing and Review
- After implementing changes, verify functionality manually and with tests
  where applicable.
- Check edge cases such as:
  - empty required fields
  - changing dropdown selections after errors appear
  - invalid email formats
  - keyboard-only navigation
