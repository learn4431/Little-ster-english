import React, { useState } from 'react';
import { Word } from '../types';
import { generateWordDetails } from '../services/geminiService';
import { Plus, Sparkles, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // Actually we will use simple Date.now() for id to avoid external lib dep if possible, or just string.

interface AddWordFormProps {
  onAdd: (word: Word) => void;
  onCancel: () => void;
}

const AddWordForm: React.FC<AddWordFormProps> = ({ onAdd, onCancel }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      // 1. Get AI details
      const details = await generateWordDetails(inputText.trim());
      
      // 2. Construct Word object
      const newWord: Word = {
        id: Date.now().toString(),
        text: inputText.trim(),
        phonetic: details.phonetic || 'N/A',
        definition: details.definition || 'Custom word',
        example: details.example || '',
        masteryLevel: 0,
      };

      onAdd(newWord);
    } catch (error) {
      alert("Failed to generate details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Plus className="w-6 h-6 text-indigo-500" /> Add New Word
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Enter a Word</label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-indigo-500 text-lg font-semibold transition-colors"
            placeholder="e.g. Galaxy"
            disabled={isLoading}
          />
        </div>

        <div className="bg-indigo-50 p-4 rounded-xl flex gap-3 items-start">
            <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-sm text-indigo-700">
                Our AI wizard will automatically find the definition, phonetic sound, and an example sentence for you!
            </p>
        </div>

        <div className="flex gap-3 pt-2">
            <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                disabled={isLoading}
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={isLoading || !inputText}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-colors flex justify-center items-center"
            >
                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Card'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddWordForm;
