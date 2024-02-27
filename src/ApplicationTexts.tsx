import React from "react";

export const SupportedLanguages = ["en", "nb"] as const;
export type SupportedLanguagesType = typeof SupportedLanguages[number];

interface ApplicationTextBundle {
  goToStart: string;
  goToMove(move: number): string;
  declareWinner(winner: string): string;
}


export const ApplicationTexts: Record<SupportedLanguagesType, ApplicationTextBundle> = {
  "en": {
    goToStart: "Go to game start",
    goToMove: (move) => `Move to move #${move}`,
    declareWinner: (winner) => `Winner: ${winner}`
  },
  "nb": {
    goToStart: "Gå til starten",
    goToMove: (move) => `Gå til steg #${move}`,
    declareWinner: (winner) => `Vinner: ${winner}`
  }
};

export const TextsContext = React.createContext({texts: ApplicationTexts["en"]});
