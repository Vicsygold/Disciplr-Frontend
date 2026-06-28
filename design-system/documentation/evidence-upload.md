# Evidence Upload

`EvidenceUpload` lets a vault owner attach a public evidence URL for milestone validation. It builds on the shared `Field` component so label, hint, error, `aria-describedby`, and `aria-invalid` behavior stay consistent with other forms.

## Accepted URLs

- `https://...`
- `http://...`

The URL is trimmed before being emitted. Missing schemes, `javascript:`, `data:`, and other non-http(s) schemes are rejected so verifier screens do not render unsafe evidence links later.

## States

| State | Behavior |
| --- | --- |
| Empty | Shows neutral guidance using `--muted`. |
| Invalid | Shows a `Field` error using `--danger` after blur or submit. |
| Valid | Shows accepted evidence feedback using `--success`. |

Use the `onChange` callback to receive the validated URL, or `undefined` when the current input is empty or invalid. Use `onSubmit` when the parent flow needs an explicit attach action.
