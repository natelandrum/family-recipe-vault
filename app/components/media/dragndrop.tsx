"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface ImageUploaderProps {
  onUpload: (file: File) => void;
}

const DragNDrop: React.FC<ImageUploaderProps> = ({ onUpload }) => {
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
      className="flex justify-center items-center h-40 border-2 border-dashed border-gray-300 p-4 rounded-md cursor-pointer"
    >
      <input {...getInputProps()} />
      <p className="text-center flex flex-col items-center text-gray-600">
        <CloudUploadIcon sx={{ fontSize: 60 }} />
        Drag and drop an image here, or click to select one
      </p>
    </div>
  );
};

export default DragNDrop;