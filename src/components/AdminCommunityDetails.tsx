'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiArrowLeft, FiRefreshCw, FiChevronDown, FiChevronUp, FiEye } from 'react-icons/fi';
import AddKnowledgeItem from '@/components/AddKnowledgeItem';
import KnowledgeItemsTable from '@/components/KnowledgeItemsTable';
import type { AdminCommunityMetricsResponse } from '@/api/admin/getMetrics';

interface AdminCommunityDetailsProps {
  communityId: string;
}

export default function AdminCommunityDetails({ communityId }: AdminCommunityDetailsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showParam = searchParams.get('show');
  const categoryParam = searchParams.get('category');
  const typeParam = searchParams.get('type');

  const [metrics, setMetrics] = useState<AdminCommunityMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchMetrics();
  }, [communityId]);

  async function fetchMetrics() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/community-metrics/${communityId}`);
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  function toggleType(typeKey: string) {
    setExpandedTypes((prev) => ({
      ...prev,
      [typeKey]: !prev[typeKey],
    }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="text-center">
          <FiRefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-gray-600">Loading metrics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2 hover:bg-gray-200 rounded transition"
            title="Back to Dashboard"
          >
            <FiArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 capitalize">
              {communityId}
            </h1>
            <p className="text-gray-600 mt-1">Manage Knowledge Items</p>
          </div>
        </div>
        <button
          onClick={fetchMetrics}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-6 bg-red-50 border border-red-300 rounded">
          <p className="text-red-800 font-medium">Error: {error}</p>
          <button
            onClick={fetchMetrics}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-4 gap-3">
        {/* Left: Add Form or View Table (60%) */}
        <div className="col-span-3 bg-white border border-gray-300 rounded p-6">
          {showParam === 'knowledge-items' && categoryParam && typeParam ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Knowledge Items in <span className="text-blue-600 capitalize">{typeParam}</span>
                </h2>
                <button
                  onClick={() => router.push(`/admin/community/${communityId}`)}
                  className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition"
                >
                  Back to Add
                </button>
              </div>
              <KnowledgeItemsTable
                community={communityId}
                category={categoryParam}
                type={typeParam}
              />
            </>
          ) : (
            <AddKnowledgeItem
              communityId={communityId}
              metrics={metrics}
              onSuccess={fetchMetrics}
            />
          )}
        </div>

        {/* Right: Metrics Table (40%) */}
        <div className="col-span-1 border border-gray-300 rounded overflow-hidden bg-white h-fit sticky top-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-300">
                <th className="px-3 py-2 text-left font-bold text-gray-900 flex-1">
                  Category / Type
                </th>
                <th className="px-2 py-2 text-center font-bold text-gray-900 w-12">
                  Count
                </th>
              </tr>
            </thead>
            <tbody>
              {metrics.byCategory.map((category) => (
                <React.Fragment key={category.category}>
                  {/* Category Row */}
                  <tr className="bg-blue-50 border-b border-gray-300 hover:bg-blue-100">
                    <td className="px-3 py-2 text-sm font-bold text-gray-900">
                      {category.category}
                    </td>
                    <td className="px-2 py-2 text-center text-sm font-bold text-gray-900">
                      {category.count}
                    </td>
                  </tr>

                  {/* Type Rows */}
                  {category.byType.map((typeMetric) => {
                    const typeKey = `${category.category}-${typeMetric.type}`;
                    const isExpanded = expandedTypes[typeKey];

                    return (
                      <React.Fragment key={typeKey}>
                        <tr
                          className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                          onClick={() => toggleType(typeKey)}
                        >
                          <td className="px-3 py-2 text-sm text-gray-800">
                            <div className="flex items-center gap-2 justify-between">
                              <div className="flex items-center gap-1">
                                {typeMetric.bySubtype.length > 0 && (
                                  isExpanded ? (
                                    <FiChevronUp className="w-3 h-3 text-gray-500 flex-shrink-0" />
                                  ) : (
                                    <FiChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" />
                                  )
                                )}
                                <span className="font-semibold truncate">{typeMetric.type}</span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/admin/community/${communityId}?show=knowledge-items&category=${category.category}&type=${typeMetric.type}`);
                                }}
                                className="text-blue-600 hover:text-blue-800 flex-shrink-0 transition"
                                title="View knowledge items"
                              >
                                <FiEye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-2 py-2 text-center text-sm font-semibold text-gray-900">
                            {typeMetric.count}
                          </td>
                        </tr>

                        {/* Subtype Rows */}
                        {isExpanded &&
                          typeMetric.bySubtype.map((subtype) => (
                            <tr
                              key={`${typeKey}-${subtype.subtype}`}
                              className="border-b border-gray-200 hover:bg-indigo-50"
                            >
                              <td className="px-3 py-2 text-sm text-gray-700">
                                <div className="flex items-center gap-1 ml-5">
                                  <span className="text-indigo-500 flex-shrink-0">→</span>
                                  <span className="truncate">{subtype.subtype}</span>
                                </div>
                              </td>
                              <td className="px-2 py-2 text-center text-sm text-gray-900">
                                {subtype.count}
                              </td>
                            </tr>
                          ))}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              ))}

              {/* Total Row */}
              <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-t-2 border-gray-300 font-bold">
                <td className="px-3 py-2 text-sm text-gray-900">TOTAL</td>
                <td className="px-2 py-2 text-center text-sm text-gray-900">
                  {metrics.totalItems}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
