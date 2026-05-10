import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import api from '../api/axios';

interface FormState {
  toolId: string;
  userId: string;
}

export default function IssueReturn() {
  const [issueForm, setIssueForm] = useState<FormState>({ toolId: '', userId: '' });
  const [returnForm, setReturnForm] = useState<FormState>({ toolId: '', userId: '' });
  const [issueSuccess, setIssueSuccess] = useState<string | null>(null);
  const [returnSuccess, setReturnSuccess] = useState<string | null>(null);

  const issue = useApi({
    onSuccess: () => {
      setIssueSuccess('Tool issued successfully');
      setIssueForm({ toolId: '', userId: '' });
      setTimeout(() => setIssueSuccess(null), 3000);
    },
  });

  const returnApi = useApi({
    onSuccess: () => {
      setReturnSuccess('Tool returned successfully');
      setReturnForm({ toolId: '', userId: '' });
      setTimeout(() => setReturnSuccess(null), 3000);
    },
  });

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await issue.request(() => api.post('/issue', issueForm));
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await returnApi.request(() => api.post('/return', { toolId: returnForm.toolId }));
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Issue / Return</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Issue Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
            Issue Tool
          </h2>

          {issue.error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {issue.error}
            </div>
          )}

          {issueSuccess && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
              {issueSuccess}
            </div>
          )}

          <form onSubmit={handleIssueSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tool ID</label>
              <input
                type="text"
                value={issueForm.toolId}
                onChange={(e) => setIssueForm({ ...issueForm, toolId: e.target.value })}
                required
                disabled={issue.loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="Enter tool ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
              <input
                type="text"
                value={issueForm.userId}
                onChange={(e) => setIssueForm({ ...issueForm, userId: e.target.value })}
                required
                disabled={issue.loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="Enter user ID"
              />
            </div>

            <button
              type="submit"
              disabled={issue.loading}
              className="w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {issue.loading ? 'Submitting...' : 'Submit Issue'}
            </button>
          </form>
        </div>

        {/* Return Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
            Return Tool
          </h2>

          {returnApi.error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {returnApi.error}
            </div>
          )}

          {returnSuccess && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
              {returnSuccess}
            </div>
          )}

          <form onSubmit={handleReturnSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tool ID</label>
              <input
                type="text"
                value={returnForm.toolId}
                onChange={(e) => setReturnForm({ ...returnForm, toolId: e.target.value })}
                required
                disabled={returnApi.loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="Enter tool ID"
              />
            </div>

            <button
              type="submit"
              disabled={returnApi.loading}
              className="w-full px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:bg-gray-400 transition"
            >
              {returnApi.loading ? 'Submitting...' : 'Submit Return'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
