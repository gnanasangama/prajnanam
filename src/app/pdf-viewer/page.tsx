'use client';

import { useSearchParams } from 'next/navigation';

export default function PdfViewerPage() {
    const searchParams = useSearchParams();
    const url = searchParams.get('url');

    if (!url) {
        return <div className="p-4 text-red-500">PDF URL is missing</div>;
    }

    return (
        <div className="w-full h-screen">
            <iframe
                src={url}
                className="w-full h-full border-none"
                allow="autoplay"
                title="PDF Viewer"
            />
        </div>
    );
}
