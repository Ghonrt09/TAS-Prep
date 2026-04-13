/** Контакт для mailto и подписи в футере. В Vercel можно задать NEXT_PUBLIC_CONTACT_EMAIL без правки кода. */
export const SITE_CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "baiserikovalmansur619@gmail.com";

const INVESTOR_SUBJECT = "TAS Prep — инвестиции / партнёрство";

export function siteMailtoInvestorsHref(): string {
  return `mailto:${SITE_CONTACT_EMAIL}?subject=${encodeURIComponent(INVESTOR_SUBJECT)}`;
}

export function siteMailtoPlainHref(): string {
  return `mailto:${SITE_CONTACT_EMAIL}`;
}
