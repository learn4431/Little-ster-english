import React, { useState, useEffect } from 'react';
import { Word, AppView, EvaluationResult } from './types';
import { INITIAL_WORDS } from './constants';
import { evaluatePronunciation } from './services/geminiService';
import WordCard from './components/WordCard';
import Recorder from './components/Recorder';
import ScoreDisplay from './components/ScoreDisplay';
import AddWordForm from './components/AddWordForm';
import Stats from './components/Stats';
import { BookOpen, PlusCircle, BarChart2, Github } from 'lucide-react';

const App: React.FC = () => {
  const [words, setWords] = useState<Word[]>(() => {
    const saved = localStorage.getItem('lse_words');
    return saved ? JSON.parse(saved) : INITIAL_WORDS;
  });
  
  const [currentView, setCurrentView] = useState<AppView>(AppView.LEARN);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<EvaluationResult | null>(null);

  useEffect(() => {
    localStorage.setItem('lse_words', JSON.stringify(words));
  }, [words]);

  const currentWord = words[currentIndex];

  const handleRecordingComplete = async (base64Audio: string) => {
    setIsProcessing(true);
    try {
      const result = await evaluatePronunciation(base64Audio, currentWord.text);
      setLastResult(result);
      
      // Update mastery level
      const updatedWords = [...words];
      updatedWords[currentIndex] = {
        ...currentWord,
        masteryLevel: result.score,
        lastPracticed: Date.now()
      };
      setWords(updatedWords);
    } catch (error) {
      alert("Oops! Something went wrong grading the audio. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNextWord = () => {
    setLastResult(null);
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  const handleAddWord = (newWord: Word) => {
    setWords([...words, newWord]);
    setCurrentView(AppView.LEARN);
    setCurrentIndex(words.length); // Jump to new word
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.ADD_WORD:
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <AddWordForm onAdd={handleAddWord} onCancel={() => setCurrentView(AppView.LEARN)} />
            </div>
        );
      case AppView.STATS:
        return (
            <div className="flex flex-col items-center min-h-[60vh] pt-8">
                <Stats words={words} />
            </div>
        );
      case AppView.LEARN:
      default:
        return (
          <div className="flex flex-col items-center gap-8 min-h-[70vh] justify-center">
            {words.length === 0 ? (
                <div className="text-center text-gray-500">
                    <p>No words yet!</p>
                    <button onClick={() => setCurrentView(AppView.ADD_WORD)} className="text-indigo-600 underline">Add one now</button>
                </div>
            ) : (
                <>
                    <WordCard word={currentWord} />
                    <Recorder 
                        onRecordingComplete={handleRecordingComplete} 
                        isProcessing={isProcessing} 
                    />
                </>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-black text-xl">L</div>
             <h1 className="text-xl font-bold text-gray-800 hidden sm:block">Little Star English</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded">Grade 6</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe z-40">
        <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto">
          <button 
            onClick={() => setCurrentView(AppView.LEARN)}
            className={`flex flex-col items-center gap-1 w-full h-full justify-center ${currentView === AppView.LEARN ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs font-bold">Practice</span>
          </button>
          
          <button 
             onClick={() => setCurrentView(AppView.ADD_WORD)}
             className={`flex flex-col items-center gap-1 w-full h-full justify-center ${currentView === AppView.ADD_WORD ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            <PlusCircle className="w-6 h-6" />
            <span className="text-xs font-bold">Add Word</span>
          </button>
          
          <button 
             onClick={() => setCurrentView(AppView.STATS)}
             className={`flex flex-col items-center gap-1 w-full h-full justify-center ${currentView === AppView.STATS ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            <BarChart2 className="w-6 h-6" />
            <span className="text-xs font-bold">Progress</span>
          </button>
        </div>
      </nav>

      {/* Result Modal */}
      {lastResult && (
        <ScoreDisplay 
            result={lastResult} 
            onClose={() => setLastResult(null)} 
            onNext={handleNextWord} 
        />
      )}
    </div>
  );
};

export default App;
