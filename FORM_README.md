# Quotation Form Change Log

## 2026-08-19 — form reliability and accessibility update

### Fixed

| Issue | Resolution |
| --- | --- |
| Design files were not uploaded | The browser now sends `multipart/form-data`; the API forwards the actual `attachment` file to Formspree instead of only passing its name. |
| Dimensions could be blank | Length, width, and height are required in the browser and must be finite positive numbers on the server. |
| Numeric zero bypass | The server explicitly rejects all non-positive dimensions, including numeric `0`. |
| Labels were not associated with controls | Every form control now has a stable `id` and matching `label htmlFor`. |
| Validation messages were inaccessible | Invalid controls expose `aria-invalid`, point to their messages with `aria-describedby`, and messages use `role="alert"`. Submission feedback uses a polite live region. |
| Native validation was disabled | Removed `noValidate`, restoring browser validation for required fields, email, numeric limits, and phone pattern. |
| Broken punctuation | Replaced malformed dash and copyright characters with `—` and `©`. |
| Unused state | Removed the unused `submitted` state. |

### Attachment rules

- Optional attachments are forwarded under the field name `attachment`.
- Allowed extensions: PDF, AI, EPS, SVG, PNG, JPG, JPEG.
- Maximum attachment size: 10 MB.
- The server validates extension and size before contacting Formspree.

### Submission flow

1. Native browser validation checks the visible controls.
2. Client validation applies business rules, including a valid Indian mobile number and positive dimensions.
3. The client submits form fields and an optional attachment to `/api/inquiry` using `FormData`.
4. The API repeats validation and relays the multipart submission to the configured Formspree form (`FORMSPREE_FORM_ID`).

### Verification checklist

- Submit with empty dimensions: submission must be blocked.
- Submit with `0` or a negative dimension: submission must be blocked.
- Attach a permitted file smaller than 10 MB: Formspree should receive it as `attachment`.
- Attach an unsupported or oversized file: the API must return a clear validation error.
- Navigate with a keyboard or screen reader: each label and validation message should identify its field.
