import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updatePosition);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
    };
  }, []);

  return (
    <>
      <div 
        className="cursor" 
        style={{ 
          left: position.x, 
          top: position.y,
          transform: 'translate(-50%, -50%)'
        }} 
      />
      <div 
        className="cursor-dot" 
        style={{ 
          left: position.x, 
          top: position.y,
          transform: 'translate(-50%, -50%)'
        }} 
      />
      <div 
        className="cursor-glow" 
        style={{ 
          left: position.x, 
          top: position.y
        }} 
      />
    </>
  );
};

export default CustomCursor;