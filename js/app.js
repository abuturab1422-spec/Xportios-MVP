/**
 * XPORTIOS — Elite Software House & Growth Marketing Syndicate
 * Master Client-Side Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initGlobalClocks();
  initHeaderScroll();
  initMobileNav();
  initClientMatrixTabs();
  initOfferingsQuickSelect();
  initProjectEstimator();
  initFaqAccordion();
  initLeadForm();
  updateCopyrightYear();
});

/* --------------------------------------------------------------------------
   1. Live Global Operations Clocks (London, NYC, Dubai, Singapore)
   -------------------------------------------------------------------------- */
function initGlobalClocks() {
  const lonEl = document.getElementById('time-lon');
  const nycEl = document.getElementById('time-nyc');
  const dxbEl = document.getElementById('time-dxb');
  const sinEl = document.getElementById('time-sin');

  function updateTimes() {
    const now = new Date();
    const formatTime = (timeZone) => {
      try {
        return new Intl.DateTimeFormat('en-GB', {
          timeZone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).format(now);
      } catch (e) {
        return '--:--';
      }
    };

    if (lonEl) lonEl.textContent = formatTime('Europe/London');
    if (nycEl) nycEl.textContent = formatTime('America/New_York');
    if (dxbEl) dxbEl.textContent = formatTime('Asia/Dubai');
    if (sinEl) sinEl.textContent = formatTime('Asia/Singapore');
  }

  updateTimes();
  setInterval(updateTimes, 30000); // refresh every 30 seconds
}

/* --------------------------------------------------------------------------
   2. Header Scroll Backdrop
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   3. Accessible Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const menuToggle = document.getElementById('menu-toggle-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const closeBtn = document.getElementById('close-drawer-btn');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuToggle || !mobileNav) return;

  function openDrawer() {
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuToggle.focus();
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  // Close when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   4. Client Matrix ("Who We Elevate") Interactive Tabs
   -------------------------------------------------------------------------- */
function initClientMatrixTabs() {
  const tabButtons = document.querySelectorAll('.matrix-tab-btn');
  const tabPanels = document.querySelectorAll('.matrix-tab-panel');

  if (!tabButtons.length) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetPanelId = button.getAttribute('aria-controls');

      // Update button states
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      // Update panel visibility
      tabPanels.forEach(panel => {
        if (panel.id === targetPanelId) {
          panel.classList.add('active');
          panel.removeAttribute('hidden');
        } else {
          panel.classList.remove('active');
          panel.setAttribute('hidden', '');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Offerings Quick Select to Contact Form
   -------------------------------------------------------------------------- */
function initOfferingsQuickSelect() {
  const selectButtons = document.querySelectorAll('.select-offering-btn');
  const targetPackageSelect = document.getElementById('target-package');

  selectButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const packageName = btn.getAttribute('data-package');
      if (targetPackageSelect && packageName) {
        // Find matching option or set value
        let matched = false;
        for (let i = 0; i < targetPackageSelect.options.length; i++) {
          if (packageName.includes(targetPackageSelect.options[i].value)) {
            targetPackageSelect.selectedIndex = i;
            matched = true;
            break;
          }
        }
        if (!matched) {
          targetPackageSelect.value = "Custom Bespoke Engagement";
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. Interactive Project Scope & Investment Estimator
   -------------------------------------------------------------------------- */
function initProjectEstimator() {
  const scopeSelect = document.getElementById('scope-type');
  const velocityRadios = document.querySelectorAll('input[name="velocity"]');
  const growthAddon = document.getElementById('growth-engine-addon');
  const securityAddon = document.getElementById('security-addon');

  const displayInvestment = document.getElementById('calc-investment-display');
  const displayTimeline = document.getElementById('calc-timeline-display');
  const displayTeam = document.getElementById('calc-team-display');
  const applyBtn = document.getElementById('apply-calc-to-contact');

  if (!scopeSelect || !displayInvestment) return;

  function calculateEstimate() {
    const selectedOption = scopeSelect.options[scopeSelect.selectedIndex];
    const basePrice = parseFloat(selectedOption.value) || 48000;
    const baseWeeks = parseInt(selectedOption.getAttribute('data-weeks'), 10) || 8;
    const baseTeam = parseInt(selectedOption.getAttribute('data-team'), 10) || 4;

    // Velocity factor
    let velocityMultiplier = 1;
    velocityRadios.forEach(radio => {
      if (radio.checked) {
        velocityMultiplier = parseFloat(radio.value) || 1;
      }
    });

    // Addons
    let addonTotal = 0;
    if (growthAddon && growthAddon.checked) {
      addonTotal += parseFloat(growthAddon.value) || 0;
    }
    if (securityAddon && securityAddon.checked) {
      addonTotal += parseFloat(securityAddon.value) || 0;
    }

    // Calculations
    const calculatedTotal = Math.round(basePrice * velocityMultiplier) + addonTotal;

    // Timeline calculation (faster pace reduces weeks, but requires higher density)
    let calculatedWeeks = baseWeeks;
    let squadSize = baseTeam;

    if (velocityMultiplier === 1.25) {
      calculatedWeeks = Math.max(4, Math.round(baseWeeks * 0.75));
      squadSize = baseTeam + 2;
    } else if (velocityMultiplier === 1.6) {
      calculatedWeeks = Math.max(3, Math.round(baseWeeks * 0.5));
      squadSize = baseTeam + 4;
    }

    // Format display
    displayInvestment.textContent = '$' + calculatedTotal.toLocaleString('en-US');
    displayTimeline.textContent = `${calculatedWeeks} – ${calculatedWeeks + 2} Weeks`;
    displayTeam.textContent = `${squadSize} Senior Specialists`;

    return {
      scopeTitle: selectedOption.textContent,
      total: calculatedTotal,
      weeks: calculatedWeeks,
      squad: squadSize
    };
  }

  // Listeners
  scopeSelect.addEventListener('change', calculateEstimate);
  velocityRadios.forEach(radio => radio.addEventListener('change', calculateEstimate));
  if (growthAddon) growthAddon.addEventListener('change', calculateEstimate);
  if (securityAddon) securityAddon.addEventListener('change', calculateEstimate);

  // Apply to Contact Form
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const estimate = calculateEstimate();
      const visionInput = document.getElementById('project-vision');
      const budgetSelect = document.getElementById('budget-tier');
      const packageSelect = document.getElementById('target-package');

      if (budgetSelect) {
        if (estimate.total <= 100000) {
          budgetSelect.value = "$50,000 - $100,000";
        } else if (estimate.total <= 250000) {
          budgetSelect.value = "$100,000 - $250,000";
        } else if (estimate.total <= 500000) {
          budgetSelect.value = "$250,000 - $500,000";
        } else {
          budgetSelect.value = "$500,000+";
        }
      }

      if (visionInput) {
        visionInput.value = `[Calculated Configuration]\nScope: ${estimate.scopeTitle}\nProjected Budget: $${estimate.total.toLocaleString()}\nTarget Delivery: ~${estimate.weeks} weeks\nSquad Density: ${estimate.squad} specialists.\n\nOur Strategic Objectives: `;
        visionInput.focus();
      }

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Run initial calculation
  calculateEstimate();
}

/* --------------------------------------------------------------------------
   7. Accessible FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const headers = document.querySelectorAll('.accordion-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      const panelId = header.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);

      // Close all other items for a clean executive layout
      headers.forEach(otherHeader => {
        if (otherHeader !== header) {
          otherHeader.setAttribute('aria-expanded', 'false');
          const otherPanelId = otherHeader.getAttribute('aria-controls');
          const otherPanel = document.getElementById(otherPanelId);
          if (otherPanel) {
            otherPanel.setAttribute('hidden', '');
          }
        }
      });

      // Toggle current
      if (isExpanded) {
        header.setAttribute('aria-expanded', 'false');
        if (panel) panel.setAttribute('hidden', '');
      } else {
        header.setAttribute('aria-expanded', 'true');
        if (panel) panel.removeAttribute('hidden');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. Client-Side Lead Form Validation & Simulated Submission
   -------------------------------------------------------------------------- */
function initLeadForm() {
  const form = document.getElementById('lead-form');
  const successCard = document.getElementById('form-success-card');
  const submitBtn = document.getElementById('submit-lead-btn');
  const resetBtn = document.getElementById('reset-form-btn');
  const refCodeEl = document.getElementById('success-ref-code');

  if (!form || !successCard || !submitBtn) return;

  const fields = {
    name: { el: document.getElementById('client-name'), err: document.getElementById('error-client-name') },
    org: { el: document.getElementById('client-org'), err: document.getElementById('error-client-org') },
    email: { el: document.getElementById('client-email'), err: document.getElementById('error-client-email') },
    phone: { el: document.getElementById('client-phone'), err: document.getElementById('error-client-phone') },
    budget: { el: document.getElementById('budget-tier'), err: document.getElementById('error-budget-tier') },
    vision: { el: document.getElementById('project-vision'), err: document.getElementById('error-project-vision') }
  };

  // Real-time clearance of errors on user input
  Object.values(fields).forEach(item => {
    if (!item.el) return;
    const eventName = item.el.tagName === 'SELECT' ? 'change' : 'input';
    item.el.addEventListener(eventName, () => {
      item.el.classList.remove('error');
      if (item.err) item.err.textContent = '';
    });
  });

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    // Allows international formats: +44 ..., (123) 456-7890, digits with spaces or hyphens
    return /^[\d\s+\-().]{7,25}$/.test(phone.trim());
  }

  function validateForm() {
    let isValid = true;

    // Name
    if (!fields.name.el.value.trim() || fields.name.el.value.trim().length < 2) {
      fields.name.el.classList.add('error');
      fields.name.err.textContent = 'Please enter your principal full name.';
      isValid = false;
    }

    // Organization
    if (!fields.org.el.value.trim() || fields.org.el.value.trim().length < 2) {
      fields.org.el.classList.add('error');
      fields.org.err.textContent = 'Please enter your corporate entity or family office name.';
      isValid = false;
    }

    // Email
    if (!fields.email.el.value.trim()) {
      fields.email.el.classList.add('error');
      fields.email.err.textContent = 'Confidential email is required.';
      isValid = false;
    } else if (!validateEmail(fields.email.el.value.trim())) {
      fields.email.el.classList.add('error');
      fields.email.err.textContent = 'Please provide a valid corporate or private email address.';
      isValid = false;
    }

    // Phone
    if (!fields.phone.el.value.trim()) {
      fields.phone.el.classList.add('error');
      fields.phone.err.textContent = 'Direct phone or Signal number is required.';
      isValid = false;
    } else if (!validatePhone(fields.phone.el.value)) {
      fields.phone.el.classList.add('error');
      fields.phone.err.textContent = 'Please enter a valid phone number with country code.';
      isValid = false;
    }

    // Budget Tier
    if (!fields.budget.el.value) {
      fields.budget.el.classList.add('error');
      fields.budget.err.textContent = 'Please designate an anticipated capital allocation.';
      isValid = false;
    }

    // Project Vision
    if (!fields.vision.el.value.trim() || fields.vision.el.value.trim().length < 10) {
      fields.vision.el.classList.add('error');
      fields.vision.err.textContent = 'Please outline your strategic vision (minimum 10 characters).';
      isValid = false;
    }

    return isValid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Focus on first invalid field
      const firstInvalid = form.querySelector('.error');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Simulate submission with loader
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Securing Transmission...';
    if (btnLoader) btnLoader.removeAttribute('hidden');

    setTimeout(() => {
      // Generate unique confidential tracking code
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const randomAlpha = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26));
      const refCode = `XP-${randomNum}-${randomAlpha}`;

      if (refCodeEl) {
        refCodeEl.textContent = refCode;
      }

      // Hide form, show success state
      form.hidden = true;
      successCard.hidden = false;

      // Reset button state
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Submit Private Briefing';
      if (btnLoader) btnLoader.setAttribute('hidden', '');

      // Scroll to confirmation
      successCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1100);
  });

  // Reset form to submit again
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.hidden = false;
      successCard.hidden = true;
      form.querySelector('input').focus();
    });
  }
}

/* --------------------------------------------------------------------------
   9. Footer Dynamic Year
   -------------------------------------------------------------------------- */
function updateCopyrightYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
