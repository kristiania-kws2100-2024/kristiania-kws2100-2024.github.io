import { ApplicationTexts } from "./applicationTexts";

export const nb: ApplicationTexts = {
  goToStart: "Gå til starten",
  goToMove: (move) => {
    if (move === 1) return "Gå til andre trekk";
    return `Gå til trekk nummer ${move}`;
  }
};