const form = document.getElementById("feedback-form");
const success = document.getElementById("success");

const validators = {
  name: (value) => value.trim().length >= 2 || "Please enter your full name.",
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || "Please enter a valid email address.",
  category: (value) => value !== "" || "Please choose a topic.",
  rating: (value) => value !== "" || "Please choose a rating.",
  message: (value) => value.trim().length >= 10 || "Please write at least 10 characters.",
  contact: (value) => value !== "" || "Please select an option.",
};

function setInvalid(field, message) {
  const wrapper = field.closest(".field");
  const error = wrapper.querySelector("[data-error-for]");
  wrapper.classList.toggle("invalid", Boolean(message));
  error.textContent = message;
}

function validateField(field) {
  const validate = validators[field.name];
  if (!validate) return true;
  const message = validate(field.value);
  setInvalid(field, message);
  return !message;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let firstInvalid = null;
  for (const field of form.elements) {
    if (field.name && validators[field.name]) {
      const isValid = validateField(field);
      if (!isValid && !firstInvalid) firstInvalid = field;
    }
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  form.hidden = true;
  success.hidden = false;

  const data = Object.fromEntries(new FormData(form).entries());
  data.subscribe = form.querySelector("#subscribe").checked;
  console.log("Feedback submitted:", data);
});

for (const field of form.elements) {
  if (!validators[field.name]) continue;
  field.addEventListener("input", () => validateField(field));
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("change", () => validateField(field));
}
