
import React, { useState, useEffect } from 'react';

const LoadingOverlay: React.FC = () => {
  const messages = [
    "Consulting the Ethiron...",
    "Chasing the Song's echoes...",
    "Weaving resonances together...",
    "Seeking guidance from the Depths...",
    "Perfecting the stat distribution...",
    "Summoning the Imagen visualizer...",
    "Drawing power from the Void..."
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-4 border-4 border-r-indigo-400 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
      </div>
      <h2 className="text-2xl font-cinzel text-white mb-2 animate-pulse">Architecting Build</h2>
      <p className="text-blue-400 font-medium tracking-wide animate-bounce">
        {messages[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingOverlay;
