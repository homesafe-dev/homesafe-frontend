export type RecaptchaAction = 'login' | 'signup' | 'forgot_password';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

let loadPromise: Promise<void> | null = null;

export const getRecaptchaSiteKey = (): string | undefined => {
  const key = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  return typeof key === 'string' && key.trim() ? key.trim() : undefined;
};

const loadRecaptchaScript = (siteKey: string): Promise<void> => {
  if (window.grecaptcha) {
    return Promise.resolve();
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-homesafe-recaptcha="true"]'
    );
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener(
        'error',
        () => {
          loadPromise = null;
          reject(new Error('Failed to load reCAPTCHA'));
        },
        { once: true }
      );
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.dataset.homesafeRecaptcha = 'true';
    script.onload = () => resolve();
    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Failed to load reCAPTCHA'));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
};

/**
 * Returns a reCAPTCHA v3 token for the given action.
 * When VITE_RECAPTCHA_SITE_KEY is unset (local/dev), returns undefined so auth still works.
 */
export const getRecaptchaToken = async (
  action: RecaptchaAction
): Promise<string | undefined> => {
  const siteKey = getRecaptchaSiteKey();
  if (!siteKey) {
    if (import.meta.env.DEV) {
      console.warn(
        '[reCAPTCHA] VITE_RECAPTCHA_SITE_KEY is not set; skipping token.'
      );
    }
    return undefined;
  }

  await loadRecaptchaScript(siteKey);

  if (!window.grecaptcha) {
    throw new Error('reCAPTCHA failed to initialize');
  }

  return new Promise((resolve, reject) => {
    window.grecaptcha!.ready(() => {
      window
        .grecaptcha!.execute(siteKey, { action })
        .then(resolve)
        .catch(reject);
    });
  });
};
