const yearNodes = document.querySelectorAll('[data-current-year]');

for (const node of yearNodes) {
  node.textContent = new Date().getFullYear();
}

const translations = window.__translations;
const translatableNodes = document.querySelectorAll('[data-i18n]');
const languageButtons = document.querySelectorAll('[data-set-lang]');
const optionGroups = document.querySelectorAll('[data-option-group]');
const contactForms = document.querySelectorAll('[data-contact-form]');

const formMessages = {
  es: {
    empty: 'Selecciona una opción y completa los campos obligatorios.',
    success: 'Listo. El correo queda preparado con el servicio seleccionado.',
    serviceFallback: 'Consulta general'
  },
  en: {
    empty: 'Choose an option and complete the required fields.',
    success: 'Done. The email draft is ready with the selected service.',
    serviceFallback: 'General enquiry'
  },
  fr: {
    empty: 'Choisissez une option et complétez les champs obligatoires.',
    success: "C'est prêt. Le brouillon d’email est préparé avec le service choisi.",
    serviceFallback: 'Demande générale'
  },
  ar: {
    empty: 'اختر خدمة وأكمل الحقول المطلوبة.',
    success: 'تم تجهيز رسالة البريد بالخدمة المحددة.',
    serviceFallback: 'استفسار عام'
  }
};

function getUiMessages() {
  const lang = document.documentElement.lang;
  return formMessages[lang] || formMessages.es;
}

function updateOptionSelection(groupNode, selectedCard) {
  const cards = groupNode.querySelectorAll('[data-option-card]');
  const selectedService = selectedCard?.dataset.serviceValue || '';

  for (const card of cards) {
    const isActive = card === selectedCard;
    card.classList.toggle('is-active', isActive);
    card.setAttribute('aria-pressed', String(isActive));
  }

  const hiddenField = groupNode.querySelector('[data-selected-service]');
  if (hiddenField) {
    hiddenField.value = selectedService;
  }

  const summary = groupNode.querySelector('[data-selected-service-label]');
  if (summary) {
    summary.textContent = selectedService || getUiMessages().serviceFallback;
  }
}

for (const groupNode of optionGroups) {
  const cards = groupNode.querySelectorAll('[data-option-card]');
  const preselectedCard = groupNode.querySelector('[data-option-card].is-active') || cards[0];

  for (const card of cards) {
    card.addEventListener('click', () => {
      updateOptionSelection(groupNode, card);
    });
  }

  if (preselectedCard) {
    updateOptionSelection(groupNode, preselectedCard);
  }
}

for (const form of contactForms) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const messages = getUiMessages();
    const feedbackNode = form.querySelector('[data-form-feedback]');
    const formData = new FormData(form);
    const selectedService = String(formData.get('service') || '').trim();
    const company = String(formData.get('company') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!selectedService || !company || !email || !message) {
      if (feedbackNode) {
        feedbackNode.textContent = messages.empty;
        feedbackNode.dataset.state = 'error';
      }
      return;
    }

    const recipient = form.dataset.recipient || '';
    const subject = encodeURIComponent(`[Web] ${selectedService} · ${company}`);
    const body = encodeURIComponent(
      [
        `Empresa: ${company}`,
        `Email: ${email}`,
        `Servicio: ${selectedService}`,
        '',
        message
      ].join('\n')
    );

    if (feedbackNode) {
      feedbackNode.textContent = messages.success;
      feedbackNode.dataset.state = 'success';
    }

    if (recipient) {
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    }
  });
}

if (translations && translatableNodes.length > 0 && languageButtons.length > 0) {
  const storageKey = `site-lang-${document.body.dataset.page || 'default'}`;
  const availableLanguages = new Set(Object.keys(translations));

  function applyLanguage(lang) {
    const selectedLanguage = availableLanguages.has(lang) ? lang : 'es';
    const selectedDictionary = translations[selectedLanguage] || translations.es || {};

    document.documentElement.lang = selectedLanguage;
    document.documentElement.dir = selectedLanguage === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('is-rtl', selectedLanguage === 'ar');

    for (const node of translatableNodes) {
      const key = node.dataset.i18n;
      const value = selectedDictionary[key];

      if (typeof value === 'string') {
        node.innerHTML = value;
      }
    }

    for (const button of languageButtons) {
      const isActive = button.dataset.setLang === selectedLanguage;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    }

    for (const groupNode of optionGroups) {
      const activeCard = groupNode.querySelector('[data-option-card].is-active');
      if (activeCard) {
        updateOptionSelection(groupNode, activeCard);
      }
    }

    try {
      localStorage.setItem(storageKey, selectedLanguage);
    } catch {
      // Ignorado si el navegador no permite persistencia.
    }
  }

  for (const button of languageButtons) {
    button.addEventListener('click', () => {
      applyLanguage(button.dataset.setLang);
    });
  }

  let preferredLanguage = 'es';

  try {
    preferredLanguage = localStorage.getItem(storageKey) || 'es';
  } catch {
    preferredLanguage = 'es';
  }

  applyLanguage(preferredLanguage);
}
