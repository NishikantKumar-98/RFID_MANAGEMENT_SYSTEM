import { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import api from '../api/axios';
import type { Stats } from '../types';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, issued: 0, missing: 0 });
  const { loading, error, request } = useApi();

  useEffect(() => {
    const fetchStats = async () => {
      const data = await request<Stats>(() => api.get('/stats'));
      if (data) {
        setStats(data);
      }
    };
    fetchStats();
  }, [request]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-blue-500">
          <h2 className="text-gray-600 text-lg font-semibold mb-2">Total Tools</h2>
          <p className="text-5xl font-bold text-blue-600">{stats.total}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-amber-500">
          <h2 className="text-gray-600 text-lg font-semibold mb-2">Issued Tools</h2>
          <p className="text-5xl font-bold text-amber-600">{stats.issued}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-red-500">
          <h2 className="text-gray-600 text-lg font-semibold mb-2">Missing Tools</h2>
          <p className="text-5xl font-bold text-red-600">{stats.missing}</p>
        </div>
      </div>
    </div>
  );
}
