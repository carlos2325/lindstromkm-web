const yearNodes = document.querySelectorAll('[data-current-year]');

for (const node of yearNodes) {
  node.textContent = new Date().getFullYear();
}

const revealTargets = document.querySelectorAll('main > section');

for (const el of revealTargets) {
  el.classList.add('reveal');
}

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -80px 0px' }
  );

  for (const el of revealTargets) {
    revealObserver.observe(el);
  }
} else {
  for (const el of revealTargets) {
    el.classList.add('is-visible');
  }
}

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
  },
  zh: {
    empty: '请选择一项服务并填写所有必填字段。',
    success: '完成。邮件草稿已按所选服务准备好。',
    serviceFallback: '一般咨询'
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

const langSwitch = document.querySelector('[data-lang-switch]');

if (langSwitch) {
  const toggle = langSwitch.querySelector('[data-lang-toggle]');
  const menu = langSwitch.querySelector('[data-lang-menu]');

  toggle.addEventListener('click', () => {
    const isOpen = !menu.hidden;
    menu.hidden = isOpen;
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });

  document.addEventListener('click', (event) => {
    if (!langSwitch.contains(event.target)) {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  for (const link of langSwitch.querySelectorAll('[data-lang-set]')) {
    link.addEventListener('click', () => {
      try {
        localStorage.setItem('lkm_lang', link.dataset.langSet);
      } catch {
        // Ignorado si el navegador no permite persistencia.
      }
    });
  }
}
