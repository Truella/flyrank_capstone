# AI Workflow Comparison

## Overview

Same feature, a feedback form, implemented twice. The vague prompt
(`feat/FE-03-Vague-prompt-implementation`) produced a minimal dark-themed form.
The structured prompt (`feat/FE-03-structured-prompt-implementation`) produced a
rewritten form specifying which fields are required vs optional, dependent
category → type dropdowns, live validation, and accessibility requirements.

## Correctness

The structured branch satisfies more requirements. It implements a dependent
dropdown: choosing a category repopulates the type select and disables it when
no category is selected. Required fields (`category`, `type`, `message`) are
enforced while `name` and `email` became optional; email is validated only when
filled. The submit button is disabled until the form is valid, so empty
submissions are impossible. The vague branch treated every field as required,
had no dependent dropdowns, and kept a `rating` select the structured spec
dropped. Its validators (min name length, 10-char message) were guesses, not
requirements.

## Accessibility

The structured branch adds a skip link, `aria-invalid` and dynamically managed
`aria-describedby` pointing at each error message, `role="status"` on the
success banner, `aria-hidden` on decorative required marks, `focus-visible`
styles, visible disabled states, and `prefers-reduced-motion` support. The vague
branch signals errors only with a CSS `.invalid` class on plain `<small>` text,
which is invisible to screen readers and unlinked from their inputs. Focus handling is
limited to focusing the first invalid field on submit.

## Edge Cases

- Changing category: structured resets the type dropdown and its error; vague
  has no dependent logic at all.
- Submitting an empty form: impossible in structured (button disabled); vague
  submits and floods all errors.
- Optional email: structured ignores blank email; vague always requires a
  valid one.
- Double-click submit: structured resets the form after success and hides the
  banner on new input; vague hides the entire form after submit.
- Long messages: structured only checks non-empty; vague caps at 10 chars.

## Review Effort

The vague branch is a small diff (~60 lines of JS, one stylesheet) and easy to
skim, but validators are coupled to DOM calls and behavior is tangled, so manual
testing is needed to trust it. The structured branch is a much larger diff
(rewritten HTML, 271-line `script.js`, 323-line `styles.css`) but is better
organized: frozen constant maps, cached DOM references in an `initializeForm`
function, and pure validation logic separated from DOM mutation. Naming and
section comments are consistent. More states (dependent dropdowns, disabled
button, ARIA churn) mean more manual checking, but each behavior is explicit and
traceable, reducing guesswork.

## Conclusion

- **Structured prompt:** produced more correct, accessible, and maintainable
  code at the cost of a bigger diff and more review surface.
- **Vague prompt:** minimized output but invented requirements and missed core
  UX.
- **Concrete AI fault caught:** the vague branch's validators use
  `condition || "message"`, so a valid field returns the boolean `true`. That
  value is rendered into the error element, showing the word "true" in red and
  marking the field invalid. This keeps a correctly filled form from ever
  submitting and bounces focus back to the top of the form.

Lesson: precise prompts (naming required vs optional fields, dependent behavior,
accessibility, and disabled-state UX) are what make AI-assisted development
reliable.
