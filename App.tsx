import React, { useState } from 'react';
import { CountryCode } from './types';
import CountrySelection from './components/CountrySelection';
import QuizView from './components/QuizView';

const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(null);

  if (!selectedCountry) {
    return <CountrySelection onSelectCountry={setSelectedCountry} />;
  }

  return <QuizView countryCode={selectedCountry} onSwitchCountry={setSelectedCountry} />;
};

export default App;
