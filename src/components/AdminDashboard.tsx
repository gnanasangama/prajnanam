'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiRefreshCw, FiArrowRight } from 'react-icons/fi';
import type { Community } from '@/models/community';

export default function AdminDashboard() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCommunities();
  }, []);

  async function fetchCommunities() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/communities');
      if (!response.ok) throw new Error('Failed to fetch communities');
      const data = await response.json();
      setCommunities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="text-center">
          <FiRefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-gray-600">Loading communities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-300 rounded">
        <p className="text-red-800 font-medium">Error: {error}</p>
        <button
          onClick={fetchCommunities}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage all communities and their knowledge items</p>
        </div>
        <button
          onClick={fetchCommunities}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Community Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <Link
            key={community.id}
            href={`/admin/community/${community.community_id}`}
            className="group"
          >
            <div className="h-full bg-white rounded-lg border border-gray-300 overflow-hidden hover:shadow-lg transition-shadow hover:border-blue-400">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-6 border-b border-gray-300">
                <h2 className="text-xl font-bold text-gray-900 capitalize">
                  {community.name?.en || community.community_id}
                </h2>
                <div className="flex items-center gap-2 mt-3">
                  <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-medium capitalize">
                    {community.type}
                  </span>
                  {community.description?.en && (
                    <p className="text-gray-600 text-sm truncate">
                      {community.description.en}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-300 flex items-center justify-between group-hover:bg-blue-50 transition">
                <span className="text-sm font-medium text-gray-700">View Metrics</span>
                <FiArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {communities.length === 0 && (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-300">
          <p className="text-gray-500 text-lg">No communities found</p>
        </div>
      )}
    </div>
  );
}
