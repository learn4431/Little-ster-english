import React from 'react';
import { Word } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Target } from 'lucide-react';

interface StatsProps {
  words: Word[];
}

const Stats: React.FC<StatsProps> = ({ words }) => {
  const practicedWords = words.filter(w => w.masteryLevel > 0);
  const avgScore = practicedWords.length 
    ? Math.round(practicedWords.reduce((acc, curr) => acc + curr.masteryLevel, 0) / practicedWords.length) 
    : 0;

  const data = words.map(w => ({
    name: w.text,
    score: w.masteryLevel
  }));

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                <div className="bg-yellow-100 p-3 rounded-full mb-2">
                    <Target className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-3xl font-black text-gray-800">{practicedWords.length}</span>
                <span className="text-gray-500 text-sm">Words Practiced</span>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                <div className="bg-green-100 p-3 rounded-full mb-2">
                    <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-3xl font-black text-gray-800">{avgScore}</span>
                <span className="text-gray-500 text-sm">Average Score</span>
            </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 h-80">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Mastery Overview</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} hide={data.length > 10} />
                    <YAxis hide />
                    <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        cursor={{fill: 'transparent'}}
                    />
                    <Bar dataKey="score" radius={[8, 8, 8, 8]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#4ade80' : entry.score > 50 ? '#facc15' : '#e5e7eb'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default Stats;
