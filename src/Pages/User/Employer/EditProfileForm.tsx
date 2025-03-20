// import React from 'react';
// import { Upload } from 'lucide-react';
// import { Municipality } from '../../../Types/Municipality';
// import ComboBox from '../../../Components/User/Dropdown/MuncipalityDropdown';

// interface EditProfileFormProps {
//   fullName: string;
//   setFullName: (name: string) => void;
//   selectedMunicipality: Municipality | null;
//   onSelectMunicipality: (municipality: Municipality) => void;
//   onSubmit: (e: React.FormEvent) => void;
//   onCancel: () => void;
//   currentMunicipalityName: string;
//   currentImageUrl: string;
//   previewImage: string | null;
//   handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   handleImageClick: () => void;
//   fileInputRef: React.RefObject<HTMLInputElement>;
// }

// export const EditProfileForm: React.FC<EditProfileFormProps> = ({
//   fullName,
//   setFullName,
//   selectedMunicipality,
//   onSelectMunicipality,
//   onSubmit,
//   onCancel,
//   currentMunicipalityName,
//   currentImageUrl,
//   previewImage,
//   handleImageChange,
//   handleImageClick,
//   fileInputRef
// }) => {
//   return (
//     <form onSubmit={onSubmit} className="space-y-4">
//       <h2 className="text-xl font-semibold mb-4 text-center">Update Profile</h2>
      
//       {/* Profile Image */}
//       <div className="flex flex-col items-center mb-4">
//         <div 
//           onClick={handleImageClick}
//           className="relative h-24 w-24 mb-2 rounded-full overflow-hidden cursor-pointer group"
//         >
//           <img 
//             src={previewImage || currentImageUrl} 
//             alt="Profile" 
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all">
//             <Upload className="text-white opacity-0 group-hover:opacity-100" size={24} />
//           </div>
//         </div>
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleImageChange}
//           accept="image/*"
//           className="hidden"
//         />
//         <p className="text-sm text-gray-500">Click to upload a new profile image</p>
//       </div>
      
//       {/* Full Name */}
//       <div>
//         <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
//           Full Name
//         </label>
//         <input
//           id="fullName"
//           type="text"
//           value={fullName}
//           onChange={(e) => setFullName(e.target.value)}
//           placeholder="Enter your full name"
//           className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//           required
//         />
//       </div>

//       {/* Municipality */}
//       <div>
//         <label htmlFor="municipality" className="block text-sm font-medium text-gray-700 mb-2">
//           Select Municipality
//         </label>
        
//         {!selectedMunicipality && currentMunicipalityName !== "Not Available" && (
//           <div className="mb-2 text-sm text-gray-500">
//             Current: {currentMunicipalityName}
//           </div>
//         )}
        
//         <ComboBox onSelectMunicipality={onSelectMunicipality} />
//       </div>

//       <div className="flex gap-4 mt-6">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="flex-1 p-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           className="flex-1 p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
//           disabled={!selectedMunicipality}
//         >
//           Save Changes
//         </button>
//       </div>
//     </form>
//   );
// };