import {
  UserCircleIcon,
  PaperClipIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import imageCompression from "browser-image-compression";
import { useEffect, useState } from "react";
import { Modal } from "../Modal";
export const UserProfilePhoto = ({
  updateUserPhoto,
  deleteUserPhoto,
  showNotification,
  profilePhoto,
}) => {
  const [isChangingPhoto, setIsChangingPhoto] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (!isChangingPhoto) {
      setPreview(null);
    }
  }, [isChangingPhoto]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file.type.match("image.*")) {
      showNotification("error", "Please select an image file");
      return;
    }
    // Проверка типа файла
    if (!file.type.match(/image\/(jpeg|png|gif|webp)/)) {
      showNotification(
        "error",
        "Please select a valid image (JPEG, PNG, GIF, WEBP)"
      );
      return;
    }

    // Проверка размера файла не больше 2мб
    if (file.size > 2 * 1024 * 1024) {
      showNotification("error", "Image is too large (max 2MB)");
      return;
    }
    try {
      const options = {
        maxSizeMB: 0.1, // Максимум 100KB
        maxWidthOrHeight: 800, // Максимальное разрешение
        initialQuality: 0.8, // Качество изображения
        fileType: "image/webp", // Используем современный формат
      };
      const compresssed = await imageCompression(file, options);
      const compressedUrl = URL.createObjectURL(compresssed);
      setPreview(compressedUrl);
    } catch (error) {
      console.error("Error compressing image:", error);
      showNotification("error", "Error compressing image");
    }
  };
  const handleUploadPhoto = async () => {
    if (!preview) return;
    try {
      // Конвертируем в base64
      const response = await fetch(preview);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = async () => {
        const fullBase64 = reader.result;
        // Сохраняем полное изображение в Firestore
        await updateUserPhoto(fullBase64);
        setIsChangingPhoto(false);
        showNotification("success", "Profile photo uploaded");
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Upload failed:", error);
      showNotification("error", "Upload failed: " + error.message);
    }
  };

  const handleDeletePhoto = async () => {
    try {
      await deleteUserPhoto();
      setIsChangingPhoto(false);
      showNotification("success", "Profile photo deleted");
    } catch (error) {
      console.error("Delete failed:", error);
      showNotification("error", "Delete failed: " + error.message);
    }
  };

  return (
    <div className="mb-6 w-full">
      {/* Заголовок */}
      <div className=" w-full mb-2 ">
        <h3 className="text-lg dark:text-white font-medium flex items-center">
          Profile Photo
        </h3>
      </div>

      {/* Основной контейнер */}
      <div className="flex flex-col items-center w-full gap-4">
        {/* Блок с фото - всегда первый */}
        <div className="flex flex-col items-center w-full sm:w-auto">
          <div
            className="relative group cursor-pointer mx-auto"
            onClick={() => profilePhoto && setIsModalOpen(true)}
          >
            {profilePhoto ? (
              <>
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 border-red-600 object-cover shadow-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <EyeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </>
            ) : (
              <div className="bg-gradient-to-br from-neutral-200 to-red-400 dark:from-neutral-700 dark:to-red-600 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center border-2 border-red-600">
                <UserCircleIcon className="w-12 h-12 sm:w-16 sm:h-16 text-red-600" />
              </div>
            )}
          </div>

          {profilePhoto && !isChangingPhoto && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 text-sm text-red-500 hover:text-red-700 cursor-pointer"
            >
              View details
            </button>
          )}
        </div>

        {/* Блок смены фото (когда активен) */}
        {isChangingPhoto && (
          <div className="w-full sm:flex-1 sm:mx-0 mt-4 sm:mt-0 ">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-red-600 ">
              <h4 className="font-medium mb-3 flex items-center">
                <PaperClipIcon className="w-5 h-5 mr-2 text-red-600" />
                <span className="text-sm sm:text-base dark:text-white">
                  Upload new photo
                </span>
              </h4>

              {preview ? (
                <div className="flex flex-col items-center mb-4">
                  <div className="relative mb-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border-2 border-red-600"
                    />
                    <button
                      onClick={() => setPreview(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  <div className="w-full">
                    <p className="text-sm mb-2 text-center dark:text-white">
                      Upload this photo?
                    </p>

                    <div className="flex gap-2 justify-center text-white">
                      <button
                        onClick={handleUploadPhoto}
                        className="p-2 px-3  bg-red-600 hover:bg-red-700  rounded-3xl text-sm transition-colors"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-red-600 rounded-lg cursor-pointer bg-white dark:bg-neutral-900 hover:bg-amber-50 dark:hover:bg-neutral-950 transition-colors">
                    <div className="flex flex-col items-center justify-center py-4 px-2">
                      <PaperClipIcon className="w-6 h-6 mb-2 text-red-600" />
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        JPG, PNG, GIF (max 2MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p>• Recommended size: 500x500 pixels</p>
                <p>• Max file size: 2MB</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex sm:flex-col gap-4">
          <button
            onClick={() => setIsChangingPhoto(!isChangingPhoto)}
            className={`dark:text-white font-medium border hover:bg-neutral-300/60 dark:hover:bg-neutral-800/60 border-red-600 p-2 px-3 rounded-3xl duration-300 transition cursor-pointer ${
              isChangingPhoto
                ? "self-end sm:self-auto"
                : "self-center sm:self-auto"
            }`}
          >
            {isChangingPhoto ? "Cancel" : "Change Photo"}
          </button>
          {!profilePhoto && (
            <button
              onClick={handleDeletePhoto}
              className="dark:text-white font-medium border hover:bg-neutral-300/60 dark:hover:bg-neutral-800/60 border-red-600 p-2 px-3 rounded-3xl duration-300 transition cursor-pointer"
            >
              Remove current
            </button>
          )}
        </div>
      </div>
      {isModalOpen && (
        <Modal setClose={() => setIsModalOpen(false)}>
          <img
            src={profilePhoto}
            className="mt-6 rounded-lg"
            alt="Profile Photo"
          />
        </Modal>
      )}
    </div>
  );
};
