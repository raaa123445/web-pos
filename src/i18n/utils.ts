// Import the UI translations
import { ui } from "../i18n/ui";

// Define available languages
export const LANGUAGES = {
  en: "EN",
  km: "ខ្មែរ",
};

// Type for language keys
export type UiType = keyof typeof ui;
export const LANGUAGES_KEYS = Object.keys(LANGUAGES) as UiType[];

// Default language
export const DEFAULT_LANG = "en";

// Function to get language from the URL
export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang && lang in ui) {
    return lang as UiType;
  }
  return DEFAULT_LANG;
}

// Function to return a translation based on language
export function useTranslations(lang?: UiType) {
  return function t(
    key: keyof (typeof ui)[typeof DEFAULT_LANG],
    ...args: any[]
  ) {
    let translation =
      (ui[lang ?? DEFAULT_LANG] && ui[lang ?? DEFAULT_LANG][key]) ||
      ui[DEFAULT_LANG][key];

    // Log to diagnose missing translations
    console.log("Language:", lang);
    console.log("Key:", key);
    console.log("Translation found:", translation);

    // Replace placeholders in the translation if args are provided
    if (translation && args.length > 0) {
      for (let i = 0; i < args.length; i++) {
        translation = translation.replace(`{${i}}`, args[i]);
      }
    }
    return translation || `[Missing translation: ${key}]`;
  };
}

// Check if the pathname starts with a specific language
export function pathNameIsInLanguage(pathname: string, lang: UiType) {
  return (
    pathname.startsWith(`/${lang}`) ||
    (lang === DEFAULT_LANG && !pathNameStartsWithLanguage(pathname))
  );
}

// Helper function to check if pathname contains any language
function pathNameStartsWithLanguage(pathname: string) {
  let startsWithLanguage = false;
  const languages = Object.keys(LANGUAGES);

  // Check if the pathname starts with any of the available languages
  for (let i = 0; i < languages.length; i++) {
    const lang = languages[i];
    if (pathname.startsWith(`/${lang}`)) {
      startsWithLanguage = true;
      break;
    }
  }

  return startsWithLanguage;
}

// Function to get localized pathname based on selected language
export function getLocalizedPathname(pathname: string, lang: UiType) {
  console.log("Original Pathname:", pathname);

  // Check if the pathname starts with a language
  if (pathNameStartsWithLanguage(pathname)) {
    const availableLanguages = Object.keys(LANGUAGES).join("|");
    const regex = new RegExp(`^/(${availableLanguages})`);

    // Replace the existing language in the path with the new one
    const newPathname = pathname.replace(regex, `/${lang}`);
    console.log("Localized Pathname:", newPathname);
    return newPathname;
  }

  // If no language prefix is found, add the selected language
  console.log("Localized Pathname (No language prefix):", `/${lang}${pathname}`);
  return `/${lang}${pathname}`;
}
