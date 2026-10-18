/** Mobile menu: toggles the nav and closes it after a link is followed. */
export const initMenu = (toggle: HTMLButtonElement, nav: HTMLElement) => {
  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
};

/** The prototype has no backend; WordPress will wire this form to Contact Form 7. */
export const initContactForm = (form: HTMLFormElement, status: HTMLElement) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    status.textContent = 'این نسخهٔ نمایشی است و فرم ارسال نمی‌شود. برای مشاوره با ۰۲۱-۱۲۳۴۵۶۷۸ تماس بگیرید.';
  });
};
