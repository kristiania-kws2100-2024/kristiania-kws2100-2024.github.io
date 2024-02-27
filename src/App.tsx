import React, { useEffect, useState } from "react";
import { ApplicationTexts, SupportedLanguagesType } from "./ApplicationTexts";


function Square({ value, onSquareClick }: { value: number, onSquareClick: () => void }) {
  return <button
    className="square"
    onClick={onSquareClick}
  >
    {value}
  </button>;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const [language, setLanguage] = useState(navigator.language as SupportedLanguagesType);

  useEffect(() => {
    function handleLanguageChange() {
      setLanguage(navigator.language as SupportedLanguagesType);
    }
    addEventListener("languagechange", handleLanguageChange);
    return () => removeEventListener("languagechange", handleLanguageChange);
  }, []);
  const texts = ApplicationTexts[language];

  const xIsNext = currentMove % 2 === 0;

  function handlePlay(index: number) {
    if (currentSquares[index] || calculateWinner(currentSquares)) {
      return;
    }
    const nextSquares = [...currentSquares];
    nextSquares[index] = xIsNext ? "X" : "0";

    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_, move) => {
    const description = move > 0 ? `Move to move #${move}` : texts.goToStart;
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
      <div>{language}</div>
    </div>
  );
}


function Board({ squares, xIsNext, onPlay }: { squares: number[], xIsNext: boolean, onPlay: (index: number) => void }) {
  const winner = calculateWinner(squares);
  const status = winner ? "Winner: " + winner : "Next player: " + (xIsNext ? "X" : "0");

  return <>
    <div className={"status"}>{status}</div>
    <div className="board-row">
      <Square value={squares[0]} onSquareClick={() => onPlay(0)} />
      <Square value={squares[1]} onSquareClick={() => onPlay(1)} />
      <Square value={squares[2]} onSquareClick={() => onPlay(2)} />
    </div>
    <div className="board-row">
      <Square value={squares[3]} onSquareClick={() => onPlay(3)} />
      <Square value={squares[4]} onSquareClick={() => onPlay(4)} />
      <Square value={squares[5]} onSquareClick={() => onPlay(5)} />
    </div>
    <div className="board-row">
      <Square value={squares[6]} onSquareClick={() => onPlay(6)} />
      <Square value={squares[7]} onSquareClick={() => onPlay(7)} />
      <Square value={squares[8]} onSquareClick={() => onPlay(8)} />
    </div>
  </>;
}


function calculateWinner(squares: number[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}