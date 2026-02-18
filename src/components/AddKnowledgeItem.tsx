'use client';

import { useState, useMemo } from 'react';
import type { AdminCommunityMetricsResponse } from '@/api/admin/getMetrics';

interface AddKnowledgeItemProps {
  communityId: string;
  metrics: AdminCommunityMetricsResponse;
  onSuccess?: () => void;
}

const MEDIA_TYPES = ['image', 'audio', 'video', 'pdf'];

const TEMPLATES = {
  none: { label: 'None', format: (content: string) => content },
  centered: { 
    label: 'Centered', 
    format: (content: string) => `<center>\n\n${content}\n\n</center>` 
  },
  withMeaning: {
    label: 'With Meaning',
    format: (content: string) => content
  },
};

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
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof TEMPLATES>('centered');
  const [subtype, setSubtype] = useState('');
  const [sequence, setSequence] = useState('99');
  const [mediaType, setMediaType] = useState<string>('');
  const [mediaUrl, setMediaUrl] = useState('');

  const typesForCategory = getTypesForCategory(activeCategory);
  const availableSubtypes = getAvailableSubtypes(activeCategory, selectedType);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setSelectedType('');
    setSelectedTemplate('centered');
    setSubtype('');
    setSequence('99');
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

      // Apply template formatting to content
      const templateFormatter = TEMPLATES[selectedTemplate];
      const formattedContent = templateFormatter.format(content.trim());

      const payload = {
        title: title.trim(),
        content: formattedContent,
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

      // Show success toast
      setToastMessage({ type: 'success', message: 'Knowledge item created successfully!' });
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      setToastMessage({ type: 'error', message: errorMsg });
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white font-medium z-[100] animate-in fade-in slide-in-from-top-2 ${
          toastMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {toastMessage.message}
        </div>
      )}

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
                setSelectedTemplate('centered');
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
                  setShowModal(true);
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

      {/* Modal for detailed form */}
      {showModal && selectedType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Add {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedType('');
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* First Row: Template Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Template
                </label>
                <div className="flex gap-2">
                  {Object.entries(TEMPLATES).map(([key, template]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedTemplate(key as keyof typeof TEMPLATES)}
                      className={`px-4 py-2 rounded border-2 font-medium transition ${
                        selectedTemplate === key
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-4 gap-4">
                {/* Left Column (3/4) - Main Content */}
                <div className="col-span-3 space-y-4">
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
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="Enter content in markdown format..."
                    />
                  </div>

                  {/* Media */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">Media</label>
                    <div className="grid grid-cols-2 gap-2">
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
                </div>

                {/* Right Column (1/4) - Metadata */}
                <div className="col-span-1 space-y-4">
                  {/* Subtype */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Subtype
                    </label>
                    {availableSubtypes.length > 0 ? (
                      <select
                        value={subtype}
                        onChange={(e) => setSubtype(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="">None</option>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Create new"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="99"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-4 sticky bottom-0 bg-white border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 font-medium"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowModal(false);
                    setSelectedType('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
