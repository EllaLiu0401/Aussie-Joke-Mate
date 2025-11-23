import React, { useState } from 'react';
import Button from './Button';
import { User } from '../types';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onLogin(input.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-md mx-auto px-4">
      <div className="bg-white p-8 rounded-2xl border-2 border-[#1D201F] shadow-[8px_8px_0px_0px_rgba(29,32,31,1)] w-full">
        <h1 className="text-3xl font-black mb-2 text-center text-[#1D201F]">
          G'day Mate! 🦘
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Enter your name to start learning Australian English through laughs.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1 ml-1">Username</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-4 rounded-lg border-2 border-gray-200 focus:border-[#00CFFF] focus:ring-4 focus:ring-[#00CFFF]/20 outline-none transition-all font-medium"
              placeholder="e.g. KangarooJack"
              autoFocus
            />
          </div>
          <Button type="submit" fullWidth variant="primary">
            Let's Go!
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;