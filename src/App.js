import { useEffect, useState } from "react";
import Home from "./Pages/Home/Home";

// function for make random color

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function App() {

  const [usedColors, setUsedColors] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState('');

  // Function to set a new random background color
  const setNewBackgroundColor = () => {
    const newColor = getRandomColor();
    setBackgroundColor(newColor);
    setUsedColors([...usedColors, newColor]);

    // Keep only the last 5 used colors
    if (usedColors.length >= 5) {
      // Remove the oldest color
      usedColors.shift();
    }
  };

  // Set a new background color on each mount / refresh
  useEffect(() => {
    setNewBackgroundColor();
  }, []);

  return (
    <div style={{ backgroundColor }} >
      <Home />
    </div>
  );
}

export default App;
