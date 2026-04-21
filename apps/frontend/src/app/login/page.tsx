'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isRegister ? 'register' : 'login';
      const payload = isRegister
        ? formData
        : { username: formData.username, password: formData.password };

      const res = await axios.post(`http://localhost:3001/auth/${endpoint}`, payload);
      
      localStorage.setItem('token', res.data.access_token);
      toast.success(isRegister ? 'Registration successful!' : 'Login successful!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Toaster position="top-center" />
      
      <div className="bg-slate-800 rounded-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">🎰 Slots Demo</h1>
          <p className="text-gray-400">Play & Win with Virtual Credits</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-slate-900 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter username"
              required
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-900 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter email"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-900 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 text-black font-bold py-3 rounded-lg transition"
          >
            {loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-yellow-400 hover:underline"
          >
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        </div>

        <div className="mt-4 p-4 bg-slate-900 rounded-lg">
          <p className="text-sm text-gray-400 text-center">
            ⚠️ Demo Account: Get ৳10,000 virtual credits on registration!
          </p>
        </div>
      </div>
    </main>
  );
}
