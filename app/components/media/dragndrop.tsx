import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
 
interface ImageUploaderProps {
  onUpload: (file: File) => void;
}
 
const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload]
  );
 
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1,
  });
 
  return (
    <div
      {...getRootProps()}
      className="flex items-center h-40 border-2 border-dashed border-gray-300 p-4 rounded-md cursor-pointer"
    >
      <input {...getInputProps()} />
      <p className="text-center text-gray-600">
        Drag and drop an image here, or click to select one
      </p>
    </div>
  );
};
 
export default ImageUploader;