import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import api from '../api/axios';
import type { AuthResponse } from '../types';

export default function Login() {
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { loading, error, request, setError } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await request<AuthResponse>(() => api.post('/auth/login', { userId }));
    if (data) {
      login(data.token, data.user);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="userId" className="sr-only">
              User ID
            </label>
            <input
              id="userId"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="User ID"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setError(null);
              }}
            />
          </div>
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <div className="text-center text-sm">
            <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}