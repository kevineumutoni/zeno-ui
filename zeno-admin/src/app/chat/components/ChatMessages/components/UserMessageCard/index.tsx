import React from 'react';
import Image from 'next/image';
import { FaFilePdf, FaFileAlt } from 'react-icons/fa';
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
            {files.map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-100 text-gray-900 p-2 rounded-xl text-sm shadow-md flex flex-col items-center"
              >
                {item.file.type.startsWith("image/") ? (
                  <Image
                    src={item.previewUrl}
                    alt={item.file.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    {item.file.type === 'application/pdf' ? (
                      <FaFilePdf size={24} className="text-red-500 mb-1" />
                    ) : (
                      <FaFileAlt size={24} className="text-blue-500 mb-1" />
                    )}
                    <span className="text-xs max-w-[100px] text-center truncate">
                      {item.file.name}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}