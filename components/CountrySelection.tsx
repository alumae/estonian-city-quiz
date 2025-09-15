import React from 'react';
import { COUNTRIES_DATA } from '../constants';
import { CountryCode } from '../types';

interface CountrySelectionProps {
  onSelectCountry: (countryCode: CountryCode) => void;
}

const CountryCard: React.FC<{ code: CountryCode, name: string, emoji: string, onSelect: () => void }> = ({ name, emoji, onSelect }) => (
    <div 
        onClick={onSelect}
        className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:bg-gray-700/70 hover:border-blue-500 hover:scale-105 shadow-lg hover:shadow-blue-500/20"
    >
        <span className="text-7xl mb-4" role="img" aria-label={`${name} flag`}>{emoji}</span>
        <h3 className="text-2xl font-bold text-gray-200">{name}</h3>
    </div>
);


const CountrySelection: React.FC<CountrySelectionProps> = ({ onSelectCountry }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
          Welcome to the City Quiz!
        </h1>
        <p className="text-gray-400 mt-4 text-xl">Please select a country to begin.</p>
      </div>
      
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-8">
        <CountryCard 
            code="ee" 
            name={COUNTRIES_DATA.ee.name}
            emoji="🇪🇪"
            onSelect={() => onSelectCountry('ee')} 
        />
        <CountryCard 
            code="ua"
            name={COUNTRIES_DATA.ua.name}
            emoji="🇺🇦"
            onSelect={() => onSelectCountry('ua')}
        />
      </div>
    </div>
  );
};

export default CountrySelection;
