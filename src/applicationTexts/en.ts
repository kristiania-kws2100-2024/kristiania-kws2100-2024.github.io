import { ApplicationTexts } from "./applicationTexts";

export const en: ApplicationTexts = {
  goToStart: "Go to start",
  goToMove: (move) => `Go to move # ${move}`,
  nextPlayer: (player) => `Next player: ${player}`,
  winner: (player) => `Winner: ${player}`
};