import React, { useState, useRef } from "react";

interface ProfileModalProps {
  showModal: boolean;
  closeModal: () => void;
  updateWorkImages: (images: File[]) => void;
  selectedImages: File[];
}

const ProfileModal: React.FC<ProfileModalProps> = ({  closeModal, updateWorkImages, selectedImages }) => {
  const [workImages, setWorkImages] = useState<File[]>(selectedImages);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newImages = Array.from(event.target.files);
      setWorkImages([...workImages, ...newImages]);
    }
  };

  const handleSave = () => {
    updateWorkImages(workImages);
    closeModal();
  };

  const handleClickImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input on div click
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Upload Work Images</h3>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <div className="mt-3 grid grid-cols-3 gap-2">
          {workImages.map((image, index) => (
            <div
              key={index}
              onClick={handleClickImage}
              className="w-24 h-24 rounded-full overflow-hidden cursor-pointer border flex items-center justify-center relative"
              style={{ backgroundImage: `url(${URL.createObjectURL(image)})`, backgroundSize: "cover" }}
            >
              {/* "Choose File" button inside the circle */}
              <button
                onClick={handleClickImage}
                className="absolute inset-0 bg-black bg-opacity-50 text-white font-bold flex items-center justify-center"
              >
                Choose File
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Save
          </button>
          <button onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
