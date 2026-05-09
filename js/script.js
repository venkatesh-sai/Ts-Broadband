const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const revealItems = document.querySelectorAll(".reveal");
const planButtons = document.querySelectorAll(".js-plan-select");
const planCards = document.querySelectorAll(".plan-card");
const planGrid = document.querySelector(".plan-grid");
const planSelect = document.getElementById("plan");
const contactForm = document.getElementById("lead-form");
const statusBox = document.getElementById("form-status");
const yearNode = document.getElementById("year");
const formResetFlag = "tsbroadband-form-submitted";
const formFields = ["name", "email", "phone", "plan", "address"];
const legalAccordionButtons = document.querySelectorAll(".legal-section__toggle");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

function toggleMenu(forceClose) {
  if (!menuToggle || !siteMenu) {
    return;
  }

  const shouldOpen = typeof forceClose === "boolean" ? !forceClose : !siteMenu.classList.contains("is-open");
  siteMenu.classList.toggle("is-open", shouldOpen);
  menuToggle.classList.toggle("is-open", shouldOpen);
  menuToggle.setAttribute("aria-expanded", String(shouldOpen));
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => toggleMenu());
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 980) {
      toggleMenu(true);
    }
  });
});

window.addEventListener("scroll", () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 20);
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("reveal-visible"));
}

planButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCard = button.closest(".plan-card");

    planCards.forEach((card) => {
      card.classList.remove("is-active");
    });

    if (selectedCard) {
      selectedCard.classList.add("is-active");
    }

    if (planGrid) {
      planGrid.classList.add("has-active");
    }

    if (planSelect) {
      planSelect.value = button.dataset.plan || "";
    }

    const formSection = document.getElementById("contact-form");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

legalAccordionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const section = button.closest(".legal-section");

    if (!section) {
      return;
    }

    const isOpen = section.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

function sanitizeValue(value) {
  return value.replace(/[<>]/g, "").trim();
}

function normalizeSpaces(value) {
  return value.replace(/\s+/g, " ").trim();
}

function setError(fieldName, message) {
  const input = document.getElementById(fieldName);
  const messageNode = document.querySelector(`.error-message[data-for="${fieldName}"]`);

  if (input) {
    input.classList.toggle("field-error", Boolean(message));
    if (message) {
      input.setAttribute("aria-invalid", "true");
    } else {
      input.removeAttribute("aria-invalid");
    }

    if (messageNode?.id) {
      input.setAttribute("aria-describedby", messageNode.id);
    }
  }

  if (messageNode) {
    messageNode.textContent = message || "";
  }
}

function setStatus(message, type) {
  if (!statusBox) {
    return;
  }

  statusBox.textContent = message;
  statusBox.classList.remove("is-error", "is-success");

  if (type) {
    statusBox.classList.add(type === "error" ? "is-error" : "is-success");
  }
}

function clearFormState() {
  if (!contactForm) {
    return;
  }

  contactForm.reset();
  const formElements = contactForm.querySelectorAll("input, select, textarea");

  formElements.forEach((element) => {
    const tagName = element.tagName.toLowerCase();
    const inputType = (element.getAttribute("type") || "").toLowerCase();
    const fieldName = element.getAttribute("name") || "";
    const isProtectedHiddenField = inputType === "hidden" && (
      fieldName === "access_key" ||
      fieldName === "redirect" ||
      fieldName === "subject"
    );

    if (isProtectedHiddenField) {
      return;
    }

    if (inputType === "checkbox") {
      element.checked = false;
    } else if (tagName === "select") {
      element.selectedIndex = 0;
    } else if (tagName === "textarea" || inputType !== "hidden") {
      element.value = "";
    }

    element.classList.remove("field-error");
    element.removeAttribute("aria-invalid");
  });

  formFields.forEach((field) => {
    const messageNode = document.querySelector(`.error-message[data-for="${field}"]`);
    if (messageNode) {
      messageNode.textContent = "";
    }
  });

  setStatus("", "");
}

function resetApplicationForm() {
  if (!contactForm) {
    return;
  }

  clearFormState();
}

function hasResetQueryFlag() {
  return new URLSearchParams(window.location.search).get("resetForm") === "true";
}

function shouldResetApplicationForm() {
  return window.sessionStorage.getItem(formResetFlag) === "true" || hasResetQueryFlag();
}

function cleanResetQueryFlag() {
  if (!hasResetQueryFlag()) {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.delete("resetForm");
  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState({}, document.title, nextUrl);
}

function scrollToApplicationForm() {
  const applyAnchor = document.getElementById("apply-now");
  if (!applyAnchor) {
    return;
  }

  requestAnimationFrame(() => {
    applyAnchor.scrollIntoView({ behavior: "auto", block: "start" });
  });
}

function scheduleApplicationFormReset() {
  if (!contactForm || !shouldResetApplicationForm()) {
    return;
  }

  const runReset = () => {
    resetApplicationForm();
  };

  runReset();
  window.setTimeout(runReset, 50);
  window.setTimeout(runReset, 300);

  if (window.location.hash === "#apply-now") {
    scrollToApplicationForm();
    window.setTimeout(scrollToApplicationForm, 50);
  }

  cleanResetQueryFlag();
  window.sessionStorage.removeItem(formResetFlag);
}

function validateForm(formData) {
  const values = {
    name: normalizeSpaces(sanitizeValue(formData.get("name") || "")),
    email: sanitizeValue(formData.get("email") || "").replace(/\s+/g, ""),
    phone: sanitizeValue(formData.get("phone") || "").replace(/\D/g, ""),
    plan: sanitizeValue(formData.get("plan") || ""),
    address: normalizeSpaces(sanitizeValue(formData.get("address") || ""))
  };

  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const namePattern = /^[A-Za-z ]+$/;
  const phonePattern = /^[6-9]\d{9}$/;

  if (
    !values.name ||
    values.name.length < 3 ||
    values.name.length > 50 ||
    !namePattern.test(values.name)
  ) {
    errors.name = "Please enter a valid name using only letters and spaces.";
  }

  if (!values.email || !emailPattern.test(values.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!phonePattern.test(values.phone)) {
    errors.phone = "Please enter a valid 10-digit mobile number.";
  }

  if (!values.plan) {
    errors.plan = "Please select a broadband plan.";
  }

  if (!values.address || values.address.length < 10 || values.address.length > 250) {
    errors.address = "Please enter a valid installation address.";
  }

  return { values, errors };
}

function attachFieldRestrictions() {
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("email");
  const addressInput = document.getElementById("address");
  const planInput = document.getElementById("plan");
  const fields = ["name", "phone", "email", "plan", "address"];

  if (nameInput) {
    nameInput.addEventListener("input", () => {
      nameInput.value = nameInput.value.replace(/[^A-Za-z ]+/g, "").replace(/\s{2,}/g, " ");
      setError("name", "");
      setStatus("", "");
    });

    nameInput.addEventListener("blur", () => {
      nameInput.value = normalizeSpaces(nameInput.value);
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
      setError("phone", "");
      setStatus("", "");
    });
  }

  if (emailInput) {
    emailInput.addEventListener("input", () => {
      emailInput.value = emailInput.value.replace(/\s+/g, "");
      setError("email", "");
      setStatus("", "");
    });
  }

  if (addressInput) {
    addressInput.addEventListener("input", () => {
      setError("address", "");
      setStatus("", "");
    });
  }

  if (planInput) {
    planInput.addEventListener("change", () => {
      setError("plan", "");
      setStatus("", "");
    });
  }

  fields.forEach((field) => {
    const element = document.getElementById(field);
    if (!element || field === "plan") {
      return;
    }

    element.addEventListener("blur", () => {
      const value = field === "email"
        ? sanitizeValue(element.value).replace(/\s+/g, "")
        : field === "phone"
          ? sanitizeValue(element.value).replace(/\D/g, "")
          : normalizeSpaces(sanitizeValue(element.value));

      element.value = value;
    });
  });
}

if (contactForm) {
  attachFieldRestrictions();
  scheduleApplicationFormReset();

  contactForm.addEventListener("submit", (event) => {
    const formData = new FormData(contactForm);
    const botcheck = formData.get("botcheck");

    setStatus("", "");
    formFields.forEach((field) => setError(field, ""));

    if (botcheck) {
      event.preventDefault();
      setStatus("Unable to submit the form right now. Please try again.", "error");
      return;
    }

    const { values, errors } = validateForm(formData);

    Object.entries(values).forEach(([key, value]) => {
      const field = contactForm.elements.namedItem(key);
      if (field && "value" in field) {
        field.value = value;
      }
    });

    if (Object.keys(errors).length > 0) {
      event.preventDefault();
      Object.entries(errors).forEach(([field, message]) => setError(field, message));
      setStatus("Please correct the highlighted fields before submitting.", "error");
      return;
    }

    window.sessionStorage.setItem(formResetFlag, "true");
    setStatus("Submitting your request...", "success");
  });
}

window.addEventListener("DOMContentLoaded", () => {
  if (!contactForm) {
    return;
  }

  scheduleApplicationFormReset();
});

window.addEventListener("pageshow", (event) => {
  if (!contactForm) {
    return;
  }

  if (event.persisted || shouldResetApplicationForm()) {
    scheduleApplicationFormReset();
  }
});
