import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { blobToBase64 } from '../utils/audioUtils';

interface RecorderProps {
  onRecordingComplete: (base64: string) => void;
  isProcessing: boolean;
}

const Recorder: React.FC<RecorderProps> = ({ onRecordingComplete, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' }); // Use webm for browser compatibility
        const base64 = await blobToBase64(blob);
        onRecordingComplete(base64);
        
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Please allow microphone access to practice pronunciation.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-spin">
          <Loader2 className="w-8 h-8 text-blue-600" />
        </div>
        <p className="mt-2 text-blue-600 font-medium text-sm">Grading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg ${
          isRecording 
            ? 'bg-red-500 blob-pulse text-white' 
            : 'bg-indigo-500 hover:bg-indigo-600 text-white'
        }`}
      >
        {isRecording ? (
          <Square className="w-8 h-8 fill-current" />
        ) : (
          <Mic className="w-10 h-10" />
        )}
      </button>
      <p className="mt-4 text-gray-500 font-medium">
        {isRecording ? "Listening... Tap to Stop" : "Tap to Speak"}
      </p>
    </div>
  );
};

export default Recorder;
