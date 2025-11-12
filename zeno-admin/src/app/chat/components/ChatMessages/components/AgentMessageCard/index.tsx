
import React from 'react';
import Image from 'next/image';

interface AgentMessageProps {
  text?: string | null;
  loading?: boolean;
  progressMessages?: string[]; 
}

export default function AgentMessage({ text, loading, progressMessages = [] }: AgentMessageProps) {
  if (loading || progressMessages.length > 0) {
    return (
      <div className="flex flex-col items-start">
        <div className="mb-1">
          <Image
            src="/images/zeno-logo-icon.png"
            alt="Zeno AI Logo"
            width={24}
            height={24}
          />
        </div>
        <div className="bg-[#131F36] text-white p-3 rounded-2xl rounded-bl-none max-w-[70%]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div> 
            <span className="text-gray-400">Connecting the dots across global markets...</span>
          </div>
          {progressMessages.map((msg, index) => (
            <div key={index} className="text-sm text-gray-300 mt-1 pl-7 animate-fadeIn">
              • {msg}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!text) return null;

  return (
    <div className="flex flex-col items-start">
      <div className="mb-1">
        <Image
          src="/images/zeno-logo-icon.png"
          alt="Zeno AI Logo"
          width={24}
          height={24}
        />
      </div>
      <div className="bg-[#131F36] text-white p-3 rounded-2xl rounded-bl-none max-w-[80%] whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}
