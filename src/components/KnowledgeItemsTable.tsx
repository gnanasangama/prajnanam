'use client';

import { useEffect, useState } from 'react';
import { FiRefreshCw, FiCheck, FiX, FiImage, FiVolume2, FiVideo, FiFile } from 'react-icons/fi';

interface KnowledgeItemDetails {
  id: string;
  title: string;
  subtype: string | null;
  sequence: number | null;
  media: { type: string; url: string } | null;
  is_visible: boolean;
}

interface KnowledgeItemsTableProps {
  community: string;
  category: string;
  type: string;
}

export default function KnowledgeItemsTable({
  community,
  category,
  type,
}: KnowledgeItemsTableProps) {
  const [items, setItems] = useState<KnowledgeItemDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, [community, category, type]);

  async function fetchItems() {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        community,
        category,
        type,
      });
      const response = await fetch(`/api/admin/knowledge-items?${params}`);
      if (!response.ok) throw new Error('Failed to fetch knowledge items');
      const data = await response.json();
      setItems(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  const getMediaIcon = (mediaType: string | undefined) => {
    if (!mediaType) return null;
    switch (mediaType) {
      case 'image':
        return <FiImage className="w-4 h-4 text-blue-600" title="Image" />;
      case 'audio':
        return <FiVolume2 className="w-4 h-4 text-purple-600" title="Audio" />;
      case 'video':
        return <FiVideo className="w-4 h-4 text-red-600" title="Video" />;
      case 'pdf':
        return <FiFile className="w-4 h-4 text-orange-600" title="PDF" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FiRefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
        <p className="text-gray-600">Loading knowledge items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-300 rounded">
        <p className="text-red-800 font-medium">Error: {error}</p>
        <button
          onClick={fetchItems}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-12 bg-gray-50 border border-gray-300 rounded text-center">
        <p className="text-gray-600">No knowledge items found</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-300">
            <th className="px-4 py-3 text-left font-bold text-gray-900">Title</th>
            <th className="px-4 py-3 text-left font-bold text-gray-900">Subtype</th>
            <th className="px-4 py-3 text-center font-bold text-gray-900 w-20">Seq</th>
            <th className="px-4 py-3 text-center font-bold text-gray-900 w-20">Media</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr
              key={item.id}
              className={`border-b border-gray-200 hover:bg-gray-50 transition ${
                idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                <div className="flex items-center gap-2">
                  {item.is_visible ? (
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <FiCheck className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                      <FiX className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <span>{item.title}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{item.subtype || '—'}</td>
              <td className="px-4 py-3 text-sm text-center text-gray-700">
                {item.sequence !== null ? item.sequence : '—'}
              </td>
              <td className="px-4 py-3 text-center">
                {item.media ? getMediaIcon(item.media.type) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
