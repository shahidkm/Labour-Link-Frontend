// import React, { useState } from 'react';

// interface Place {
//   id: number;
//   name: string;
// }

// const SearchAndSelect: React.FC = () => {
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [places, setPlaces] = useState<Place[]>([
//     { id: 1, name: 'New York' },
//     { id: 2, name: 'Los Angeles' },
//     { id: 3, name: 'Chicago' },
//     { id: 4, name: 'San Francisco' },
//     { id: 5, name: 'Miami' },
//   ]);
//   const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);

//   // Handle Search Input
//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//   };

//   // Filter places based on search query
//   const filteredPlaces = places.filter((place) =>
//     place.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Add or remove places to/from selected array
//   const handlePlaceSelect = (place: Place) => {
//     if (selectedPlaces.find((p) => p.id === place.id)) {
//       setSelectedPlaces(selectedPlaces.filter((p) => p.id !== place.id));
//     } else {
//       // If array has 3 places, remove the first added one and add new place
//       if (selectedPlaces.length >= 3) {
//         setSelectedPlaces([...selectedPlaces.slice(1), place]);
//       } else {
//         setSelectedPlaces([...selectedPlaces, place]);
//       }
//     }
//   };

//   return (
//     <div className="p-6 max-w-lg mx-auto">
//       <div className="mb-4">
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={handleSearch}
//           className="p-2 border border-gray-300 rounded-md w-full"
//           placeholder="Search places..."
//         />
//       </div>

//       <div className="space-y-2">
//         {filteredPlaces.map((place) => (
//           <div key={place.id} className="flex items-center space-x-3">
//             <input
//               type="checkbox"
//               checked={selectedPlaces.some((p) => p.id === place.id)}
//               onChange={() => handlePlaceSelect(place)}
//               className="h-5 w-5 text-blue-600 border-gray-300 rounded"
//             />
//             <label className="text-lg">{place.name}</label>
//           </div>
//         ))}
//       </div>

//       <div className="mt-6">
//         <h3 className="font-semibold">Selected Places (Max 3):</h3>
//         <ul className="list-disc pl-5">
//           {selectedPlaces.map((place) => (
//             <li key={place.id}>{place.name}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default SearchAndSelect;
