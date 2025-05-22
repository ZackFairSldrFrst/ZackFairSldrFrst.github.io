'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LockClosedIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [currentPuzzle, setCurrentPuzzle] = useState(1);
  const [userInput, setUserInput] = useState('');
  const [message, setMessage] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
      setMessage('Time\'s up! Game Over.');
    }
  }, [timeLeft, isGameOver]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const puzzles = [
    {
      id: 1,
      question: "I am taken from a mine and shut up in a wooden case, from which I am never released, and yet I am used by everyone. What am I?",
      answer: "pencil lead",
      hint: "Think about what's inside a pencil"
    },
    {
      id: 2,
      question: "What has keys, but no locks; space, but no room; and you can enter, but not go in?",
      answer: "keyboard",
      hint: "You use it to type"
    },
    {
      id: 3,
      question: "What gets wetter and wetter the more it dries?",
      answer: "towel",
      hint: "You use it after a shower"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPuzzleData = puzzles.find(p => p.id === currentPuzzle);
    
    if (currentPuzzleData && userInput.toLowerCase().trim() === currentPuzzleData.answer.toLowerCase()) {
      if (currentPuzzle === puzzles.length) {
        setIsGameOver(true);
        setMessage('Congratulations! You\'ve escaped!');
      } else {
        setCurrentPuzzle(prev => prev + 1);
        setUserInput('');
        setMessage('Correct! Moving to the next puzzle...');
      }
    } else {
      setMessage('Try again!');
    }
  };

  const getCurrentPuzzleData = () => {
    return puzzles.find(p => p.id === currentPuzzle);
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Escape Room Challenge</h1>
          <div className="flex items-center justify-center gap-4 text-xl">
            <ClockIcon className="w-6 h-6" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </motion.div>

        {!isGameOver ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="escape-card"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Puzzle {currentPuzzle}</h2>
              <p className="text-lg mb-4">{getCurrentPuzzleData()?.question}</p>
              <p className="text-sm text-gray-400">Hint: {getCurrentPuzzleData()?.hint}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="escape-input w-full"
                placeholder="Enter your answer..."
                disabled={isGameOver}
              />
              <button type="submit" className="escape-button w-full">
                Submit Answer
              </button>
            </form>

            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-center text-escape-highlight"
              >
                {message}
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="escape-card text-center"
          >
            <h2 className="text-3xl font-bold mb-4">{message}</h2>
            <button
              onClick={() => {
                setTimeLeft(15 * 60);
                setCurrentPuzzle(1);
                setUserInput('');
                setMessage('');
                setIsGameOver(false);
              }}
              className="escape-button"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
} 