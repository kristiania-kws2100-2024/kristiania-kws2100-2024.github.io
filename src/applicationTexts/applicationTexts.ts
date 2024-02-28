export interface ApplicationTexts {
  goToStart: string;
  goToMove(move: number): string;

  winner(winner: "X" | "O"): string;

  nextPlayer(string: "X" | "O"): string;
}