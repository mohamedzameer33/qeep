import React, { useState } from 'react';
import Header from './header';
import Footer from './Footer';

const Tictactoe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isTie, setIsTie] = useState(false);

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const checkTie = (board) => board.every(cell => cell !== null);

  const handleClick = (index) => {
    if (board[index] || winner || isTie) return;

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

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setIsTie(false);
  };

  const renderSquare = (index) => (
    <button 
      onClick={() => handleClick(index)}
      style={{
        width: '100px',
        height: '100px',
        fontSize: '48px',
        fontWeight: 'bold',
        background: 'white',
        border: '3px solid #333',
        borderRadius: '15px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
      }}
      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
    >
      <span style={{
        color: board[index] === 'X' ? '#FF4500' : '#32CD32'
      }}>
        {board[index]}
      </span>
    </button>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: '#2e0909ff',
      color: 'white',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* HEADER */}
      <div style={{flexShrink: 0}}>
        <Header />
      </div>

      {/* MAIN GAME */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '30px 20px',
        paddingBottom: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
       marginBottom:"80px",
        
      }}>
        <h1 style={{
          fontSize: '48px',
          color: '#c2fd43',
          margin: '20px 0',
          fontWeight: 'bold',
          textShadow: '0 0 20px rgba(194,253,67,0.5)'
        }}>
          Tic-Tac-Toe
        </h1>

        {/* STATUS */}
        <div style={{
          fontSize: '32px',
          margin: '20px 0',
          padding: '15px 30px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)'
        }}>
          {winner ? (
            <span style={{color: '#FFD700'}}>Winner: {winner}!</span>
          ) : isTie ? (
            <span style={{color: '#FFA500'}}>It's a tie!</span>
          ) : (
            <span>Next: <strong style={{color: isXNext ? '#FF4500' : '#32CD32'}}>
              {isXNext ? 'X' : 'O'}
            </strong></span>
          )}
        </div><button 
          onClick={resetGame}
          style={{
            padding: '18px 50px',
            background: 'linear-gradient(45deg, #FF4500, #FF8E53)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '24px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(255,69,0,0.4)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        >
          New Game
        </button>

        {/* BOARD */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 100px)',
          gap: '15px',
          margin: '40px 0',
          padding: '20px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '25px',
          backdropFilter: 'blur(10px)'
        }}>
          {[...Array(9)].map((_, i) => (
            <div key={i}>{renderSquare(i)}</div>
          ))}
        </div>

        {/* RESET BUTTON */}
        
      </div>

      {/* FOOTER */}
      <div style={{position:"relative",bottom:"120px",left:"3px"}}>

      <Footer /></div>
    </div>
  );
};

export default Tictactoe;