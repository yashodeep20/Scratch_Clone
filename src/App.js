import './App.css';
import './index.css';
import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [selectedSpriteId, setSelectedSpriteId] = useState(null);
  const [sprites, setSprites] = useState([]);
  const [moveDis, setMoveDis] = useState('');
  const [rotationDR, setRotationDR] = useState('');
  const [rotationDL, setRotationDL] = useState('');
  const [spriteRoo, setSpriteRoo] = useState(0);
  const [goToX, setGoToX] = useState('');
  const [goToY, setGoToY] = useState('');
  const [spriteCoo, setSpriteCoo] = useState({ x: 0, y: 0 });
  const [actions, setActions] = useState([]);
  const [sizeIncrement, setSizeIncrement] = useState(0);
  const [message, setMessage] = useState(''); // State for displaying message

  const previewWidth = 450;
  const previewHeight = 450;

  const handleSpriteSelection = (event) => {
    const selectedId = event.target.value;
    setSelectedSpriteId(selectedId);
  };

  const addSprite = () => {
    if (selectedSpriteId) {
      setSprites([...sprites, { src: selectedSpriteId, id: Date.now(), size: 100 }]);
      setSelectedSpriteId(null);
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

  const handleM = (e) => setMoveDis(Number(e.target.value));
  const handleRoRich = (e) => setRotationDR(Number(e.target.value));
  const handleRolc = (e) => setRotationDL(Number(e.target.value));
  const handleGoToXC = (e) => setGoToX(Number(e.target.value));
  const handleGoToYC = (e) => setGoToY(Number(e.target.value));
  const handleSizeIncrement = (e) => setSizeIncrement(Number(e.target.value));

  const constrainCoordinates = (coords) => {
    return {
      x: Math.max(0, Math.min(coords.x, previewWidth - 100)),
      y: Math.max(0, Math.min(coords.y, previewHeight - 100))
    };
  };

  const goToRP = () => {
    const randomX = Math.floor(Math.random() * (previewWidth - 100));
    const randomY = Math.floor(Math.random() * (previewHeight - 100));
    setSpriteCoo({ x: randomX, y: randomY });
  };

  const handleSpriteClick = (spriteId) => {
    // Check if "onClick" action exists in actions, if yes then start actions
    if (actions.includes('onClick')) {
      startAction(); // Trigger actions only when "onClick" is included
    }
  };

  const startAction = () => {
    actions.forEach((action) => {
      if (action === 'move') {
        const newCoords = {
          x: spriteCoo.x + moveDis,
          y: spriteCoo.y
        };
        setSpriteCoo(constrainCoordinates(newCoords));
      } else if (action === 'Turnr') {
        setSpriteRoo((prev) => prev + Number(rotationDR));
      } else if (action === 'Turnl') {
        setSpriteRoo((prev) => prev - Number(rotationDL));
      } else if (action === 'goto') {
        const newCoords = { x: Number(goToX), y: Number(goToY) };
        setSpriteCoo(constrainCoordinates(newCoords));
      } else if (action === 'random') {
        goToRP();
      } else if (action === 'increaseSize') {
        setSprites((prevSprites) =>
          prevSprites.map((sprite) =>
            sprite.id === Number(selectedSpriteId)
              ? { ...sprite, size: sprite.size + sizeIncrement }
              : sprite
          )
        );
      } else if (action === 'sayHello') {
        setMessage("Hello!"); // Display Hello message
      }
    });
  };

  const deleteAction = (index) => {
    setActions((prevActions) => prevActions.filter((_, i) => i !== index));
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
            Go to X: <input type="number" onChange={handleGoToXC} value={goToX} /> Y: <input type="number" onChange={handleGoToYC} />
          </button>
          <button className="button" draggable="true" onDragStart={(e) => dragStart(e, 'random')}>
            Go to Random Position
          </button>
          <button className="button" draggable="true" onDragStart={(e) => dragStart(e, 'sayHello')}>
            Say Hello!
          </button>
          <button className="button" draggable="true" onDragStart={(e) => dragStart(e, 'onClick')}>
            When sprite is clicked
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
                {action === 'increaseSize' && `Increase size by ${sizeIncrement}`}
                {action === 'sayHello' && `Say Hello!`}
                {action === 'onClick' && `When sprite is clicked`}
                <span className="delete-icon" onClick={() => deleteAction(index)}>
                  <i className="fas fa-trash" style={{ marginLeft: '8px' }}></i>
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="Preview">
          <h2>Preview Area</h2>
          <select id="sprite-options" onChange={handleSpriteSelection} value={selectedSpriteId || ''}>
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
                  width: `${sprite.size}px`,
                  height: `${sprite.size}px`,
                  position: 'absolute', 
                  left: `${spriteCoo.x}px`,
                  top: `${spriteCoo.y}px`,  
                  transform: `rotate(${spriteRoo}deg)` 
                }}
                onClick={() => handleSpriteClick(sprite.id)} // Attach click handler here
              />
            ))}
            {message && (
              <div 
                className="message" 
                style={{ 
                  position: 'absolute', 
                  top: `${spriteCoo.y - 50}px`,  // Adjust to position above the sprite
                  left: `${spriteCoo.x + 80}px`, // Adjust to center the message near the sprite
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '20px',
                  color: 'white'
                }}
              >
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FontAwesomeIcon 
                    icon={faComment} 
                    style={{ 
                      color: "#63E6BE", 
                      fontSize: '60px', 
                      position: 'relative' 
                    }} 
                  />
                  <span 
                    style={{ 
                      position: 'absolute', 
                      color: 'black', 
                      fontWeight: 'bold' 
                    }}
                  >
                    {message}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
