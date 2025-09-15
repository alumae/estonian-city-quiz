import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { City } from '../types';

interface EstoniaMapProps {
  quizCities: City[];
  placedCities: Map<number, string>;
  onCityDrop: (droppedLatLng: L.LatLng, droppedCityName: string) => void;
  gameState: 'playing' | 'finished';
}

const EstoniaMap: React.FC<EstoniaMapProps> = ({ quizCities, placedCities, onCityDrop, gameState }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());
  const linesRef = useRef<L.Polyline[]>([]);
  const [highlightedCityId, setHighlightedCityId] = useState<number | null>(null);


  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
        center: [58.59, 25.01],
        zoom: 7,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);
    
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map based on game state
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous markers and lines
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();
    linesRef.current.forEach(line => line.remove());
    linesRef.current = [];

    quizCities.forEach(city => {
        const placedCityName = placedCities.get(city.id);
        const isCorrect = placedCityName === city.name;
        const isHighlighted = highlightedCityId === city.id && gameState === 'playing';
        
        let markerHtml: string;
        let tooltipContent = '';
        let iconSize: [number, number] = [12, 12];
        let iconAnchor: [number, number] = [6, 6];

        if (isHighlighted) {
            markerHtml = `<div class="w-5 h-5 bg-yellow-400 rounded-full border-2 border-yellow-300 ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900 shadow-lg animate-pulse"></div>`;
            iconSize = [20, 20];
            iconAnchor = [10, 10];
        } else if (gameState === 'playing') {
            if (placedCityName) {
                markerHtml = `<div class="w-3 h-3 bg-blue-400 rounded-full border-2 border-blue-400"></div>`;
                tooltipContent = `<span class="font-bold text-white">${placedCityName}</span>`;
            } else {
                 markerHtml = `<div class="w-3 h-3 bg-gray-400 rounded-full border-2 border-gray-500/50 animate-pulse"></div>`;
            }
        } else { // gameState === 'finished'
             if (placedCityName) { // A city was placed here
                if(isCorrect) {
                     markerHtml = `<div class="w-3 h-3 bg-green-500 rounded-full border-2 border-green-400"></div>`;
                     tooltipContent = `<span class="font-bold text-green-300">${placedCityName}</span>`;
                } else {
                     markerHtml = `<div class="w-3 h-3 bg-red-500 rounded-full border-2 border-red-400"></div>`;
                     tooltipContent = `<span class="font-bold text-red-300 line-through">${placedCityName}</span> <span class="font-bold text-green-300">${city.name}</span>`;

                     // Draw line to correct location
                     const actualCityLocation = quizCities.find(c => c.name === placedCityName);
                     if (actualCityLocation) {
                         const line = L.polyline([city.coords, actualCityLocation.coords], {
                             color: 'rgba(255, 255, 255, 0.4)',
                             weight: 1.5,
                             dashArray: '5, 10'
                         }).addTo(map);
                         linesRef.current.push(line);
                     }
                }
            } else { // No city placed here, show correct answer
                markerHtml = `<div class="w-3 h-3 bg-gray-400 rounded-full border-2 border-dashed border-gray-500"></div>`;
                tooltipContent = `<span class="font-bold text-gray-300">${city.name}</span>`;
            }
        }

        const icon = L.divIcon({
            html: markerHtml,
            className: 'transition-all duration-300',
            iconSize: iconSize,
            iconAnchor: iconAnchor
        });

        const marker = L.marker(city.coords, { icon }).addTo(map);

        if (tooltipContent || gameState === 'finished') {
            marker.bindTooltip(tooltipContent, {
                permanent: true,
                direction: 'top',
                offset: [0, -10],
                className: 'custom-tooltip'
            }).openTooltip();
        }

        markersRef.current.set(city.id, marker);
    });

  }, [quizCities, placedCities, gameState, highlightedCityId]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setHighlightedCityId(null);
    const map = mapRef.current;
    if (!map) return;

    const droppedCityName = e.dataTransfer.getData("text/plain");
    if (droppedCityName) {
      const latLng = map.mouseEventToLatLng(e.nativeEvent);
      onCityDrop(latLng, droppedCityName);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const map = mapRef.current;
      if (!map || gameState !== 'playing') return;

      const latLng = map.mouseEventToLatLng(e.nativeEvent);

      let closestCity: City | null = null;
      let minDistance = Infinity;

      quizCities.forEach(city => {
          const cityLatLng = L.latLng(city.coords.lat, city.coords.lng);
          const distance = latLng.distanceTo(cityLatLng);
          if (distance < minDistance) {
              minDistance = distance;
              closestCity = city;
          }
      });
      
      const SNAP_THRESHOLD_METERS = 50000; // 50km
      if (closestCity && minDistance < SNAP_THRESHOLD_METERS) {
          setHighlightedCityId(closestCity.id);
      } else {
          setHighlightedCityId(null);
      }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setHighlightedCityId(null);
  };

  return (
    <>
        <style>
        {`
            .leaflet-tooltip.custom-tooltip {
                background-color: rgba(26, 32, 44, 0.8) !important;
                border: 1px solid #4A5568 !important;
                color: #E2E8F0 !important;
                border-radius: 0.5rem !important;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
                padding: 4px 8px !important;
            }
            .leaflet-tooltip-top.custom-tooltip::before {
                border-top-color: #4A5568 !important;
            }
            .leaflet-container {
                background: #111827; /* bg-gray-900 */
            }
        `}
        </style>
        <div 
            ref={mapContainerRef} 
            className="w-full h-full rounded-2xl cursor-grab"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        ></div>
    </>
  );
};

export default EstoniaMap;