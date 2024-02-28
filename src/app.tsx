import React, { useEffect, useState } from "react";
import { nb } from "./applicationTexts/nb";
import { en } from "./applicationTexts/en";


type SquareValue = "X" | "O" | null;

interface SquareProps {
  value: SquareValue;

  onSquareClick(): void;
}

function Square({ value, onSquareClick }: SquareProps) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

function Board({ xIsNext, squares, onPlay }: {
  xIsNext: boolean;
  squares: SquareValue[];
  onPlay(squares: SquareValue[]): void
}) {
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "0");
  }

  function handleClick(i: number) {
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = [...squares];
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  return <>
    <div className="status">{status}</div>
    <div className="board-row">
      <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
      <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
      <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
    </div>
    <div className="board-row">
      <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
      <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
      <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
    </div>
    <div className="board-row">
      <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
      <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
      <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
    </div>
  </>;
}

export default function Game() {
  const [userLanguage, setUserLanguage] = useState(navigator.language);

  const applicationTexts = userLanguage === "nb" ? nb : en;

  useEffect(() => {
    function handleLanguageChange() {
      setUserLanguage(navigator.language)
    }
    addEventListener("languagechange", handleLanguageChange);
    return () => removeEventListener("languagechange", handleLanguageChange)
  }, []);
  const [history, setHistory] = useState([
    Array(9).fill(null)
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function jumpTo(move: number) {
    setCurrentMove(move);
  }

  function handlePlay(nextSquares: SquareValue[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const moves = history.map((_, move) => {
    let description;
    if (move === 0) {
      description = applicationTexts.goToStart;
    } else {
      description = "Go to move # " + move;
    }
    return <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>;
  });
  return <>
    <div>{userLanguage}</div>
    <div className={"game"}>

      <div id="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div id="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  </>;
}


function calculateWinner(squares: SquareValue[]): SquareValue {
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