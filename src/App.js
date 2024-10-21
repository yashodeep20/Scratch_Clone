import './App.css';
import './index.css';
import React, { useState } from 'react';

function App() {
  const [selectedSprite, setSelectedSprite] = useState('');
  const [sprites, setSprites] = useState([]);
  const [moveDis, setmoveDis] = useState('');
  const [rotationDR, setrotationDR] = useState('');
  const [rotationDL, setrotationDL] = useState('');
  const [spriteRoo, setspriteRoo] = useState('');
  const [goToX, setGoToX] = useState('');
  const [goToY, setGoToY] = useState('');
  const [spriteCoo, setspriteCoo] = useState({ x: 0, y: 0 });
  const [actions, setActions] = useState([]);

  const previewWidth = 450;  
  const previewHeight = 450; 

  const handleSpriteSelection = (event) => {
    setSelectedSprite(event.target.value);
  };

  const addSprite = () => {
    if (selectedSprite) {
      setSprites([...sprites, { src: selectedSprite, id: Date.now() }]);
      setSelectedSprite('');
    } else {
      alert('Please select a sprite.');
    }
  };

  const dragStart = (e, actionType) => {
    e.dataTransfer.setData('actionType', actionType);
  };

  const dragOver = (e) => {
    e.preventDefault(); 
  };

  const handleDrop = (e) => {
    const actionType = e.dataTransfer.getData('actionType');
    setActions((prevActions) => [...prevActions, actionType]);
  };

  const handleM = (e) => setmoveDis(Number(e.target.value));
  const handleRoRich = (e) => setrotationDR(Number(e.target.value));
  const handleRolc = (e) => setrotationDL(Number(e.target.value));
  const handleGoToXC = (e) => setGoToX(Number(e.target.value));
  const handleGoToYC = (e) => setGoToY(Number(e.target.value));

  
  const constrainCoordinates = (coords) => {
    return {
      x: Math.max(0, Math.min(coords.x, previewWidth - 100)), 
      y: Math.max(0, Math.min(coords.y, previewHeight - 100)) 
    };
  };

  const goToRP = () => {
    const randomX = Math.floor(Math.random() * (previewWidth - 100)); 
    const randomY = Math.floor(Math.random() * (previewHeight - 100)); 
    setspriteCoo({ x: randomX, y: randomY });
  };

  const startAction = () => {
    actions.forEach((action) => {
      if (action === 'move') {
        const newCoords = {
          x: spriteCoo.x + moveDis,
          y: spriteCoo.y
        };
        setspriteCoo(constrainCoordinates(newCoords));
      } else if (action === 'Turnr') {
        setspriteRoo((prev) => prev + Number(rotationDR));
      } else if (action === 'Turnl') {
        setspriteRoo((prev) => prev - Number(rotationDL));
      } else if (action === 'goto') {
        const newCoords = { x: Number(goToX), y: Number(goToY) };
        setspriteCoo(constrainCoordinates(newCoords));
      } else if (action === 'random') {
        goToRP();
      }
    });
  };

  return (
    <div className="App">
      <div className="Nav">
        <a className="active" href="#home">Scratch</a>
      </div>
      <div className="container">
        <div className="Motion">
          <h2>Motion</h2>
          <button className="button" draggable="true" onDragStart={(e) => dragStart(e, 'move')}>
            Move by <input type="number" onChange={handleM} value={moveDis} /> Spaces
          </button>
          <button className="button" draggable="true" onDragStart={(e) => dragStart(e, 'Turnr')}>
            Turn Right by <input type="number" onChange={handleRoRich} value={rotationDR} /> Degrees
          </button>
          <button className="button" draggable="true" onDragStart={(e) => dragStart(e, 'Turnl')}>
            Turn Left by <input type="number" onChange={handleRolc} value={rotationDL} /> Degrees
          </button>
          <button className="button" draggable="true" onDragStart={(e) => dragStart(e, 'goto')}>
            Go to X: <input type="number" onChange={handleGoToXC} value={goToX} /> Y: <input type="number" onChange={handleGoToYC} value={goToY} />
          </button>
          <button className="button" draggable="true" onDragStart={(e) => dragStart(e, 'random')}>
            Go to Random Position
          </button>
        </div>
        <div className="Mid" onDragOver={dragOver} onDrop={handleDrop}>
          <h2>Action</h2>
          <button className="start-button" onClick={startAction}>Start</button>
          <div className="dropped-actions">
            {actions.map((action, index) => (
              <button key={index} className="button">
                {action === 'move' && `Move by ${moveDis} Spaces`}
                {action === 'Turnr' && `Turn Right by ${rotationDR} Degrees`}
                {action === 'Turnl' && `Turn Left by ${rotationDL} Degrees`}
                {action === 'goto' && `Go to X: ${goToX} Y: ${goToY}`}
                {action === 'random' && `Go to Random Position`}
              </button>
            ))}
          </div>
        </div>
        <div className="Preview">
          <h2>Preview Area</h2>
          <select id="sprite-options" onChange={handleSpriteSelection} value={selectedSprite}>
            <option value="" disabled>Select a sprite</option>
            <option value="/Images/Cat.png">Cat</option>
            <option value="/Images/Dog.png">Dog</option>
            <option value="/Images/Apple.png">Apple</option>
            <option value="/Images/Ball.png">Ball</option>
          </select>
          <button className="nbutton" onClick={addSprite}>Add New</button>
          <div 
            className="image-preview" 
            style={{ position: 'relative', width: '100%', height: '400px', border: '1px solid #ccc' }}
          >
            {sprites.map(sprite => (
              <img
                key={sprite.id}
                src={sprite.src}
                alt="sprite"
                style={{ 
                  width: 'auto', 
                  height: '100px', 
                  position: 'absolute', 
                  left: `${spriteCoo.x}px`,
                  top: `${spriteCoo.y}px`,  
                  transform: `rotate(${spriteRoo}deg)` 
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
