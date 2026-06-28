# Link Safety Policy

All external URLs provided by users (such as `evidenceUrl` in validation tasks) must be sanitized before being rendered to verifiers.

## Policy
1.  **Strict Scheme Allowlist:** Only `http:` and `https:` schemes are permitted. All others (e.g., `javascript:`, `data:`, `file:`) are rejected.
2.  **Safe Attributes:** Any rendered external link MUST include `target="_blank"` and `rel="noopener noreferrer"` to prevent security vulnerabilities like reverse tabnabbing.
3.  **Inert Fallback:** If a URL fails sanitization, it must be rendered as inert text (`[Invalid Link]`) with an optional `title` attribute explaining the rejection.

## Implementation
Use the `isSafeEvidenceUrl` utility from `src/utils/url.ts` to validate links, and the `SafeLink` component from `src/components/SafeLink.tsx` to render them.
