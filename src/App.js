import { useEffect, useRef, useState } from 'react';
import './App.css';

const TILE_COLORS = ['red', 'green', 'blue', 'yellow'];

const App = () => {
  const [preparedBoxes, setPreparedBoxes] = useState(() => shuffle([...TILE_COLORS, ...TILE_COLORS]));
  const [gameCompleted, setGameCompleted] = useState(false);
  const [previousClick, setPreviousClick] = useState(null);
  const [currentClick, setCurrentClick] = useState(null);
  const [acertedBoxes, setAcertedBoxes] = useState([]);
  const checking = useRef(false);

  useEffect(() => {
    if (previousClick === null || currentClick === null) return
    if (preparedBoxes[previousClick] === preparedBoxes[currentClick]) {
      setPreviousClick(null);
      setCurrentClick(null);
      const newArray = [...acertedBoxes];
      newArray[previousClick] = true;
      newArray[currentClick] = true;
      setAcertedBoxes(newArray);
      return;
    }
    clearBoxes();
  }, [previousClick, currentClick, acertedBoxes, preparedBoxes]);

  useEffect(() => {
    if (acertedBoxes.length === 8 && acertedBoxes.every(status => status !== undefined)) setGameCompleted(true);
  }, [acertedBoxes]);

  const handleClickedBoxes = (index) => {
    if (checking.current) return;
    if (acertedBoxes[index]) return;
    if (currentClick === null && previousClick === index) return;
    if (previousClick === null) return setPreviousClick(index);
    setCurrentClick(index);
  }

  const clearBoxes = () => {
    checking.current = true;
    setTimeout(() => {
      setPreviousClick(null);
      setCurrentClick(null);
      checking.current = false;
    }, 1000);
  }

  const restartGame = () => {
    setGameCompleted(false);
    setPreviousClick(null);
    setCurrentClick(null);
    setAcertedBoxes([]);
    checking.current = false;
    setPreparedBoxes(shuffle([...TILE_COLORS, ...TILE_COLORS]));
  }

  const gameBoxes = preparedBoxes.map((color, i) => {
    const classColor = (acertedBoxes[i] || (previousClick === i || currentClick === i)) ? "tile " + color : "tile";
    return <div key={i} className={classColor} onClick={() => handleClickedBoxes(i, color)} />
  });

  return (
    <div id="memory">
      <h1>{gameCompleted ? 'You Win!' : 'Mini-Game'}</h1>
      <div className="board">
        {gameBoxes}
      </div>
      {gameCompleted &&
        <button onClick={restartGame}>Restart</button>
      }
    </div>
  )
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    // Swap the elements at i and randomIndex
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}

export default App;
