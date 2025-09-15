
import React from 'react';
import DraggableCity from './DraggableCity';

interface CitySidebarProps {
  cityNames: string[];
  placedCityNames: Set<string>;
}

const CitySidebar: React.FC<CitySidebarProps> = ({ cityNames, placedCityNames }) => {
  return (
    <aside className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 h-full shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">Cities to Place</h2>
      <div className="space-y-3">
        {cityNames.map(name => (
          <DraggableCity 
            key={name} 
            name={name} 
            isPlaced={placedCityNames.has(name)}
          />
        ))}
      </div>
    </aside>
  );
};

export default CitySidebar;
