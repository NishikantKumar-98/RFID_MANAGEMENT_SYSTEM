import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import api from '../api/axios';
import type { ScanResult } from '../types';

export default function Scan() {
  const [textInput, setTextInput] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const { loading, error, request, setError } = useApi();

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    const scannedIds = textInput
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    if (scannedIds.length === 0) {
      setError('Please enter at least one tool ID');
      return;
    }

    const data = await request<ScanResult>(() => api.post('/scan', { scannedIds }));
    if (data) {
      setResult(data);
    }
  };

  const clearResults = () => {
    setTextInput('');
    setResult(null);
    setError(null);
  };

  const renderList = (items: string[], isEmpty: string) =>
    items.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {items.map((id) => (
          <span key={id} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
            {id}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-gray-600">{isEmpty}</p>
    );

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Inventory Scan</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Scan Tools</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleScan} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Tool IDs (comma-separated)
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={loading}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono disabled:bg-gray-100"
              placeholder="Example: TOOL-001, TOOL-003, TOOL-005"
            />
            <p className="text-xs text-gray-500 mt-1">Separate tool IDs with commas</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Scanning...' : 'Scan'}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h3 className="text-xl font-semibold text-green-700 mb-4">✓ Correct Tools</h3>
            {renderList(result.correct, 'No correct tools found')}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <h3 className="text-xl font-semibold text-red-700 mb-4">✗ Missing Tools</h3>
            {renderList(result.missing, 'No missing tools found')}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500">
            <h3 className="text-xl font-semibold text-amber-700 mb-4">⚠ Extra Tools</h3>
            {renderList(result.extra, 'No extra tools found')}
          </div>

          <button
            onClick={clearResults}
            className="px-6 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition"
          >
            Clear Results
          </button>
        </div>
      )}
    </div>
  );
}
