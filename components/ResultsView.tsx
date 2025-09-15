
import React, { useEffect, useState } from 'react';

interface ResultsViewProps {
  score: number;
  total: number;
  onPlayAgain: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ score, total, onPlayAgain }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);


    const getFeedback = () => {
        const percentage = (score / total) * 100;
        if (percentage === 100) return "Perfect! You're an expert!";
        if (percentage >= 70) return "Great job! You know Estonia well!";
        if (percentage >= 40) return "Not bad! A good start.";
        return "Keep trying! You'll get there.";
    }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        <div className="text-center sm:text-right">
            <p className="text-xl text-gray-300">Your Score</p>
            <p className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                {score}<span className="text-3xl text-gray-500">/{total}</span>
            </p>
            <p className="text-lg text-gray-400 mt-1">{getFeedback()}</p>
        </div>
        <button
            onClick={onPlayAgain}
            className="px-8 py-3 bg-teal-500 text-white font-bold rounded-lg shadow-lg hover:bg-teal-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-opacity-50"
        >
            Play Again
        </button>
    </div>
  );
};

export default ResultsView;
