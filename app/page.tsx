'use client';

import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="space-y-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Counter App</h1>
        
        <div className="text-8xl font-bold text-blue-600 dark:text-blue-400">
          {count}
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={() => setCount(prev => prev - 1)}
            className="rounded-lg bg-red-500 px-6 py-3 text-white hover:bg-red-600 transition-colors"
          >
            Decrease
          </button>
          
          <button
            onClick={() => setCount(0)}
            className="rounded-lg bg-gray-500 px-6 py-3 text-white hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
          
          <button
            onClick={() => setCount(prev => prev + 1)}
            className="rounded-lg bg-green-500 px-6 py-3 text-white hover:bg-green-600 transition-colors"
          >
            Increase
          </button>
        </div>
      </div>
    </div>
  );
}
