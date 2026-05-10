import { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import api from '../api/axios';
import type { Tool } from '../types';

export default function ToolMaster() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [formData, setFormData] = useState({
    toolId: '',
    name: '',
    category: 'Power Tools' as const,
  });
  const [success, setSuccess] = useState<string | null>(null);

  const { loading, error, request: createTool } = useApi({
    onSuccess: () => {
      setSuccess('Tool created successfully');
      setFormData({ toolId: '', name: '', category: 'Power Tools' });
      setTimeout(() => setSuccess(null), 3000);
      fetchTools();
    },
  });

  const { loading: loadingTools, error: toolsError, request: fetchToolsRequest } = useApi();

  const fetchTools = async () => {
    const data = await fetchToolsRequest<Tool[]>(() => api.get('/tools'));
    if (data) {
      setTools(data);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTool<Tool>(() => api.post('/tools', formData));
  };

  const statusColors: Record<string, string> = {
    Available: 'bg-green-100 text-green-800',
    Issued: 'bg-amber-100 text-amber-800',
    Missing: 'bg-red-100 text-red-800',
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Tool Master</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create New Tool</h2>

        {(error || toolsError) && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error || toolsError}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tool ID</label>
            <input
              type="text"
              value={formData.toolId}
              onChange={(e) => setFormData({ ...formData, toolId: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., TOOL-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Hammer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Power Tools</option>
              <option>Hand Tools</option>
              <option>Measuring Tools</option>
              <option>Safety Equipment</option>
              <option>Electrical Tools</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-2xl font-semibold text-gray-800 p-6 border-b border-gray-200">
          Tools List
        </h2>

        {loadingTools && !tools.length ? (
          <div className="p-6 text-center text-gray-600">Loading tools...</div>
        ) : tools.length === 0 ? (
          <div className="p-6 text-center text-gray-600">No tools found. Create one to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Tool ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tools.map((tool) => (
                  <tr key={tool._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{tool.toolId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{tool.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{tool.category}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          statusColors[tool.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {tool.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
