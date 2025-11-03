import React from 'react';
import Image from 'next/image';
import { FaFilePdf, FaFileAlt, FaFileExcel, FaFileWord, FaFileCsv } from 'react-icons/fa';
import { UserMessageProps } from '../../../../../utils/types/chat';

export default function UserMessage({ text, files }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[50%] inline-block">
        {text && (
          <div className=" bg-[#9FF8F8] text-black p-3 rounded-2xl rounded-br-none  break-words overflow-x-auto whitespace-pre-line
    max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ">
            {text}
          </div>
        )}
{files && files.length > 0 && (
  <div className="flex flex-wrap gap-2 mt-2 justify-end">
    {files.map((item, idx) => {
      const fileName = item.file.name.toLowerCase();
      let IconComponent: React.ElementType = FaFileAlt;
      let iconColor = "text-blue-500";

      if (item.file.type.startsWith("image/")) {
        return (
          <div key={idx} className="bg-gray-100 p-2 rounded-xl shadow-md">
            <Image
              src={item.previewUrl}
              alt={item.file.name}
              width={96}
              height={96}
              className="w-24 h-24 object-cover rounded-md"
            />
          </div>
        );
      }

      if (fileName.endsWith(".pdf")) {
        IconComponent = FaFilePdf;
        iconColor = "text-red-500";
      } else if (fileName.endsWith(".csv")) {
        IconComponent = FaFileCsv;
        iconColor = "text-green-600";
      } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        IconComponent = FaFileExcel;
        iconColor = "text-green-700";
      } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
        IconComponent = FaFileWord;
        iconColor = "text-blue-600";
      } else if (fileName.endsWith(".txt")) {
        iconColor = "text-gray-700";
      }

      return (
        <div
          key={idx}
          className="bg-gray-100 text-gray-900 p-2 rounded-xl text-sm shadow-md flex flex-col items-center"
        >
          <IconComponent size={24} className={`${iconColor} mb-1`} />
          <span className="text-xs max-w-[100px] text-center truncate">
            {item.file.name}
          </span>
        </div>
      );
    })}
  </div>
)}
      </div>
    </div>
  );
}