import React, { useState } from 'react';
import '../App.css';
import Header from './header';
import Footer from './Footer';

const Tictactoe = () => {
  const [board, setBoard] = useState(Array(9).fill(null)); // 9 cells on the board
  const [isXNext, setIsXNext] = useState(true); // true if X's turn, false if O's turn
  const [winner, setWinner] = useState(null); // stores the winner if any
  const [isTie, setIsTie] = useState(false); // stores if the game ended in a tie

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
      [0, 4, 8], [2, 4, 6] // diagonal
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const checkTie = (board) => {
    // If there's no winner and the board is full, it's a tie
    return board.every(cell => cell !== null);
  };

  const handleClick = (index) => {
    if (board[index] || winner || isTie) return; // Ignore click if cell is filled, game over, or tie

    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const currentWinner = checkWinner(newBoard);
    if (currentWinner) {
      setWinner(currentWinner);
    } else if (checkTie(newBoard)) {
      setIsTie(true);
    }
  };

  const renderSquare = (index) => (
    <button className="square" onClick={() => handleClick(index)}>
      {board[index]}
    </button>
  );

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setIsTie(false);
  };

  return (
    <>
      <Header />
      <div className="game">
        <h1>Tic-Tac-Toe</h1>
        {winner ? (
          <div className="status">
            Winner: {winner}
          </div>
        ) : isTie ? (
          <div className="status">
            It's a tie!
          </div>
        ) : (
          <div className="status">
            Next player: {isXNext ? 'X' : 'O'}
          </div>
        )}

        <div className="board">
          {[...Array(9)].map((_, index) => renderSquare(index))}
        </div>

        <button className="reset" onClick={resetGame}>
          Reset Game
        </button>
      </div>
      <Footer />
    </>
  );
};

export default Tictactoe;
