// Site-wide settings. Change values here, not inside components.

/**
 * Do NOT turn this on until Andres has written permission from Broward
 * International University to use its logo. When true, the page shows
 * /public/brand/biu-logo.png next to the BIU credit line, so add that file first.
 */
export const SHOW_BIU_LOGO = false;

export const CALENDLY_URL = "https://calendly.com/andres-hdw/30min";
export const WEBSITE_URL = "https://www.mycreativestrategist.com";
export const WEBSITE_LABEL = "mycreativestrategist.com";
export const CONTACT_EMAIL = "andres@mycreativestrategist.com";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://biu-masterbrain.vercel.app";

/** Search engines stay out unless NEXT_PUBLIC_NOINDEX is explicitly "false". */
export const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX !== "false";

/** One localStorage key holds every answer. */
export const STORAGE_KEY = "biu_masterbrain_v1";
export const LANG_KEY = "biu_masterbrain_lang";

export const SECTION_IDS = [
  "que-es",
  "cuatro-partes",
  "como-funciona",
  "builder",
  "a-trabajar",
  "andres",
  "agenda",
] as const;
export type SectionId = (typeof SECTION_IDS)[number];
