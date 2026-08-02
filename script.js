'use strict';

/* ------------------------------------------------------------------
   Feedback Form — script.js
   Validation logic is kept separate from DOM manipulation.
   ------------------------------------------------------------------ */

const CATEGORY_TYPES = Object.freeze({
  'bug-report': ['UI Issue', 'Performance', 'Crash', 'Data Issue'],
  'feature-request': ['New Feature', 'Improvement', 'Integration'],
  'general-feedback': ['Compliment', 'Suggestion', 'Complaint'],
  question: ['Technical', 'Billing', 'General'],
  other: ['Other'],
});

const REQUIRED_FIELDS = Object.freeze(['category', 'type', 'message']);

const REQUIRED_MESSAGES = Object.freeze({
  category: 'Please select a feedback category.',
  type: 'Please select a feedback type.',
  message: 'Please enter your feedback message.',
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* --- Pure validation logic (no DOM access) -------------------------- */

const validators = Object.freeze({
  category: (value) => (value ? null : REQUIRED_MESSAGES.category),
  type: (value, data) =>
    data.category && !value ? REQUIRED_MESSAGES.type : null,
  message: (value) => (value.trim() ? null : REQUIRED_MESSAGES.message),
  email: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    return EMAIL_REGEX.test(trimmed)
      ? null
      : 'Please enter a valid email address (e.g., name@example.com).';
  },
});

function validateField(name, value, data) {
  const validator = validators[name];
  return validator ? validator(value, data) : null;
}

/* --- DOM references ------------------------------------------------- */

let form;
let submitButton;
let successMessage;
let categoryEl;
let typeEl;

function getFormData() {
  const data = {};
  for (const name of ['name', 'email', 'category', 'type', 'message']) {
    data[name] = form.elements[name] ? form.elements[name].value.trim() : '';
  }
  return data;
}

/* --- Error rendering ------------------------------------------------- */

function showError(control, errorElement, message) {
  control.classList.add('field-invalid');
  control.setAttribute('aria-invalid', 'true');

  const existing = (control.getAttribute('aria-describedby') || '')
    .split(' ')
    .filter((id) => id !== errorElement.id);
  existing.push(errorElement.id);
  control.setAttribute('aria-describedby', existing.join(' '));

  errorElement.textContent = message;
}

function clearError(control, errorElement) {
  control.classList.remove('field-invalid');
  control.removeAttribute('aria-invalid');

  const existing = (control.getAttribute('aria-describedby') || '')
    .split(' ')
    .filter((id) => id !== errorElement.id)
    .filter(Boolean);
  if (existing.length) {
    control.setAttribute('aria-describedby', existing.join(' '));
  } else {
    control.removeAttribute('aria-describedby');
  }

  errorElement.textContent = '';
}

function updateFieldError(name, error) {
  const control = form.elements[name];
  const errorElement = document.getElementById(`${name}-error`);
  if (!control || !errorElement) return;

  if (error) {
    showError(control, errorElement, error);
  } else {
    clearError(control, errorElement);
  }
}

function clearAllErrors() {
  for (const name of [...REQUIRED_FIELDS, 'email']) {
    updateFieldError(name, null);
  }
}

/* --- Dependent dropdown ---------------------------------------------- */

function populateTypeOptions() {
  const selectedCategory = categoryEl.value;
  const types = CATEGORY_TYPES[selectedCategory] || [];

  typeEl.replaceChildren();

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = types.length
    ? 'Select a feedback type'
    : 'Select a category first';
  typeEl.appendChild(placeholder);

  for (const type of types) {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    typeEl.appendChild(option);
  }

  typeEl.value = '';
  typeEl.disabled = types.length === 0;
}

/* --- Submit button state --------------------------------------------- */

function updateSubmitState() {
  const data = getFormData();
  const allValid = REQUIRED_FIELDS.every(
    (name) => !validateField(name, data[name], data)
  );
  submitButton.disabled = !allValid;
}

/* --- Validation lifecycle --------------------------------------------- */

function validateFieldOnEvent(name) {
  const data = getFormData();
  updateFieldError(name, validateField(name, data[name], data));
  updateSubmitState();
}

function attachFieldValidation(name) {
  const control = form.elements[name];
  if (!control) return;

  control.addEventListener('blur', () => validateFieldOnEvent(name));

  const eventName = control.tagName === 'SELECT' ? 'change' : 'input';
  control.addEventListener(eventName, () => validateFieldOnEvent(name));
}

function handleCategoryChange() {
  populateTypeOptions();

  const data = getFormData();
  updateFieldError('category', validateField('category', data.category, data));
  updateFieldError('type', null);
  updateSubmitState();
}

/* --- Form submission --------------------------------------------------- */

function applyErrors(errors) {
  for (const name of ['email', ...REQUIRED_FIELDS]) {
    updateFieldError(name, errors[name] || null);
  }
}

function focusFirstError(errors) {
  for (const control of form.elements) {
    if (control.name && errors[control.name]) {
      control.focus();
      return;
    }
  }
}

function handleSubmit(event) {
  event.preventDefault();

  const data = getFormData();
  const errors = {};
  for (const name of REQUIRED_FIELDS) {
    const error = validateField(name, data[name], data);
    if (error) errors[name] = error;
  }
  const emailError = validateField('email', data.email, data);
  if (emailError) errors.email = emailError;

  applyErrors(errors);
  updateSubmitState();

  if (Object.keys(errors).length > 0) {
    focusFirstError(errors);
    return;
  }

  const submission = {
    name: data.name,
    email: data.email,
    category: data.category,
    type: data.type,
    message: data.message,
    submittedAt: new Date().toISOString(),
  };
  console.log('Feedback submitted:', submission);

  showSuccessMessage();
  resetForm();
}

/* --- Reset & success ---------------------------------------------------- */

function showSuccessMessage() {
  successMessage.hidden = false;
}

function hideSuccessMessage() {
  successMessage.hidden = true;
}

function resetForm() {
  form.reset();
  populateTypeOptions();
  clearAllErrors();
  updateSubmitState();
}

/* --- Initialization ------------------------------------------------------ */

function initializeForm() {
  form = document.getElementById('feedback-form');
  submitButton = document.getElementById('submit-button');
  successMessage = document.getElementById('success-message');
  categoryEl = form.elements.category;
  typeEl = form.elements.type;

  populateTypeOptions();

  for (const name of ['type', 'email', 'message']) {
    attachFieldValidation(name);
  }

  categoryEl.addEventListener('change', handleCategoryChange);
  categoryEl.addEventListener('blur', () => validateFieldOnEvent('category'));

  form.addEventListener('submit', handleSubmit);

  // Hide the success banner as soon as the user starts interacting again.
  form.addEventListener('input', hideSuccessMessage);
  form.addEventListener('change', hideSuccessMessage);

  updateSubmitState();
}

initializeForm();
