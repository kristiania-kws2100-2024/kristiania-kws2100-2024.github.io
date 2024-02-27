export const SupportedLanguages = ["en", "nb"] as const;
export type SupportedLanguagesType = typeof SupportedLanguages[number];

export const ApplicationTexts = {
  "en": {
    goToStart: "Go to game start"
  },
  "nb": {
    goToStart: "Gå til starten"
  }
};