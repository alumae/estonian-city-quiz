import React from 'react';
import { COUNTRIES_DATA } from '../constants';
import { CountryCode } from '../types';

interface CountrySwitcherProps {
  currentCountry: CountryCode;
  onSwitchCountry: (countryCode: CountryCode) => void;
}

const CountrySwitcher: React.FC<CountrySwitcherProps> = ({ currentCountry, onSwitchCountry }) => {
  const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = event.target.value as CountryCode;
    if (newCountry !== currentCountry) {
      onSwitchCountry(newCountry);
    }
  };

  return (
    <div className="relative">
      <select
        value={currentCountry}
        onChange={handleSelectionChange}
        className="appearance-none bg-gray-800 border border-gray-700 text-white font-semibold py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-gray-700 focus:border-blue-500"
        aria-label="Select country"
      >
        {Object.entries(COUNTRIES_DATA).map(([code, data]) => (
          <option key={code} value={code}>
            {data.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default CountrySwitcher;
