export type MaybeText = string | { [k: string]: string } | undefined;

/** Translate a DB-sourced multilingual field. */
export const tr = (text: MaybeText, lang: string): string => {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[lang] ?? text.en ?? Object.values(text)[0] ?? "";
};

/** Get the current language no matter which i18n library you use. */
export const getUiLanguage = (i18n: any): string =>
  (i18n.language ?? i18n.locale ?? "en").split("-")[0];
