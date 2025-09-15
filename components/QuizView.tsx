import React, { useState, useEffect, useCallback } from 'react';
import L from 'leaflet';
import { City, CountryCode } from '../types';
import { COUNTRIES_DATA } from '../constants';
import CitySidebar from './CitySidebar';
import EstoniaMap from './EstoniaMap';
import ResultsView from './ResultsView';
import CountrySwitcher from './CountrySwitcher';

const TOTAL_CITIES = 10;

const shuffle = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface QuizViewProps {
    countryCode: CountryCode;
    onSwitchCountry: (countryCode: CountryCode) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ countryCode, onSwitchCountry }) => {
  const [quizCities, setQuizCities] = useState<City[]>([]);
  const [placedCities, setPlacedCities] = useState<Map<number, string>>(new Map());
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [score, setScore] = useState<number>(0);
  const [shuffledCityNames, setShuffledCityNames] = useState<string[]>([]);
  
  const countryData = COUNTRIES_DATA[countryCode];

  const startNewGame = useCallback(() => {
    const allCities = COUNTRIES_DATA[countryCode].cities;
    const selectedCities = shuffle(allCities).slice(0, Math.min(TOTAL_CITIES, allCities.length));
    setQuizCities(selectedCities);
    setShuffledCityNames(shuffle(selectedCities.map(c => c.name)));
    setPlacedCities(new Map());
    setGameState('playing');
    setScore(0);
  }, [countryCode]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleCityDrop = (droppedLatLng: L.LatLng, droppedCityName: string) => {
    if (gameState !== 'playing') return;

    let closestCity: City | null = null;
    let minDistance = Infinity;

    quizCities.forEach(city => {
        const cityLatLng = L.latLng(city.coords.lat, city.coords.lng);
        const distance = droppedLatLng.distanceTo(cityLatLng);
        if (distance < minDistance) {
            minDistance = distance;
            closestCity = city;
        }
    });

    const SNAP_THRESHOLD_METERS = 75000; // 75km, larger for bigger countries

    if (closestCity && minDistance < SNAP_THRESHOLD_METERS) {
        let sourceCityId: number | null = null;
        for (const [key, value] of placedCities.entries()) {
            if (value === droppedCityName) {
                sourceCityId = key;
                break;
            }
        }

        setPlacedCities(prev => {
            const newMap = new Map(prev);
            if (sourceCityId !== null) {
                newMap.delete(sourceCityId);
            }
            newMap.set(closestCity!.id, droppedCityName);
            return newMap;
        });
    }
  };

  const handleCheckAnswers = () => {
    let correctGuesses = 0;
    quizCities.forEach(city => {
      if (placedCities.get(city.id) === city.name) {
        correctGuesses++;
      }
    });
    setScore(correctGuesses);
    setGameState('finished');
  };
  
  const placedCityNames = new Set(Array.from(placedCities.values()));
  const citiesInQuiz = Math.min(TOTAL_CITIES, countryData.cities.length);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-8 transition-colors duration-500">
      <header className="w-full max-w-7xl text-center mb-6 relative">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
          {countryData.name} City Quiz
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Drag the cities to their correct locations on the map.</p>
        <div className="absolute top-0 right-0">
             <CountrySwitcher 
                currentCountry={countryCode} 
                onSwitchCountry={onSwitchCountry}
            />
        </div>
      </header>
      
      <main className="w-full max-w-7xl flex-grow grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <CitySidebar 
            cityNames={shuffledCityNames} 
            placedCityNames={placedCityNames}
          />
        </div>

        <div className="lg:col-span-3 relative bg-gray-800/50 rounded-2xl shadow-2xl shadow-blue-500/10 overflow-hidden border border-gray-700 min-h-[550px]">
          <EstoniaMap 
            quizCities={quizCities}
            placedCities={placedCities}
            onCityDrop={handleCityDrop}
            gameState={gameState}
            mapKey={countryCode}
            mapConfig={countryData.mapConfig}
          />
        </div>
      </main>

      <footer className="w-full max-w-7xl mt-6">
         {gameState === 'playing' && (
          <div className="flex justify-center">
            <button
              onClick={handleCheckAnswers}
              disabled={placedCities.size !== citiesInQuiz}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
            >
              Check Answers
            </button>
          </div>
        )}

        {gameState === 'finished' && (
          <ResultsView 
            score={score} 
            total={citiesInQuiz} 
            onPlayAgain={startNewGame} 
          />
        )}
      </footer>
    </div>
  );
};

export default QuizView;
