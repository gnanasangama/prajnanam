'use client';

import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminCommunityDetails from '@/components/AdminCommunityDetails';

export default function CommunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const paramsSync = React.use(params);

  return (
    <>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8 max-w-7xl mx-auto">
          <AdminCommunityDetails communityId={paramsSync.id} />
        </div>
      </main>
    </>
  );
}
