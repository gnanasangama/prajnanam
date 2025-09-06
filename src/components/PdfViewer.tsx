"use client";

import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Match PDF.js worker version
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PdfViewerProps {
    url: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageWidth, setPageWidth] = useState<number>(window.innerWidth); // 16px padding on each side

    // Update width on window resize
    useEffect(() => {
        const handleResize = () => {
            setPageWidth(window.innerWidth);
        };

        handleResize(); // initial
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    return (
        <div className="flex flex-col items-center px-4 py-2 overflow-y-scroll h-screen snap-y snap-mandatory">
            <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<p className="text-gray-500 text-center">Loading PDF...</p>}
            >
                {numPages &&
                    Array.from({ length: numPages }, (_, index) => (
                        <div
                            key={index}
                            className="mb-4 snap-start flex justify-center items-center min-h-screen"
                        >
                            <Page
                                pageNumber={index + 1}
                                width={pageWidth}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                            />
                        </div>
                    ))}
            </Document>
        </div>
    );
};

export default PdfViewer;
