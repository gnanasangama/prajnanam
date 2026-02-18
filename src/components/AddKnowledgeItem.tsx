'use client';

import { useState, useMemo } from 'react';
import type { AdminCommunityMetricsResponse } from '@/api/admin/getMetrics';

interface AddKnowledgeItemProps {
  communityId: string;
  metrics: AdminCommunityMetricsResponse;
  onSuccess?: () => void;
}

const MEDIA_TYPES = ['image', 'audio', 'video', 'pdf'];

export default function AddKnowledgeItem({
  communityId,
  metrics,
  onSuccess,
}: AddKnowledgeItemProps) {
  // Get dynamic categories from metrics
  const categories = useMemo(() => {
    return metrics.byCategory.map((cat) => cat.category);
  }, [metrics]);

  // Get types for selected category
  const getTypesForCategory = (category: string): string[] => {
    const catData = metrics.byCategory.find((c) => c.category === category);
    if (!catData) return [];
    return catData.byType.map((t) => t.type);
  };

  // Get available subtypes for selected type in active category
  const getAvailableSubtypes = (category: string, type: string): string[] => {
    const catData = metrics.byCategory.find((c) => c.category === category);
    if (!catData) return [];
    const typeData = catData.byType.find((t) => t.type === type);
    if (!typeData) return [];
    return Array.from(new Set(typeData.bySubtype.map((s) => s.subtype)));
  };

  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || 'wiki');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [subtype, setSubtype] = useState('');
  const [sequence, setSequence] = useState('');
  const [mediaType, setMediaType] = useState<string>('');
  const [mediaUrl, setMediaUrl] = useState('');

  const typesForCategory = getTypesForCategory(activeCategory);
  const availableSubtypes = getAvailableSubtypes(activeCategory, selectedType);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setSelectedType('');
    setSubtype('');
    setSequence('');
    setMediaType('');
    setMediaUrl('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!title.trim()) throw new Error('Title is required');
      if (!content.trim()) throw new Error('Content is required');
      if (!selectedType) throw new Error('Type is required');

      const payload = {
        title: title.trim(),
        content: content.trim(),
        community: communityId,
        category: activeCategory,
        type: selectedType,
        subtype: subtype || null,
        sequence: sequence ? parseInt(sequence) : null,
        is_visible: true,
        media: mediaType && mediaUrl ? { type: mediaType, url: mediaUrl } : null,
      };

      const response = await fetch('/api/admin/knowledge-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to create knowledge item');
      }

      setSuccess(true);
      resetForm();
      onSuccess?.();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Add Knowledge Item</h2>
        <p className="text-gray-600 text-sm mt-1">Create new content for {communityId}</p>
      </div>

      {/* Category Tabs */}
      {categories.length > 0 && (
        <div className="flex gap-2 border-b border-gray-300">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedType('');
                setError(null);
              }}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeCategory === cat
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Type Selection */}
      {typesForCategory.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-900">Type</label>
          <div className="grid grid-cols-2 gap-2">
            {typesForCategory.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  setSubtype('');
                }}
                className={`px-4 py-3 rounded-xl border-2 font-medium transition capitalize ${
                  selectedType === type
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedType && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter title"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Content (Markdown) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="Enter content in markdown format..."
            />
          </div>

          {/* Subtype */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Subtype
            </label>
            {availableSubtypes.length > 0 ? (
              <select
                value={subtype}
                onChange={(e) => setSubtype(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select or leave empty</option>
                {availableSubtypes.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={subtype}
                onChange={(e) => setSubtype(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Create new subtype or leave empty"
              />
            )}
          </div>

          {/* Sequence */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Sequence
            </label>
            <input
              type="number"
              value={sequence}
              onChange={(e) => setSequence(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional display order"
            />
          </div>

          {/* Media */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">Media</label>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Media Type</option>
                {MEDIA_TYPES.map((mt) => (
                  <option key={mt} value={mt}>
                    {mt.charAt(0).toUpperCase() + mt.slice(1)}
                  </option>
                ))}
              </select>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Media URL"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-300 rounded text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-300 rounded text-green-800 text-sm">
              Knowledge item created successfully!
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 font-medium"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 transition font-medium"
            >
              Reset
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
