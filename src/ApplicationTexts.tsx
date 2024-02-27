export const SupportedLanguages = ["en", "nb"] as const;
export type SupportedLanguagesType = typeof SupportedLanguages[number];

interface ApplicationTextBundle {
  goToStart: string;
}


export const ApplicationTexts: Record<SupportedLanguagesType, ApplicationTextBundle> = {
  "en": {
    goToStart: "Go to game start"
  },
  "nb": {
    goToStart: "Gå til starten"
  }
};