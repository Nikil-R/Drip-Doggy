# Rules & Safeguards for AI Coding Agents

This workspace is managed using strict guidelines to ensure that AI agents do not delete files unexpectedly, overwrite critical application components, or perform unauthorized code changes.

## 1. Directory Structure Integrity

- **Never** perform broad recursive deletions on `frontend/src/` or `backend/` without explicit, step-by-step user confirmation.
- **Never** modify root directory config files (`vite.config.ts`, `package.json`, etc.) in a way that shifts path resolutions outside of the `frontend/` subdirectory.

## 2. Code Modifying Safeguards

- **Before modifying any file**: Read it first to identify structural patterns and existing imports.
- **Incremental changes**: Edit files targeting exact line ranges using search/replace rather than replacing complete files.
- **Imports preservation**: Do not rewrite or remove imports of local UI primitives (`frontend/src/app/components/ui/*`) unless those elements are completely deprecated.
- **Comments/JSDocs**: Do not remove user documentation, JSDoc comments, or inline warnings.

## 3. Style Constraints

- AI agents must adhere to the design system outlined in `frontend/src/DESIGN.md` (e.g. sharp corners `rounded-none`, Warm Editorial Ivory background, custom Syne/EB Garamond font setups).
- Do not introduce ad-hoc utility libraries or UI packages (e.g. Tailwind variants) unless requested.
- Verify compiling states using `npm run build` after editing, ensuring that no broken relative file imports exist.


