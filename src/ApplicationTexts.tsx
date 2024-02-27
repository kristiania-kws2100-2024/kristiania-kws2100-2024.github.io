export const SupportedLanguages = ["en", "nb"] as const;
export type SupportedLanguagesType = typeof SupportedLanguages[number];

interface ApplicationTextBundle {
  goToStart: string;
  goToMove(move: number): string;
}


export const ApplicationTexts: Record<SupportedLanguagesType, ApplicationTextBundle> = {
  "en": {
    goToStart: "Go to game start",
    goToMove: (move) => `Move to move #${move}`
  },
  "nb": {
    goToStart: "Gå til starten",
    goToMove: (move) => `Gå til steg #${move}`
  }
};