import React from 'react';

interface DraggableCityProps {
  name: string;
  isPlaced: boolean;
}

const DraggableCity: React.FC<DraggableCityProps> = ({ name, isPlaced }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", name);
    e.currentTarget.classList.add('opacity-50', 'scale-95');

    // Hide default ghost image by setting it to a transparent pixel
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50', 'scale-95');
  };

  const baseClasses = "w-full p-3 rounded-lg text-center font-semibold transition-all duration-300 ease-in-out";
  const placedClasses = "bg-gray-700 text-gray-500 cursor-not-allowed opacity-60";
  const unplacedClasses = "bg-gray-700/50 border border-gray-600 hover:bg-blue-500 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20 cursor-grab active:cursor-grabbing transform hover:scale-105";

  return (
    <div
      draggable={!isPlaced}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`${baseClasses} ${isPlaced ? placedClasses : unplacedClasses}`}
    >
      {name}
    </div>
  );
};

export default DraggableCity;