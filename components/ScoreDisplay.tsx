import React from 'react';
import { EvaluationResult } from '../types';
import { X, RefreshCw, ChevronRight } from 'lucide-react';

interface ScoreDisplayProps {
  result: EvaluationResult;
  onClose: () => void;
  onNext: () => void;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ result, onClose, onNext }) => {
  const isGood = result.score >= 80;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className={`p-6 flex flex-col items-center ${isGood ? 'bg-gradient-to-b from-green-400 to-green-500' : 'bg-gradient-to-b from-orange-400 to-orange-500'}`}>
          <div className="w-full flex justify-between items-start mb-2">
             <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-6 h-6"/></button>
          </div>
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white/30">
             <span className={`text-6xl font-black ${isGood ? 'text-green-500' : 'text-orange-500'}`}>{result.score}</span>
          </div>
          <h3 className="text-white font-bold text-2xl mt-4">{result.encouragement}</h3>
        </div>
        
        <div className="p-6 space-y-4">
            <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Feedback</p>
                <p className="text-gray-800">{result.feedback}</p>
            </div>

            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                <p className="text-sm text-indigo-400 font-bold uppercase tracking-wider mb-1">Tip</p>
                <p className="text-indigo-800 font-medium">{result.suggestion}</p>
            </div>

            <div className="flex gap-3 mt-4">
                <button 
                    onClick={onClose} 
                    className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                >
                    <RefreshCw className="w-5 h-5" /> Retry
                </button>
                <button 
                    onClick={onNext} 
                    className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-200"
                >
                    Next <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
