import React from 'react';
import { Word } from '../types';
import { Volume2, Star } from 'lucide-react';
import { playWordPronunciation } from '../services/geminiService';

interface WordCardProps {
  word: Word;
}

const WordCard: React.FC<WordCardProps> = ({ word }) => {
  const handlePlayAudio = () => {
    playWordPronunciation(word.text);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border-b-8 border-indigo-100 p-8 flex flex-col items-center text-center relative">
        {/* Mastery Indicator */}
        <div className="absolute top-4 right-4 flex items-center bg-yellow-50 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="text-yellow-700 font-bold text-sm">{word.masteryLevel}%</span>
        </div>

      <div className="mt-4 mb-2">
        <h2 className="text-5xl font-black text-gray-800 tracking-tight mb-2">{word.text}</h2>
        <div className="flex items-center justify-center gap-2">
            <span className="text-gray-400 font-mono text-xl">{word.phonetic}</span>
            <button 
                onClick={handlePlayAudio}
                className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
            >
                <Volume2 className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 p-4 rounded-xl w-full">
        <p className="text-gray-600 italic mb-2">"{word.definition}"</p>
        <div className="h-px bg-gray-200 w-full my-3"></div>
        <p className="text-indigo-600 font-medium">
            {word.example}
        </p>
      </div>

      <div className="mt-6 flex gap-1">
        {[1,2,3].map((i) => (
             <div key={i} className={`h-2 flex-1 rounded-full ${word.masteryLevel >= i*30 ? 'bg-green-400' : 'bg-gray-200'}`}></div>
        ))}
      </div>
    </div>
  );
};

export default WordCard;
